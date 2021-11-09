import accountActions from './account.actions';
import localeActions from './locale.actions';
import notificationActions from './notification.actions';
import uiActions from './ui.actions';
import libraryActions from './library.actions';

export default {
  ...accountActions, ...localeActions, ...uiActions, ...libraryActions, ...notificationActions,
};
