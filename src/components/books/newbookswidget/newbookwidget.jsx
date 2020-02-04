import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { injectIntl, FormattedMessage } from 'react-intl';

import { getLatestBooks } from '../../../state/actions/apiActions';

function bookItem (book)
{
	return (
		<div key={book.id} className="product product__style--3">
			<div className="product__thumb">
				<a className="first__img" href="single-product.html">
					<img src={book.links.image} alt="product image"/>
				</a>
				<a className="second__img animation1" href="single-product.html">
					<img src={book.links.image} alt="product image" />
				</a>
			</div>
			<div className="product__content content--center">
				<h4><a href="single-product.html">{book.title}</a></h4>
				<ul className="prize d-flex">
					<li>{book.authorName}</li>
				</ul>
				{/* <div className="action">
					<div className="actions_inner">
						<ul className="add_to_links">
							<li><a className="cart" href="cart.html"><i className="bi bi-shopping-bag4"></i></a>
							</li>
							<li><a className="wishlist" href="wishlist.html"><i className="bi bi-shopping-cart-full"></i></a></li>
							<li><a className="compare" href="#"><i className="bi bi-heart-beat"></i></a></li>
							<li><a data-toggle="modal" title="Quick View" className="quickview modal-view detail-link" href="#productmodal"><i className="bi bi-search"></i></a></li>
						</ul>
					</div>
				</div>
				<div className="product__hover--content">
					<ul className="rating d-flex">
						<li className="on"><i className="fa fa-star-o"></i></li>
						<li className="on"><i className="fa fa-star-o"></i></li>
						<li className="on"><i className="fa fa-star-o"></i></li>
						<li><i className="fa fa-star-o"></i></li>
						<li><i className="fa fa-star-o"></i></li>
					</ul>
				</div> */}
			</div>
		</div>
	);
}
class NewBookWidget extends Component
{
	async componentDidMount ()
	{
		try
		{
			this.setState({ isLoading : true, isError : false });
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
		console.dir(this.props.latestBooks);

		if (!this.props.latestBooks)
		{
			return null;
		}

		let books = this.props.latestBooks.map(book => bookItem(book));
		return (
			<section className="wn__product__area brown--color pt--80  pb--30">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="section__title text-center">
								<h2 className="title__be--2"><FormattedMessage id="home.latestBooks" /></h2>
								<div className="container">
									<div className="row">
										{books}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">

					</div>
				</div>
			</section>
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
