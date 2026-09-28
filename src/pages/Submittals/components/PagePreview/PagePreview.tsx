import { Box } from "@mui/joy";

type PagePreviewProps = {
  children: React.ReactNode;
};

export const PagePreview = ({ children }: PagePreviewProps) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          aspectRatio: "500 / 647",
          border: "1px solid",
          borderColor: "neutral.300",
          overflow: "hidden",
          bgcolor: "background.surface",
          position: "relative",
          boxShadow: "sm",
        }}
      >
        <Box
          sx={{
            width: "816px",
            height: "1056px",
            transform: "scale(0.6127)",
            transformOrigin: "top left",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
