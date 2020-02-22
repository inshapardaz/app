import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';

import { getLatestBooks } from '../../../state/actions/apiActions';

import Section from '../../ui/section.jsx';

const defaultBookImage = '/resources/img/book_placeholder.png';

function bookItem (book)
{
	return (
		<div key={book.id} className="book book__style--3">
			<div className="book__thumb">
				<Link className="first__img" to={`/books/${book.id}`}>
					<img src={(book.links ? book.links.image : null) || defaultBookImage} alt={book.title}/>
				</Link>
				<Link className="second__img animation1" to={`/books/${book.id}`}>
					<img src={(book.links ? book.links.image : null) || defaultBookImage} alt={book.title} />
				</Link>
			</div>
			<div className="book__content content--center">
				<h4><Link to={`/books/${book.id}`}>{book.title}</Link></h4>
				<ul className="prize d-flex">
					<li><Link to={`/authors/${book.authorId}`}>{book.authorName}</Link></li>
				</ul>
			</div>
		</div>
	);
}

class NewBookWidget extends Component
{
	state = {
		isLoading : true,
		isError : false
	};

	async componentDidMount ()
	{
		try
		{
			await this.props.getLatestBooks();
			this.setState({
				isLoading : false,
				isError : false
			});
		}
		catch (e)
		{
			console.error(e);
			this.setState({
				isLoading : false,
				isError : true
			});
		}
	}

	render ()
	{
		if (!this.props.latestBooks)
		{
			return <></>;
		}

		let books = this.props.latestBooks.map(book => bookItem(book));
		return (
			<Section title={<FormattedMessage id="home.latestBooks" />}>
				{books}
			</Section>
		);
	}
}

export default (connect(
	(state) => ({
		entry : state.apiReducers.entry,
		latestBooks : state.apiReducers.latestBooks
	}),
	dispatch => bindActionCreators({
		getLatestBooks
	}, dispatch)
)(injectIntl(NewBookWidget)));
