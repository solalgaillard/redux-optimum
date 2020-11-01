//-------------------------------------------------------------------------------
//
// Basic wrapper around browser errors
//
//-------------------------------------------------------------------------------

const handleFetchErrors = async error => (
  {
    response: null,
    error: { status: -1, error },
  });

const handleSuccess = async response => {
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
      error: { status: response.status, response: parsedResponse },
    };
  }

  return {
    response: parsedResponse,
    error: null,
  };
};

const HttpClient = (url, method, body, requestParameters) => {
  const { headers, ...params } = requestParameters;

  const myHeaders = new Headers();

  Object.keys(headers).forEach(property => (
    myHeaders.append(property, requestParameters.headers[property])
  ));

  const allParams = {
    ...params, method, headers: myHeaders, body,
  };

  return fetch(url, allParams)
    .then(response => handleSuccess(response))
    .catch(error => handleFetchErrors(error));
};

export default HttpClient;
