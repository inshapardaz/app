/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import LocaleService from '../../services/LocaleService';

export default class LanguageSelector extends Component
{
    state = {
    	locale : LocaleService.getCurrentLanguage()
    };

    chooseLanguage ({ key })
    {
    	LocaleService.setCurrentLanguage(key);
    	location.reload();
    }

    render ()
    {
    	const { locale } = this.state;

    	const langMenu = (
    		<Menu className="menu" selectedKeys={[locale]} onClick={this.chooseLanguage}>
    			<Menu.Item key="en">
    				<span role="img" aria-label="English" className="mr-2">
                        EN
    				</span>
                    English
    			</Menu.Item>
    			<Menu.Item key="ur">
    				<span role="img" aria-label="Urdu" className="mr-2">
                        UR
    				</span>
                    Urdu
    			</Menu.Item>
    		</Menu>
    	);
    	return (
            <>
                <Dropdown overlay={langMenu} trigger={['click']} className="languageSelector">
                	<div className="dropdown">
                		<strong className="text-uppercase">{locale}</strong>
                	</div>
                </Dropdown>
            </>
    	);
    }
}
