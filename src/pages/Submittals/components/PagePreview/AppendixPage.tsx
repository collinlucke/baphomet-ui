import { Box, Typography } from "@mui/joy";

type AppendixPageProps = {
  imageUrl: string;
};

export const AppendixPage = ({ imageUrl }: AppendixPageProps) => {
  return (
    <Box
      sx={{
        width: 816,
        height: 1056,
        bgcolor: "#fff",
        color: "#1a1a1a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Typography
        level="h2"
        sx={{
          position: "absolute",
          top: 36,
          left: 48,
          color: "#136739",
          "&&": { color: "#136739" },
          fontSize: 36,
          fontWeight: 700,
        }}
      >
        Appendix
      </Typography>
      <Typography
        level="body-lg"
        sx={{
          position: "absolute",
          top: 86,
          left: 48,
          color: "#333",
          "&&": { color: "#333" },
          fontSize: 20,
        }}
      >
        Plant Schedule
      </Typography>
      <Box
        sx={{
          position: "absolute",
          top: 130,
          left: 48,
          right: 48,
          bottom: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt="Plant schedule"
          sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </Box>
    </Box>
  );
};
