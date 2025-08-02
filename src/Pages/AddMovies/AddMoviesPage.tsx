import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { getMovieByTMDBId } from '../../api/tmdbApi';
import {
  Button,
  InputField,
  Search,
  baseColors as paColors,
  mediaQueries
} from '@collinlucke/phantomartist';
import { AboveTheFold } from '../../components/AboveTheFold';
import { CSSObject } from '@emotion/react';
import { ADD_MOVIE } from '../../api/mutations';

type NewMovie = {
  title: string;
  releaseDate: string;
  directors: string[];
  genres: string[];
  posterUrl: string;
  backdropUrl: string;
  tmdbId: string;
  revenue: string;
};

type TMDBGenre = {
  id: number;
  name: string;
};

export const AddMoviesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newMovie, setNewMovie] = useState<NewMovie>({
    title: '',
    releaseDate: '',
    directors: [],
    genres: [],
    revenue: '',
    posterUrl: '',
    backdropUrl: '',
    tmdbId: ''
  });
  const [addMovieMutation, { loading: isLoading, error }] = useMutation(
    ADD_MOVIE,
    {
      onCompleted: data => {
        console.log('Movie added successfully:', data);
      },
      onError: error => {
        console.error('Error adding movie:', error);
      }
    }
  );

  const handleFetch = async (tmdbId?: string) => {
    const idToFetch = tmdbId || searchTerm;
    if (!idToFetch) return;
    try {
      const data = await getMovieByTMDBId(Number(idToFetch));
      setNewMovie({
        ...newMovie,
        title: data.title || '',
        releaseDate: data.release_date || '',
        // directors: [], // Directors are fetched from TMDB's credits endpoint
        genres: data.genres?.map((genre: TMDBGenre) => genre.name) || [],
        revenue: data.revenue ? `$${data.revenue.toLocaleString()} USD` : '',
        posterUrl: data.poster_path
          ? `https://image.tmdb.org/t/p/original${data.poster_path}`
          : '',
        backdropUrl: data.backdrop_path
          ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
          : '',
        tmdbId: idToFetch
      });
    } catch (err) {
      console.error('Error fetching TMDB movie:', err);
    }
  };

  const handleSearch = (searchValue?: string) => {
    if (searchValue) {
      handleFetch(searchValue);
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setNewMovie({
      title: '',
      releaseDate: '',
      directors: [],
      genres: [],
      revenue: '',
      posterUrl: '',
      backdropUrl: '',
      tmdbId: ''
    });
  };

  const handleChange =
    (field: keyof NewMovie) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (field === 'directors' || field === 'genres') {
        setNewMovie({
          ...newMovie,
          [field]: value.split(',').map(s => s.trim())
        });
      } else {
        setNewMovie({ ...newMovie, [field]: value });
      }
    };

  const handleAddMovie = async (e: React.FormEvent) => {
    const { id } = JSON.parse(localStorage.getItem('baphomet-user') || '{}');
    const addtionalMovieData = {
      totalWins: 0,
      totalLosses: 0,
      winningPercentage: 0,
      totalComparisons: 0,
      addedBy: id,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    console.log({ ...newMovie, ...addtionalMovieData });
    // try {
    //   await addMovieMutation({
    //     variables: {
    //       input: { ...newMovie, ...addtionalMovieData }
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error adding movie:', error);
    // }
  };

  return (
    <AboveTheFold>
      <h1>Add Movies</h1>
      <div
        css={baphStyles.formContainer}
        className="baph-add-movies-form-container"
      >
        <div
          css={baphStyles.leftContainer}
          className="baph-add-movies-left-side"
        >
          <Search
            searchTerm={searchTerm}
            searchLabel="Enter TMDB ID"
            setSearchTerm={handleSearchTermChange}
            onSearch={handleSearch}
            inputSize="medium"
            buttonSize="medium"
            buttonKind="secondary"
            showResultsCount={false}
            label="TMDB ID"
            buttonText={`Fetch Movie`}
            onDark
          />

          <div css={baphStyles.formFieldContainers}>
            <InputField
              label="Title"
              type="text"
              value={newMovie.title}
              onChange={handleChange('title')}
              placeholder="Movie Title"
              size="medium"
              onDark
            />
            <InputField
              size="medium"
              label="Release Date"
              type="text"
              value={newMovie.releaseDate}
              onChange={handleChange('releaseDate')}
              placeholder="Release Date"
              onDark
            />
            <InputField
              size="medium"
              label="Genres"
              type="text"
              value={newMovie.genres.join(', ')}
              onChange={handleChange('genres')}
              placeholder="Genres, comma-separated"
              onDark
            />
            <InputField
              size="medium"
              label="Revenue"
              type="text"
              value={newMovie.revenue}
              onChange={handleChange('revenue')}
              placeholder="Revenue"
              onDark
            />
            <InputField
              size="medium"
              label="Poster URL"
              type="text"
              value={newMovie.posterUrl}
              onChange={handleChange('posterUrl')}
              placeholder="URL to poster image"
              onDark
            />
            <InputField
              size="medium"
              label="Backdrop URL"
              type="text"
              value={newMovie.backdropUrl}
              onChange={handleChange('backdropUrl')}
              placeholder="URL to backdrop image"
              onDark
            />
          </div>
        </div>
        <div
          css={baphStyles.rightContainer}
          className="baph-add-movies-right-side"
        >
          <div
            css={baphStyles.posterPreview}
            className="baph-add-movies-poster-preview"
          >
            {newMovie.posterUrl ? (
              <img
                css={baphStyles.posterImg}
                src={newMovie.posterUrl}
                alt="Poster Preview"
              />
            ) : (
              <p>No Poster Available</p>
            )}
          </div>

          <div
            css={baphStyles.backdropPreview}
            className="baph-add-movies-backdrop-preview"
          >
            {newMovie.backdropUrl ? (
              <img
                css={baphStyles.backdropImg}
                src={newMovie.backdropUrl}
                alt="Backdrop Preview"
              />
            ) : (
              <p>No Backdrop Available</p>
            )}
          </div>
        </div>
      </div>
      <div css={baphStyles.saveButtonGroup}>
        <Button size="small" kind="secondary" onClick={handleAddMovie}>
          Add Movie
        </Button>
        <Button size="medium" kind="ghost" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </AboveTheFold>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  formFieldContainers: {
    display: 'flex',
    gap: '2rem',
    flexDirection: 'column'
  },
  saveButtonGroup: {
    display: 'flex',
    gap: '1rem',
    alignSelf: 'end'
  },
  formContainer: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'space-between',
    flexDirection: 'column' as const,
    [mediaQueries.minWidth.sm]: {
      flexDirection: 'row' as const
    }
  },
  rightContainer: {
    flex: 1,
    display: 'flex',
    gap: '1rem',
    flexDirection: 'row' as const,
    [mediaQueries.minWidth.sm]: {
      flexDirection: 'column'
    },
    [mediaQueries.minWidth.md]: {
      flex: 2
    }
  },
  leftContainer: {
    flex: 1,
    gap: '2rem',
    display: 'flex',
    flexDirection: 'column'
  },
  posterPreview: {
    maxHeight: '250px',
    aspectRatio: '2/3',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '2px',
    overflow: 'hidden',
    width: 'fit-content',
    backgroundColor: paColors.secondary[500],
    border: `1px solid ${paColors.tertiary[500]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  backdropPreview: {
    height: 'auto',
    aspectRatio: '16/9',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '2px',
    overflow: 'hidden',
    backgroundColor: paColors.secondary[500],
    border: `1px solid ${paColors.tertiary[500]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2
  }
};
