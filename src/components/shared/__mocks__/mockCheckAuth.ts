import { CHECK_AUTH } from '../../../api/queries';

export default {
  request: {
    query: CHECK_AUTH,
    variables: {
      token: null
    }
  },
  error: {
    name: 'ApolloError',
    graphQLErrors: [],
    protocolErrors: [],
    clientErrors: [],
    networkError: {
      name: 'ServerError',
      response: {},
      statusCode: 401,
      result: 'Unauthorized'
    },
    message: 'Response not successful: Received status code 401',
    cause: {
      name: 'ServerError',
      response: {},
      statusCode: 401,
      result: 'Unauthorized'
    },
    title: 'checkAuth'
  }
};
