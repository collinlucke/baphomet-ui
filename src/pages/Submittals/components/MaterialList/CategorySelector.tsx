import { useState } from 'react';
import {
  Input,
  List,
  ListItem,
  CircularProgress,
  Sheet,
  Button
} from '@mui/joy';
import Add from '@mui/icons-material/Add';
import { useDebounce } from '../../../../hooks/useDebounce';

type Category = {
  id: number;
  categoryName: string;
};

type CategorySelectorProps = {
  availableCategories: Category[];
  onSelect: (category: Category) => void;
  onCreate?: (categoryName: string) => Promise<Category>;
  isLoading?: boolean;
  disabled?: boolean;
};

export const CategorySelector = ({
  availableCategories,
  onSelect,
  onCreate,
  isLoading = false,
  disabled = false
}: CategorySelectorProps) => {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 300);
  const [isOpen, setIsOpen] = useState(false);

  const filteredCategories = availableCategories.filter(cat =>
    cat.categoryName.toLowerCase().includes(debounced.toLowerCase())
  );

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelect = (category: Category) => {
    onSelect(category);
    setSearch('');
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    if (disabled || isLoading) return;
    setIsOpen(!isOpen);
  };

  const exactMatch = availableCategories.some(
    cat => cat.categoryName.toLowerCase() === debounced.trim().toLowerCase()
  );
  const showDropdown =
    isOpen &&
    (search.length > 0
      ? filteredCategories.length > 0 || (!exactMatch && Boolean(onCreate))
      : availableCategories.length > 0);
  const categoriesToShow =
    search.length > 0 ? filteredCategories : availableCategories;

  return (
    <Sheet sx={{ position: 'relative', mb: 0, width: '100%' }}>
      {!isOpen ? (
        <Button
          variant="outlined"
          startDecorator={disabled || isLoading ? undefined : <Add />}
          loading={disabled || isLoading}
          disabled={disabled || isLoading}
          onClick={handleButtonClick}
          sx={{
            width: '100%',
            justifyContent: 'flex-start',
            borderRadius: 'md'
          }}
        >
          {isLoading
            ? 'Loading categories…'
            : disabled
              ? 'Loading category…'
              : 'Add Category'}
        </Button>
      ) : (
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={onChangeHandler}
          disabled={disabled}
          endDecorator={
            (isLoading || disabled) && <CircularProgress size="sm" />
          }
          onBlur={() => {
            // Delay closing to allow click events on list items
            setTimeout(() => setIsOpen(false), 150);
          }}
          autoFocus
        />
      )}

      {showDropdown && (
        <Sheet
          variant="outlined"
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 10,
            mt: 0.5,
            borderRadius: 'md',
            bgcolor: 'background.surface',
            maxHeight: 200,
            overflow: 'auto',
            color: 'red'
          }}
        >
          <List>
            {categoriesToShow.map(category => (
              <ListItem
                key={category.id}
                onClick={() => handleSelect(category)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'neutral.softBg' }
                }}
              >
                {category.categoryName}
              </ListItem>
            ))}
            {onCreate && debounced.trim() && !exactMatch && (
              <ListItem
                onMouseDown={async event => {
                  event.preventDefault();
                  const created = await onCreate(debounced.trim());
                  handleSelect(created);
                }}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'neutral.softBg'
                  }
                }}
              >
                Create &quot;{debounced.trim()}&quot;
              </ListItem>
            )}
          </List>
        </Sheet>
      )}
    </Sheet>
  );
};
