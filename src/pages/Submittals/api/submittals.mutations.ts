import { apiFetch } from './apiClient';

export type UpdateMaterialPayload = {
  itemName?: string;
  alternateName?: string;
  categoryId?: number;
  purchaseUnitCost?: number;
  allocation?: number;
  allocationUnit?: string;
};

export type UnitTypeOption = {
  id: number;
  name: string;
};

export type SyncInstalledKitsResult = {
  updated: number;
  failed: number;
  skipped: number;
  details: Array<{
    materialId: number;
    kitId?: number;
    replacementKitId?: number;
    status: 'updated' | 'failed' | 'skipped' | 'recreated';
    reason?: string;
  }>;
};

export type CreateMaterialItemPayload = {
  commonName: string;
  purchaseUnit: string;
  categoryId: string | number;
  alternateName: string;
  description?: string;
};

export type CreatedMaterialItem = {
  id: number;
  itemType: string;
  materialName: string;
  altName?: string;
  purchaseUnit?: string;
  purchaseUnitCost?: number;
  allocation?: number;
  allocationUnit?: string;
  selected: boolean;
  imageUrl: string | null;
  active: boolean;
  availableToBid: boolean;
  categoryId: number;
  categoryName: string;
};

export type CreateMaterialItemResult = {
  material: CreatedMaterialItem;
  kit: {
    id: number;
    kitName: string;
  };
  urls: {
    material: string;
    kit: string;
  };
};

export const updateMaterial = async (
  id: number,
  payload: UpdateMaterialPayload
): Promise<void> => {
  const res = await apiFetch(`/api/materials/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to update material ${id}`);
  }
};

export const syncInstalledKits = async (
  materialIds: number[]
): Promise<SyncInstalledKitsResult> => {
  const res = await apiFetch('/api/materials/sync-installed-kits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ materialIds })
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to sync installed kits');
  }

  return res.json();
};

export const fetchUnitTypes = async (): Promise<UnitTypeOption[]> => {
  const res = await apiFetch('/api/materials/unit-types');
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to fetch unit types');
  }
  return res.json();
};

export const createMaterialItem = async (
  payload: CreateMaterialItemPayload
): Promise<CreateMaterialItemResult> => {
  const res = await apiFetch('/api/submittals/material-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to create material item');
  }

  return res.json();
};

export const createCategory = async (
  categoryName: string
): Promise<{ id: number; categoryName: string }> => {
  const name = categoryName.trim();
  return { id: name as unknown as number, categoryName: name };
};
