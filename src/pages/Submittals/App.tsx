import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography
} from '@mui/joy';
import { MaterialsList } from './components/MaterialList/MaterialsList';
import { SelectedMaterialsList } from './components/MaterialList/SelectedMaterialsList';
// import { BackgroundImageUploader } from "./components/BackgroundImageUploader";
import { PagePreview } from './components/PagePreview/PagePreview';
import {
  PreviewPage,
  DEFAULT_COVER_LAYOUT,
  type CoverImageLayout
} from './components/PagePreview/PreviewPage';
import { MaterialPage } from './components/PagePreview/MaterialPage';
import { PagePreviewNavigation } from './components/PagePreview/PagePreviewNavigation';
import { AppendixPage } from './components/PagePreview/AppendixPage';
import { PlantScheduleUploader } from './components/PlantScheduleUploader';
import { GenerateSubmittalButton } from './components/GenerateSubmittalButton';
import { SavedSubmittalsPanel } from './components/SavedSubmittalsPanel';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePdfExport } from './hooks/usePdfExport';
import type { CreateMaterialItemResult } from './api/submittals.mutations';
import {
  createSavedSubmittal,
  getSavedSubmittal,
  updateSavedSubmittal,
  uploadCoverImage
} from './api/savedSubmittals.api';
import { getCommonName } from './components/MaterialList/materialGrouping';
import { descriptionBlockHeight } from './components/MaterialList/richText';
import { PageShell } from '../../components/PageShell';
import { PageContent } from './components/PageLayout';
import { apiFetch } from './api/apiClient';

const AUTOSAVE_DELAY_MS = 3000;

type Category = {
  id: number;
  categoryName: string;
};

type Opportunity = {
  id: number;
  name: string;
  propertyName: string;
};

