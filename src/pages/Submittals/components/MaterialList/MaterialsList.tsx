import { useState } from "react";
import { Typography, Sheet, Box, CircularProgress, Button } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import { MaterialListCategoryItem } from "./MaterialListCategoryItem";
import { CategorySelector } from "./CategorySelector";
import { GlobalMaterialSearch } from "./GlobalMaterialSearch";
import type { Material } from "./MaterialListItem";
import { AddMaterialItemModal } from "./AddMaterialItemModal";
import type { CreateMaterialItemResult } from "../../api/submittals.mutations";

type LoadingCategory = {
  id: number;
  categoryName: string;
};

type CategoryWithMaterials = {
  id: number;
  categoryName: string;
  materials: Material[];
};

type Category = {
  id: number;
  categoryName: string;
};

type MaterialsListProps = {
  materials: CategoryWithMaterials[];
  availableCategories: Category[];
  loadingCategories?: LoadingCategory[];
  onToggleMaterial: (categoryId: number, materialId: number) => void;
  onRemoveMaterial: (categoryId: number) => void;
  onAddCategory: (category: Category) => void;
  onCreateCategory?: (categoryName: string) => Promise<Category>;
  onGlobalSelect?: (
    category: { id: number; categoryName: string },
    materialId: number,
  ) => void;
  onImageUpload?: (materialId: number, imageFile: File) => void;
  onMaterialsUpdated?: (
    updates: Array<{
      id: number;
      materialName?: string;
      altName?: string;
      purchaseUnitCost?: number;
      allocation?: number;
      allocationUnit?: string;
      categoryId?: number;
      kitId?: number | null;
    }>,
  ) => void;
  onCreateMaterialItem?: (
    result: CreateMaterialItemResult,
    imageFile?: File,
  ) => Promise<void>;
  isLoadingCategories?: boolean;
};

export const MaterialsList = ({
  materials = [],
  availableCategories = [],
  loadingCategories = [],
  onToggleMaterial,
  onRemoveMaterial,
  onAddCategory,
  onCreateCategory,
  onGlobalSelect,
  onImageUpload,
  onMaterialsUpdated,
  onCreateMaterialItem,
  isLoadingCategories = false,
}: MaterialsListProps) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [lockedCategoryId, setLockedCategoryId] = useState<number | undefined>(
    undefined,
  );

  const allCategoryOptions = [
    ...materials.map((m) => ({ id: m.id, categoryName: m.categoryName })),
    ...availableCategories,
  ]
    .filter(
      (value, index, arr) =>
        arr.findIndex((item) => item.id === value.id) === index,
    )
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));

  const toggleExpand = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <Sheet
      sx={{
        p: 2,
        minWidth: 0,
        height: 'auto',
        bgcolor: '#444',
        color: '#f5f5f5',
        borderRadius: '12px',
        '& .MuiTypography-root': { color: '#f5f5f5' }
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography level="h4" sx={{ color: '#f5f5f5' }}>
          Catalog
        </Typography>
        {onCreateMaterialItem && (
          <Button
            size="sm"
            startDecorator={<Add />}
            onClick={() => {
              setLockedCategoryId(undefined);
              setShowAddItemModal(true);
            }}
          >
            Add Item
          </Button>
        )}
      </Box>
      {onGlobalSelect && <GlobalMaterialSearch onSelect={onGlobalSelect} />}

      {materials.map((cat) => (
        <MaterialListCategoryItem
          key={cat.id}
          category={cat}
          availableCategories={allCategoryOptions}
          expanded={expanded === cat.id}
          onToggleExpansion={() => toggleExpand(cat.id)}
          onRemoveCategory={() => onRemoveMaterial(cat.id)}
          onToggleMaterial={(materialId) =>
            onToggleMaterial(cat.id, materialId)
          }
          onAddItemInCategory={
            onCreateMaterialItem
              ? () => {
                  setLockedCategoryId(cat.id);
                  setShowAddItemModal(true);
                }
              : undefined
          }
          onImageUpload={onImageUpload}
          onCreateMaterialItem={onCreateMaterialItem}
          onMaterialsUpdated={onMaterialsUpdated}
        />
      ))}

      {loadingCategories.map((cat) => (
        <Box
          key={`loading-${cat.id}`}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: "100%",
            gap: 1,
            mb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: 1,
              minWidth: 0,
              px: 1.5,
              py: 0.75,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 5,
              opacity: 0.85,
              pointerEvents: "none",
            }}
          >
            <CircularProgress size="sm" />
            <Typography level="title-md" sx={{ flex: 1 }}>
              {cat.categoryName}
            </Typography>
            <Typography level="body-xs" sx={{ color: "neutral.500" }}>
              Loading…
            </Typography>
          </Box>
          <Box sx={{ width: 72, flexShrink: 0 }} />
        </Box>
      ))}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
          gap: 1,
          mb: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CategorySelector
            availableCategories={availableCategories}
            onSelect={onAddCategory}
            onCreate={onCreateCategory}
            isLoading={isLoadingCategories}
          />
        </Box>
        <Box sx={{ width: 72, flexShrink: 0 }} />
      </Box>

      {materials.length === 0 && (
        <Typography level="body-sm" sx={{ opacity: 0.6, mt: 2 }}>
          No categories added yet. Click &quot;Add Category&quot; to get started.
        </Typography>
      )}

      {onCreateMaterialItem && (
        <AddMaterialItemModal
          open={showAddItemModal}
          categories={allCategoryOptions}
          lockedCategoryId={lockedCategoryId}
          onClose={() => setShowAddItemModal(false)}
          onAfterCreate={async (result, imageFile) => {
            await onCreateMaterialItem(result, imageFile);
          }}
        />
      )}
    </Sheet>
  );
};
