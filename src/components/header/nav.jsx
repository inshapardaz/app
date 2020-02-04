import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

import { chunkArray } from '../../utilities/arrays';
class Nav extends Component
{
	renderCategories ()
	{
		if (this.props.categories)
		{
			const categories = chunkArray(this.props.categories.items);
			return categories.map((a, i) => (
				<ul className="item item03" key={`category_col_${i}`}>
					{
						a.map(c =>
							(
								<li key={c.id}>
									<Link to={`/books?category=${c.id}`}>{c.name}</Link>
								</li>
							))
					}
				</ul>
			));
		}

		return null;
	}

	render ()
	{
		return (
			<nav className="mainmenu__nav">
				<ul className="meninmenu d-flex justify-content-start">
					<li>
						<Link to="/"><FormattedMessage id="header.home" /></Link>
					</li>
					<li className="drop">
						<Link to="/books"><FormattedMessage id="header.books" /></Link>
						<div className="megamenu mega03">
							{ this.renderCategories() }
						</div>
					</li>
					<li>
						<Link to="/authors"><FormattedMessage id="header.authors" /></Link>
					</li>
					<li>
						<Link to="/series"><FormattedMessage id="header.series" /></Link>
					</li>
					<li>
						<Link to="/categories"><FormattedMessage id="header.categories" /></Link>
					</li>
				</ul>
			</nav>
		);
	}
}

export default (connect(
	(state) => ({
		categories : state.apiReducers.categories
	}),
	dispatch => bindActionCreators({
	}, dispatch)
)(Nav));
