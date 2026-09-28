import { Box, IconButton, Typography } from "@mui/joy";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";

type PagePreviewNavigationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export const PagePreviewNavigation = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: PagePreviewNavigationProps) => {
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
        variant="outlined"
        onClick={onPrev}
        disabled={currentPage <= 1}
      >
        <ChevronLeft />
      </IconButton>

      <Typography level="body-sm">
        {currentPage} / {totalPages}
      </Typography>

      <IconButton
        size="sm"
        variant="outlined"
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};
