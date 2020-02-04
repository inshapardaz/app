import React, { Component } from 'react';
import { Link } from  'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Menu, Icon } from 'antd';
import Nav from './nav.jsx';
import SearchBox from '../searchbox/searchbox.jsx';
// import BooksMenu from '../booksMenu/booksMenu.jsx';
// import SearchBox from '../searchbox/searchbox.jsx';
// import ProfileMenu from '../profileMenu/profileMenu.jsx';

const SubMenu = Menu.SubMenu;

class Header extends Component
{
	onToggle ()
	{
		// this.props.toggleSidebar();
	}

	onToggleCompact ()
	{
		//this.props.toggleSidebarCompact();
	}

	renderBooks ()
	{
		return (
			<SubMenu title={<span className="submenu-title-wrapper"><Icon type="book" /><FormattedMessage id="header.books" /></span>}>
				<Menu.Item key="new">
					<Link to="/books/new">
						<Icon type="star" />
						<FormattedMessage id="home.latestBooks" />
					</Link>
				</Menu.Item>
				<Menu.Item key="recent">
					<Link to="/books/recent">
						<Icon type="clock-circle" />
						<FormattedMessage id="home.recent" />
					</Link>
				</Menu.Item>
				{this.props.entry && this.props.entry.links.favorites
					? (<Menu.Item key="favorites">
						<Link to="/books/favorites">
							<Icon type="heart" />
							<FormattedMessage id="home.favoriteBooks" />
						</Link>
					</Menu.Item>)
					: null
				}
				<Menu.Item key="allbooks">
					<Link to="/books">
						<Icon type="book" />
						<FormattedMessage id="header.books.list" />
					</Link>
				</Menu.Item>
				<Menu.Divider></Menu.Divider>
				<SubMenu title={<span className="submenu-title-wrapper">
					<Icon type="appstore" />
					<FormattedMessage id="header.categories" /></span>}>
					{this.renderCategoriesMenu()}
				</SubMenu>
			</SubMenu>
		);
	}

	renderCategoriesMenu ()
	{
		if (this.props.categories)
		{
			return this.props.categories.items.map(c => (
				<Menu.Item key={c.id}>
					<Link to={`/books?category=${c.id}`}>
						{c.name}
					</Link>
				</Menu.Item>
			));
		}

		return null;
	}

	renderCategories ()
	{
		if (this.props.categories && this.props.categories.links.create)
		{
			return (
				<div className="ml-4">
					<Link to="/categories" className="link">
						<i className="fa fa-th-large menuIcon ml-2" />
						<span className="d-none d-xl-inline">
							<strong>
								<FormattedMessage id="header.categories" />
							</strong>
						</span>
					</Link>
				</div>
			);
		}

		return null;
	}

	render ()
	{
		return (<header className="header__area header__absolute sticky__header">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-6 col-sm-6 col-6 col-lg-2">
						<div className="logo">
							<Link to="/">
								<img src="/resources/images/header_logo.png" style={{ margin : '4px' }} />
							</Link>
						</div>
					</div>
					<div className="col-lg-8 d-none d-lg-block">
						<Nav />
					</div>
					<div className="col-md-6 col-sm-6 col-6 col-lg-2">
						<ul className="header__sidebar__right d-flex justify-content-end align-items-center">
							<li>
								<SearchBox />
							</li>
							<li>
								<Link className="favorites" to="/books/favorites"></Link>
							</li>
							<li className="setting__bar__icon">
								<a className="setting__active" href="#"></a>
							</li>
						</ul>
					</div>
				</div>
				<div className="row d-none"></div>
				<div className="mobile-menu d-block d-lg-none"></div>
			</div>
		</header>);
		/*return (
			<div className="header">
				<Link className="header__logo" to="/">
					<img height="24" width="24" src="/resources/images/logo.png" style={{ margin : '4px' }} />
				</Link>
				<div className="header__item">
					<BooksMenu />
				</div>
				<div className="header__item">
					<Link to="/authors" className="link">
						<i className="fa fa-user menuIcon ml-2" />
						<span className="d-none d-xl-inline">
							<strong>
								<FormattedMessage id="header.authors" />
							</strong>
						</span>
					</Link>
				</div>
				<div className="header__item">
					<Link to="/series" className="link">
						<i className="fa fa-link menuIcon ml-2" />
						<span className="d-none d-xl-inline">
							<strong>
								<FormattedMessage id="header.series" />
							</strong>
						</span>
					</Link>
				</div>
				{this.renderCategories()}
				<div className="header__search">
					<SearchBox />
				</div>
				<div className="header__item header__item--profile">
					<ProfileMenu />
				</div>
			</div>
		);*/
	}
}

export default (connect(
	(state) => ({
		categories : state.apiReducers.categories,
		entry : state.apiReducers.entry
	}),
	dispatch => bindActionCreators({
		//toggleSidebar: toggleSidebar,
		//toggleSidebarCompact: toggleSidebarCompact
	}, dispatch)
)(Header));
