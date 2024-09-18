import {
  Header,
  Form,
  FormTextInput,
  TwoColumn,
  FormInputLabel,
  FormTextArea,
  Button
} from '@collinlucke/phantomartist';
import * as stylex from '@stylexjs/stylex';

type MovieEditorFormProps = {
  movie: {
    id: string;
    poster?: string;
    year?: number;
    rated?: string;
    title?: string;
    fullplot?: string;
  };
  clean?: boolean;

  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeTextArea?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const MovieEditorForm: React.FC<MovieEditorFormProps> = ({
  onSubmit,
  onChange,
  onChangeTextArea,
  movie
}) => {
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

  const leftContent = (
    <>
      <FormTextInput
        label="Title"
        labelPos="above"
        name="title"
        value={movie.title}
        onChange={onChangeHandlerText}
      />
      <FormInputLabel label="Poster" position="above" name="poster" />
      {movie.poster && (
        <img src={movie.poster} {...stylex.props(baphStyles.img)} />
      )}
      <FormTextInput
        name="poster"
        value={movie.poster}
        onChange={onChangeHandlerText}
      />
    </>
  );

  const rightContent = (
    <>
      <FormTextArea
        label="Plot"
        labelPos="above"
        name="fullplot"
        value={movie.fullplot}
        onChange={onChangeHandlerTextArea}
      />
      <FormTextInput
        label="Rated"
        labelPos="above"
        name="rated"
        value={movie.rated}
        onChange={onChangeHandlerText}
      />
      <FormTextInput
        label="Year"
        labelPos="above"
        name="year"
        value={movie.year}
        onChange={onChangeHandlerText}
      />
      <Button type="submit">Save</Button>
    </>
  );

  return (
    <Form onSubmit={onSubmitHandler}>
      <Header>
        <h1>{movie.title || '-Add title-'}</h1>
      </Header>
      <TwoColumn left={leftContent} right={rightContent} />
    </Form>
  );
};

// TODO: Create Image Component
const baphStyles = stylex.create({
  img: {
    marginBottom: '10px'
  }
});
