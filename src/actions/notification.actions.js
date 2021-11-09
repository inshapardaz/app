export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export default {
  showError: (message) => ({
    type: ENQUEUE_SNACKBAR,
    notification: {
      message,
      options: {
        variant: 'error',
      },
      key: new Date().getTime() + Math.random(),
    },
  }),

  showWarning: (message) => ({
    type: ENQUEUE_SNACKBAR,
    notification: {
      message,
      options: {
        variant: 'warning',
      },
      key: new Date().getTime() + Math.random(),
    },
  }),

  showInfo: (message) => ({
    type: ENQUEUE_SNACKBAR,
    notification: {
      message,
      options: {
        variant: 'info',
      },
      key: new Date().getTime() + Math.random(),
    },
  }),

  showSuccess: (message) => ({
    type: ENQUEUE_SNACKBAR,
    notification: {
      message,
      options: {
        variant: 'success',
      },
      key: new Date().getTime() + Math.random(),
    },
  }),

  showMessage: (message) => ({
    type: ENQUEUE_SNACKBAR,
    notification: {
      message,
      options: {
        variant: 'default',
      },
      key: new Date().getTime() + Math.random(),
    },
  }),

  enqueueSnackbar: (notification) => {
    const key = notification.options && notification.options.key;

    return {
      type: ENQUEUE_SNACKBAR,
      notification: {
        ...notification,
        key: key || new Date().getTime() + Math.random(),
      },
    };
  },

  closeSnackbar: (key) => ({
    type: CLOSE_SNACKBAR,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
  }),

  removeSnackbar: (key) => ({
    type: REMOVE_SNACKBAR,
    key,
  }),

};
