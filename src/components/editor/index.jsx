import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import MarkdownEditor from '@jdinabox/ckeditor5-build-markdown';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	editor: {
		fontFamily: props => `${props.font}`,
		fontSize: props => `${props.textScale}em`,
	}
});

const Editor = ({ data, textScale, font, onChange, fullScreen }) => {
	const classes = useStyles({ textScale, font });

	return (<div className={`${classes.editor} ${fullScreen ? 'fullScreen' : ''}`}>
		<CKEditor
			editor={MarkdownEditor}
			data={data || ''}
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
				},
				height: '100%'
			}}

		/>
	</div>
	);
}

export default Editor;
