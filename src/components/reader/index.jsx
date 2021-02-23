import React from 'react';
import parse from 'html-react-parser';
import ReactMarkdown from 'react-markdown'

const Reader = ({ data, format = 'text' }) => {

	if (format === 'html') {
		return parse(`<div>${data}</div`);
	}

	if (format === 'markdown') {
		return <ReactMarkdown>{data}</ReactMarkdown>
	}

	return (<div>{data}</div>)


}

export default Reader;
