import { Box, IconButton, Typography } from "@mui/joy";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";

type PagePreviewNavigationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const arrowSx = (canTurn: boolean) => ({
  bgcolor: canTurn ? "#f5f5f5" : "#2a2a2a",
  color: canTurn ? "#1a1a1a" : "#4a4a4a",
  border: "1px solid",
  borderColor: canTurn ? "#f5f5f5" : "#2a2a2a",
  "&:hover": {
    bgcolor: canTurn ? "#ffffff" : "#2a2a2a",
  },
  "&.Mui-disabled": {
    bgcolor: "#2a2a2a",
    color: "#4a4a4a",
    borderColor: "#2a2a2a",
    opacity: 1,
  },
});

export const PagePreviewNavigation = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: PagePreviewNavigationProps) => {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        mt: 1,
      }}
    >
      <IconButton
        size="sm"
        variant="plain"
        onClick={onPrev}
        disabled={!canGoBack}
        sx={arrowSx(canGoBack)}
      >
        <ChevronLeft />
      </IconButton>

      <Typography level="body-sm" sx={{ color: "#f5f5f5" }}>
        {currentPage} / {totalPages}
      </Typography>

      <IconButton
        size="sm"
        variant="plain"
        onClick={onNext}
        disabled={!canGoForward}
        sx={arrowSx(canGoForward)}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};
