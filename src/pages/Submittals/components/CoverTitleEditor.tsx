import { useEffect, useRef } from "react";
import { Typography, Box } from "@mui/joy";

type Opportunity = {
  id: number;
  name: string;
  propertyName: string;
};

type CoverTitleEditorProps = {
  value: string;
  onChange: (title: string) => void;
  opportunity?: Opportunity | null;
};

export const CoverTitleEditor = ({
  value,
  onChange,
  opportunity,
}: CoverTitleEditorProps) => {
  const lastOpportunityIdRef = useRef<number | null>(null);
  const hasBeenManuallyClearedRef = useRef<boolean>(false);

  // Auto-populate title when opportunity is selected (but not when manually cleared)
  useEffect(() => {
    if (opportunity) {
      // Only auto-fill if this is a new opportunity or if the field was never manually cleared
      const isNewOpportunity = opportunity.id !== lastOpportunityIdRef.current;
      const shouldAutoFill =
        isNewOpportunity && (!value || value.trim() === "");

      if (shouldAutoFill) {
        onChange(opportunity.name);
        hasBeenManuallyClearedRef.current = false;
      }

      lastOpportunityIdRef.current = opportunity.id;
    } else {
      // Reset when opportunity is deselected
      lastOpportunityIdRef.current = null;
      hasBeenManuallyClearedRef.current = false;
    }
  }, [opportunity, value, onChange]);

  return (
    <Box sx={{ mb: 2 }}>
      {opportunity && (
        <Typography level="body-sm" sx={{ mt: 0.5, opacity: 0.7 }}>
          Auto-populated from: {opportunity.name}
        </Typography>
      )}
    </Box>
  );
};
