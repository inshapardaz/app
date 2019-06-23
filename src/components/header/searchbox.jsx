import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../icon';

export default class SearchBox extends Component
{
	render ()
	{
		return (
			<form>
				<button type="submit">
					<Icon type="search" />
				</button>
				<input type="text" placeholder={<FormattedMessage id="header.search.placeholder" />} />
			</form>
		);
	}
}
