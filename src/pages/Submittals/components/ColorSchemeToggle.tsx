import { IconButton } from "@mui/joy";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import { useColorScheme } from "@mui/joy/styles";

export function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton
      variant="soft"
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
    >
      {mode === "light" ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
}
