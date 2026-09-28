import type { Material } from "./MaterialListItem";

export type GroupedMaterial = {
  key: string;
  displayName: string;
  commonName: string;
  botanicalName: string;
  materials: Material[];
  sizes: string[];
  hasImage: boolean;
};

export type PossibleMatch = {
  id: number;
  itemName: string;
  commonName: string;
  botanicalName: string;
  purchaseUnit: string;
};

export type ActiveGroupMismatch = {
  hasMismatch: boolean;
  hasCommonConflict: boolean;
  hasBotanicalConflict: boolean;
  commonNameCandidates: string[];
  botanicalCandidates: string[];
  possibleMatches: PossibleMatch[];
  suggestedCommonName: string;
  suggestedBotanicalName: string;
};

export const getCommonName = (material: Material | null | undefined) => {
  if (!material) return "";
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

export const getBotanicalName = (material: Material | null | undefined) =>
  (material?.altName ?? "").trim();

const pickMostFrequent = (values: string[]) => {
  const counts = new Map<string, { value: string; count: number }>();
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { value: trimmed, count: 1 });
    }
  }

  let top: { value: string; count: number } | null = null;
  for (const entry of counts.values()) {
    if (!top || entry.count > top.count) {
      top = entry;
    }
  }
  return top?.value ?? "";
};

export const buildGroupedMaterials = (
  materials: Material[],
): GroupedMaterial[] => {
  const groups = new Map<string, GroupedMaterial>();

  for (const material of materials) {
    const commonName = getCommonName(material) || material.materialName;
    const botanicalName = getBotanicalName(material);
    const key = botanicalName
      ? `botanical:${botanicalName.toLowerCase()}`
      : `common:${commonName.trim().toLowerCase()}`;

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        displayName: botanicalName || commonName,
        commonName,
        botanicalName,
        materials: [],
        sizes: [],
        hasImage: false,
      });
    }

    const group = groups.get(key)!;
    group.materials.push(material);
    if (material.imageUrl) group.hasImage = true;
    if (!group.botanicalName && botanicalName) {
      group.botanicalName = botanicalName;
      group.displayName = botanicalName;
    }

    const unit = (material.purchaseUnit ?? "").trim();
    if (unit && !group.sizes.includes(unit)) {
      group.sizes.push(unit);
    }
  }

  return Array.from(groups.values())
    .map((g) => ({ ...g, sizes: [...g.sizes].sort() }))
    .sort((a, b) => {
      const commonCompare = a.commonName.localeCompare(b.commonName);
      if (commonCompare !== 0) return commonCompare;
      return a.displayName.localeCompare(b.displayName);
    });
};

export const buildActiveGroupMismatch = (
  activeGroup: GroupedMaterial | null,
): ActiveGroupMismatch | null => {
  if (!activeGroup) return null;

  const commonNameCandidates = [
    ...new Set(
      activeGroup.materials
        .map((material) => getCommonName(material).trim())
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

  const botanicalCandidates = [
    ...new Set(
      activeGroup.materials
        .map((material) => getBotanicalName(material).trim())
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

  const hasCommonConflict = commonNameCandidates.length > 1;
  const hasBotanicalConflict = botanicalCandidates.length > 1;

  return {
    hasMismatch: hasCommonConflict || hasBotanicalConflict,
    hasCommonConflict,
    hasBotanicalConflict,
    commonNameCandidates,
    botanicalCandidates,
    possibleMatches: activeGroup.materials
      .map((material) => ({
        id: material.id,
        itemName: (material.materialName ?? "").trim(),
        commonName: getCommonName(material).trim(),
        botanicalName: getBotanicalName(material).trim(),
        purchaseUnit: (material.purchaseUnit ?? "").trim(),
      }))
      .sort((a, b) => {
        const nameA = (a.itemName || a.commonName || "").toLowerCase();
        const nameB = (b.itemName || b.commonName || "").toLowerCase();
        if (nameA !== nameB) return nameA.localeCompare(nameB);

        const botanicalA = (a.botanicalName || "").toLowerCase();
        const botanicalB = (b.botanicalName || "").toLowerCase();
        if (botanicalA !== botanicalB) {
          return botanicalA.localeCompare(botanicalB);
        }

        return a.id - b.id;
      }),
    suggestedCommonName: pickMostFrequent(
      activeGroup.materials.map((material) => getCommonName(material)),
    ),
    suggestedBotanicalName: pickMostFrequent(
      activeGroup.materials.map((material) => getBotanicalName(material)),
    ),
  };
};
