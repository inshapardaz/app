import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

class BooksMenu extends React.Component
{
	renderCategory (c)
	{
		return (
			<Menu.Item key={c.id}>
				<Link to={`/books?category=${c.id}`}>
					<i className="fa fa-book menuIcon mr-2" />
					{c.name}
				</Link>
			</Menu.Item>);
	}

	renderCategories (categories)
	{
		// if (categories && categories.items)
		// {
		// 	let menuItems = [];
		// 	menuItems.push(categories.items.map(c => this.renderCategory(c)));

		// 	return (<Menu selectable={false} placement="bottomRight">
		// 		<Menu.Item key="new">
		// 			<Link to="/books/new">
		// 				<i className="fa fa-star menuIcon mr-2" />
		// 				<FormattedMessage id="home.latestBooks" />
		// 			</Link>
		// 		</Menu.Item>
		// 		<Menu.Item key="recent">
		// 			<Link to="/books/recent">
		// 				<i className="far fa-clock menuIcon mr-2" />
		// 				<FormattedMessage id="home.recent" />
		// 			</Link>
		// 		</Menu.Item>
		// 		{this.props.entry && this.props.entry.links.favorites
		// 			? (<Menu.Item key="favorites">
		// 				<Link to="/books/favorites">
		// 					<i className="far fa-heart menuIcon mr-2" />
		// 					<FormattedMessage id="home.favoriteBooks" />
		// 				</Link>
		// 			</Menu.Item>)
		// 			: null
		// 		}
		// 		<Menu.Item key="allbooks">
		// 			<Link to="/books">
		// 				<i className="fa fa-book menuIcon mr-2" />
		// 				<FormattedMessage id="header.books.list" />
		// 			</Link>
		// 		</Menu.Item>
		// 		<Menu.Divider />
		// 		{menuItems}
		// 	</Menu>
		// 	);
		// }

		return null;
	}

	render ()
	{
		const { categories } = this.props;
		return (
			// <Dropdown overlay={this.renderCategories(categories)} trigger={['click']} placement="bottomLeft">
			// 	<div className="dropdown">
			// 		<i className="fa fa-book menuIcon mr-2" />
			// 		<span className="d-none d-xl-inline">
			// 			<strong>
			// 				<FormattedMessage id="header.books" />
			// 			</strong>
			// 		</span>
			// 	</div>
			// </Dropdown>
		);
	}
}

export default (connect(
	(state) => ({
		categories : state.apiReducers.categories,
		entry : state.apiReducers.entry
	}),
	dispatch => bindActionCreators({
	}, dispatch)
)(BooksMenu));
