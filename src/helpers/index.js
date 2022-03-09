const parseReadFilter = (readFilter) => {
  switch (readFilter) {
    case true:
      return 'read=true&';
    case false:
      return 'read=false&';
    default:
      return '';
  }
};

export default {
  truncateWithEllipses: (text, max) => {
    if (!text) return text;
    return text.substr(0, max - 1) + (text.length > max ? '...' : '');
  },
  defaultAuthorImage: '/images/author_placeholder.jpg',
  setDefaultAuthorImage: (ev) => {
    ev.target.src = this.defaultAuthorImage;
  },
  defaultSeriesImage: '/images/series_placeholder.jpg',
  setDefaultSeriesImage: (ev) => {
    ev.target.src = this.defaultSeriesImage;
  },
  defaultBookImage: '/images/book_placeholder.jpg',
  setDefaultBookImage: (ev) => {
    ev.target.src = this.defaultBookImage;
  },
  defaultPageImage: '/images/page_placeholder.jpg',
  setDefaultPageImage: (ev) => {
    ev.target.src = this.defaultPageImage;
  },

  defaultPeriodicalImage: '/images/periodical_placeholder.png',
  setDefaultPeriodicalImage: (ev) => {
    ev.target.src = this.defaultPeriodicalImage;
  },

  parseNullableBool: (val) => {
    if (val === 'true') {
      return true;
    }
    if (val === 'false') {
      return false;
    }
    return null;
  },
  buildLinkToBooksPage: (
    location,
    page,
    query,
    authorId,
    categoryId,
    seriesId,
    sortBy,
    sortDirection,
    favoriteFilter,
    readFilter,
    statusFilter,
  ) => {
    let querystring = '';
    querystring += page ? `page=${page}&` : '';
    querystring += query ? `query=${query}&` : '';
    querystring += authorId ? `author=${authorId}&` : '';
    querystring += categoryId ? `category=${categoryId}&` : '';
    querystring += seriesId ? `series=${seriesId}&` : '';
    querystring += sortBy && sortBy !== 'title' ? `sortBy=${sortBy}&` : '';
    querystring += sortDirection && sortDirection !== 'ascending' ? `sortDirection=${sortDirection}&` : '';
    querystring += favoriteFilter && favoriteFilter !== false ? 'favorite=true&' : '';
    querystring += parseReadFilter(readFilter);
    querystring += statusFilter && statusFilter !== 'published' ? `status=${statusFilter}&` : '';

    if (querystring !== '') {
      if (querystring.substr(querystring.length - 1) === '&') {
        querystring = querystring.slice(0, -1);
      }

      return `${location.pathname}?${querystring}`;
    }

    return location.pathname;
  },
  buildLinkToBooksPagesPage: (location,
    page,
    pageSize,
    statusFilter,
    assignmentFilter) => {
    let querystring = '';
    querystring += page ? `page=${page}&` : '';
    querystring += pageSize && pageSize !== 12 ? `pageSize=${pageSize}&` : '';
    querystring += statusFilter ? `filter=${statusFilter}&` : '';
    querystring += assignmentFilter ? `assignmentFilter=${assignmentFilter}&` : '';

    if (querystring !== '') {
      if (querystring.substr(querystring.length - 1) === '&') {
        querystring = querystring.slice(0, -1);
      }

      return `${location.pathname}?${querystring}`;
    }

    return location.pathname;
  },
  buildLinkToLibrariesPage: (location,
    page,
    query,
    pageSize = 12) => {
    let querystring = '';
    querystring += page ? `page=${page}&` : '';
    querystring += query ? `q=${query}&` : '';
    querystring += pageSize && pageSize !== 12 ? `pageSize=${pageSize}&` : '';

    if (querystring !== '') {
      if (querystring.substr(querystring.length - 1) === '&') {
        querystring = querystring.slice(0, -1);
      }

      return `${location.pathname}?${querystring}`;
    }

    return location.pathname;
  },
  buildLinkToLibraryUsersPage: (location,
    page,
    query,
    pageSize = 12) => {
    let querystring = '';
    querystring += page ? `page=${page}&` : '';
    querystring += query ? `q=${query}&` : '';
    querystring += pageSize && pageSize !== 12 ? `pageSize=${pageSize}&` : '';

    if (querystring !== '') {
      if (querystring.substr(querystring.length - 1) === '&') {
        querystring = querystring.slice(0, -1);
      }

      return `${location.pathname}?${querystring}`;
    }

    return location.pathname;
  },
  buildLinkToPeriodicalsPage: (
    location,
    page,
    query,
    categoryId,
    sortBy,
    sortDirection,
  ) => {
    let querystring = '';
    querystring += page ? `page=${page}&` : '';
    querystring += query ? `query=${query}&` : '';
    querystring += categoryId ? `category=${categoryId}&` : '';
    querystring += sortBy && sortBy !== 'title' ? `sortBy=${sortBy}&` : '';
    querystring += sortDirection && sortDirection !== 'ascending' ? `sortDirection=${sortDirection}&` : '';

    if (querystring !== '') {
      if (querystring.substr(querystring.length - 1) === '&') {
        querystring = querystring.slice(0, -1);
      }

      return `${location.pathname}?${querystring}`;
    }

    return location.pathname;
  },
  buildLinkToIssuesPage: (
    location,
    page,
    sortDirection,
  ) => {
    let querystring = '';
    querystring += page ? `page=${page}&` : '';
    querystring += sortDirection && sortDirection !== 'ascending' ? `sortDirection=${sortDirection}&` : '';

    if (querystring !== '') {
      if (querystring.substr(querystring.length - 1) === '&') {
        querystring = querystring.slice(0, -1);
      }

      return `${location.pathname}?${querystring}`;
    }

    return location.pathname;
  },
};
