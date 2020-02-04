import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import NewBookWidget from '../books/newbookswidget/newbookwidget.jsx';

export default class Home extends Component
{
	render ()
	{
		return (
			<>
				<div className="container">
					<div className="home">
						<div className="contentbox">
							<h3><FormattedMessage id="app"/></h3>
							<h2><FormattedMessage id="slogan" /></h2>
							<p><FormattedMessage id="home.message" /></p>
							<a className="shopbtn" href="#"><FormattedMessage id="home.getStarted" /></a>
						</div>
					</div>
				</div>
				<NewBookWidget />
			</>
		);
	}
}
