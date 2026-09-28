import { useState } from "react";
import { Input, List, ListItem, CircularProgress, Sheet } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../../hooks/useDebounce";

type Opportunity = {
  id: number;
  name: string;
  propertyName: string;
};

type OpportunitySelectorProps = {
  value: Opportunity | null;
  onSelect: (opp: Opportunity | null) => void;
};

export const OpportunitySelector = ({
  value,
  onSelect,
}: OpportunitySelectorProps) => {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["opportunities", debounced],
    queryFn: async () => {
      if (!debounced) return [];
      const res = await fetch(
        `/api/submittals/opportunities?search=${debounced}`,
      );

      try {
        const result = await res.json();

        return result;
      } catch (jsonError) {
        console.error("❌ JSON parsing failed:", jsonError);
        await res.text();

        return [];
      }
    },
    enabled: debounced.length > 1,
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (value) onSelect(null);
    setSearch(e.target.value);
  };

  const showDropdown = debounced.length > 1 && !value;

  return (
    <Sheet sx={{ position: "relative", mb: 2 }}>
      <Input
        placeholder="Search opportunities..."
        value={value ? value.name : search}
        onChange={onChangeHandler}
        endDecorator={isLoading && <CircularProgress size="sm" />}
      />

      {showDropdown && data?.length > 0 && (
        <Sheet
          variant="outlined"
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            mt: 0.5,
            borderRadius: "md",
            bgcolor: "background.surface",
          }}
        >
          <List>
            {data.map((opp: Opportunity) => (
              <ListItem
                key={opp.id}
                onClick={() => {
                  onSelect(opp);
                  setSearch("");
                }}
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "neutral.softBg" },
                }}
              >
                {opp.name} — #{opp.id} — {opp.propertyName}
              </ListItem>
            ))}
          </List>
        </Sheet>
      )}
    </Sheet>
  );
};
