import { libraryService, localeService } from '@/services';
import notificationActions from './notification.actions';
import browserHistory from '@/store/browserHistory';

export const LIBRARY_SELECTED = 'LIBRARY_SELECTED';
export const ENTRY_LOADED = 'ENTRY_LOADED';
export const ENTRY_LOADING = 'ENTRY_LOADING';
export const CATEGORIES_LOADED = 'CATEGORIES_LOADED';

const getCategories = () => (dispatch, getState) => {
  const { library } = getState().libraryReducer;
  libraryService.getCategories(library.links.categories)
    .then((categories) => {
      dispatch({
        type: CATEGORIES_LOADED,
        payload: categories,
      });
    }, () => {
      dispatch({
        type: CATEGORIES_LOADED,
        payload: null,
      });
    });
};

export default {
  getEntry: () => (dispatch) => {
    dispatch({
      type: ENTRY_LOADING,
      payload: true,
    });

    libraryService.getLibraries()
      .then((libraries) => {
        dispatch({
          type: ENTRY_LOADED,
          payload: libraries,
        });

        const selectedLibrary = localStorage.getItem('library');
        if (selectedLibrary) {
          const library = libraries.data.filter((l) => l.id === parseInt(selectedLibrary, 10))[0];
          if (library) {
            dispatch({
              type: LIBRARY_SELECTED,
              payload: library,
            });
            dispatch(getCategories());
          }
        } else {
          browserHistory.replace('/account/libraries');
        }
      }, () => {
        dispatch({
          type: ENTRY_LOADED,
          payload: null,
        });
        browserHistory.replace('/error/500');
      });
  },

  setSelectedLibrary: (library) => (dispatch) => {
    localStorage.setItem('library', library.id);
    dispatch({
      type: LIBRARY_SELECTED,
      payload: library,
    });

    dispatch(getCategories());

    browserHistory.replace('/');
  },

  getCategories,

  createCategory: (category) => (dispatch, getState) => {
    const { categories } = getState().libraryReducer;
    return libraryService.createCategory(categories.links.create, category)
      .then(() => dispatch(getCategories()));
  },

  updateCategory: (link, category) => (dispatch) => libraryService.updateCategory(link, category)
    .then(() => dispatch(getCategories())),

  deleteCategory: (category) => (dispatch) => libraryService.deleteCategory(category)
    .then(() => {
      dispatch(getCategories());
      dispatch(notificationActions.showSuccess(localeService.formatMessage({ id: 'categories.messages.deleted' })));
    })
    .catch(() => {
      dispatch(notificationActions.showError(localeService.formatMessage({ id: 'categories.messages.error.delete' })));
    }),

  deleteLibrary: (library) => (dispatch) => libraryService.deleteLibrary(library)
    .then((res) => {
      dispatch({
        type: 'libraryUpdated',
        payload: res,
      });
      dispatch(notificationActions.showSuccess(localeService.formatMessage({ id: 'library.message.delete.success' }, { name: library.name })));
    })
    .catch(() => {
      dispatch(notificationActions.showError(localeService.formatMessage({ id: 'library.message.delete.error' })));
    }),
};
