import { useState, useRef } from "react";
import { Box, Typography, Sheet, IconButton } from "@mui/joy";
import Close from "@mui/icons-material/Close";
import DragIndicator from "@mui/icons-material/DragIndicator";
import type { Material } from "./MaterialListItem";

type Category = {
  id: number;
  categoryName: string;
  materials: Material[];
};

type SelectedMaterialsListProps = {
  materials: Category[];
  onRemoveMaterial: (categoryId: number, materialId: number) => void;
  onReorder?: (
    items: { categoryId: number; categoryName: string; material: Material }[],
  ) => void;
  onReorderCategories?: (categoryOrder: number[]) => void;
};

// Extract common name from material name (removes the size suffix like " - 2\"")
const getCommonName = (material: Material) => {
  const name = (material.materialName ?? "").trim();
  const unit = (material.purchaseUnit ?? "").trim();
  if (!name) return "";
  if (!unit) return name;
  const suffix = ` - ${unit}`.toLowerCase();
  if (name.toLowerCase().endsWith(suffix)) {
    return name.slice(0, name.length - suffix.length).trim();
  }
  return name;
};

export const SelectedMaterialsList = ({
  materials,
  onRemoveMaterial,
  onReorder,
  onReorderCategories,
}: SelectedMaterialsListProps) => {
  const categoriesWithSelected = materials
    .map((cat) => ({
      ...cat,
      materials: cat.materials.filter((m) => m.selected),
    }))
    .filter((cat) => cat.materials.length > 0);

  const totalSelected = categoriesWithSelected.reduce(
    (t, c) => t + c.materials.length,
    0,
  );

  const dragItem = useRef<{
    categoryId: string | number;
    materialId: string | number;
  } | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const dragCategoryId = useRef<number | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<number | null>(
    null,
  );

  const itemKey = (catId: string | number, matId: string | number) =>
    `${catId}::${matId}`;

  const sameId = (a: string | number, b: string | number) =>
    String(a) === String(b);

  const handleDrop = (
    toCatId: string | number,
    toMatId: string | number,
  ) => {
    const from = dragItem.current;
    dragItem.current = null;
    setDragOverKey(null);
    if (!from) return;
    if (sameId(from.categoryId, toCatId) && sameId(from.materialId, toMatId)) {
      return;
    }
    if (!sameId(from.categoryId, toCatId)) return;

    const flat = materials.flatMap((cat) =>
      cat.materials
        .filter((m) => m.selected)
        .map((m) => ({
          categoryId: cat.id,
          categoryName: cat.categoryName,
          material: m,
        })),
    );
    const fromIdx = flat.findIndex(
      (i) =>
        sameId(i.categoryId, from.categoryId) &&
        sameId(i.material.id, from.materialId),
    );
    const toIdx = flat.findIndex(
      (i) => sameId(i.categoryId, toCatId) && sameId(i.material.id, toMatId),
    );
    if (fromIdx === -1 || toIdx === -1) return;
    const reordered = [...flat];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    onReorder?.(reordered);
  };

  const handleCategoryDrop = (toCatId: number) => {
    const fromCatId = dragCategoryId.current;
    dragCategoryId.current = null;
    setDragOverCategoryId(null);
    if (!fromCatId || fromCatId === toCatId) return;

    const order = categoriesWithSelected.map((cat) => cat.id);
    const fromIdx = order.indexOf(fromCatId);
    const toIdx = order.indexOf(toCatId);
    if (fromIdx === -1 || toIdx === -1) return;

    const reordered = [...order];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    onReorderCategories?.(reordered);
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
      <Typography level="h4" sx={{ mb: 2, color: '#f5f5f5' }}>
        Selected Items
        {totalSelected > 0 && (
          <Typography level="body-sm" sx={{ ml: 1, opacity: 0.7 }}>
            ({totalSelected})
          </Typography>
        )}
      </Typography>

      {categoriesWithSelected.length === 0 ? (
        <Typography level="body-sm" sx={{ opacity: 0.6 }}>
          No materials selected yet.
        </Typography>
      ) : (
        categoriesWithSelected.map((category) => (
          <Sheet
            key={category.id}
            sx={{
              mb: 2,
              borderRadius: "sm",
              border: "1px solid",
              borderColor:
                dragOverCategoryId === category.id
                  ? "primary.300"
                  : "transparent",
              bgcolor:
                dragOverCategoryId === category.id
                  ? "primary.softBg"
                  : "transparent",
            }}
          >
            <Box
              component="div"
              draggable
              onDragStart={() => {
                dragCategoryId.current = category.id;
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverCategoryId(category.id);
              }}
              onDrop={() => handleCategoryDrop(category.id)}
              onDragEnd={() => {
                dragCategoryId.current = null;
                setDragOverCategoryId(null);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 1,
                cursor: "grab",
                px: 0.5,
                py: 0.25,
                borderRadius: "sm",
                "&:active": { cursor: "grabbing" },
              }}
            >
              <DragIndicator
                sx={{ fontSize: 16, color: "neutral.400", flexShrink: 0 }}
              />
              <Typography level="title-sm" sx={{ fontWeight: "bold" }}>
                {category.categoryName}
              </Typography>
            </Box>
            {category.materials.map((material) => {
              const k = itemKey(category.id, material.id);
              return (
                <Box
                  key={material.id}
                  component="div"
                  draggable
                  onDragStart={(event) => {
                    event.stopPropagation();
                    dragItem.current = {
                      categoryId: category.id,
                      materialId: material.id,
                    };
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setDragOverKey(k);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleDrop(category.id, material.id);
                  }}
                  onDragEnd={() => {
                    dragItem.current = null;
                    setDragOverKey(null);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.75,
                    ml: 2,
                    mb: 0.5,
                    borderRadius: "8px",
                    overflow: "hidden",
                    bgcolor: dragOverKey === k ? "#d9e8ff" : "#fff",
                    border: "1px solid",
                    borderColor: dragOverKey === k ? "primary.300" : "transparent",
                    cursor: "grab",
                    "&:active": { cursor: "grabbing" },
                  }}
                >
                  <DragIndicator
                    sx={{ fontSize: 16, color: "#666", flexShrink: 0 }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      level="body-sm"
                      sx={{
                        color: "#1a1a1a",
                        "&&": { color: "#1a1a1a" },
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {getCommonName(material)}
                    </Typography>
                    <Typography
                      level="body-xs"
                      sx={{
                        color: "#444",
                        "&&": { color: "#444" },
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {(material.altName ?? "").trim() || "No alternate name"}
                    </Typography>
                  </Box>
                  <IconButton
                    size="sm"
                    variant="soft"
                    color="neutral"
                    onClick={() => onRemoveMaterial(category.id, material.id)}
                    sx={{
                      minHeight: "auto",
                      minWidth: "auto",
                      p: 0.5,
                      flexShrink: 0,
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
          </Sheet>
        ))
      )}
    </Sheet>
  );
};
