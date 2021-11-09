const defaultHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
  'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
  'Access-Control-Allow-Origin': '*',
  'X-Server': 'cypress-test',
};

const mockRequest = (urlRegEx, fixture, method = 'GET') => cy.intercept(method, urlRegEx, {
  fixture,
  headers: defaultHeaders,
  statusCode: 200,
});

const mockSlowRequest = (urlRegEx, fixture, method = 'GET') => cy.intercept({ method, pathname: urlRegEx },
  (req) => {
    req.continue((res) => {
      res.delay = 10000;
      res.statusCode = 200;
      res.headers = defaultHeaders;
      res.fixture = fixture;
      res.send();
    });
  });

const mockRequestWithCode = (urlRegEx, errorCode, method = 'GET') => cy.intercept(method, urlRegEx, { statusCode: errorCode, headers: defaultHeaders });

const mockRequestError = (urlRegEx, method = 'GET') => cy.intercept(method, urlRegEx, { forceNetworkError: true });

export {
  mockRequest, mockSlowRequest, mockRequestError, mockRequestWithCode,
};
