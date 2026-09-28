import { useState, useRef, useCallback } from "react";
import { Sheet, Typography, Button, Box, IconButton, Card } from "@mui/joy";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Image from "@mui/icons-material/Image";
import Close from "@mui/icons-material/Close";

type BackgroundImageUploaderProps = {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
};

export const BackgroundImageUploader = ({
  value: _value = null,
  onChange,
}: BackgroundImageUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate preview URL when file changes
  const updatePreview = useCallback(
    (file: File | null) => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      if (file) {
        const newPreview = URL.createObjectURL(file);
        setPreview(newPreview);
      } else {
        setPreview(null);
      }
    },
    [preview],
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      updatePreview(file);
      onChange?.(file);
    },
    [onChange, updatePreview],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    updatePreview(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography level="title-md" sx={{ mb: 1 }}>
        Background Image
      </Typography>

      {preview ? (
        // Image preview with remove option
        <Card sx={{ position: "relative", p: 1, height: 150 }}>
          <img
            src={preview}
            alt="Background preview"
            style={{
              width: "100%",
              height: "130px",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <IconButton
            size="sm"
            variant="soft"
            color="danger"
            onClick={handleRemove}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "background.surface",
              "&:hover": { bgcolor: "danger.softBg" },
            }}
          >
            <Close />
          </IconButton>
        </Card>
      ) : (
        // Upload area (smaller than cover image uploader)
        <Sheet
          variant="outlined"
          sx={{
            p: 3,
            height: 150,
            borderRadius: "md",
            border: isDragOver ? "2px dashed" : "2px dashed",
            borderColor: isDragOver ? "primary.400" : "neutral.300",
            bgcolor: isDragOver ? "primary.50" : "background.level1",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              borderColor: "primary.300",
              bgcolor: "primary.25",
            },
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            {isDragOver ? (
              <CloudUpload fontSize="large" color="primary" />
            ) : (
              <Image sx={{ fontSize: 32, color: "neutral.400" }} />
            )}

            <Box>
              <Typography level="title-sm" sx={{ mb: 0.5 }}>
                {isDragOver ? "Drop background" : "Page background"}
              </Typography>
              <Typography level="body-xs" sx={{ color: "neutral.600" }}>
                Optional watermark image
              </Typography>
            </Box>

            <Button
              size="sm"
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick();
              }}
            >
              Browse
            </Button>
          </Box>
        </Sheet>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
    </Box>
  );
};
