import { useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Input,
  Typography,
  Box,
} from "@mui/joy";
import Search from "@mui/icons-material/Search";
import Delete from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Material } from "./MaterialListItem";
import {
  fetchUnitTypes,
  syncInstalledKits,
  updateMaterial,
} from "../../api/submittals.mutations";
import {
  buildActiveGroupMismatch,
  buildGroupedMaterials,
  getBotanicalName,
  getCommonName,
  type GroupedMaterial,
} from "./materialGrouping";
import { GroupedMaterialEditModal } from "./GroupedMaterialEditModal";
import { MaterialMismatchModal } from "./MaterialMismatchModal";
import { IndividualVariantModal } from "./IndividualVariantModal";
import { AddMaterialItemModal } from "./AddMaterialItemModal";
import { CategoryGroupRow } from "./CategoryGroupRow";
import type { CreateMaterialItemResult } from "../../api/submittals.mutations";
import { formatCost } from "../../../../utils/formatCost";

type Category = {
  id: number;
  categoryName: string;
  materials: Material[];
};

type MaterialListCategoryItemProps = {
  category: Category;
  expanded: boolean;
  availableCategories: Array<{ id: number; categoryName: string }>;
  onToggleExpansion: () => void;
  onRemoveCategory: () => void;
  onToggleMaterial: (materialId: number) => void;
  onAddItemInCategory?: () => void;
  onImageUpload?: (materialId: number, imageFile: File) => void;
  onCreateMaterialItem?: (
    result: CreateMaterialItemResult,
    imageFile?: File,
  ) => Promise<void>;
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
};

