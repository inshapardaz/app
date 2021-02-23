import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import MarkdownEditor from '@jdinabox/ckeditor5-build-markdown';

const Editor = ({ data, onChange }) => {
	return (<CKEditor
		editor={MarkdownEditor}
		data={data}
		onChange={(event, editor) => {
			if (onChange) {
				const data = editor.getData();
				onChange(data);
			}
		}}
		config={{
			language: {
				ui: 'en',
				content: 'ar'
			}
		}}

	/>);
}

export default Editor;
