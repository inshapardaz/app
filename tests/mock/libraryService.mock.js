import { mockRequest } from './mockHelpers';

const librariesPattern = new RegExp(/libraries\?(.*)$/);
const categoriesPattern = new RegExp(/libraries\/(.*)\/categories\?(.*)$/);

export default {
  mockEntry: () => {
    mockRequest(librariesPattern, 'libraries/entry.json', 'GET');
  },

  mockEntryAsAdmin: () => {
    mockRequest(librariesPattern, 'libraries/admin-entry.json', 'GET');
  },

  mockCategories: () => {
    mockRequest(categoriesPattern, 'libraries/categories/categories.json', 'GET');
  },
};
