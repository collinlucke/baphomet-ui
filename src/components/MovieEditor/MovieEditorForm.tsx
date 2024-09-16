import {
  Header,
  Form,
  FormTextInput,
  TwoColumn
} from '@collinlucke/phantomartist';
import { useRef } from 'react';

type MovieEditorFormProps = {
  movie: {
    id: string;
    poster?: string;
    year?: number;
    rated?: string;
    title?: string;
  };

  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const MovieEditorForm: React.FC<MovieEditorFormProps> = ({
  onSubmit,
  onChange,
  movie
}) => {
  let origTitleRef;

  if (movie.title) {
    origTitleRef = useRef(movie.title);
  }
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    onSubmit?.(e);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  const leftContent = (
    <>
      <FormTextInput
        label="Title"
        labelPos="above"
        name="title"
        value={movie.title}
        onChange={onChangeHandler}
      />
    </>
  );

  return (
    <Form onSubmit={onSubmitHandler}>
      <Header>
        <h1>{movie.title || '<Add title>'}</h1>
      </Header>
      <TwoColumn left={leftContent} right={<div>NOTHING HERE YET</div>} />
    </Form>
  );
};
