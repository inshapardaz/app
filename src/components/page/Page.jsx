import React                            from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IntlProvider } from 'react-intl';
import { push } from 'connected-react-router';
import { getEntry } from '../../state/actions/apiActions';

import Routes from '../Routes';
import AuthenticationService from '../../services/AuthenticationService';
import LocaleService from '../../services/LocaleService';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Page extends React.Component
{
	state = {
		isLoading : false,
		locale : null
	  };

	async componentDidMount ()
	{
		console.log('componentDidMount');
		if (localStorage.getItem('isLoggedIn') === 'true')
		{
		  AuthenticationService.renewSession();
		}

		this.setState({
		  isLoading : true
		});

		let locale = await LocaleService.initLocale();

		this.setState({
		  locale
		});

		try
		{
		  await this.props.getEntry();
		  this.setState({
				isLoading : false
		  });
		}
		catch (e)
		{
		  console.error('error', e);
		  this.props.push('/error');
		}

		this.setState({
		  isLoading : false
		});
	  }

	render ()
	{
		const { isLoading, locale } = this.state;
		if (isLoading)
		{
			return null;
		}

		return (
			<IntlProvider locale={locale.locale} messages={locale.messages}>
				<Routes />
			</IntlProvider>
		);
	}
}

export default (connect(
	(state) => ({
	  history : state.history,
	  entry : state.entry,
	  isLoading : state.isLoading
	}),
	dispatch => bindActionCreators({
	  getEntry,
	  push
	}, dispatch)
)(Page));

