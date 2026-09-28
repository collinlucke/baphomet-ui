import { useState } from 'react';
import {
  Input,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Box,
  CircularProgress
} from '@mui/joy';
import Search from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../../../../hooks/useDebounce';
import { apiFetch } from '../../api/apiClient';

type SearchResult = {
  id: number;
  categoryId?: number;
  categoryName?: string;
  itemName: string;
  alternateName?: string;
};

type GlobalMaterialSearchProps = {
  onSelect: (
    category: { id: number; categoryName: string },
    materialId: number
  ) => void;
};

export const GlobalMaterialSearch = ({
  onSelect
}: GlobalMaterialSearchProps) => {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 300);
  const { data: results = [], isFetching } = useQuery({
    queryKey: ['submittals', 'material-search', debounced],
    enabled: debounced.trim().length >= 2,
    queryFn: async () => {
      const res = await apiFetch(
        `/api/submittals/materials/search?q=${encodeURIComponent(debounced)}`
      );
      if (!res.ok) return [];
      return (await res.json()) as SearchResult[];
    }
  });

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <Input
        size="sm"
        placeholder="Search catalog..."
        startDecorator={<Search fontSize="small" />}
        endDecorator={isFetching ? <CircularProgress size="sm" /> : null}
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 100,
            bgcolor: 'background.surface',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 'sm',
            boxShadow: 'md',
            maxHeight: 280,
            overflowY: 'auto',
            color: '#1a1a1a',
            '& .MuiTypography-root': { color: '#1a1a1a' },
            '& .MuiListItemButton-root': { color: '#1a1a1a' }
          }}
        >
          <List size="sm" sx={{ '--List-padding': '4px' }}>
            {results.map(material => (
              <ListItem key={material.id}>
                <ListItemButton
                  disabled={!material.categoryId}
                  onClick={() => {
                    if (!material.categoryId) return;
                    onSelect(
                      {
                        id: material.categoryId,
                        categoryName: material.categoryName || 'Uncategorized'
                      },
                      material.id
                    );
                    setQuery('');
                  }}
                >
                  <Box>
                    <Typography
                      level="body-sm"
                      fontWeight="md"
                      sx={{ '&&': { color: '#1a1a1a' } }}
                    >
                      {material.itemName}
                    </Typography>
                    {material.alternateName ? (
                      <Typography
                        level="body-xs"
                        sx={{
                          '&&': { color: '#333' },
                          fontStyle: 'italic'
                        }}
                      >
                        {material.alternateName}
                      </Typography>
                    ) : null}
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};
