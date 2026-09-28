import type { CoverImageLayout } from "../components/PagePreview/PreviewPage";
import { apiFetch } from "./apiClient";

export type SavedSubmittalOpportunity = {
  id: number;
  name: string;
  propertyName: string;
};

export type SavedSubmittalCategory = {
  id: number;
  categoryName: string;
  selectedMaterialIds: number[];
};

export type SavedSubmittalListItem = {
  id: string;
  name: string;
  coverTitle: string;
  opportunity: SavedSubmittalOpportunity | null;
  hasCover: boolean;
  categoryCount: number;
  materialCount: number;
  updatedAt: string;
  createdAt: string;
};

export type SavedSubmittalDetail = {
  id: string;
  name: string;
  coverTitle: string;
  opportunity: SavedSubmittalOpportunity | null;
  coverImageUrl: string | null;
  coverImageMimeType: string | null;
  plantScheduleImageUrl: string | null;
  plantScheduleMimeType: string | null;
  coverImageLayout: CoverImageLayout;
  categories: SavedSubmittalCategory[];
  createdAt: string;
  updatedAt: string;
};

export type SaveSubmittalPayload = {
  name: string;
  coverTitle: string;
  opportunity: SavedSubmittalOpportunity | null;
  coverImageUrl: string | null;
  coverImageMimeType: string | null;
  plantScheduleImageUrl: string | null;
  plantScheduleMimeType: string | null;
  coverImageLayout: CoverImageLayout;
  categories: SavedSubmittalCategory[];
};

async function parseJson<T>(res: Response): Promise<T> {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error =
      typeof payload === "object" &&
      payload &&
      "error" in payload &&
      typeof (payload as { error: unknown }).error === "string"
        ? (payload as { error: string }).error
        : `Request failed (${res.status})`;
    throw new Error(error);
  }
  return payload as T;
}

export async function listSavedSubmittals(): Promise<SavedSubmittalListItem[]> {
  const res = await apiFetch("/api/submittals/saved");
  return parseJson(res);
}

export async function getSavedSubmittal(
  id: string,
): Promise<SavedSubmittalDetail> {
  const res = await apiFetch(`/api/submittals/saved/${id}`);
  return parseJson(res);
}

export async function createSavedSubmittal(
  payload: SaveSubmittalPayload,
): Promise<{ id: string; name: string; updatedAt: string }> {
  const res = await apiFetch("/api/submittals/saved", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function updateSavedSubmittal(
  id: string,
  payload: SaveSubmittalPayload,
): Promise<{ id: string; name: string; updatedAt: string }> {
  const res = await apiFetch(`/api/submittals/saved/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function deleteSavedSubmittal(id: string): Promise<void> {
  const res = await apiFetch(`/api/submittals/saved/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    await parseJson(res);
  }
}

export async function uploadCoverImage(
  file: File,
): Promise<{ url: string; mimeType: string }> {
  const form = new FormData();
  form.append("image", file);
  const res = await apiFetch("/api/submittals/cover-image", {
    method: "POST",
    body: form,
  });
  return parseJson(res);
}
