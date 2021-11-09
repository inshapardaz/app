import { mockRequest } from './mockHelpers';

const librariesPattern = new RegExp(/api\/libraries\?(.*)$/);

export default {
  mockEntry: () => {
    mockRequest(librariesPattern, 'libraries/entry.json', 'GET');
  },

  mockEntryAsAdmin: () => {
    mockRequest(librariesPattern, 'libraries/admin-entry.json', 'GET');
  },
};
