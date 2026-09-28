import { useCallback, useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/joy";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Close from "@mui/icons-material/Close";

type Material = {
  id: number;
  materialName: string;
  selected: boolean;
  imageUrl?: string;
};

type Category = {
  id: number;
  categoryName: string;
  materials: Material[];
};

export type CoverImageLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PreviewPageProps = {
  title?: string;
  onTitleChange?: (title: string) => void;
  coverImage?: File | string | null;
  onCoverImageChange?: (file: File | string | null) => void;
  coverImageLayout?: CoverImageLayout;
  onCoverImageLayoutChange?: (layout: CoverImageLayout) => void;
  backgroundImage?: File | string | null;
  categories?: Category[];
};

const PAGE_WIDTH = 816;
const PAGE_HEIGHT = 1056;
const DEFAULT_COVER_WIDTH = 490;
const DEFAULT_COVER_HEIGHT = 360;
const MIN_COVER_SIZE = 80;

export const DEFAULT_COVER_LAYOUT: CoverImageLayout = {
  x: Math.round((PAGE_WIDTH - DEFAULT_COVER_WIDTH) / 2),
  y: Math.round((PAGE_HEIGHT - DEFAULT_COVER_HEIGHT) / 2),
  width: DEFAULT_COVER_WIDTH,
  height: DEFAULT_COVER_HEIGHT,
};

type Corner = "nw" | "ne" | "sw" | "se";

export const PreviewPage = ({
  title = "",
  coverImage = null,
  onCoverImageChange,
  coverImageLayout = DEFAULT_COVER_LAYOUT,
  onCoverImageLayoutChange,
  backgroundImage: _backgroundImage = null,
  categories = [],
}: PreviewPageProps) => {
  const logoSrc = `${import.meta.env.BASE_URL}full-logo.png`;
  const pageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const aspectRatioRef = useRef(
    DEFAULT_COVER_WIDTH / DEFAULT_COVER_HEIGHT,
  );
  const layout = coverImageLayout;
  const interaction = useRef<
    | {
        type: "move";
        startClientX: number;
        startClientY: number;
        origin: CoverImageLayout;
        scale: number;
      }
    | {
        type: "resize";
        corner: Corner;
        startClientX: number;
        startClientY: number;
        origin: CoverImageLayout;
        scale: number;
        aspect: number;
      }
    | null
  >(null);

  useEffect(() => {
    if (!coverImage) {
      setCoverImageUrl(null);
      return;
    }
    if (typeof coverImage === "string") {
      setCoverImageUrl(coverImage);
      return;
    }
    const url = URL.createObjectURL(coverImage);
    setCoverImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverImage]);

  const getPageScale = () => {
    const el = pageRef.current;
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    return rect.width / el.offsetWidth || 1;
  };

  const clampLayout = (
    next: CoverImageLayout,
    aspect = aspectRatioRef.current,
  ): CoverImageLayout => {
    const ratio = aspect > 0 ? aspect : 1;
    let width = Math.round(next.width);
    let height = Math.round(width / ratio);

    if (height < MIN_COVER_SIZE) {
      height = MIN_COVER_SIZE;
      width = Math.round(height * ratio);
    }
    if (width < MIN_COVER_SIZE) {
      width = MIN_COVER_SIZE;
      height = Math.round(width / ratio);
    }
    if (width > PAGE_WIDTH) {
      width = PAGE_WIDTH;
      height = Math.round(width / ratio);
    }
    if (height > PAGE_HEIGHT) {
      height = PAGE_HEIGHT;
      width = Math.round(height * ratio);
    }

    const x = Math.min(PAGE_WIDTH - width, Math.max(0, Math.round(next.x)));
    const y = Math.min(PAGE_HEIGHT - height, Math.max(0, Math.round(next.y)));
    return { x, y, width, height };
  };

  const selectFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const aspect = img.naturalWidth / img.naturalHeight || 1;
        aspectRatioRef.current = aspect;
        let width = DEFAULT_COVER_WIDTH;
        let height = Math.round(width / aspect);
        if (height > DEFAULT_COVER_HEIGHT) {
          height = DEFAULT_COVER_HEIGHT;
          width = Math.round(height * aspect);
        }
        onCoverImageLayoutChange?.(
          clampLayout(
            {
              x: Math.round((PAGE_WIDTH - width) / 2),
              y: Math.round((PAGE_HEIGHT - height) / 2),
              width,
              height,
            },
            aspect,
          ),
        );
        URL.revokeObjectURL(objectUrl);
      };
      img.onerror = () => {
        onCoverImageLayoutChange?.(DEFAULT_COVER_LAYOUT);
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
      onCoverImageChange?.(file);
    },
    [onCoverImageChange, onCoverImageLayoutChange],
  );

  const endInteraction = (e: React.PointerEvent) => {
    if (!interaction.current) return;
    interaction.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const session = interaction.current;
    if (!session) return;

    const dx = (e.clientX - session.startClientX) / session.scale;
    const dy = (e.clientY - session.startClientY) / session.scale;
    const { origin } = session;

    if (session.type === "move") {
      onCoverImageLayoutChange?.(
        clampLayout({
          ...origin,
          x: origin.x + dx,
          y: origin.y + dy,
        }),
      );
      return;
    }

    const { corner, aspect } = session;
    const widthFromX = corner.includes("e")
      ? origin.width + dx
      : origin.width - dx;
    const heightFromY = corner.includes("s")
      ? origin.height + dy
      : origin.height - dy;

    let width: number;
    let height: number;
    if (Math.abs(dx) >= Math.abs(dy)) {
      width = widthFromX;
      height = width / aspect;
    } else {
      height = heightFromY;
      width = height * aspect;
    }

    let x = origin.x;
    let y = origin.y;
    if (corner.includes("w")) x = origin.x + origin.width - width;
    if (corner.includes("n")) y = origin.y + origin.height - height;

    onCoverImageLayoutChange?.(clampLayout({ x, y, width, height }, aspect));
  };

  const startMove = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    interaction.current = {
      type: "move",
      startClientX: e.clientX,
      startClientY: e.clientY,
      origin: layout,
      scale: getPageScale(),
    };
  };

  const startResize =
    (corner: Corner) => (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      const aspect =
        layout.height > 0
          ? layout.width / layout.height
          : aspectRatioRef.current;
      aspectRatioRef.current = aspect;
      interaction.current = {
        type: "resize",
        corner,
        startClientX: e.clientX,
        startClientY: e.clientY,
        origin: layout,
        scale: getPageScale(),
        aspect,
      };
    };

  const categoriesWithMaterials = categories.filter((category) =>
    category.materials.some((material) => material.selected),
  );

  return (
    <Box
      ref={pageRef}
      sx={{
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        flexShrink: 0,
        position: "relative",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      {/* Background cover image / upload zone */}
      {coverImageUrl ? (
        <Box
          aria-label="Move cover photo"
          onPointerDown={startMove}
          onPointerMove={handlePointerMove}
          onPointerUp={endInteraction}
          onPointerCancel={endInteraction}
          sx={{
            position: "absolute",
            left: layout.x,
            top: layout.y,
            width: layout.width,
            height: layout.height,
            outline: "2px solid",
            outlineColor: "primary.300",
            borderRadius: "8px",
            cursor: "move",
            zIndex: 2,
            touchAction: "none",
          }}
        >
          <img
            src={coverImageUrl}
            alt="Cover"
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "8px",
              display: "block",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
          <IconButton
            size="sm"
            variant="solid"
            color="danger"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              onCoverImageChange?.(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>
          {(["nw", "ne", "sw", "se"] as const).map((corner) => (
            <Box
              key={corner}
              onPointerDown={startResize(corner)}
              onPointerMove={handlePointerMove}
              onPointerUp={endInteraction}
              onPointerCancel={endInteraction}
              sx={{
                position: "absolute",
                width: 18,
                height: 18,
                bgcolor: "primary.500",
                border: "2px solid white",
                borderRadius: "2px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                zIndex: 1,
                touchAction: "none",
                ...(corner === "nw" && {
                  top: -9,
                  left: -9,
                  cursor: "nwse-resize",
                }),
                ...(corner === "ne" && {
                  top: -9,
                  right: -9,
                  cursor: "nesw-resize",
                }),
                ...(corner === "sw" && {
                  bottom: -9,
                  left: -9,
                  cursor: "nesw-resize",
                }),
                ...(corner === "se" && {
                  bottom: -9,
                  right: -9,
                  cursor: "nwse-resize",
                }),
              }}
            />
          ))}
        </Box>
      ) : (
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) selectFile(file);
          }}
          sx={{
            position: "absolute",
            left: DEFAULT_COVER_LAYOUT.x,
            top: DEFAULT_COVER_LAYOUT.y,
            width: DEFAULT_COVER_WIDTH,
            height: DEFAULT_COVER_HEIGHT,
            border: "3px dashed",
            borderColor: isDragOver ? "primary.400" : "neutral.300",
            bgcolor: isDragOver ? "rgba(19, 103, 57, 0.06)" : "rgba(255,255,255,0.92)",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            cursor: "pointer",
            userSelect: "none",
            zIndex: 2,
            transition: "border-color 0.15s ease, background-color 0.15s ease",
            "&:hover": {
              borderColor: "primary.300",
              bgcolor: "rgba(19, 103, 57, 0.06)",
            },
          }}
        >
          <CloudUpload
            sx={{ fontSize: 64, color: "neutral.400", pointerEvents: "none" }}
          />
          <Typography
            level="title-lg"
            sx={{
              fontSize: 28,
              color: "neutral.600",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            {isDragOver ? "Drop image here" : "Upload cover image"}
          </Typography>
          <Typography
            level="body-md"
            sx={{
              fontSize: 20,
              color: "neutral.500",
              textAlign: "center",
              px: 2,
              pointerEvents: "none",
            }}
          >
            Drag and drop or click to browse
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) selectFile(file);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) selectFile(file);
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </Box>
      )}

      {/* Foreground: title, logo, categories */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          p: "48px",
          display: "flex",
          flexDirection: "column",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <img
          src={logoSrc}
          alt=""
          style={{
            position: "absolute",
            bottom: 0,
            left: "-180px",
            width: "816px",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        <Typography
          sx={{
            fontSize: "82px",
            fontWeight: "bold",
            color: title ? "#136739" : "rgba(19, 103, 57, 0.35)",
            textShadow: "0 2px 3px rgba(0,0,0,0.2)",
            lineHeight: 1.2,
            whiteSpace: "pre-wrap",
            width: "100%",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {title || "Property Name | Opportunity Name"}
        </Typography>

        {categoriesWithMaterials.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              bottom: "48px",
              right: "48px",
              textAlign: "right",
              maxWidth: "40%",
              pointerEvents: "none",
            }}
          >
            {categoriesWithMaterials.map((category, index) => (
              <Typography
                key={category.id}
                level="body-md"
                sx={{
                  fontSize: "48px",
                  fontWeight: "400",
                  color: "#136739",
                  textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                  mb: index < categoriesWithMaterials.length - 1 ? "3px" : 0,
                  lineHeight: 1.2,
                }}
              >
                {category.categoryName}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

    </Box>
  );
};
