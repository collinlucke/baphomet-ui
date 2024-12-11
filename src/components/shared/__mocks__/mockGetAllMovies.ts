import { GET_ALL_MOVIES } from '../../../api/queries';

export default {
  request: {
    query: GET_ALL_MOVIES,
    variables: {
      limit: 100,
      searchTerm: ''
    }
  },
  result: {
    data: {
      allMovies: [
        {
          fullplot: '',
          poster: null,
          title: 'A new title',
          releaseDate: '1111-03-21',
          rated: null,
          id: '672e8b1d6ec1b1001a9e3c11',
          __typename: 'Movie'
        },
        {
          fullplot:
            'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.',
          poster:
            'https://m.media-amazon.com/images/M/MV5BMTc0NjIyMjA2OF5BMl5BanBnXkFtZTcwMzIxNDE1MQ@@._V1_SY1000_SX677_AL_.jpg',
          title: 'Superbad',
          releaseDate: '2007-08-17',
          rated: 'R',
          id: '66fdd70418e00a520662b994',
          __typename: 'Movie'
        },
        {
          fullplot: 'new in the plot',
          poster:
            'https://m.media-amazon.com/images/M/MV5BNDI2MzBhNzgtOWYyOS00NDM2LWE0OGYtOGQ0M2FjMTI2NTllXkEyXkFqcGc@._V1_.jpg',
          title: 'The Hangover',
          releaseDate: '2009-06-07',
          rated: 'R',
          id: '66fddf0318e00a520662b997',
          __typename: 'Movie'
        },
        {
          fullplot: '',
          poster: null,
          title: 'added even if not ready',
          releaseDate: null,
          rated: null,
          id: '67355695525d47e2604773b2',
          __typename: 'Movie'
        },
        {
          fullplot: '',
          poster: null,
          title: 'dwdwaqdea',
          releaseDate: null,
          rated: null,
          id: '672e8bedb2a88166073b558a',
          __typename: 'Movie'
        },
        {
          fullplot: '',
          poster: null,
          title: 'fou uyiyhuikuf',
          releaseDate: null,
          rated: null,
          id: '672e8bbfb2a88166073b5589',
          __typename: 'Movie'
        },
        {
          fullplot: '',
          poster: null,
          title: 'the newest of titles;i',
          releaseDate: null,
          rated: null,
          id: '672e8c9579f0d637d1a17060',
          __typename: 'Movie'
        }
      ]
    }
  }
};
