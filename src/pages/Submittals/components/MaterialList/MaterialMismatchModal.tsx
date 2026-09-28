import {
  Box,
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import type { ActiveGroupMismatch } from "./materialGrouping";

type MaterialMismatchModalProps = {
  open: boolean;
  mismatch: ActiveGroupMismatch | null;
  onClose: () => void;
  onUseSuggested: (commonName: string, botanicalName: string) => void;
  onEditMaterial: (materialId: number) => void;
};

export const MaterialMismatchModal = ({
  open,
  mismatch,
  onClose,
  onUseSuggested,
  onEditMaterial,
}: MaterialMismatchModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ minWidth: 420 }}>
        <ModalClose />
        <Typography level="title-md">Potential Duplicate Variants</Typography>
        <Typography level="body-sm" sx={{ mt: 0.75 }}>
          This group has inconsistent naming across variants. You can normalize
          names and alternate names now so one image and one name set applies
          cleanly to all variants.
        </Typography>

        {mismatch?.hasCommonConflict && (
          <Box sx={{ mt: 1 }}>
            <Typography level="body-xs" fontWeight="lg">
              Names found:
            </Typography>
            <Typography level="body-xs" color="neutral">
              {mismatch.commonNameCandidates.join(" | ")}
            </Typography>
          </Box>
        )}

        {mismatch?.hasBotanicalConflict && (
          <Box sx={{ mt: 1 }}>
            <Typography level="body-xs" fontWeight="lg">
              Alternate names found:
            </Typography>
            <Typography level="body-xs" color="neutral">
              {mismatch.botanicalCandidates.join(" | ")}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 1.25 }}>
          <Typography level="body-xs" fontWeight="lg">
            Possible matches in this group:
          </Typography>
          <Stack
            spacing={0.75}
            sx={{
              mt: 0.75,
              maxHeight: 180,
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {mismatch?.possibleMatches.map((match) => (
              <Sheet
                key={`mismatch-match-${match.id}`}
                variant="soft"
                sx={{
                  px: 1,
                  py: 0.75,
                  borderRadius: "sm",
                  border: "1px solid",
                  borderColor: "neutral.outlinedBorder",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography level="body-xs" fontWeight="lg">
                      {match.itemName || "(Unnamed item)"}
                    </Typography>
                    <Typography
                      level="body-xs"
                      color="neutral"
                      sx={{ mt: 0.25, wordBreak: "break-word" }}
                    >
                      ID: {match.id}
                      {match.purchaseUnit
                        ? ` | Size: ${match.purchaseUnit}`
                        : ""}
                      {match.botanicalName
                        ? ` | Alternate: ${match.botanicalName}`
                        : ""}
                    </Typography>
                  </Box>
                  <Button
                    size="sm"
                    variant="outlined"
                    onClick={() => onEditMaterial(match.id)}
                  >
                    Edit
                  </Button>
                </Box>
              </Sheet>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
        >
          <Button variant="plain" color="neutral" onClick={onClose}>
            Review Manually
          </Button>
          <Button
            onClick={() =>
              onUseSuggested(
                mismatch?.suggestedCommonName ?? "",
                mismatch?.suggestedBotanicalName ?? "",
              )
            }
          >
            Use Suggested Values
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};
