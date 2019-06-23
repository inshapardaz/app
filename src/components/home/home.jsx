import React, { Component } from 'react';
import { Button } from 'antd';

export default class Home extends Component
{
	render ()
	{
		return (
			<div className="home">
				Welcome to Home
				<Button>Press me</Button>
			</div>
		);
	}
}
