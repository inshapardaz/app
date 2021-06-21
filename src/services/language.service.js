import replaceList from '../i18n/correctionText';

export const languageService = {

	fixText: (input) => {
		replaceList.forEach(value => {
			input = input.replaceAll(value.Key, value.Value);
		});

		return input;
	}
};
