import { useLayoutEffect, useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/joy';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import { uploadCoverImage } from '../../api/savedSubmittals.api';

type RichTextDescriptionProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export const RichTextDescription = ({
  value,
  onChange,
  placeholder = 'Description shown under the name on the submittal'
}: RichTextDescriptionProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const lastEmitted = useRef(value || '');
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  onChangeRef.current = onChange;

  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    // Assigning innerHTML moves the caret to the start, so never do it
    // while the user is typing.
    if (document.activeElement === editor) return;
    const next = value || '';
    if (editor.innerHTML === next) {
      lastEmitted.current = next;
      return;
    }
    editor.innerHTML = next;
    lastEmitted.current = next;
  }, [value]);

  const publish = () => {
    const html = editorRef.current?.innerHTML ?? '';
    lastEmitted.current = html;
    onChangeRef.current(html);
  };

  const format = (command: 'bold' | 'italic' | 'underline') => {
    editorRef.current?.focus();
    document.execCommand(command);
    publish();
  };

  const insertImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadCoverImage(file);
      const editor = editorRef.current;
      if (!editor) return;
      const image = document.createElement('img');
      image.src = uploaded.url;
      image.alt = '';
      editor.appendChild(image);
      publish();
    } catch (error) {
      console.error('Failed to upload description image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
        <IconButton
          size="sm"
          variant="outlined"
          aria-label="Bold"
          onMouseDown={event => event.preventDefault()}
          onClick={() => format('bold')}
        >
          <FormatBold />
        </IconButton>
        <IconButton
          size="sm"
          variant="outlined"
          aria-label="Italic"
          onMouseDown={event => event.preventDefault()}
          onClick={() => format('italic')}
        >
          <FormatItalic />
        </IconButton>
        <IconButton
          size="sm"
          variant="outlined"
          aria-label="Underline"
          onMouseDown={event => event.preventDefault()}
          onClick={() => format('underline')}
        >
          <FormatUnderlined />
        </IconButton>
        <IconButton
          size="sm"
          variant="outlined"
          aria-label="Insert image"
          loading={uploading}
          onMouseDown={event => event.preventDefault()}
          onClick={() => fileRef.current?.click()}
        >
          <ImageOutlined />
        </IconButton>
      </Box>
      <Box
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Description"
        data-placeholder={placeholder}
        onInput={publish}
        onBlur={publish}
        sx={{
          minHeight: 120,
          p: 1,
          border: '1px solid',
          borderColor: 'neutral.outlinedBorder',
          borderRadius: 'sm',
          bgcolor: 'background.surface',
          color: '#1a1a1a',
          fontSize: '14px',
          lineHeight: 1.4,
          outline: 'none',
          '&:focus': { borderColor: 'primary.500' },
          '&:empty:before': {
            content: 'attr(data-placeholder)',
            color: 'neutral.500'
          },
          '& img': {
            display: 'block',
            maxWidth: '100%',
            maxHeight: 180,
            objectFit: 'contain',
            mt: 0.5
          }
        }}
      />
      <Typography level="body-xs" sx={{ color: 'neutral.500', mt: 0.5 }}>
        This appears on the submittal under the name and alternate name.
      </Typography>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={event => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) void insertImage(file);
        }}
      />
    </Box>
  );
};
