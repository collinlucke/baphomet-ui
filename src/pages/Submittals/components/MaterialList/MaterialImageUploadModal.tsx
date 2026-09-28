import { useState, useRef, useCallback } from "react";
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  Box,
  IconButton,
  Card,
  Stack,
} from "@mui/joy";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Image from "@mui/icons-material/Image";
import Close from "@mui/icons-material/Close";

type Material = {
  id: number;
  materialName: string;
  selected: boolean;
  imageUrl?: string;
};

type MaterialImageUploadModalProps = {
  material: Material | null;
  open: boolean;
  onClose: () => void;
  onSave: (materialId: number, imageFile: File) => void;
};

export const MaterialImageUploadModal = ({
  material,
  open,
  onClose,
  onSave,
}: MaterialImageUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      updatePreview(file);
    },
    [updatePreview],
  );

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSave = () => {
    if (selectedFile && material) {
      onSave(material.id, selectedFile);
      handleClose();
    }
  };

  const handleClose = () => {
    // Clean up preview URL
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setSelectedFile(null);
    onClose();
  };

  if (!material) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        sx={{
          minWidth: 400,
          maxWidth: 500,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography level="h4">Upload Material Image</Typography>
          <IconButton size="sm" variant="plain" onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Typography level="body-md" sx={{ mb: 3, fontWeight: 600 }}>
          {material.materialName}
        </Typography>
        <Box sx={{ mb: 3 }}>
          {preview ? (
            <Card
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                p: 2,
                textAlign: "center",
                border: isDragging ? "2px dashed" : undefined,
                borderColor: isDragging ? "primary.500" : undefined,
                cursor: "pointer",
              }}
            >
              <img
                src={preview}
                alt="Material preview"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </Card>
          ) : material.imageUrl ? (
            <Card
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                p: 2,
                textAlign: "center",
                border: isDragging ? "2px dashed" : undefined,
                borderColor: isDragging ? "primary.500" : undefined,
                cursor: "pointer",
              }}
            >
              <img
                src={material.imageUrl}
                alt="Current material image"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
              <Typography level="body-sm" sx={{ mt: 1, color: "neutral.600" }}>
                Current image (select new file to replace)
              </Typography>
            </Card>
          ) : (
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleButtonClick}
              sx={{
                p: 4,
                textAlign: "center",
                border: "2px dashed",
                borderColor: isDragging ? "primary.500" : "neutral.300",
                borderRadius: "md",
                bgcolor: isDragging ? "primary.50" : "background.level1",
                cursor: "pointer",
                transition: "border-color 0.15s, background-color 0.15s",
                "&:hover": {
                  borderColor: "primary.400",
                  bgcolor: "background.level2",
                },
              }}
            >
              <Image
                sx={{
                  fontSize: 48,
                  color: isDragging ? "primary.500" : "neutral.400",
                  mb: 1,
                }}
              />
              <Typography
                level="body-sm"
                sx={{ color: isDragging ? "primary.600" : "neutral.600" }}
              >
                {isDragging
                  ? "Drop image here"
                  : "Drag & drop or click to upload"}
              </Typography>
            </Box>
          )}
        </Box>
        <Button
          variant="outlined"
          startDecorator={<CloudUpload />}
          onClick={handleButtonClick}
          sx={{ mb: 3 }}
          fullWidth
        >
          {selectedFile || material.imageUrl
            ? "Choose Different Image"
            : "Upload Image"}
        </Button>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button variant="plain" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="solid" onClick={handleSave} disabled={!selectedFile}>
            Save
          </Button>
        </Stack>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />
      </ModalDialog>
    </Modal>
  );
};