export const MaterialListCategoryItem = ({
  category,
  expanded,
  onToggleExpansion,
  onRemoveCategory,
  onToggleMaterial,
  onAddItemInCategory,
  onImageUpload,
  onCreateMaterialItem,
  onMaterialsUpdated,
  availableCategories,
}: MaterialListCategoryItemProps) => {
  const [search, setSearch] = useState("");
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null);
  const [commonNameInput, setCommonNameInput] = useState("");
  const [botanicalNameInput, setBotanicalNameInput] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [individualSaving, setIndividualSaving] = useState(false);
  const [showMismatchAlert, setShowMismatchAlert] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(
    null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [editingCommonName, setEditingCommonName] = useState("");
  const [editingMaterialAltName, setEditingMaterialAltName] = useState("");
  const [editingPurchaseUnitCost, setEditingPurchaseUnitCost] = useState(
    formatCost(0),
  );
  const [editingAllocation, setEditingAllocation] = useState("1");
  const [editingAllocationUnit, setEditingAllocationUnit] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [, setIsDragging] = useState(false);
  const [unitTypeOptions, setUnitTypeOptions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loadingUnitTypes, setLoadingUnitTypes] = useState(false);
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();
    return category.materials.filter((m) => {
      if (!query) return true;
      const commonName = getCommonName(m).toLowerCase();
      return (
        commonName.includes(query) ||
        (m.altName ?? "").toLowerCase().includes(query) ||
        (m.purchaseUnit ?? "").toLowerCase().includes(query)
      );
    });
  }, [category.materials, search]);

  const groupListRef = useRef<HTMLDivElement | null>(null);

  const groupedByCommonName = useMemo(
    () => buildGroupedMaterials(filteredMaterials),
    [filteredMaterials],
  );

  const groupVirtualizer = useVirtualizer({
    count: groupedByCommonName.length,
    getScrollElement: () => groupListRef.current,
    estimateSize: () => 40,
    overscan: 10,
    enabled: expanded,
  });

  const activeGroup = useMemo<GroupedMaterial | null>(
    () => groupedByCommonName.find((g) => g.key === activeGroupKey) ?? null,
    [groupedByCommonName, activeGroupKey],
  );

  const activeGroupMismatch = useMemo(
    () => buildActiveGroupMismatch(activeGroup),
    [activeGroup],
  );

  // Check if active group contains any new materials (no IDs)
  const isNewGroup = useMemo(() => {
    if (!activeGroup) return false;
    return activeGroup.materials.some((m) => !m.id || m.id <= 0);
  }, [activeGroup]);

  const activeGroupKitIds = useMemo<Record<string, number>>(() => {
    if (!activeGroup) return {};
    const ids: Record<string, number> = {};
    activeGroup.materials.forEach((m) => {
      const size = (m.purchaseUnit ?? "").trim();
      const kitId = Number(m.kitId ?? 0);
      // Key by size within this plant group only — never across the whole category.
      if (size && kitId > 0) {
        ids[size] = kitId;
      }
    });
    return ids;
  }, [activeGroup]);

  const hasMissingKits = useMemo(() => {
    if (!activeGroup) return false;
    return activeGroup.materials.some((m) => {
      const id = Number(m.id);
      return Number.isFinite(id) && id > 0 && !Number(m.kitId);
    });
  }, [activeGroup]);

  const hasGroupFieldChanges = useMemo(() => {
    if (!activeGroup) return false;
    const trimmedCommon = commonNameInput.trim();
    const trimmedBotanical = botanicalNameInput.trim();

    return activeGroup.materials.some((material) => {
      const unit = (material.purchaseUnit ?? "").trim();
      const nextName = unit ? `${trimmedCommon} - ${unit}` : trimmedCommon;
      const currentName = (material.materialName ?? "").trim();
      const currentBotanical = (material.altName ?? "").trim();
      const currentCategoryId = material.categoryId ?? category.id;

      if (currentName !== nextName) return true;
      if (currentBotanical !== trimmedBotanical) return true;
      if (
        selectedCategoryId != null &&
        currentCategoryId !== selectedCategoryId
      ) {
        return true;
      }
      return false;
    });
  }, [
    activeGroup,
    commonNameInput,
    botanicalNameInput,
    selectedCategoryId,
    category.id,
  ]);

  const canSaveGroup =
    hasGroupFieldChanges || hasMissingKits || Boolean(selectedFile);

  const modalImageSrc =
    preview ?? activeGroup?.materials.find((m) => m.imageUrl)?.imageUrl ?? null;

  const clearModalMediaState = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
    setIsDragging(false);
  };

  const closeModal = () => {
    clearModalMediaState();
    setShowMismatchAlert(false);
    setEditingMaterialId(null);
    setEditingCommonName("");
    setEditingMaterialAltName("");
    setActiveGroupKey(null);
    setSelectedSize(null); // Reset selected size
  };

  const editingMaterial = useMemo(
    () =>
      editingMaterialId == null
        ? null
        : (activeGroup?.materials.find((m) => m.id === editingMaterialId) ??
          null),
    [activeGroup, editingMaterialId],
  );

  const hasIndividualFieldChanges = useMemo(() => {
    if (!editingMaterial) return false;
    const nextCommon = editingCommonName.trim();
    const nextAlt = editingMaterialAltName.trim();
    const nextCost = Number(editingPurchaseUnitCost);
    const nextAllocation = Number(editingAllocation);
    const nextAllocationUnit = editingAllocationUnit.trim();
    const unit = (editingMaterial.purchaseUnit ?? "").trim();
    const nextName = unit ? `${nextCommon} - ${unit}` : nextCommon;

    if ((editingMaterial.materialName ?? "").trim() !== nextName) return true;
    if ((editingMaterial.altName ?? "").trim() !== nextAlt) return true;
    if (Number(editingMaterial.purchaseUnitCost ?? 0) !== nextCost) return true;
    if (Number(editingMaterial.allocation ?? 1) !== nextAllocation) return true;
    if (
      String(editingMaterial.allocationUnit ?? "").trim() !== nextAllocationUnit
    ) {
      return true;
    }
    return false;
  }, [
    editingMaterial,
    editingCommonName,
    editingMaterialAltName,
    editingPurchaseUnitCost,
    editingAllocation,
    editingAllocationUnit,
  ]);

  const canSaveIndividual =
    hasIndividualFieldChanges ||
    (editingMaterial != null &&
      Number.isFinite(Number(editingMaterial.id)) &&
      Number(editingMaterial.id) > 0 &&
      !Number(editingMaterial.kitId));

  const addSizeSourceMaterial = useMemo(
    () => editingMaterial ?? activeGroup?.materials[0] ?? null,
    [editingMaterial, activeGroup],
  );

  const addSizeCommonName = useMemo(
    () => getCommonName(addSizeSourceMaterial),
    [addSizeSourceMaterial],
  );
  const addSizeBotanicalName = useMemo(
    () => getBotanicalName(addSizeSourceMaterial),
    [addSizeSourceMaterial],
  );

  const beginIndividualEdit = (material: Material) => {
    setEditingMaterialId(material.id);
    setEditingCommonName(getCommonName(material));
    setEditingMaterialAltName((material.altName ?? "").trim());
    setEditingPurchaseUnitCost(formatCost(material.purchaseUnitCost));
    setEditingAllocation(String(material.allocation ?? 1));
    setEditingAllocationUnit(String(material.allocationUnit ?? ""));
  };

  const closeIndividualEdit = () => {
    setEditingMaterialId(null);
    setEditingCommonName("");
    setEditingMaterialAltName("");
    setEditingPurchaseUnitCost(formatCost(0));
    setEditingAllocation("1");
    setEditingAllocationUnit("");
  };

  const handleSaveIndividualMaterial = async () => {
    if (!editingMaterialId || !canSaveIndividual) return;

    const nextCommon = editingCommonName.trim();
    const nextAlt = editingMaterialAltName.trim();
    const nextCost = Number(editingPurchaseUnitCost);
    const nextAllocation = Number(editingAllocation);
    const nextAllocationUnit = editingAllocationUnit.trim();
    if (!nextCommon) {
      alert("Name cannot be empty.");
      return;
    }

    if (!Number.isFinite(nextCost) || nextCost < 0) {
      alert("Purchase Unit Cost must be a non-negative number.");
      return;
    }

    if (!Number.isFinite(nextAllocation) || nextAllocation <= 0) {
      alert("Allocation must be a positive number.");
      return;
    }

    if (!nextAllocationUnit) {
      alert("Allocation Unit cannot be empty.");
      return;
    }

    const material = activeGroup?.materials.find(
      (m) => m.id === editingMaterialId,
    );
    if (!material) {
      closeIndividualEdit();
      return;
    }

    const unit = (material.purchaseUnit ?? "").trim();
    const nextName = unit ? `${nextCommon} - ${unit}` : nextCommon;

    const currentName = (material.materialName ?? "").trim();
    const currentAlt = (material.altName ?? "").trim();
    const currentCost = Number(material.purchaseUnitCost ?? 0);
    const currentAllocation = Number(material.allocation ?? 1);
    const currentAllocationUnit = String(material.allocationUnit ?? "").trim();
    const payload: {
      itemName?: string;
      alternateName?: string;
      purchaseUnitCost?: number;
      allocation?: number;
      allocationUnit?: string;
    } = {};
    if (currentName !== nextName) payload.itemName = nextName;
    if (currentAlt !== nextAlt) payload.alternateName = nextAlt;
    if (currentCost !== nextCost) payload.purchaseUnitCost = nextCost;
    if (currentAllocation !== nextAllocation)
      payload.allocation = nextAllocation;
    if (currentAllocationUnit !== nextAllocationUnit) {
      payload.allocationUnit = nextAllocationUnit;
    }

    const hasFieldUpdates =
      Boolean(payload.itemName) ||
      payload.alternateName !== undefined ||
      payload.purchaseUnitCost !== undefined ||
      payload.allocation !== undefined ||
      payload.allocationUnit !== undefined;
    const needsKitLookup = !Number(material.kitId);

    if (!hasFieldUpdates && !needsKitLookup) {
      closeIndividualEdit();
      return;
    }

    setIndividualSaving(true);
    try {
      if (hasFieldUpdates) {
        await updateMaterial(editingMaterialId, payload);
        onMaterialsUpdated?.([
          {
            id: editingMaterialId,
            materialName: payload.itemName ?? currentName,
            altName: payload.alternateName ?? currentAlt,
            purchaseUnitCost: payload.purchaseUnitCost ?? currentCost,
            allocation: payload.allocation ?? currentAllocation,
            allocationUnit: payload.allocationUnit ?? currentAllocationUnit,
          },
        ]);
      }

      if (hasFieldUpdates || needsKitLookup) {
        try {
          const kitSyncResult = await syncInstalledKits([editingMaterialId]);
          if (kitSyncResult.failed > 0) {
            console.warn(
              "Installed kit lookup/sync failed for variant:",
              kitSyncResult,
            );
            if (needsKitLookup) {
              alert(
                "Saved material changes, but an installed kit could not be found or synced.",
              );
            }
          }
          const renameBlocked = kitSyncResult.details.some(
            (detail) =>
              detail.status === "updated" &&
              typeof detail.reason === "string" &&
              /Aspire refused rename/i.test(detail.reason),
          );
          if (renameBlocked) {
            alert(
              "Saved and linked the kit, but Aspire refused to rename it (legacy unit-conversion data). Fix allocation conversion on that kit in Aspire, then save again.",
            );
          }
          const kitUpdates = kitSyncResult.details
            .filter(
              (detail) =>
                (detail.status === "updated" ||
                  detail.status === "recreated") &&
                Number(detail.kitId ?? detail.replacementKitId ?? 0) > 0,
            )
            .map((detail) => ({
              id: detail.materialId,
              kitId: Number(detail.replacementKitId ?? detail.kitId),
            }));
          if (kitUpdates.length > 0) {
            onMaterialsUpdated?.(kitUpdates);
          }
        } catch (error) {
          console.warn("Installed kit sync failed after variant save:", error);
          if (needsKitLookup) {
            alert("Saved material changes, but installed kit lookup failed.");
          }
        }
      }

      // Close and regroup the category list so identical variants collapse together.
      closeModal();
    } catch (error) {
      console.error("Failed to save material variant:", error);
      alert("Failed to save material variant. Please try again.");
    } finally {
      setIndividualSaving(false);
    }
  };

  const openModal = (groupKey: string, commonName: string) => {
    setActiveGroupKey(groupKey);
    setCommonNameInput(commonName);
    setSelectedCategoryId(category.id);
    const group = groupedByCommonName.find((g) => g.key === groupKey);
    setBotanicalNameInput(group?.botanicalName ?? "");

    if (group) {
      const commonNameCandidates = [
        ...new Set(
          group.materials
            .map((material) => getCommonName(material).trim())
            .filter(Boolean),
        ),
      ];
      const botanicalCandidates = [
        ...new Set(
          group.materials
            .map((material) => getBotanicalName(material).trim())
            .filter(Boolean),
        ),
      ];
      setShowMismatchAlert(
        commonNameCandidates.length > 1 || botanicalCandidates.length > 1,
      );
    } else {
      setShowMismatchAlert(false);
    }

    clearModalMediaState();

    if (unitTypeOptions.length === 0 && !loadingUnitTypes) {
      setLoadingUnitTypes(true);
      fetchUnitTypes()
        .then((units) => setUnitTypeOptions(units))
        .catch((error) => {
          console.error("Failed to load unit types:", error);
        })
        .finally(() => setLoadingUnitTypes(false));
    }
  };

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
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const toggleGroupSelection = (group: { materials: Material[] }) => {
    const allSelected = group.materials.every((m) => m.selected);
    group.materials.forEach((material) => {
      if (material.selected === allSelected) {
        onToggleMaterial(material.id);
      }
    });
  };

  const handleSaveGroup = async () => {
    if (!activeGroup || !canSaveGroup) return;

    const trimmedCommon = commonNameInput.trim();
    const trimmedBotanical = botanicalNameInput.trim();
    if (!trimmedCommon) {
      alert("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const updatePromises: Promise<void>[] = [];
      const localUpdates: Array<{
        id: number;
        materialName?: string;
        altName?: string;
        categoryId?: number;
      }> = [];

      for (const material of activeGroup.materials) {
        const unit = (material.purchaseUnit ?? "").trim();
        const nextName = unit ? `${trimmedCommon} - ${unit}` : trimmedCommon;
        const currentName = (material.materialName ?? "").trim();
        const currentBotanical = (material.altName ?? "").trim();
        const currentCategoryId = material.categoryId ?? category.id;

        const payload: {
          itemName?: string;
          alternateName?: string;
          categoryId?: number;
        } = {};
        if (currentName !== nextName) payload.itemName = nextName;
        if (currentBotanical !== trimmedBotanical) {
          payload.alternateName = trimmedBotanical;
        }
        if (selectedCategoryId && currentCategoryId !== selectedCategoryId) {
          payload.categoryId = selectedCategoryId;
        }

        if (
          payload.itemName ||
          payload.alternateName !== undefined ||
          payload.categoryId !== undefined
        ) {
          updatePromises.push(
            updateMaterial(material.id, {
              ...(payload.itemName ? { itemName: payload.itemName } : {}),
              ...(payload.alternateName !== undefined
                ? { alternateName: payload.alternateName }
                : {}),
              ...(payload.categoryId !== undefined
                ? { categoryId: payload.categoryId }
                : {}),
            }),
          );
          localUpdates.push({
            id: material.id,
            materialName: nextName,
            altName: trimmedBotanical,
            categoryId: selectedCategoryId ?? currentCategoryId,
          });
        }
      }

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
      if (localUpdates.length > 0) {
        onMaterialsUpdated?.(localUpdates);
      }

      // Sync/rename kits after field changes, or look up missing kits on save.
      const materialIdsToSync = activeGroup.materials
        .filter((material) => {
          const id = Number(material.id);
          if (!Number.isFinite(id) || id <= 0) return false;
          if (hasGroupFieldChanges) return true;
          return !Number(material.kitId);
        })
        .map((material) => Number(material.id));

      if (materialIdsToSync.length > 0) {
        try {
          const kitSyncResult = await syncInstalledKits(materialIdsToSync);
          if (kitSyncResult.failed > 0) {
            console.warn(
              "Some installed kit names failed to sync:",
              kitSyncResult,
            );
            alert(
              `Saved material changes, but ${kitSyncResult.failed} installed kit update(s) failed.`,
            );
          }
          const renameBlocked = kitSyncResult.details.filter(
            (detail) =>
              detail.status === "updated" &&
              typeof detail.reason === "string" &&
              /Aspire refused rename/i.test(detail.reason),
          );
          if (renameBlocked.length > 0) {
            console.warn(
              "Some kits were linked but Aspire blocked renaming:",
              renameBlocked,
            );
            alert(
              `Saved and linked ${renameBlocked.length} kit(s), but Aspire refused to rename them (legacy unit-conversion data). Fix allocation conversion on those kits in Aspire, then save again.`,
            );
          }
          const skippedMissing = kitSyncResult.details.filter(
            (detail) =>
              detail.status === "skipped" &&
              detail.reason === "no matching kit found",
          );
          if (skippedMissing.length > 0 && !hasGroupFieldChanges) {
            alert(
              `Could not find installed kits for ${skippedMissing.length} material(s).`,
            );
          }
          const kitUpdates = kitSyncResult.details
            .filter(
              (detail) =>
                (detail.status === "updated" ||
                  detail.status === "recreated") &&
                Number(detail.kitId ?? detail.replacementKitId ?? 0) > 0,
            )
            .map((detail) => ({
              id: detail.materialId,
              kitId: Number(detail.replacementKitId ?? detail.kitId),
            }));
          if (kitUpdates.length > 0) {
            onMaterialsUpdated?.(kitUpdates);
          }
        } catch (error) {
          console.warn("Installed kit sync failed after material save:", error);
          alert(
            "Saved material changes, but installed kit naming could not be synchronized.",
          );
        }
      }

      if (selectedFile && onImageUpload) {
        await Promise.all(
          activeGroup.materials.map((material) =>
            Promise.resolve(onImageUpload(material.id, selectedFile)),
          ),
        );
      }

      // Stay open after save; clear pending media and retarget the group key
      // in case botanical/common name changes moved the grouping key.
      clearModalMediaState();
      setShowMismatchAlert(false);
      const nextKey = trimmedBotanical
        ? `botanical:${trimmedBotanical.toLowerCase()}`
        : `common:${trimmedCommon.toLowerCase()}`;
      setActiveGroupKey(nextKey);
    } catch (error) {
      console.error("Failed to save grouped material:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
        gap: 1,
        mb: 1,
      }}
    >
      <Accordion
        expanded={expanded}
        onChange={onToggleExpansion}
        sx={{
          flex: 1,
          minWidth: 0,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 5,
          overflow: "hidden",
          justifyContent: "center",
          "--AccordionDetails-transition":
            "grid-template-rows 0.3s ease, padding-block 0.3s ease",
        }}
      >
        <AccordionSummary sx={{ height: "31px" }}>
          <Typography
            level="title-md"
            sx={{ flexGrow: 1, marginLeft: 1 }}
            className="sub-category-name"
          >
            {category.categoryName}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Input
            size="sm"
            placeholder="Search name..."
            startDecorator={<Search fontSize="small" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ m: 1 }}
          />
          <Box
            ref={groupListRef}
            sx={{
              maxHeight: "calc(10 * 40px)",
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              position: "relative",
            }}
          >
            <Box
              sx={{
                height: `${groupVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {groupVirtualizer.getVirtualItems().map((virtualRow) => {
                const group = groupedByCommonName[virtualRow.index];
                const openingThisGroup =
                  loadingUnitTypes && activeGroupKey === group.key;
                return (
                  <Box
                    key={group.key}
                    data-index={virtualRow.index}
                    ref={groupVirtualizer.measureElement}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <CategoryGroupRow
                      group={group}
                      openingThisGroup={openingThisGroup}
                      onOpen={() => openModal(group.key, group.commonName)}
                      onToggleSelection={() => toggleGroupSelection(group)}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box
        sx={{
          zIndex: 1,
          display: "flex",
          flexShrink: 0,
          width: 72,
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        {onAddItemInCategory && (
          <IconButton
            size="sm"
            variant="soft"
            color="primary"
            onClick={onAddItemInCategory}
            title="Add item to this category"
          >
            <Add />
          </IconButton>
        )}
        <IconButton
          size="sm"
          variant="soft"
          color="danger"
          onClick={onRemoveCategory}
        >
          <Delete />
        </IconButton>
      </Box>

      <GroupedMaterialEditModal
        open={!!activeGroup}
        activeGroup={activeGroup}
        categoryName={category.categoryName}
        hasMismatch={!!activeGroupMismatch?.hasMismatch}
        commonNameInput={commonNameInput}
        botanicalNameInput={botanicalNameInput}
        modalImageSrc={modalImageSrc}
        saving={saving}
        canSave={canSaveGroup}
        kitIds={activeGroupKitIds}
        selectedSize={selectedSize}
        onSetSelectedSize={setSelectedSize}
        isNewGroup={isNewGroup}
        onCommonNameChange={setCommonNameInput}
        onBotanicalNameChange={setBotanicalNameInput}
        onClose={closeModal}
        onAddSize={
          onCreateMaterialItem
            ? () => {
                setShowAddSizeModal(true);
              }
            : undefined
        }
        onSave={handleSaveGroup}
        onFileSelect={handleFileSelect}
        availableCategories={(availableCategories || []).map((c) => ({
          id: c.id.toString(),
          name: c.categoryName,
        }))}
        selectedCategoryId={selectedCategoryId?.toString() ?? null}
        onCategoryChange={(value) => setSelectedCategoryId(Number(value))}
      />

      <MaterialMismatchModal
        open={!!activeGroup && showMismatchAlert}
        mismatch={activeGroupMismatch}
        onClose={() => setShowMismatchAlert(false)}
        onUseSuggested={(commonName, botanicalName) => {
          if (commonName) {
            setCommonNameInput(commonName);
          }
          setBotanicalNameInput(botanicalName);
          setShowMismatchAlert(false);
        }}
        onEditMaterial={(materialId) => {
          const material = activeGroup?.materials.find(
            (m) => m.id === materialId,
          );
          if (material) {
            beginIndividualEdit(material);
          }
        }}
      />

      <IndividualVariantModal
        open={editingMaterialId != null}
        commonName={editingCommonName}
        botanicalName={editingMaterialAltName}
        purchaseUnit={(editingMaterial?.purchaseUnit ?? "").trim()}
        purchaseUnitCost={editingPurchaseUnitCost}
        allocation={editingAllocation}
        allocationUnit={editingAllocationUnit}
        saving={individualSaving}
        canSave={canSaveIndividual}
        unitTypeOptions={unitTypeOptions}
        loadingUnits={loadingUnitTypes}
        onClose={closeIndividualEdit}
        onCommonNameChange={setEditingCommonName}
        onBotanicalNameChange={setEditingMaterialAltName}
        onPurchaseUnitCostChange={setEditingPurchaseUnitCost}
        onAllocationChange={setEditingAllocation}
        onAllocationUnitChange={setEditingAllocationUnit}
        onAddSize={
          onCreateMaterialItem
            ? () => {
                setShowAddSizeModal(true);
              }
            : undefined
        }
        onSave={handleSaveIndividualMaterial}
      />

      {onCreateMaterialItem && (
        <AddMaterialItemModal
          open={showAddSizeModal}
          title="Add Size"
          categories={[
            { id: category.id, categoryName: category.categoryName },
          ]}
          lockedCategoryId={category.id}
          initialValues={{
            commonName:
              (editingMaterialId != null
                ? editingCommonName
                : commonNameInput) || addSizeCommonName,
            alternateName:
              (editingMaterialId != null
                ? editingMaterialAltName
                : botanicalNameInput) || addSizeBotanicalName,
            purchaseUnitCost: Number(
              editingMaterialId != null
                ? editingPurchaseUnitCost || formatCost(0)
                : (addSizeSourceMaterial?.purchaseUnitCost ?? 0),
            ),
            allocation: Number(
              editingMaterialId != null
                ? editingAllocation || "1"
                : (addSizeSourceMaterial?.allocation ?? 1),
            ),
            allocationUnit:
              (editingMaterialId != null
                ? editingAllocationUnit
                : String(addSizeSourceMaterial?.allocationUnit ?? "")) || "",
          }}
          onClose={() => setShowAddSizeModal(false)}
          onAfterCreate={async (result, imageFile) => {
            // Call parent's callback if provided
            if (onCreateMaterialItem) {
              await onCreateMaterialItem(result, imageFile);
            }
            setShowAddSizeModal(false);
          }}
        />
      )}
    </Box>
  );
};
