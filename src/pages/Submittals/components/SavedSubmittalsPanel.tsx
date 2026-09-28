import { useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  ModalDialog,
  Typography,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  CircularProgress,
  Input,
  Divider,
} from "@mui/joy";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Save from "@mui/icons-material/Save";
import {
  deleteSavedSubmittal,
  listSavedSubmittals,
  type SavedSubmittalListItem,
} from "../api/savedSubmittals.api";

type SavedSubmittalsPanelProps = {
  savedId: string | null;
  defaultName: string;
  isSaving: boolean;
  openLibraryRequest?: number;
  onSave: (name: string) => Promise<void>;
  onLoad: (id: string) => Promise<void>;
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

export const SavedSubmittalsPanel = ({
  savedId,
  defaultName,
  isSaving,
  openLibraryRequest = 0,
  onSave,
  onLoad,
}: SavedSubmittalsPanelProps) => {
  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [items, setItems] = useState<SavedSubmittalListItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (saveOpen) setName(defaultName);
  }, [saveOpen, defaultName]);

  const refreshList = async () => {
    setLoadingList(true);
    setError(null);
    try {
      setItems(await listSavedSubmittals());
    } catch (err: any) {
      setError(err?.message || "Failed to load saved submittals");
    } finally {
      setLoadingList(false);
    }
  };

  const handleOpenLibrary = async () => {
    setOpen(true);
    await refreshList();
  };

  useEffect(() => {
    if (!openLibraryRequest) return;
    void handleOpenLibrary();
    // The counter is the only trigger; handleOpenLibrary is recreated each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openLibraryRequest]);

  const handleLoad = async (id: string) => {
    setLoadingId(id);
    setError(null);
    try {
      await onLoad(id);
      setOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to open submittal");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this saved submittal?")) return;
    setError(null);
    try {
      await deleteSavedSubmittal(id);
      await refreshList();
    } catch (err: any) {
      setError(err?.message || "Failed to delete submittal");
    }
  };

  const handleSaveClick = async () => {
    if (savedId) {
      await onSave(defaultName || "Untitled submittal");
      return;
    }
    setSaveOpen(true);
  };

  const handleConfirmSave = async () => {
    const trimmed = name.trim() || "Untitled submittal";
    await onSave(trimmed);
    setSaveOpen(false);
  };

  return (
    <>
      <Button
        variant="solid"
        color="neutral"
        startDecorator={<Save />}
        loading={isSaving}
        onClick={handleSaveClick}
        sx={{ flex: 1 }}
      >
        {savedId ? "Update" : "Save"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog sx={{ width: 520, maxWidth: "95vw" }}>
          <DialogTitle>Saved submittals</DialogTitle>
          <DialogContent>
            {error && (
              <Typography level="body-sm" color="danger" sx={{ mb: 1 }}>
                {error}
              </Typography>
            )}
            {loadingList ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size="sm" />
              </Box>
            ) : items.length === 0 ? (
              <Typography level="body-sm" sx={{ opacity: 0.7, py: 2 }}>
                No saved submittals yet.
              </Typography>
            ) : (
              <List sx={{ "--List-gap": "4px" }}>
                {items.map((item) => (
                  <ListItem
                    key={item.id}
                    endAction={
                      <IconButton
                        size="sm"
                        variant="plain"
                        color="danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      onClick={() => handleLoad(item.id)}
                      disabled={loadingId === item.id}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography level="title-sm" noWrap>
                          {item.name}
                          {item.id === savedId ? " (current)" : ""}
                        </Typography>
                        <Typography level="body-xs" sx={{ opacity: 0.7 }}>
                          {item.materialCount} materials ·{" "}
                          {formatDate(item.updatedAt)}
                        </Typography>
                      </Box>
                      {loadingId === item.id && (
                        <CircularProgress size="sm" sx={{ ml: 1 }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      <Modal open={saveOpen} onClose={() => setSaveOpen(false)}>
        <ModalDialog sx={{ width: 420, maxWidth: "95vw" }}>
          <DialogTitle>Save submittal</DialogTitle>
          <DialogContent>
            <Typography level="body-sm" sx={{ mb: 1.5, opacity: 0.8 }}>
              Give this draft a name so you can find it later.
            </Typography>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Submittal name"
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleConfirmSave();
              }}
            />
            <Divider sx={{ my: 1.5 }} />
            <Typography level="body-xs" sx={{ opacity: 0.65 }}>
              Saves the title, cover image, and selected materials.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setSaveOpen(false)}
            >
              Cancel
            </Button>
            <Button loading={isSaving} onClick={() => void handleConfirmSave()}>
              Save
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
};