export const App = () => {
  const queryClient = useQueryClient();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [coverImage, setCoverImage] = useState<File | string | null>(null);
  const [coverImageLayout, setCoverImageLayout] =
    useState<CoverImageLayout>(DEFAULT_COVER_LAYOUT);
  const [backgroundImage, _setBackgroundImage] = useState<File | null>(null);
  const [coverTitle, setCoverTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [pendingSelection, setPendingSelection] = useState<{
    categoryId: number;
    materialId: number;
  } | null>(null);
  const [restoreSelections, setRestoreSelections] = useState<Record<
    number,
    number[]
  > | null>(null);
  const [savedSubmittalId, setSavedSubmittalId] = useState<string | null>(null);
  const [savedSubmittalName, setSavedSubmittalName] = useState('');
  const [isSavingSubmittal, setIsSavingSubmittal] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newSubmittalName, setNewSubmittalName] = useState('');
  const [openLibraryRequest, setOpenLibraryRequest] = useState(0);
  const skipNextAutosave = useRef(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [plantSchedule, setPlantSchedule] = useState<File | null>(null);
  const [plantScheduleUrl, setPlantScheduleUrl] = useState<string | null>(null);
  const [plantScheduleMimeType, setPlantScheduleMimeType] = useState<
    string | null
  >(null);

  const { exportToPdf, isExporting } = usePdfExport();

  const parseArrayResponse = async <T,>(res: Response): Promise<T[]> => {
    const payload: unknown = await res.json();

    if (!res.ok) {
      const errorMessage =
        typeof payload === 'object' && payload !== null && 'error' in payload
          ? String((payload as { error: unknown }).error)
          : `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    if (Array.isArray(payload)) {
      return payload as T[];
    }

    if (
      typeof payload === 'object' &&
      payload !== null &&
      'data' in payload &&
      Array.isArray((payload as { data: unknown }).data)
    ) {
      return (payload as { data: T[] }).data;
    }

    return [];
  };

  // Lazy-load materials for each selected category in parallel
  // Use a Submittals-specific query key so it does not collide with Material Editor.
  const catalogCategoriesQuery = useQuery({
    queryKey: ['submittals', 'categories'],
    queryFn: async () => {
      const res = await apiFetch('/api/submittals/categories');
      return parseArrayResponse<{ id: string | number; categoryName: string }>(
        res
      );
    },
    staleTime: 5 * 60 * 1000
  });

  const categoryMaterialsQueries = useQueries({
    queries: selectedCategories.map(cat => ({
      queryKey: ['submittals', 'materials', 'by-category', cat.id],
      queryFn: async () => {
        const res = await apiFetch(
          `/api/submittals/materials/by-category?name=${encodeURIComponent(cat.id)}`
        );
        const items = await parseArrayResponse<any>(res);
        return { categoryId: cat.id, categoryName: cat.categoryName, items };
      },
      staleTime: 5 * 60 * 1000
    }))
  });

  // Stable fingerprint of successful query payloads — avoids effect loops from
  // useQueries returning a new array identity every render.
  const loadedCategoryFingerprint = categoryMaterialsQueries
    .filter(q => q.isSuccess && q.data)
    .map(q => `${q.data!.categoryId}:${q.dataUpdatedAt}`)
    .join('|');

  // Sync freshly loaded category data into materials state (preserving selected flags).
  // Merge when the category already exists so create-stubs get the rest of the items.
  useEffect(() => {
    if (!loadedCategoryFingerprint) return;

    categoryMaterialsQueries.forEach(query => {
      if (!query.isSuccess || !query.data) return;
      const { categoryId, categoryName, items } = query.data;

      setMaterials((prev: any) => {
        const existing = prev.find((c: any) => c.id === categoryId);
        const restoreIds = restoreSelections?.[categoryId] ?? null;
        const selectedById = new Set(
          (existing?.materials ?? [])
            .filter((m: any) => m.selected)
            .map((m: any) => m.id)
        );
        if (restoreIds) {
          for (const id of restoreIds) selectedById.add(id);
        }
        const localById = new Map<
          number,
          {
            id: number;
            selected?: boolean;
            imageUrl?: string;
          }
        >((existing?.materials ?? []).map((m: any) => [m.id, m]));

        const mergedFromServer = items.map((m: any) => {
          const local = localById.get(m.id);
          const withCategory = {
            ...m,
            categoryId: m.categoryId ?? categoryId,
            // Prefer an optimistic local image until the server catches up.
            imageUrl: local?.imageUrl ?? m.imageUrl
          };
          const shouldSelect =
            selectedById.has(m.id) ||
            (pendingSelection?.categoryId === categoryId &&
              pendingSelection?.materialId === m.id);
          return shouldSelect
            ? { ...withCategory, selected: true }
            : { ...withCategory, selected: Boolean(local?.selected) };
        });

        const serverIds = new Set(items.map((m: any) => m.id));
        const localOnly = (existing?.materials ?? []).filter(
          (m: any) => !serverIds.has(m.id)
        );

        let nextMaterials = [...mergedFromServer, ...localOnly];
        if (restoreIds?.length) {
          const byId = new Map(nextMaterials.map((m: any) => [m.id, m]));
          const orderedSelected = restoreIds
            .map(id => byId.get(id))
            .filter(Boolean);
          const rest = nextMaterials.filter(
            (m: any) => !restoreIds.includes(m.id)
          );
          nextMaterials = [...orderedSelected, ...rest];
        } else if (existing?.materials?.length) {
          const mergedById = new Map(
            nextMaterials.map((material: any) => [String(material.id), material])
          );
          const ordered: any[] = [];
          const seen = new Set<string>();
          for (const local of existing.materials) {
            const id = String(local.id);
            const next = mergedById.get(id);
            if (!next || seen.has(id)) continue;
            ordered.push(next);
            seen.add(id);
          }
          for (const material of nextMaterials) {
            const id = String(material.id);
            if (seen.has(id)) continue;
            ordered.push(material);
            seen.add(id);
          }
          nextMaterials = ordered;
        } else {
          nextMaterials.sort((a: any, b: any) =>
            String(a.materialName ?? '').localeCompare(
              String(b.materialName ?? '')
            )
          );
        }

        const nextCategoryName =
          categoryName &&
          (!existing?.categoryName ||
            /^Category\s+\d+$/i.test(String(existing.categoryName)))
            ? categoryName
            : (existing?.categoryName ?? categoryName);

        if (!existing) {
          const updated = [
            ...prev,
            {
              id: categoryId,
              categoryName: nextCategoryName,
              materials: nextMaterials
            }
          ];
          return updated.sort(
            (a: any, b: any) =>
              selectedCategories.findIndex(c => c.id === a.id) -
              selectedCategories.findIndex(c => c.id === b.id)
          );
        }

        return prev.map((c: any) =>
          c.id === categoryId
            ? {
                ...c,
                categoryName: nextCategoryName,
                materials: nextMaterials
              }
            : c
        );
      });

      if (pendingSelection?.categoryId === categoryId) {
        setPendingSelection(null);
      }
      if (restoreSelections?.[categoryId]) {
        setRestoreSelections(prev => {
          if (!prev) return null;
          const next = { ...prev };
          delete next[categoryId];
          return Object.keys(next).length ? next : null;
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on fingerprint only
  }, [loadedCategoryFingerprint]);

  // Remove from materials when category is deselected
  useEffect(() => {
    const selectedIds = new Set(selectedCategories.map(c => c.id));
    setMaterials((prev: any) => prev.filter((c: any) => selectedIds.has(c.id)));
  }, [selectedCategories]);

  const availableCategories = useMemo(() => {
    const selectedIds = new Set(selectedCategories.map(c => String(c.id)));
    return (catalogCategoriesQuery.data ?? [])
      .filter(cat => cat.categoryName && !selectedIds.has(String(cat.id)))
      .map(cat => ({
        id: cat.categoryName as unknown as number,
        categoryName: cat.categoryName
      }));
  }, [catalogCategoriesQuery.data, selectedCategories]);

  // Categories that are selected but whose materials haven't loaded yet
  const loadingCategories = useMemo(() => {
    const loadedIds = new Set((materials as any[]).map((c: any) => c.id));
    return selectedCategories.filter(c => !loadedIds.has(c.id));
  }, [selectedCategories, materials]);

  const buildSavePayload = async (name: string) => {
    let coverImageUrl: string | null =
      typeof coverImage === 'string' ? coverImage : null;
    let coverImageMimeType: string | null = null;

    if (coverImage instanceof File) {
      const uploaded = await uploadCoverImage(coverImage);
      coverImageUrl = uploaded.url;
      coverImageMimeType = uploaded.mimeType;
      setCoverImage(uploaded.url);
    }

    let plantScheduleImageUrl: string | null =
      plantScheduleUrl && !plantScheduleUrl.startsWith('blob:')
        ? plantScheduleUrl
        : null;
    let savedPlantScheduleMimeType = plantScheduleMimeType;

    if (plantSchedule instanceof File) {
      const uploaded = await uploadCoverImage(plantSchedule);
      plantScheduleImageUrl = uploaded.url;
      savedPlantScheduleMimeType = uploaded.mimeType;
      setPlantSchedule(null);
      setPlantScheduleMimeType(uploaded.mimeType);
      setPlantScheduleUrl(current => {
        if (current?.startsWith('blob:')) URL.revokeObjectURL(current);
        return uploaded.url;
      });
    }

    const categories = (materials as any[])
      .map(cat => ({
        id: cat.id as number,
        categoryName: String(cat.categoryName ?? `Category ${cat.id}`),
        selectedMaterialIds: (cat.materials ?? [])
          .filter((m: any) => m.selected)
          .map((m: any) => m.id as number)
      }))
      .filter(cat => cat.selectedMaterialIds.length > 0);

    // Keep empty selected categories in the draft if the user added them
    const categoryIds = new Set(categories.map(c => c.id));
    for (const cat of selectedCategories) {
      if (!categoryIds.has(cat.id)) {
        categories.push({
          id: cat.id,
          categoryName: cat.categoryName,
          selectedMaterialIds: []
        });
      }
    }

    return {
      name,
      coverTitle,
      opportunity: opportunity
        ? {
            id: opportunity.id,
            name: opportunity.name,
            propertyName: opportunity.propertyName ?? ''
          }
        : null,
      coverImageUrl,
      coverImageMimeType,
      plantScheduleImageUrl,
      plantScheduleMimeType: savedPlantScheduleMimeType,
      coverImageLayout,
      categories
    };
  };

  const handleSaveSubmittal = async (name: string) => {
    setIsSavingSubmittal(true);
    setSaveStatus('Saving…');
    try {
      const payload = await buildSavePayload(name);
      if (savedSubmittalId) {
        const updated = await updateSavedSubmittal(savedSubmittalId, payload);
        setSavedSubmittalName(updated.name);
      } else {
        const created = await createSavedSubmittal(payload);
        setSavedSubmittalId(created.id);
        setSavedSubmittalName(created.name);
      }
      setSaveStatus('Saved');
    } catch (error) {
      console.error('Failed to save submittal:', error);
      setSaveStatus('Save failed');
    } finally {
      setIsSavingSubmittal(false);
    }
  };

  const handleLoadSubmittal = async (id: string) => {
    const saved = await getSavedSubmittal(id);
    skipNextAutosave.current = true;
    setSavedSubmittalId(saved.id);
    setSavedSubmittalName(saved.name);
    setSaveStatus('');
    setOpportunity(saved.opportunity);
    setCoverTitle(saved.coverTitle || '');
    setCoverImage(saved.coverImageUrl);
    setCoverImageLayout(saved.coverImageLayout || DEFAULT_COVER_LAYOUT);
    setPlantSchedule(null);
    setPlantScheduleMimeType(saved.plantScheduleMimeType || null);
    setPlantScheduleUrl(current => {
      if (current?.startsWith('blob:')) URL.revokeObjectURL(current);
      return saved.plantScheduleImageUrl || null;
    });
    setCurrentPageIndex(0);
    setPendingSelection(null);
    setMaterials([]);
    setSelectedCategories(
      saved.categories.map(c => ({
        id: c.id,
        categoryName: c.categoryName
      }))
    );
    setRestoreSelections(
      Object.fromEntries(
        saved.categories.map(c => [c.id, c.selectedMaterialIds])
      )
    );
  };

  const onAddCategoryHandler = (category: Category) => {
    setSelectedCategories(prev => [...prev, category]);
  };

  const onGlobalSelectHandler = (category: any, materialId: number) => {
    const alreadyAdded = selectedCategories.some(c => c.id === category.id);
    if (alreadyAdded) {
      onToggleMaterialHandler(category.id, materialId);
    } else {
      setPendingSelection({ categoryId: category.id, materialId });
      setSelectedCategories(prev => [
        ...prev,
        { id: category.id, categoryName: category.categoryName }
      ]);
    }
  };

  const onRemoveSelectedMaterialHandler = (catId: number, matId: number) => {
    // Same logic as toggle - just unselect the material
    setMaterials((prev: any) =>
      prev.map((c: any) =>
        c.id === catId
          ? {
              ...c,
              materials: c.materials.map((m: any) =>
                m.id === matId ? { ...m, selected: false } : m
              )
            }
          : c
      )
    );
  };

  const onReorderHandler = (
    flatItems: { categoryId: number; material: { id: number } }[]
  ) => {
    setMaterials((prev: any) => {
      // Build a new materials array preserving all category data
      // but reordering the selected materials within each category
      // based on the new flat order
      const ordered = flatItems.map(item => item.material.id);
      return prev.map((cat: any) => ({
        ...cat,
        materials: [
          // selected in new order
          ...ordered
            .filter(id =>
              cat.materials.some((m: any) => m.id === id && m.selected)
            )
            .map(id => cat.materials.find((m: any) => m.id === id)),
          // unselected items (order doesn't matter)
          ...cat.materials.filter((m: any) => !m.selected)
        ].filter(Boolean)
      }));
    });
  };

  const onReorderCategoriesHandler = (categoryOrder: number[]) => {
    setMaterials((prev: any) => {
      const orderMap = new Map(categoryOrder.map((id, idx) => [id, idx]));
      return [...prev].sort((a: any, b: any) => {
        const aIdx = orderMap.has(a.id)
          ? (orderMap.get(a.id) as number)
          : Number.MAX_SAFE_INTEGER;
        const bIdx = orderMap.has(b.id)
          ? (orderMap.get(b.id) as number)
          : Number.MAX_SAFE_INTEGER;
        if (aIdx !== bIdx) return aIdx - bIdx;
        return 0;
      });
    });
  };

  const onToggleMaterialHandler = (catId: number, matId: number) => {
    setMaterials((prev: any[]) => {
      const category = prev.find(c => c.id === catId);
      if (!category) return prev;

      const materialToToggle = category.materials.find(
        (m: any) => m.id === matId
      );
      if (!materialToToggle) return prev;

      const isSelecting = !materialToToggle.selected;
      const commonName = getCommonName(materialToToggle);

      // Find all variants of this material in the same category
      const variants = category.materials.filter(
        (m: any) => getCommonName(m) === commonName
      );

      if (!isSelecting) {
        // If de-selecting, de-select all variants
        const variantIds = new Set(variants.map((v: any) => v.id));
        return prev.map(c =>
          c.id === catId
            ? {
                ...c,
                materials: c.materials.map((m: any) =>
                  variantIds.has(m.id) ? { ...m, selected: false } : m
                )
              }
            : c
        );
      }

      // If selecting, find the best variant to select
      let bestVariant = variants.find((v: any) => v.imageUrl);
      if (!bestVariant) {
        bestVariant = variants[0];
      }

      const variantIdsToDeselect = new Set(
        variants
          .map((v: any) => v.id)
          .filter((id: number) => id !== bestVariant.id)
      );

      return prev.map(c => {
        if (c.id !== catId) return c;
        const updated = c.materials.map((m: any) => {
          if (m.id === bestVariant.id) {
            return { ...m, selected: true };
          }
          if (variantIdsToDeselect.has(m.id)) {
            return { ...m, selected: false };
          }
          return m;
        });
        const selectedItem = updated.find((m: any) => m.id === bestVariant.id);
        const rest = updated.filter((m: any) => m.id !== bestVariant.id);
        return {
          ...c,
          materials: [
            ...rest.filter((m: any) => m.selected),
            selectedItem,
            ...rest.filter((m: any) => !m.selected)
          ].filter(Boolean)
        };
      });
    });
  };

  const onRemoveMaterialHandler = (catId: number) => {
    // Remove from selected categories
    setSelectedCategories(prev => prev.filter(cat => cat.id !== catId));
    // Remove from materials display
    setMaterials((prev: any) => prev.filter((c: any) => c.id !== catId));
  };

  const handleMaterialImageUpload = async (
    materialId: number,
    imageFile: File
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('materialId', materialId.toString());

      const response = await apiFetch('/api/submittals/material-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        console.error('Server error details:', errorData);
        throw new Error(
          `Server error: ${errorData.error || 'Failed to upload image'}`
        );
      }

      const result = await response.json();
      const imageUrl = result.imageUrl;
      const appliedMaterialIds: number[] = Array.isArray(
        result.appliedMaterialIds
      )
        ? result.appliedMaterialIds
        : [materialId];
      const appliedSet = new Set(appliedMaterialIds);

      // Update all materials in the same botanical group so size variants
      // immediately share the uploaded image in the UI.
      setMaterials((prevMaterials: any) =>
        prevMaterials.map((category: any) => ({
          ...category,
          materials: category.materials.map((material: any) =>
            appliedSet.has(material.id) ? { ...material, imageUrl } : material
          )
        }))
      );
    } catch (error) {
      console.error('Failed to upload material image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleMaterialsDeleted = (ids: Array<number | string>) => {
    const idSet = new Set(ids.map(id => String(id)));
    setMaterials((prevMaterials: any) =>
      prevMaterials.map((category: any) => ({
        ...category,
        materials: category.materials.filter(
          (material: any) => !idSet.has(String(material.id))
        )
      }))
    );
    void queryClient.invalidateQueries({
      queryKey: ['submittals', 'materials', 'by-category']
    });
    void queryClient.invalidateQueries({
      queryKey: ['submittals', 'categories']
    });
    void queryClient.invalidateQueries({
      queryKey: ['submittals', 'material-search']
    });
  };

  const handleMaterialsUpdated = (
    updates: Array<{
      id: number;
      materialName?: string;
      altName?: string;
      description?: string;
      purchaseUnitCost?: number;
      allocation?: number;
      allocationUnit?: string;
      categoryId?: number;
    }>
  ) => {
    if (!updates.length) return;

    const updateMap = new Map(updates.map(u => [u.id, u]));
    setMaterials((prevMaterials: any) =>
      prevMaterials.map((category: any) => ({
        ...category,
        materials: category.materials.map((material: any) => {
          const next = updateMap.get(material.id);
          if (!next) return material;
          return {
            ...material,
            materialName: next.materialName ?? material.materialName,
            altName: next.altName ?? material.altName,
            description: next.description ?? material.description,
            purchaseUnitCost:
              next.purchaseUnitCost ?? material.purchaseUnitCost,
            allocation: next.allocation ?? material.allocation,
            allocationUnit: next.allocationUnit ?? material.allocationUnit,
            categoryId: next.categoryId ?? material.categoryId
          };
        })
      }))
    );
  };

  const resolveCategoryName = (categoryId: number, fallback?: string) => {
    const trimmed = String(fallback ?? '').trim();
    if (trimmed && !/^Category\s+\d+$/i.test(trimmed)) return trimmed;

    const fromSelected = selectedCategories.find(
      c => c.id === categoryId
    )?.categoryName;
    if (fromSelected?.trim()) return fromSelected;

    const fromCatalog = catalogCategoriesQuery.data?.find(
      cat => String(cat.id) === String(categoryId)
    )?.categoryName;
    if (fromCatalog?.trim()) return fromCatalog;

    return trimmed || String(categoryId);
  };

  const handleCreateMaterialItem = async (
    result: CreateMaterialItemResult,
    imageFile?: File
  ) => {
    const created = result.material;
    const categoryName = resolveCategoryName(
      created.categoryId,
      created.categoryName
    );

    if (imageFile) {
      await handleMaterialImageUpload(created.id, imageFile);
    }

    setSelectedCategories(prev => {
      const existing = prev.find(c => c.id === created.categoryId);
      if (existing) {
        if (
          /^Category\s+\d+$/i.test(existing.categoryName) &&
          categoryName !== existing.categoryName
        ) {
          return prev.map(c =>
            c.id === created.categoryId ? { ...c, categoryName } : c
          );
        }
        return prev;
      }
      return [
        ...prev,
        {
          id: created.categoryId,
          categoryName
        }
      ];
    });

    setMaterials((prev: any) => {
      const imageUrl = imageFile ? null : created.imageUrl;
      const materialToInsert = {
        id: created.id,
        itemType: created.itemType,
        materialName: created.materialName,
        altName: created.altName ?? '',
        description: created.description ?? '',
        purchaseUnit: created.purchaseUnit ?? '',
        purchaseUnitCost: created.purchaseUnitCost ?? 0,
        allocation: created.allocation ?? 1,
        allocationUnit: created.allocationUnit ?? '',
        selected: created.selected ?? false,
        imageUrl,
        availableToBid: created.availableToBid,
        active: created.active
      };

      const existingCategoryIndex = prev.findIndex(
        (category: any) => category.id === created.categoryId
      );

      if (existingCategoryIndex === -1) {
        return [
          ...prev,
          {
            id: created.categoryId,
            categoryName,
            materials: [materialToInsert]
          }
        ];
      }

      return prev.map((category: any) => {
        if (category.id !== created.categoryId) return category;

        const existsInCategory = category.materials.some(
          (material: any) => material.id === created.id
        );
        if (existsInCategory) {
          return {
            ...category,
            categoryName: /^Category\s+\d+$/i.test(
              String(category.categoryName ?? '')
            )
              ? categoryName
              : category.categoryName
          };
        }

        const nextMaterials = [...category.materials, materialToInsert];

        return {
          ...category,
          categoryName: /^Category\s+\d+$/i.test(
            String(category.categoryName ?? '')
          )
            ? categoryName
            : category.categoryName,
          materials: nextMaterials
        };
      });
    });

    // Refetch so a newly created category picks up the rest of its items.
    await queryClient.invalidateQueries({
      queryKey: ['submittals', 'categories']
    });
    await queryClient.invalidateQueries({
      queryKey: ['submittals', 'materials', 'by-category', created.categoryId]
    });
  };

  // Flatten all selected materials into ordered list for material pages
  const allSelectedMaterials = useMemo(() => {
    const result: {
      id: number;
      materialName: string;
      altName?: string;
      description?: string;
      purchaseUnit?: string;
      imageUrl?: string;
      categoryName: string;
    }[] = [];
    for (const cat of materials as any[]) {
      for (const mat of cat.materials) {
        if (mat.selected) {
          result.push({
            id: mat.id,
            materialName: getCommonName(mat),
            altName: mat.altName,
            description: mat.description,
            purchaseUnit: mat.purchaseUnit,
            imageUrl: mat.imageUrl,
            categoryName: cat.categoryName
          });
        }
      }
    }
    return result;
  }, [materials]);

  // Height-aware chunker: accounts for item rows AND category heading rows so nothing overflows the footer.
  // Heights are in px at the full 816×1056 page scale.
  // Item row: 120px circle + 8px gap = 128px per item after the first (first = 120px).
  // Category heading: 32px text + 8px gap + 4px extra top margin (if not first) ≈ 44px.
  // The first item under a heading also has 15px of extra space.
  // Usable content height: page 1056 − 48px top padding − 36px bottom padding − 50px footer = 922px.
  const materialPageChunks = useMemo(() => {
    const ITEM_H = 120; // height of one item row
    const GAP = 8; // flex gap between rows
    const HEADING_H = 44; // height consumed by a category heading row
    const FIRST_ITEM_GAP = 15; // extra space under a category heading
    const MAX_H = 880; // conservative usable height per page (below footer)

    type Item = (typeof allSelectedMaterials)[0];
    const chunks: Item[][] = [];
    let page: Item[] = [];
    let usedHeight = 0;
    let lastCat = '__none__';

    for (const item of allSelectedMaterials) {
      const isNewCat = item.categoryName !== lastCat;
      const itemH = Math.max(
        ITEM_H,
        88 + descriptionBlockHeight(item.description)
      );
      const headingExtra =
        isNewCat && item.categoryName ? HEADING_H + FIRST_ITEM_GAP : 0;
      const rowH = (page.length === 0 ? 0 : GAP) + headingExtra + itemH;

      if (page.length > 0 && usedHeight + rowH > MAX_H) {
        // Carry this item to next page
        chunks.push(page);
        page = [item];
        usedHeight =
          itemH + (item.categoryName ? HEADING_H + FIRST_ITEM_GAP : 0);
        lastCat = item.categoryName ?? '';
      } else {
        page.push(item);
        usedHeight += rowH;
        lastCat = item.categoryName ?? '';
      }
    }

    if (page.length > 0) chunks.push(page);
    return chunks;
  }, [allSelectedMaterials]);

  const hasAppendix = Boolean(plantScheduleUrl);
  // Total pages = 1 cover + N material pages + optional plant schedule appendix
  const totalPages = 1 + materialPageChunks.length + (hasAppendix ? 1 : 0);
  const appendixIndex = hasAppendix ? totalPages - 1 : -1;

  // Adjust during render so a shrink in totalPages (removed materials or
  // appendix) is applied before this frame paints. useMemo cached on
  // totalPages alone and could keep a stale index.
  if (currentPageIndex >= totalPages || currentPageIndex < 0) {
    setCurrentPageIndex(Math.max(0, totalPages - 1));
  }

  const materialPageItems = materialPageChunks[currentPageIndex - 1];

  const handleDownloadPdf = async () => {
    const selectedCategories = (materials as any[]).filter(c =>
      c.materials.some((m: any) => m.selected)
    );
    await exportToPdf({
      title: coverTitle,
      coverImage,
      coverImageX: coverImageLayout.x,
      coverImageY: coverImageLayout.y,
      coverImageWidth: coverImageLayout.width,
      coverImageHeight: coverImageLayout.height,
      categories: selectedCategories,
      materialPages: materialPageChunks.map((chunk, idx) => ({
        items: chunk,
        propertyName: (opportunity as any)?.propertyName,
        opportunityName: (opportunity as any)?.name,
        pageNumber: idx + 2,
        totalPages
      })),
      plantSchedule,
      plantScheduleUrl:
        plantScheduleUrl && !plantScheduleUrl.startsWith('blob:')
          ? plantScheduleUrl
          : null,
      plantScheduleMimeType
    });
  };

  const autosaveKey = useMemo(() => {
    const selected = (materials as any[]).map(cat => ({
      id: cat.id,
      name: cat.categoryName,
      ids: (cat.materials ?? [])
        .filter((material: any) => material.selected)
        .map((material: any) => material.id)
    }));
    return JSON.stringify({
      savedSubmittalName,
      coverTitle,
      selected,
      categoryIds: selectedCategories.map(category => category.id),
      coverImage:
        typeof coverImage === 'string' ? coverImage : coverImage ? 'file' : null,
      coverImageLayout,
      plantSchedule: plantSchedule
        ? `${plantSchedule.name}:${plantSchedule.size}:${plantSchedule.lastModified}`
        : plantScheduleUrl
    });
  }, [
    savedSubmittalName,
    coverTitle,
    materials,
    selectedCategories,
    coverImage,
    coverImageLayout,
    plantSchedule,
    plantScheduleUrl
  ]);

  const saveSubmittalRef = useRef(handleSaveSubmittal);
  const savedNameRef = useRef(savedSubmittalName);
  const savedIdRef = useRef(savedSubmittalId);
  saveSubmittalRef.current = handleSaveSubmittal;
  savedNameRef.current = savedSubmittalName;
  savedIdRef.current = savedSubmittalId;

  useEffect(() => {
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      const name = savedNameRef.current.trim();
      if (!name) return;
      void saveSubmittalRef.current(name);
    }, AUTOSAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [autosaveKey]);

  const handlePlantScheduleChange = (file: File | null) => {
    setPlantSchedule(file);
    setPlantScheduleMimeType(file ? file.type || 'image/jpeg' : null);
    setPlantScheduleUrl(current => {
      if (current?.startsWith('blob:')) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleCreateNewSubmittal = async () => {
    const name = newSubmittalName.trim();
    if (!name) return;
    skipNextAutosave.current = true;
    setIsSavingSubmittal(true);
    setSaveStatus('Saving…');
    try {
      setCoverTitle('');
      setCoverImage(null);
      setCoverImageLayout(DEFAULT_COVER_LAYOUT);
      setOpportunity(null);
      setSelectedCategories([]);
      setMaterials([]);
      setPendingSelection(null);
      setRestoreSelections(null);
      setCurrentPageIndex(0);
      handlePlantScheduleChange(null);
      const created = await createSavedSubmittal({
        name,
        coverTitle: '',
        opportunity: null,
        coverImageUrl: null,
        coverImageMimeType: null,
        plantScheduleImageUrl: null,
        plantScheduleMimeType: null,
        coverImageLayout: DEFAULT_COVER_LAYOUT,
        categories: []
      });
      setSavedSubmittalId(created.id);
      setSavedSubmittalName(created.name);
      setSaveStatus('Saved');
      setCreateOpen(false);
      setNewSubmittalName('');
    } catch (error) {
      console.error('Failed to create submittal:', error);
      setSaveStatus('Save failed');
    } finally {
      setIsSavingSubmittal(false);
    }
  };

  return (
    <PageShell>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: '20px',
          flexWrap: 'wrap'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Input
            value={savedSubmittalName}
            onChange={event => setSavedSubmittalName(event.target.value)}
            placeholder="Submittal name"
            aria-label="Submittal name"
            sx={{
              width: { xs: 200, sm: 320 },
              bgcolor: '#fff',
              color: '#1a1a1a'
            }}
          />
          <Button
            loading={isSavingSubmittal}
            disabled={!savedSubmittalName.trim()}
            onClick={() => void handleSaveSubmittal(savedSubmittalName.trim())}
          >
            Save
          </Button>
          {saveStatus && (
            <Typography level="body-sm" sx={{ color: '#f5f5f5' }}>
              {saveStatus}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button
            variant="outlined"
            onClick={() => setOpenLibraryRequest(request => request + 1)}
            sx={{
              color: '#f5f5f5',
              borderColor: 'rgba(255,255,255,0.7)'
            }}
          >
            Open
          </Button>
          <Button
            onClick={() => {
              setNewSubmittalName('');
              setCreateOpen(true);
            }}
          >
            Create New Submittal
          </Button>
        </Box>
      </Box>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
        <ModalDialog sx={{ width: 420 }}>
          <ModalClose />
          <Typography level="title-md">Create New Submittal</Typography>
          <FormControl sx={{ mt: 1 }}>
            <FormLabel>Name</FormLabel>
            <Input
              autoFocus
              value={newSubmittalName}
              onChange={event => setNewSubmittalName(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && newSubmittalName.trim()) {
                  void handleCreateNewSubmittal();
                }
              }}
              placeholder="Submittal name"
            />
          </FormControl>
          <Button
            sx={{ mt: 2 }}
            disabled={!newSubmittalName.trim() || isSavingSubmittal}
            loading={isSavingSubmittal}
            onClick={() => void handleCreateNewSubmittal()}
          >
            Create
          </Button>
        </ModalDialog>
      </Modal>
      <PageContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          <MaterialsList
            materials={materials}
            availableCategories={availableCategories}
            loadingCategories={loadingCategories}
            onToggleMaterial={onToggleMaterialHandler}
            onRemoveMaterial={onRemoveMaterialHandler}
            onAddCategory={onAddCategoryHandler}
            isLoadingCategories={catalogCategoriesQuery.isLoading}
            onGlobalSelect={onGlobalSelectHandler}
            onImageUpload={handleMaterialImageUpload}
            onMaterialsUpdated={handleMaterialsUpdated}
            onMaterialsDeleted={handleMaterialsDeleted}
            onCreateMaterialItem={handleCreateMaterialItem}
          />
          <SelectedMaterialsList
            materials={materials}
            onRemoveMaterial={onRemoveSelectedMaterialHandler}
            onReorder={onReorderHandler}
            onReorderCategories={onReorderCategoriesHandler}
          />
        </Box>

        {/* Row 2: Preview */}
        <Box
          sx={{
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            bgcolor: '#444',
            color: '#f5f5f5',
            borderRadius: '12px',
            p: '20px'
          }}
        >
          <Typography level="h4" sx={{ color: '#f5f5f5' }}>
            Submittal Preview
          </Typography>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: 'center',
              gap: '24px'
            }}
          >
            <PlantScheduleUploader
              previewUrl={plantScheduleUrl}
              onChange={handlePlantScheduleChange}
            />
            <Box
              sx={{
                width: '100%',
                maxWidth: 500,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5
              }}
            >
            <Input
              value={coverTitle}
              onChange={event => setCoverTitle(event.target.value)}
              placeholder="Name of proposal..."
              aria-label="Name of proposal"
              sx={{
                bgcolor: '#fff',
                color: '#1a1a1a'
              }}
            />
            <PagePreview>
              {currentPageIndex === 0 ? (
                <PreviewPage
                  title={coverTitle}
                  coverImage={coverImage}
                  onCoverImageChange={setCoverImage}
                  coverImageLayout={coverImageLayout}
                  onCoverImageLayoutChange={setCoverImageLayout}
                  backgroundImage={backgroundImage}
                  categories={materials}
                />
              ) : currentPageIndex === appendixIndex ? (
                plantScheduleUrl ? (
                  <AppendixPage imageUrl={plantScheduleUrl} />
                ) : null
              ) : materialPageItems != null ? (
                <MaterialPage
                  items={materialPageItems}
                  propertyName={(opportunity as any)?.propertyName}
                  opportunityName={(opportunity as any)?.name}
                  pageNumber={currentPageIndex + 1}
                  totalPages={totalPages}
                />
              ) : null}
            </PagePreview>
            <PagePreviewNavigation
              currentPage={currentPageIndex + 1}
              totalPages={totalPages}
              onPrev={() => setCurrentPageIndex(i => Math.max(0, i - 1))}
              onNext={() =>
                setCurrentPageIndex(i => Math.min(totalPages - 1, i + 1))
              }
            />
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <SavedSubmittalsPanel
                savedId={savedSubmittalId}
                openLibraryRequest={openLibraryRequest}
                defaultName={
                  savedSubmittalName ||
                  coverTitle ||
                  opportunity?.name ||
                  'Untitled submittal'
                }
                isSaving={isSavingSubmittal}
                onSave={handleSaveSubmittal}
                onLoad={handleLoadSubmittal}
              />
              <GenerateSubmittalButton
                onClick={handleDownloadPdf}
                isLoading={isExporting}
              />
            </Box>
            </Box>
          </Box>
        </Box>
      </PageContent>
    </PageShell>
  );
};
