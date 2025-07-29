import {
  InputField,
  TwoColumn,
  Button,
  Header,
  Image,
  ButtonGroup
} from '@collinlucke/phantomartist';
import { useNavigate } from 'react-router-dom';
import { isAuthenticatedVar } from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client';

type MovieEditorFormProps = {
  movie: {
    id: string;
    poster?: string;
    releaseDate?: string;
    rated?: string;
    title?: string;
    fullplot?: string;
  };
  readonly?: boolean;

  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onChangeTextArea?: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
};

export const MovieEditorForm: React.FC<MovieEditorFormProps> = ({
  movie,
  readonly,
  onSubmit,
  onChange,
  onChangeTextArea
}) => {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const navigate = useNavigate();
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    onSubmit?.(e);
  };

  const onChangeHandlerText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange?.(e);
  };

  const onChangeHandlerTextArea = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChangeTextArea?.(e);
  };

  const cancelHandler = () => {
    if (movie.id) {
      navigate(`/view/${movie.id}`);
    } else {
      navigate('/movielist');
    }
  };

  const navToEdit = () => {
    navigate(`/edit/${movie.id}`);
  };

  const leftContent = (
    <>
      {!readonly && (
        <InputField
          readonly={readonly}
          label="Title"
          labelPosition="above"
          name="title"
          value={movie.title || ''}
          onChange={onChangeHandlerText}
        />
      )}
      {movie.poster && (
        <Image src={movie.poster} className={{ img: baphStyles.img }} />
      )}
      {!readonly && (
        <InputField
          readonly={readonly}
          name="poster"
          value={movie.poster || ''}
          onChange={onChangeHandlerTextArea}
          type="textarea"
          label="Poster URL"
          labelPosition="above"
        />
      )}
    </>
  );
  const rightContent = (
    <>
      <InputField
        readonly={readonly}
        label="Plot"
        labelPosition="above"
        name="fullplot"
        value={movie.fullplot || ''}
        onChange={onChangeHandlerTextArea}
        type="textarea"
      />
      <InputField
        readonly={readonly}
        label="Rated"
        labelPosition="above"
        name="rated"
        value={movie.rated || ''}
        onChange={onChangeHandlerText}
      />
      <InputField
        type="text"
        readonly={readonly}
        label="Release Date"
        labelPosition="above"
        name="releaseDate"
        value={movie.releaseDate || ''}
        onChange={onChangeHandlerText}
      />
      {!readonly && (
        <ButtonGroup>
          <Button type="submit" kind="primary">
            Save
          </Button>
          <Button onClick={cancelHandler} kind="secondary">
            Cancel
          </Button>
        </ButtonGroup>
      )}
    </>
  );

  return (
    <form onSubmit={onSubmitHandler}>
      <Header className={{ header: baphStyles.header }}>
        <>
          <h1 css={[baphStyles.h1]}>{movie.title || '-Add title-'}</h1>
          {readonly && isAuthenticated && (
            <Button onClick={navToEdit}>Edit Movie</Button>
          )}
        </>
      </Header>
      <TwoColumn left={leftContent} right={rightContent} />
    </form>
  );
};

const baphStyles = {
  header: {
    justifyContent: 'space-between',
    height: 'auto',
    alignItems: 'end'
  },
  h1: {
    maxWidth: '80%',
    justifySelf: 'start'
  },
  img: {
    marginBottom: '20px',
    width: '100%'
  }
};
