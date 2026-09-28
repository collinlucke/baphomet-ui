import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { formatCost } from "../../../../utils/formatCost";

type IndividualVariantModalProps = {
  open: boolean;
  commonName: string;
  botanicalName: string;
  purchaseUnit: string;
  purchaseUnitCost: string;
  allocation: string;
  allocationUnit: string;
  saving: boolean;
  unitTypeOptions: { id: number; name: string }[];
  loadingUnits?: boolean;
  onClose: () => void;
  onCommonNameChange: (value: string) => void;
  onBotanicalNameChange: (value: string) => void;
  onPurchaseUnitCostChange: (value: string) => void;
  onAllocationChange: (value: string) => void;
  onAllocationUnitChange: (value: string) => void;
  onAddSize?: () => void;
  onSave: () => void;
  canSave?: boolean;
};

export const IndividualVariantModal = ({
  open,
  commonName,
  botanicalName,
  purchaseUnit,
  purchaseUnitCost,
  allocation,
  allocationUnit,
  saving,
  unitTypeOptions,
  loadingUnits = false,
  onClose,
  onCommonNameChange,
  onBotanicalNameChange,
  onPurchaseUnitCostChange,
  onAllocationChange,
  onAllocationUnitChange,
  onAddSize,
  onSave,
  canSave = true,
}: IndividualVariantModalProps) => {
  const normalizedPurchaseUnit = purchaseUnit.trim().toLowerCase();
  const normalizedAllocationUnit = allocationUnit.trim().toLowerCase();
  const allocationLocked =
    normalizedPurchaseUnit.length > 0 &&
    normalizedPurchaseUnit === normalizedAllocationUnit;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: { xs: "calc(100vw - 2rem)", sm: "min(920px, 94vw)" },
          maxWidth: 920,
        }}
      >
        <ModalClose />
        <Typography level="title-md">Edit Item</Typography>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Stack spacing={2} sx={{ gridColumn: { xs: "1", md: "1" } }}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={commonName}
                  onChange={(e) => onCommonNameChange(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Alternate Name</FormLabel>
                <Input
                  value={botanicalName}
                  onChange={(e) => onBotanicalNameChange(e.target.value)}
                  placeholder="Optional alternate name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input value="Current Category" readOnly />
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
              <Box
                sx={{
                  p: 3,
                  flex: 1,
                  textAlign: "center",
                  border: "2px dashed",
                  borderColor: "neutral.300",
                  borderRadius: "md",
                  bgcolor: "background.level1",
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography level="body-sm" sx={{ color: "neutral.500" }}>
                  Use grouped editor image upload to update visuals
                </Typography>
              </Box>
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
                <Input value={purchaseUnit || "No size information"} readOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Purchase Unit Cost</FormLabel>
                <Input
                  type="number"
                  value={purchaseUnitCost}
                  onChange={(e) => onPurchaseUnitCostChange(e.target.value)}
                  onBlur={() =>
                    onPurchaseUnitCostChange(formatCost(purchaseUnitCost))
                  }
                  slotProps={{ input: { min: 0, step: "0.01" } }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Allocation</FormLabel>
                <Input
                  type="number"
                  value={allocation}
                  onChange={(e) => onAllocationChange(e.target.value)}
                  disabled={allocationLocked}
                  slotProps={{ input: { min: 0.0001, step: "0.0001" } }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Allocation Unit</FormLabel>
                <Select
                  value={allocationUnit || null}
                  onChange={(_, value) => onAllocationUnitChange(value ?? "")}
                  disabled={loadingUnits}
                  placeholder={
                    loadingUnits
                      ? "Loading unit types..."
                      : "Select allocation unit"
                  }
                >
                  {unitTypeOptions.map((unit) => (
                    <Option key={`variant-alloc-${unit.id}`} value={unit.name}>
                      {unit.name}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}
          >
            {onAddSize && (
              <Button variant="outlined" color="primary" onClick={onAddSize}>
                Add Size
              </Button>
            )}
            <Button variant="plain" color="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={saving} disabled={!canSave} onClick={onSave}>
              Save Variant
            </Button>
          </Box>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};
