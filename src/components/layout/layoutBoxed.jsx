import React, { Component } from 'react';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { getEntry } from '../../state/actions/apiActions';
import Header from '../header/header.jsx';
import Footer from '../footer/footer.jsx';


class LayoutBoxed extends Component
{
	state = {
		isLoading : false
	};

	render ()
	{
		if (this.state.isLoading)
		{
			return null;
		}

		const { children } = this.props;
		return (
			<>
				<CssBaseline />
				<Header />
				<Container maxWidth="lg">
					{children}
				</Container>
				<Divider />
				<Footer />
			</>
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
)(LayoutBoxed));
