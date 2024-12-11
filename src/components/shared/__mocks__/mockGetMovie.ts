import { GET_MOVIE } from '../../../api/queries';

export default {
  request: {
    query: GET_MOVIE,
    variables: {
      id: 'test-movie-id'
    }
  },
  result: {
    data: {
      movie: {
        fullplot: 'The is the movie of the little unit test that could',
        poster: 'www.there-is-no-poster.baph',
        title: 'Test Movie Title',
        releaseDate: '06/29/1984',
        rated: 'G',
        id: 'test-movie-id',
        __typename: 'Movie'
      }
    }
  }
};
