import React, { Component } from 'react';
import { Link } from  'react-router-dom';
import { FormattedMessage } from 'react-intl';
import SearchBox from './searchbox.jsx';
import ProfileMenu from './profileMenu.jsx';

export default class Header extends Component
{
	render ()
	{
		return (
			<div className="header">
				<Link className="header__logo" to="/">
					<img src="/resources/images/logo.png" />
					<span className="header__text">
						<FormattedMessage id="app"/>
					</span>
				</Link>

				<div className="header__search">
					<SearchBox />
				</div>

				<div className="menu">
					<ul>
						<li>
							<Link to="/books"><FormattedMessage id="header.library"/></Link>
						</li>

						<li>
							<Link to="/authors"><FormattedMessage id="header.authors"/></Link>
						</li>

						<li>
							<Link to="/categories"><FormattedMessage id="header.categories"/></Link>
						</li>

						<li>
							<Link to="/series"><FormattedMessage id="header.series"/></Link>
						</li>
					</ul>
				</div>

				<div className="header__profile">
					<ProfileMenu />
				</div>
			</div>
		);
	}
}
