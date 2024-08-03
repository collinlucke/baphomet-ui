import {
  Form
  // FormInputLabel,
  // FormTextInput
} from '@crazy-overlord/phantomartist';

type MovieEditorFormProps = {
  movieData: {
    getMovie: {
      id: string;
      poster?: string;
      year?: number;
      rated?: string;
      title?: string;
    };
  };
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const MovieEditorForm: React.FC<MovieEditorFormProps> = ({
  onSubmit,
  movieData
}) => {
  console.log(movieData);
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    onSubmit?.(e);
  };

  return <Form onSubmit={onSubmitHandler}></Form>;
};
