//-------------------------------------------------------------------------------
// Class Methods to simplify calls to API endpoints.
//
// Three methods, a GET, a POST, and a Error Handling method.
//
//-------------------------------------------------------------------------------
// import 'babel-polyfill';
import { v4 as uuidv4 } from 'uuid';

const handleErrors = async (response, isFetchError = false) => {

  if (isFetchError) {
    return {
      response: null,
      error: {status: -1, response},
    };
  }

  let parsedResponse;

  if (response.headers.get('content-type') === 'application/json') {
    parsedResponse = await response.json();
  }
  else {
    parsedResponse = await response.text();
  }

  if (response.status !== 200) {
    return {
      response: null,
      error: {status: response.status, response: parsedResponse},
    };
  }

  return {
    response: parsedResponse,
    error: null,
  };
}


const HttpClient = (url, method, body, requestParameters) => {

    const {headers, ...params} = requestParameters;

    const myHeaders = new Headers();

    for (const property in headers) {
      myHeaders.append(property, requestParameters.headers[property]);
    }

    const allParams = { ...params, method, headers: myHeaders, body };

    console.log(allParams, url)

    return fetch(url, allParams)
      .then(response => handleErrors(response))
      .catch(error => handleErrors(error, true));
}



export default HttpClient;
