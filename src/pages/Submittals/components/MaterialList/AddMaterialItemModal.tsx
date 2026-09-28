import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Input,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import ImageIcon from "@mui/icons-material/Image";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  createMaterialItem,
  type CreateMaterialItemResult,
} from "../../api/submittals.mutations";
import { ITEM_CATEGORIES } from "../../categories";
import { ITEM_SIZES } from "../../sizes";

type CategoryOption = {
  id: number;
  categoryName: string;
};

type AddMaterialItemModalProps = {
  open: boolean;
  categories: CategoryOption[];
  lockedCategoryId?: number;
  title?: string;
  initialValues?: {
    commonName?: string;
    alternateName?: string;
    purchaseUnitCost?: number;
    allocation?: number;
    allocationUnit?: string;
  };
  onClose: () => void;
  onAfterCreate: (
    result: CreateMaterialItemResult,
    imageFile?: File,
  ) => Promise<void>;
};

type SuccessState = {
  materialName: string;
  kitName: string;
  materialUrl: string;
  kitUrl: string;
};

export const AddMaterialItemModal = ({
  open,
  lockedCategoryId,
  title = "Add Item",
  initialValues,
  onClose,
  onAfterCreate,
}: AddMaterialItemModalProps) => {
  const [commonName, setCommonName] = useState("");
  const [alternateName, setAlternateName] = useState("");
  const [description, setDescription] = useState("");
  const [purchaseUnit, setPurchaseUnit] = useState("");
  const [categoryName, setCategoryName] = useState<string | null>(
    lockedCategoryId != null ? String(lockedCategoryId) : null,
  );
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const initialValuesRef = useRef(initialValues);
  const lockedCategoryIdRef = useRef(lockedCategoryId);
  initialValuesRef.current = initialValues;
  lockedCategoryIdRef.current = lockedCategoryId;

  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreview(null);
  }, []);

  useEffect(() => {
    if (lockedCategoryId != null) {
      setCategoryName(String(lockedCategoryId));
    }
  }, [lockedCategoryId]);

  useEffect(() => {
    if (open) {
      const initial = initialValuesRef.current;
      const locked = lockedCategoryIdRef.current;
      setCommonName(String(initial?.commonName ?? ""));
      setAlternateName(String(initial?.alternateName ?? ""));
      setDescription("");
      setPurchaseUnit("");
      setCategoryName(locked != null ? String(locked) : null);
      setSelectedFile(null);
      setIsDragging(false);
      setSuccess(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    clearPreview();
    setSelectedFile(null);
  }, [open, clearPreview]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }
    setSelectedFile(file);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreview(url);
  };

  const resetFormForAnother = () => {
    clearPreview();
    setCommonName("");
    setAlternateName("");
    setDescription("");
    setPurchaseUnit("");
    setCategoryName(lockedCategoryId != null ? String(lockedCategoryId) : null);
    setSelectedFile(null);
    setIsDragging(false);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const trimmedCommon = commonName.trim();
    const trimmedAlternate = alternateName.trim();
    const trimmedDescription = description.trim();
    const trimmedPurchaseUnit = purchaseUnit.trim();

    if (!trimmedCommon) {
      alert("Name is required.");
      return;
    }

    if (!categoryName) {
      alert("Category is required.");
      return;
    }

    setSaving(true);
    try {
      const result = await createMaterialItem({
        commonName: trimmedCommon,
        purchaseUnit: trimmedPurchaseUnit,
        categoryId: categoryName,
        alternateName: trimmedAlternate,
        description: trimmedDescription,
      });

      await onAfterCreate(result, selectedFile ?? undefined);

      setSuccess({
        materialName: result.material.materialName,
        kitName: result.kit?.kitName || "",
        materialUrl: result.urls.material,
        kitUrl: result.urls.kit,
      });
    } catch (error) {
      console.error("Failed to create material item:", error);
      alert("Failed to create item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const openPicker = () => fileInputRef.current?.click();

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: { xs: "calc(100vw - 2rem)", sm: "min(920px, 94vw)" },
          maxWidth: 920,
        }}
      >
        <ModalClose />
        <Typography level="title-md">{title}</Typography>

        <Stack spacing={2} sx={{ mt: 1 }}>
          {success && (
            <Box
              sx={{
                p: 1,
                borderRadius: "sm",
                bgcolor: "success.softBg",
                border: "1px solid",
                borderColor: "success.softColor",
              }}
            >
              <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                Item Created Successfully
              </Typography>
              <Typography level="body-xs" sx={{ mt: 0.5 }}>
                Item: {success.materialName}
              </Typography>
              <Typography level="body-xs">Kit: {success.kitName}</Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <Stack spacing={2} sx={{ gridColumn: { xs: "1", md: "1" } }}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={commonName}
                  onChange={(e) => setCommonName(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Alternate Name</FormLabel>
                <Input
                  value={alternateName}
                  onChange={(e) => setAlternateName(e.target.value)}
                  placeholder="Optional alternate name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  minRows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  value={categoryName}
                  onChange={(_, value) => setCategoryName(value ?? null)}
                  disabled={lockedCategoryId != null}
                  placeholder="Select a category"
                >
                  {ITEM_CATEGORIES.map((name) => (
                    <Option key={name} value={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Box
              sx={{
                gridColumn: { xs: "1", md: "2" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography level="body-sm" fontWeight="md" sx={{ mb: 0.75 }}>
                Item Image
              </Typography>
              {preview ? (
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
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelect(file);
                  }}
                  onClick={openPicker}
                  sx={{
                    p: 1,
                    flex: 1,
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
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: 6,
                    }}
                  />
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
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelect(file);
                  }}
                  onClick={openPicker}
                  sx={{
                    p: 3,
                    flex: 1,
                    textAlign: "center",
                    border: "2px dashed",
                    borderColor: isDragging ? "primary.500" : "neutral.300",
                    borderRadius: "md",
                    bgcolor: isDragging ? "primary.50" : "background.level1",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
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
            </Box>

            <Box
              sx={{
                gridColumn: { xs: "auto", md: "1 / span 2" },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                columnGap: 1.5,
                rowGap: 2,
              }}
            >
              <FormControl>
                <FormLabel>Size</FormLabel>
                <Select
                  value={purchaseUnit || null}
                  onChange={(_, value) => setPurchaseUnit(value ?? "")}
                  placeholder="Optional"
                >
                  {ITEM_SIZES.map((size) => (
                    <Option key={size} value={size}>
                      {size}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          {success && (
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Link
                href={success.materialUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                underline="always"
                sx={{
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                Open Item
                <OpenInNewIcon sx={{ fontSize: 14 }} />
              </Link>
              <Link
                href={success.kitUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                underline="always"
                sx={{
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                Open Kit
                <OpenInNewIcon sx={{ fontSize: 14 }} />
              </Link>
            </Box>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
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
            <Button variant="plain" color="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button
              loading={saving}
              onClick={success ? resetFormForAnother : handleSubmit}
            >
              {success ? "Create Another Item" : "Create Item"}
            </Button>
          </Box>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};
