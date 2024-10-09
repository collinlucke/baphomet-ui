/** @jsxImportSource @emotion/react */
import {
  Form,
  FormTextInput,
  TwoColumn,
  FormInputLabel,
  FormTextArea,
  Button
} from '@collinlucke/phantomartist';
import { useNavigate } from 'react-router-dom';

type MovieEditorFormProps = {
  movie: {
    id: string;
    poster?: string;
    releaseDate?: string;
    rated?: string;
    title?: string;
    fullplot?: string;
  };
  clean?: boolean;
  readonly?: boolean;

  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeTextArea?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const MovieEditorForm: React.FC<MovieEditorFormProps> = ({
  onSubmit,
  onChange,
  onChangeTextArea,
  movie,
  readonly
}) => {
  const navigate = useNavigate();
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    onSubmit?.(e);
  };

  const onChangeHandlerText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  const onChangeHandlerTextArea = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChangeTextArea?.(e);
  };

  const cancelHandler = () => {
    navigate(`/view/${movie.id}`);
  };

  const navToEdit = () => {
    navigate(`/edit/${movie.id}`);
  };

  const leftContent = (
    <>
      {!readonly && (
        <FormTextInput
          readonly={readonly}
          label="Title"
          labelPos="above"
          name="title"
          value={movie.title}
          onChange={onChangeHandlerText}
        />
      )}
      <FormInputLabel label="Poster" position="above" name="poster" />
      {movie.poster && <img src={movie.poster} css={[baphStyles.img]} />}
      <FormTextArea
        readonly={readonly}
        name="poster"
        value={movie.poster}
        onChange={onChangeHandlerTextArea}
        autoResize
      />
    </>
  );

  const rightContent = (
    <>
      <FormTextArea
        readonly={readonly}
        label="Plot"
        labelPos="above"
        name="fullplot"
        value={movie.fullplot}
        onChange={onChangeHandlerTextArea}
        autoResize
      />
      <FormTextInput
        readonly={readonly}
        label="Rated"
        labelPos="above"
        name="rated"
        value={movie.rated}
        onChange={onChangeHandlerText}
      />
      {/* Need to figure out how to edit dates */}
      <FormTextInput
        type="date"
        readonly={readonly}
        label="Release Date"
        labelPos="above"
        name="releaseDate"
        value={movie.releaseDate}
        onChange={onChangeHandlerText}
      />
      {!readonly && (
        <>
          <Button type="submit" kind="primary">
            Save
          </Button>
          <Button onClick={cancelHandler} kind="secondary">
            Cancel
          </Button>
        </>
      )}
    </>
  );

  return (
    <Form onSubmit={onSubmitHandler}>
      <>
        <h1 css={[baphStyles.h1]}>{movie.title || '-Add title-'}</h1>
        {readonly && <Button onClick={navToEdit}>Edit Movie</Button>}
      </>
      <TwoColumn left={leftContent} right={rightContent} />
    </Form>
  );
};

// TODO: Create Image Component
const baphStyles = {
  h1: {
    maxWidth: '80%',
    justifySelf: 'start'
  },
  img: {
    marginBottom: '10px'
  }
};
