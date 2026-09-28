import { useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/joy";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Close from "@mui/icons-material/Close";

type PlantScheduleUploaderProps = {
  previewUrl: string | null;
  onChange: (file: File | null) => void;
};

export const PlantScheduleUploader = ({
  previewUrl,
  onChange,
}: PlantScheduleUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }
    onChange(file);
  };

  return (
    <Box sx={{ width: { xs: "100%", md: 240 }, flexShrink: 0 }}>
      <Typography level="title-md" sx={{ color: "#f5f5f5", mb: 1 }}>
        Plant Schedule
      </Typography>
      <Box
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) selectFile(file);
        }}
        sx={{
          position: "relative",
          minHeight: 280,
          borderRadius: "12px",
          border: "2px dashed",
          borderColor: isDragging ? "#8fd0a8" : "rgba(255,255,255,0.45)",
          bgcolor: isDragging ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.15)",
          color: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 1,
          p: 2,
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt="Plant schedule"
            sx={{
              width: "100%",
              maxHeight: 320,
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 36, color: "rgba(255,255,255,0.8)" }} />
            <Typography level="body-sm" sx={{ color: "#f5f5f5" }}>
              Upload the plant schedule from the plans
            </Typography>
            <Typography level="body-xs" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Drag and drop or click to browse
            </Typography>
          </>
        )}
        {previewUrl && (
          <IconButton
            size="sm"
            variant="solid"
            color="neutral"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            sx={{ position: "absolute", top: 8, right: 8 }}
            title="Remove plant schedule"
          >
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) selectFile(file);
        }}
      />
    </Box>
  );
};
