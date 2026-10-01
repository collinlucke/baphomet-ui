import { useState } from "react";
import { apiFetch } from "../api/apiClient";

type Category = {
  categoryName: string;
};

type MaterialPageData = {
  items: Array<{
    id: number;
    materialName: string;
    altName?: string;
    description?: string;
    imageUrl?: string;
    categoryName?: string;
  }>;
  propertyName?: string;
  opportunityName?: string;
  pageNumber?: number;
  totalPages?: number;
};

type ExportOptions = {
  title: string;
  coverImage: File | string | null;
  coverImageX?: number | null;
  coverImageY?: number | null;
  coverImageWidth?: number | null;
  coverImageHeight?: number | null;
  categories: Category[];
  materialPages?: MaterialPageData[];
  plantSchedule?: File | null;
  plantScheduleUrl?: string | null;
  plantScheduleMimeType?: string | null;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix ("data:image/png;base64,")
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async ({
    title,
    coverImage,
    coverImageX,
    coverImageY,
    coverImageWidth,
    coverImageHeight,
    categories,
    materialPages,
    plantSchedule,
    plantScheduleUrl,
    plantScheduleMimeType: savedPlantScheduleMimeType,
  }: ExportOptions) => {
    setIsExporting(true);
    try {
      let coverImageBase64: string | null = null;
      let coverImageMimeType: string | null = null;
      let coverImageUrl: string | null = null;
      let plantScheduleBase64: string | null = null;
      let plantScheduleMimeType: string | null = null;
      let plantScheduleImageUrl: string | null = null;

      if (plantSchedule) {
        plantScheduleBase64 = await fileToBase64(plantSchedule);
        plantScheduleMimeType = plantSchedule.type || "image/jpeg";
      } else if (plantScheduleUrl) {
        plantScheduleImageUrl = plantScheduleUrl;
        plantScheduleMimeType = savedPlantScheduleMimeType || null;
      }

      if (coverImage instanceof File) {
        coverImageBase64 = await fileToBase64(coverImage);
        coverImageMimeType = coverImage.type || "image/jpeg";
      } else if (typeof coverImage === "string" && coverImage) {
        coverImageUrl = coverImage;
      }

      const response = await apiFetch("/api/submittals/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          coverImageBase64,
          coverImageMimeType,
          coverImageUrl,
          coverImageX: coverImageX ?? null,
          coverImageY: coverImageY ?? null,
          coverImageWidth: coverImageWidth ?? null,
          coverImageHeight: coverImageHeight ?? null,
          categories,
          materialPages,
          plantScheduleBase64,
          plantScheduleMimeType,
          plantScheduleUrl: plantScheduleImageUrl,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = title
        ? `${title.replace(/[^a-z0-9 ]/gi, "_")}.pdf`
        : "submittal.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToPdf, isExporting };
};
