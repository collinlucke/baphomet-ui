import { Button } from "@mui/joy";
import Download from "@mui/icons-material/Download";

type GenerateSubmittalButtonProps = {
  onClick: () => void;
  isLoading?: boolean;
};

export const GenerateSubmittalButton = ({
  onClick,
  isLoading = false,
}: GenerateSubmittalButtonProps) => {
  return (
    <Button
      onClick={onClick}
      loading={isLoading}
      startDecorator={<Download />}
      color="primary"
      size="md"
      sx={{ width: "100%" }}
    >
      Download PDF
    </Button>
  );
};
