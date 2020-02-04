/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-invalid-this */
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';

import { Icon, Checkbox, Avatar  } from 'antd';
import ApiService from '../../services/LibraryService';

const defaultAuthorImage = '/resources/img/avatar1.jpg';
const defaultBookImage = '/resources/img/book_placeholder.png';

class SearchBox extends Component
{
	constructor (props)
	{
		super(props);
		this.state = {
			show : false,
			searchText : '',
			searchBooks : true,
			searchAuthors : true,
			books : null,
			authors : null
		};
	}

    showLiveSearch = () =>
    {
    	this.searchInput.focus();
    	this.setState({ show : true });
    }

    hideLiveSearch = () =>
    {
    	this.searchInput.blur();
    	this.setState({
    		show : false,
    		searchText : '',
    		books : null,
    		authors : null
    	});
    }

    changeSearchText = e =>
    {
    	this.setState({
    		searchText : e.target.value
    	});
    }

	searchBooks = async () =>
	{
		if (this.state.searchBooks)
		{
			try
			{
				const result = await ApiService.searchBooks(this.state.searchText, 1, 6);
				this.setState({
					books : result
				});
			}
			catch (error)
			{
				console.error(error);
				this.setState({
					isError : true
				});
			}
		}
	}

	searchAuthors = async () =>
	{
		if (this.state.searchAuthors)
		{
			try
			{
				const result = ApiService.searchAuthors(this.state.searchText, 1, 6);
				this.setState({
					authors : result
				});
			}
			catch (error)
			{
				console.log(error);
				this.setState({
					isError : true
				});
			}
		}
	}

    handleKeyDown = async (event) =>
    {
    	if (this.state.show)
    	{
    		let key = event.keyCode.toString();
    		if (key === '27') //Escape
    		{
    			this.hideLiveSearch();
    		}
    		else if (key === '13') //Enter
    		{
    			await this.searchBooks();
    			await this.searchAuthors();

    		}
    	}
    }

    componentWillMount ()
    {
    	document.addEventListener('keydown', this.handleKeyDown, false);
    }

    setDefaultBookImage (ev)
    {
    	ev.target.src = '/resources/img/book_placeholder.png';
    }

    setDefaultAuthorImage (ev)
    {
    	ev.target.src = '/resources/img/avatar1.jpg';
    }

    renderBook (book)
    {
    	return (
    		<div className="livesearch__result-content" key={book.id}>
    			<div className="livesearch__result-thumb" style={{ backgroundImage : `url(${book.links.image || defaultBookImage})` }}></div>
    			<div className="livesearch__result">
    				<div className="livesearch__result-text">
    					<Link to={`/books/${book.id}`} onClick={this.hideLiveSearch}> {book.title}</Link>
    				</div>
    				<div className="livesearch__result-source">{book.authorName}</div>
    			</div>
    		</div>);
    }

    renderAuthor (author)
    {
    	return (
    		<div className="livesearch__result-content" key={author.id}>
    			<div className="livesearch__result-thumb"><Avatar src={author.links.image || defaultAuthorImage} onError={this.setDefaultAuthorImage} /></div>
    			<div className="livesearch__result">
    				<div className="livesearch__result-text">
    					<Link to={`/authors/${author.id}`} onClick={this.hideLiveSearch}> {author.name}</Link>
    				</div>
    				<div className="livesearch__result-source">{author.bookCount} کتابیں</div>
    			</div>
    		</div>);
    }

    renderBooks (books)
    {
    	if (!books || books.data.length < 1)
    	{
    		return (<div className="col-lg-8">
    			<div className="livesearch__result-content">
    				<div className="livesearch__result">
    					<span className="livesearch__result-text">کوئی کتاب موجود نہیں</span>
    				</div>
    			</div>
    		</div>);
    	}

    	let bookNodes = books.data.map(b => this.renderBook(b));

    	let column1 = (
    		<div className="col-lg-4">
    			{bookNodes.slice(0, 3)}</div>);

    	let column2 = (
    		<div className="col-lg-4">
    			{bookNodes.slice(3, 6)}
    		</div>);
    	return (
    		<div className="row">
    			{column1}
    			{bookNodes.length > 3 || column2}
    		</div>
    	);
    }

    renderAuthors (authors)
    {
    	if (!authors || authors.data.length < 1)
    	{
    		return (<div className="col-lg-8">
    			<div className="livesearch__result-content">
    				<div className="livesearch__result">
    					<span className="livesearch__result-text">کوئی مصنّف موجود نہیں</span>
    				</div>
    			</div>
    		</div>);
    	}

    	let authorNodes = authors.data.map(a => this.renderAuthor(a));

    	let column1 = (
    		<div className="col-lg-4">
    			{authorNodes.slice(0, 3)}</div>);

    	let column2 = (
    		<div className="col-lg-4">
    			{authorNodes.slice(3, 6)}
    		</div>);
    	return (
    		<div className="row">
    			{column1}
    			{authorNodes.length > 3 || column2}
    		</div>
    	);
    }

    render ()
    {
    	//const searchMessage = this.props.intl.formatMessage({ id : 'header.search.placeholder' });
    	let { show, searchText, books, authors } = this.state;

    	const booksResult = this.renderBooks(books);
    	const authorsResult = this.renderAuthors(authors);

    	return (
            <>
				<a className="search__active" href="#" onClick={this.showLiveSearch}></a>
                <div
                	className={show === true ? 'liveSearch liveSearch--show' : 'liveSearch'}
                	id="liveSearch"
                >
                	<div className="livesearch__close" onClick={this.hideLiveSearch}>
                		<Icon type="close" />
                	</div>
                	<div className="container-fluid">
                		<div className="livesearch__wrapper">
                			<div className="livesearch__logo">
                				<img className="livesearch__logo--img" src="/resources/img/logo.png" alt="" />
                			</div>
                			<div className="livesearch__search">
                				<input
                					type="search"
                					className="livesearch__input"
                					value={searchText}
                					onChange={this.changeSearchText}
                					id="livesearchInput"
                					placeholder="تلاش کے لیے لکھیں۔۔۔"
                					ref={ele => (this.searchInput = ele)}
                				/>
                			</div>
                			<ul className="livesearch__options">
                				<li className="livesearch__option">تلاش کے لیے اینٹر دبائیں</li>
                				<li className="livesearch__option livesearch__option--checkbox">
                					<Checkbox checked={this.state.searchBooks}>کتاب کی تلاش</Checkbox>
                				</li>

                				<li className="livesearch__option livesearch__option--checkbox">
                					<Checkbox checked={this.state.searchAuthors}>مصنّف کی تلاش</Checkbox>
                				</li>

                			</ul>
                			<div className="livesearch__results">
                				<div className="livesearch__results-title">
                					<span className="livesearch__results-title-text">کتابوں کے نتائج</span>
                				</div>
                				{booksResult}
                				<div className="livesearch__results-title">
                					<span className="livesearch__results-title-text">مصنّفین کےنتاِئج</span>
                				</div>
                				{authorsResult}
                			</div>
                		</div>
                	</div>
                </div>
            </>
    	);
    }
}

export default withRouter(injectIntl(SearchBox));
