import { useEffect, useRef, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
  Select,
  Option,
  Tabs,
  TabList,
  Tab
} from '@mui/joy';
import ImageIcon from '@mui/icons-material/Image';
import type { GroupedMaterial } from './materialGrouping';
import type { Material } from './MaterialListItem';
import { RichTextDescription } from './RichTextDescription';

type GroupedMaterialEditModalProps = {
  open: boolean;
  activeGroup: GroupedMaterial | null;
  categoryName: string;
  hasMismatch: boolean;
  commonNameInput: string;
  botanicalNameInput: string;
  descriptionInput: string;
  modalImageSrc: string | null;
  saving: boolean;
  deleting?: boolean;
  isNewGroup?: boolean;
  canSave?: boolean;
  onCommonNameChange: (value: string) => void;
  onBotanicalNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onClose: () => void;
  onAddSize?: () => void;
  onDelete?: () => void;
  onSave: () => void;
  onFileSelect: (file: File) => void;
  availableCategories: { id: string; name: string }[];
  selectedCategoryId: string | null;
  onCategoryChange: (value: string) => void;
  selectedSize: string | null;
  onSetSelectedSize: (size: string | null) => void;
};

export const GroupedMaterialEditModal = ({
  open,
  activeGroup,
  categoryName: _categoryName,
  hasMismatch,
  commonNameInput,
  botanicalNameInput,
  descriptionInput,
  modalImageSrc,
  saving,
  deleting = false,
  isNewGroup: _isNewGroup = false,
  canSave = true,
  onCommonNameChange,
  onBotanicalNameChange,
  onDescriptionChange,
  onClose,
  onAddSize,
  onDelete,
  onSave,
  onFileSelect,
  availableCategories,
  selectedCategoryId,
  onCategoryChange,
  selectedSize,
  onSetSelectedSize
}: GroupedMaterialEditModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [selectedImageSourceSize, setSelectedImageSourceSize] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize selectedSize on modal open
  const effectiveSelectedSize = useMemo(() => {
    if (selectedSize) return selectedSize;
    if (activeGroup?.sizes.length) return activeGroup.sizes[0];
    return null;
  }, [selectedSize, activeGroup?.sizes, open]);

  // Get the material variant for the selected size
  const selectedMaterial = useMemo<Material | null>(() => {
    if (!effectiveSelectedSize || !activeGroup) return null;
    return (
      activeGroup.materials.find(
        m => (m.purchaseUnit ?? '').trim() === effectiveSelectedSize.trim()
      ) ?? null
    );
  }, [effectiveSelectedSize, activeGroup]);

  // Get sizes with images for fallback picker
  const sizesWithImages = useMemo<
    Array<{ size: string; material: Material }>
  >(() => {
    if (!activeGroup) return [];
    return activeGroup.materials
      .filter(m => m.imageUrl)
      .map(m => ({
        size: (m.purchaseUnit ?? '').trim(),
        material: m
      }))
      .filter(item => item.size && item.size !== effectiveSelectedSize);
  }, [activeGroup, effectiveSelectedSize]);

  // Prefer a freshly picked local preview, then fallback picker, then existing image.
  const currentImageUrl = useMemo<string | null>(() => {
    if (modalImageSrc) return modalImageSrc;
    if (selectedImageSourceSize && selectedImageSourceSize !== 'current') {
      const sourceSize = sizesWithImages.find(
        item => item.size === selectedImageSourceSize
      );
      return sourceSize?.material.imageUrl ?? null;
    }
    return selectedMaterial?.imageUrl ?? null;
  }, [
    modalImageSrc,
    selectedMaterial,
    selectedImageSourceSize,
    sizesWithImages
  ]);

  useEffect(() => {
    if (!open) setConfirmingDelete(false);
  }, [open, activeGroup?.key]);

  const openPicker = () => fileInputRef.current?.click();

  const handleDrop = (file?: File) => {
    if (!file) return;
    onFileSelect(file);
    // Reset the image source selection when a new image is uploaded
    setSelectedImageSourceSize(null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: { xs: 'calc(100vw - 2rem)', sm: 'min(920px, 94vw)' },
          maxWidth: 920
        }}
      >
        <ModalClose onClick={onClose} />

        {/* Header with Title, Size Tabs, and Add Size Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            pb: 1,
            mb: 1
          }}
        >
          <Typography level="title-md" sx={{ whiteSpace: 'nowrap' }}>
            Edit Items
          </Typography>

          {/* Size Tabs Navigation */}
          {activeGroup?.sizes.length ? (
            <Tabs
              value={effectiveSelectedSize}
              onChange={(_, value) => onSetSelectedSize(value as string | null)}
            >
              <TabList sx={{ minWidth: 200, flexWrap: 'wrap' }}>
                {activeGroup.sizes.map(size => (
                  <Tab
                    key={`size-tab-${size}`}
                    value={size}
                    sx={{
                      fontWeight: size === effectiveSelectedSize ? '600' : '400'
                    }}
                  >
                    {size}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
          ) : null}

          {/* Add Size Button (right after tabs) */}
          {onAddSize && (
            <Button
              variant="outlined"
              color="primary"
              size="sm"
              onClick={onAddSize}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Add Variant
            </Button>
          )}
        </Box>

        <Stack spacing={2} sx={{ mt: 1 }}>
          {hasMismatch && (
            <Box
              sx={{
                px: 1,
                py: 0.75,
                borderRadius: 'sm',
                bgcolor: 'warning.softBg',
                border: '1px solid',
                borderColor: 'warning.softColor'
              }}
            >
              <Typography level="body-sm" color="warning">
                Some variants in this group have inconsistent names. Saving will
                normalize all variants to the values below.
              </Typography>
            </Box>
          )}

          {/* Two-Column Layout: Left (Group-level), Right (Size-specific) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              alignItems: 'flex-start'
            }}
          >
            {/* Left Column: Group-Level Fields */}
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={commonNameInput}
                  onChange={e => onCommonNameChange(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Alternate Name</FormLabel>
                <Input
                  value={botanicalNameInput}
                  onChange={e => onBotanicalNameChange(e.target.value)}
                  placeholder="Optional alternate name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  value={selectedCategoryId}
                  onChange={(_, value) => onCategoryChange(value as string)}
                >
                  {availableCategories.map(cat => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </FormControl>
              <Typography
                level="body-xs"
                sx={{ color: 'neutral.500', px: 0.25 }}
              >
                Changes to Name, Alternate Name, or Category apply to all variants
                in this group.
              </Typography>
            </Stack>

            {/* Right Column: Size-Specific Content */}
            <Stack spacing={2}>
              {/* Size Image */}
              <Box>
                <Typography level="body-sm" fontWeight="md" sx={{ mb: 0.75 }}>
                  Variant Image
                </Typography>
                {currentImageUrl ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      maxWidth: 300
                    }}
                  >
                    <Card
                      onDragOver={e => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={e => {
                        e.preventDefault();
                        setIsDragging(false);
                      }}
                      onDrop={e => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleDrop(e.dataTransfer.files[0]);
                      }}
                      onClick={openPicker}
                      sx={{
                        p: 1,
                        textAlign: 'center',
                        border: isDragging ? '2px dashed' : undefined,
                        borderColor: isDragging ? 'primary.500' : undefined,
                        cursor: 'pointer',
                        display: 'inline-block',
                        maxWidth: '100%'
                      }}
                    >
                      <img
                        src={currentImageUrl}
                        alt="Material size"
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          objectFit: 'contain',
                          borderRadius: 6,
                          maxHeight: 200
                        }}
                      />
                    </Card>
                    {selectedImageSourceSize &&
                      selectedImageSourceSize !== 'current' && (
                        <Typography
                          level="body-xs"
                          sx={{ color: 'neutral.500' }}
                        >
                          Using image from:{' '}
                          <strong>{selectedImageSourceSize}</strong>
                        </Typography>
                      )}
                  </Box>
                ) : (
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Box
                      onDragOver={e => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={e => {
                        e.preventDefault();
                        setIsDragging(false);
                      }}
                      onDrop={e => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleDrop(e.dataTransfer.files[0]);
                      }}
                      onClick={openPicker}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        border: '2px dashed',
                        borderColor: isDragging ? 'primary.500' : 'neutral.300',
                        borderRadius: 'md',
                        bgcolor: isDragging
                          ? 'primary.50'
                          : 'background.level1',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 140,
                        '&:hover': {
                          borderColor: 'primary.400',
                          bgcolor: 'background.level2'
                        }
                      }}
                    >
                      <ImageIcon
                        sx={{
                          fontSize: 32,
                          color: 'neutral.400',
                          mb: 0.5
                        }}
                      />
                      <Typography level="body-sm" sx={{ color: 'neutral.500' }}>
                        {isDragging
                          ? 'Drop image here'
                          : 'Drag & drop or click to upload'}
                      </Typography>
                    </Box>

                    {/* Fallback Image Picker */}
                    {sizesWithImages.length > 0 && (
                      <FormControl>
                        <FormLabel>Or pick an image from another variant</FormLabel>
                        <Select
                          value={selectedImageSourceSize}
                          onChange={(_, value) =>
                            setSelectedImageSourceSize(value)
                          }
                          placeholder="Select a variant with an image"
                        >
                          {sizesWithImages.map(({ size }) => (
                            <Option key={`img-source-${size}`} value={size}>
                              {size}
                            </Option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <RichTextDescription
              value={descriptionInput}
              onChange={onDescriptionChange}
            />
          </FormControl>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                handleDrop(file);
              }
            }}
          />

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            {onDelete &&
              (confirmingDelete ? (
                <>
                  <Typography level="body-sm" sx={{ mr: 'auto' }}>
                    {(activeGroup?.materials.length ?? 0) > 1
                      ? 'Delete this item and its variants?'
                      : 'Delete this item?'}
                  </Typography>
                  <Button
                    variant="plain"
                    color="neutral"
                    disabled={deleting}
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Keep
                  </Button>
                  <Button
                    color="danger"
                    loading={deleting}
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="danger"
                  disabled={saving || deleting}
                  onClick={() => setConfirmingDelete(true)}
                  sx={{ mr: 'auto' }}
                >
                  Delete
                </Button>
              ))}
            {!confirmingDelete && (
              <>
                <Button
                  variant="plain"
                  color="neutral"
                  disabled={deleting}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  loading={saving}
                  disabled={!canSave || deleting}
                  onClick={onSave}
                >
                  Save
                </Button>
              </>
            )}
          </Box>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};
