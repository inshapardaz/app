import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, FormattedMessage } from 'react-intl';

import { getLatestBooks } from '../../../state/actions/apiActions';
import BookCell from '../bookCell.jsx';
import Section from '../../ui/section.jsx';

class NewBookWidget extends Component
{
	state = {
		isLoading : true,
		isError : false
	};

	async componentDidMount ()
	{
		try
		{
			await this.props.getLatestBooks();
			this.setState({
				isLoading : false,
				isError : false
			});
		}
		catch (e)
		{
			console.error(e);
			this.setState({
				isLoading : false,
				isError : true
			});
		}
	}

	useStyles = () => makeStyles((theme) => ({
		cardGrid : {
		  paddingTop : theme.spacing(8),
		  paddingBottom : theme.spacing(8)
		}
	}));

	render ()
	{
		if (!this.props.latestBooks)
		{
			return null;
		}

		const classes = this.useStyles();
		return (<>
			<Container className={classes.cardGrid} maxWidth="md">
				<Grid container spacing={4}>
					{this.props.latestBooks.data.map((b) => (
						<Grid item key={b.id} xs={12} sm={6} md={4}>
							<BookCell book={b} key={b.id}/>
						</Grid>
					))}
				</Grid>
			</Container>
		</>);
	}
}

export default (connect(
	(state) => ({
		entry : state.apiReducers.entry,
		latestBooks : state.apiReducers.latestBooks
	}),
	dispatch => bindActionCreators({
		getLatestBooks
	}, dispatch)
)(injectIntl(NewBookWidget)));
