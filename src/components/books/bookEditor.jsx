import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import EditorDialog from '../editorDialog';
import BookEditorForm from './bookEditorForm';

const BookEditor = ({ show, book, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const [busy, setBusy] = useState(false);

	const dialogTitle =
		book === null
			? intl.formatMessage({ id: "book.editor.header.add" })
			: intl.formatMessage(
				{ id: "book.editor.header.edit" },
				{ title: book.title }
			);

	const onBusy = (isBusy) => {
		setBusy(isBusy);
	}

	return (
		<EditorDialog show={show} busy={busy} title={dialogTitle} onCancelled={() => onCancelled()}  >
			<BookEditorForm book={book} createLink={createLink} onSaved={onSaved} onBusy={onBusy} />
		</EditorDialog >
	);
};

export default BookEditor;
