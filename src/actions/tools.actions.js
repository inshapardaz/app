import { toolsService } from '@/services';

const getPunctuationCorrections = (language) => (dispatch) => toolsService.getPunctuations(language)
  .then((res) => {
    dispatch({
      type: 'punctuationCorrectionsChanged',
      payload: res,
    });
  });

const getAutoFixCorrections = (language) => (dispatch) => toolsService.getAutoFixList(language)
  .then((res) => {
    dispatch({
      type: 'autoFixCorrectionsChanged',
      payload: res,
    });
  });

const getCorrections = (language) => (dispatch) => toolsService.getCorrections(language)
  .then((res) => {
    dispatch({
      type: 'correctionsChanged',
      payload: res,
    });
  });

export default { getPunctuationCorrections, getAutoFixCorrections, getCorrections };
