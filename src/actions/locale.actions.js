import { localeService } from '@/services';

const setLanguageAction = (language) => (dispatch) => {
  localeService.setCurrentLanguage(language);
  const isRtl = localeService.isRtl(language);
  dispatch({
    type: 'languageChanged',
    payload: { language, isRtl },
  });
};

const initLocaleAction = () => (dispatch) => {
  const { language, isRtl } = localeService.initLocale();
  dispatch({
    type: 'languageChanged',
    payload: { language, isRtl },
  });
};

export default { setLanguageAction, initLocaleAction };
