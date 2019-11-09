/* eslint-disable no-script-url */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown, Avatar } from 'antd';
import { useAuth0 } from '../../react-auth0-spa';

const ProfileMenu = () =>
{
	const { loading, user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

	const displayName = user ? user.name : '';

	if (loading)
	{
		return (<div>Loading...</div>);
	}

	const loginAction = isAuthenticated ?
		(<Menu.Item>
			<a href="javascript: void(0);" onClick={() => logout()}>
				<i className="fa fa-sign-out-alt menuIcon mr-2" />
				<FormattedMessage id="logout" />
			</a>
		</Menu.Item>)
		:
		(<Menu.Item>
			<a href="javascript:void(0);" onClick={() => loginWithRedirect({})}>
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
	const avatar = user && user.picture ?
		(<Avatar className="avatar" shape="square" size="large" src={user.picture} />) :
		(<Avatar className="avatar" shape="square" size="large" icon="user" />);

	return (
		<>
			<Dropdown overlay={menu} trigger={['click']} className="profileMenu">
				<div className="dropdown">
					{avatar}
				</div>
			</Dropdown>
		</>
	);
};

export default ProfileMenu;
