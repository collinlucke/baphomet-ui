import { memo } from "react";
import { Box, Checkbox, CircularProgress, IconButton, Sheet, Typography } from "@mui/joy";
import EditOutlined from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import type { GroupedMaterial } from "./materialGrouping";

type CategoryGroupRowProps = {
  group: GroupedMaterial;
  openingThisGroup: boolean;
  onOpen: () => void;
  onToggleSelection: () => void;
};

export const CategoryGroupRow = memo(function CategoryGroupRow({
  group,
  openingThisGroup,
  onOpen,
  onToggleSelection,
}: CategoryGroupRowProps) {
  const allSelected = group.materials.every((m) => m.selected);
  const someSelected = group.materials.some((m) => m.selected);

  return (
    <Sheet
      sx={{
        display: "flex",
        alignItems: "center",
        height: 40,
        px: 1,
        ml: 1,
        mb: 0.5,
        gap: 0.75,
        cursor: openingThisGroup ? "wait" : "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        bgcolor: "#fff",
        opacity: openingThisGroup ? 0.75 : 1,
        pointerEvents: openingThisGroup ? "none" : "auto",
        "&:hover": { bgcolor: "#f3f3f3" },
      }}
      onClick={() => {
        if (openingThisGroup) return;
        onOpen();
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
      >
        <Checkbox
          size="sm"
          checked={allSelected}
          indeterminate={!allSelected && someSelected}
          onChange={onToggleSelection}
          disabled={openingThisGroup}
          sx={{ "--Checkbox-size": "18px" }}
        />
      </Box>
      <Typography
        level="body-sm"
        sx={{
          flex: 1,
          minWidth: 0,
          lineHeight: 1.2,
          color: "#1a1a1a",
          "&&": { color: "#1a1a1a" },
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {group.commonName}
      </Typography>
      <IconButton
        size="sm"
        variant="plain"
        disabled={openingThisGroup}
        onClick={(e) => {
          e.stopPropagation();
          if (openingThisGroup) return;
          onOpen();
        }}
        sx={{
          "--IconButton-size": "32px",
          flexShrink: 0,
          alignSelf: "center",
          color: "#444",
          "&:hover": { color: "primary.500" },
        }}
        title="Edit grouped material"
      >
        {openingThisGroup ? (
          <CircularProgress size="sm" />
        ) : (
          <EditOutlined sx={{ fontSize: 18 }} />
        )}
      </IconButton>
      <Box
        sx={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ImageIcon
          sx={{
            fontSize: 18,
            display: "block",
            color: group.hasImage ? "success.500" : "#9a9a9a",
          }}
          titleAccess={group.hasImage ? "Has image" : "No image"}
        />
      </Box>
    </Sheet>
  );
});
