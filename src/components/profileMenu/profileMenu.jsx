/* eslint-disable no-script-url */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown, Avatar } from 'antd';
import { login, logout, getProfile } from '../../state/actions/authActions';

class ProfileMenu extends React.Component
{
	constructor (props)
	{
		super(props);
		this.state = {
			profile : {
				nickname : ''
			}
		};
	}

	async componentWillMount ()
	{
		console.log('this.props.user', this.props.user);
		if (this.props.user)
		{
			await this.props.getProfile();
		}
	}

	render ()
	{

		const { user } = this.props;
		const { profile } = this.state;

		const displayName = user && profile ? profile.nickname : '';

		const loginAction = user ?
			(<Menu.Item>
				<a href="javascript: void(0);" onClick={this.props.logout}>
					<i className="fa fa-sign-out-alt menuIcon mr-2" />
					<FormattedMessage id="logout" />
				</a>
			</Menu.Item>)
			:
			(<Menu.Item>
				<a href="javascript:void(0);" onClick={this.props.login}>
					<i className="fa fa-sign-in-alt menuIcon mr-2" />
					<FormattedMessage id="login" />
				</a>
			</Menu.Item>);

		const menu = (
			<Menu selectable={false}>
				<Menu.Item>
					<strong>
						<FormattedMessage id="welcome.user" values={{ user : displayName }} />
					</strong>
				</Menu.Item>
				<Menu.Divider />
				{loginAction}
			</Menu>
		);
		const avatar = profile.picture ?
			(<Avatar className="avatar" shape="square" size="large" src={profile.picture} />) :
			(<Avatar className="avatar" shape="square" size="large" icon="user" />);

		return (
            <>
                <Dropdown overlay={menu} trigger={['click']} onVisibleChange={this.addCount} className="profileMenu">
                	<div className="dropdown">
                		{avatar}
                	</div>
                </Dropdown>
            </>
		);
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
