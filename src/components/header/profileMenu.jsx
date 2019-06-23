import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from '../icon';
import { login, logout, getProfile } from '../../state/actions/authActions';

class ProfileMenu extends Component
{
	state = {
		pressed : false
	};

	async componentWillMount ()
	{
		await this.props.getProfile();
	}

	toggleState ()
	{
		this.state(prevState =>
		{
			pressed : !prevState.pressed;
		});
	}

	render ()
	{
		const { pressed } = this.state;
		if (this.props.user)
		{
			return (<a onClick={this.toggleState} className={`profile__button${ pressed ? '--pressed' : '' }`}><FormattedMessage id="logout"/></a>);
			//onClick={this.props.logout}
		}
		else
		{
			return (<a onClick={this.toggleState} className={`profile__button${ pressed ? '--pressed' : '' }`}><Icon type="user" /></a>);
			//onClick={this.props.login}
		}
	}
}

export default connect(
	state => ({
		user : state.oidc.user
	}),
	dispatch => bindActionCreators({
		login,
		logout,
		getProfile
	}, dispatch)
)(ProfileMenu);
