import { useState, useRef, useCallback } from "react";
import {
  Checkbox,
  Sheet,
  IconButton,
  Input,
  Box,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Button,
  FormControl,
  FormLabel,
  Stack,
  Card,
  Divider,
} from "@mui/joy";
import ImageIcon from "@mui/icons-material/Image";
import EditOutlined from "@mui/icons-material/EditOutlined";
import CloudUpload from "@mui/icons-material/CloudUpload";
import { updateMaterial } from "../../api/submittals.mutations";

export type Material = {
  id: number;
  categoryId?: number;
  className?: string;
  materialName: string;
  altName?: string;
  description?: string;
  purchaseUnit?: string;
  purchaseUnitCost?: number;
  allocation?: number;
  allocationUnit?: string;
  selected: boolean;
  imageUrl?: string;
  active: boolean;
  availableToBid: boolean;
  itemType: string;
};

type MaterialListItemProps = {
  material: Material;
  className?: string;
  onToggle: () => void;
  onImageUpload?: (materialId: number, imageFile: File) => void;
};

export const MaterialListItem = ({
  material,
  className,
  onToggle,
  onImageUpload,
}: MaterialListItemProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [itemName, setItemName] = useState(material.materialName);
  const [altName, setAltName] = useState(material.altName ?? "");
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updatePreview = useCallback((file: File | null) => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      updatePreview(file);
    },
    [updatePreview],
  );

  const handleClose = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setSelectedFile(null);
    setEditOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMaterial(material.id, {
        itemName,
        alternateName: altName,
      });
      if (selectedFile && onImageUpload) {
        onImageUpload(material.id, selectedFile);
      }
      handleClose();
    } catch (err) {
      console.error("Failed to save material:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const currentImageSrc = preview ?? material.imageUrl ?? null;

  return (
    <>
      <Sheet
        className={className}
        onClick={() => setEditOpen(true)}
        sx={{
          display: "flex",
          alignItems: "center",
          height: 40,
          px: 1,
          ml: 1,
          gap: 0.75,
          cursor: "pointer",
          borderRadius: "8px",
          overflow: "hidden",
          bgcolor: "#fff",
          "&:hover": { bgcolor: "#f3f3f3" },
        }}
        data-testid="sub-category-material-item"
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          <Checkbox
            size="sm"
            checked={material.selected}
            onChange={onToggle}
            sx={{ "--Checkbox-size": "18px" }}
          />
        </Box>
        <Typography
          data-testid="sub-category-material-item-name"
          level="body-sm"
          sx={{
            flex: 1,
            minWidth: 0,
            lineHeight: 1.2,
            color: "#1a1a1a",
            "&&": { color: "#1a1a1a" },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {itemName}
        </Typography>
        <IconButton
          size="sm"
          variant="plain"
          onClick={(e) => {
            e.stopPropagation();
            setEditOpen(true);
          }}
          sx={{
            "--IconButton-size": "32px",
            flexShrink: 0,
            alignSelf: "center",
            color: "#444",
            "&:hover": { color: "primary.500" },
          }}
          title="Edit material"
        >
          <EditOutlined sx={{ fontSize: 18 }} />
        </IconButton>
      </Sheet>

      <Modal open={editOpen} onClose={handleClose}>
        <ModalDialog sx={{ minWidth: 420 }}>
          <ModalClose />
          <Typography level="title-md">{material.materialName}</Typography>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Alternate Name</FormLabel>
              <Input
                value={altName}
                onChange={(e) => setAltName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Variant</FormLabel>
              <Typography level="body-sm" sx={{ py: 0.75 }}>
                {material.purchaseUnit}
              </Typography>
            </FormControl>
            <Divider />
            <Typography level="body-sm" fontWeight="md">
              Image
            </Typography>
            {currentImageSrc ? (
              <Card
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFileSelect(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  p: 1,
                  textAlign: "center",
                  border: isDragging ? "2px dashed" : undefined,
                  borderColor: isDragging ? "primary.500" : undefined,
                  cursor: "pointer",
                }}
              >
                <img
                  src={currentImageSrc}
                  alt="Material"
                  style={{
                    width: "100%",
                    maxHeight: 160,
                    objectFit: "contain",
                    borderRadius: 6,
                  }}
                />
                {!preview && material.imageUrl && (
                  <Typography
                    level="body-xs"
                    sx={{ mt: 0.5, color: "neutral.500" }}
                  >
                    Click or drag to replace
                  </Typography>
                )}
              </Card>
            ) : (
              <Box
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFileSelect(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  p: 3,
                  textAlign: "center",
                  border: "2px dashed",
                  borderColor: isDragging ? "primary.500" : "neutral.300",
                  borderRadius: "md",
                  bgcolor: isDragging ? "primary.50" : "background.level1",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.400",
                    bgcolor: "background.level2",
                  },
                }}
              >
                <ImageIcon
                  sx={{ fontSize: 36, color: "neutral.400", mb: 0.5 }}
                />
                <Typography level="body-sm" sx={{ color: "neutral.500" }}>
                  {isDragging
                    ? "Drop image here"
                    : "Drag & drop or click to upload"}
                </Typography>
              </Box>
            )}
            <Button
              variant="outlined"
              size="sm"
              startDecorator={<CloudUpload />}
              onClick={() => fileInputRef.current?.click()}
              fullWidth
            >
              {currentImageSrc ? "Choose Different Image" : "Upload Image"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                pt: 0.5,
              }}
            >
              <Button variant="plain" color="neutral" onClick={handleClose}>
                Cancel
              </Button>
              <Button loading={saving} onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
};
