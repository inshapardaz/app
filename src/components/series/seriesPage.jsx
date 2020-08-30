import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import { getSeries } from '../../state/actions/apiActions';
import SeriesCard from './SeriesCard.jsx';

class SeriesPage extends Component
{
	constructor (props)
	{
		super(props);
		this.state = {
			loading : true
		};
	}

	async componentDidMount ()
	{
		await this.props.getSeries();
		this.setState({ loading : false });
	}

	useStyles = () => makeStyles((theme) => ({
		root : {
			flexGrow : 1,
			backgroundColor : theme.palette.grey['A500'],
			overflow : 'hidden',
			backgroundPosition : '0 400px',
			marginTop : 20,
			padding : 20,
			paddingBottom : 200
		},
		cardGrid : {
			paddingTop : theme.spacing(8),
			paddingBottom : theme.spacing(8)
		}
	}));

	render ()
	{
		if (this.state.loading)
		{
			return (<>loading</>);
		}
		const classes = this.useStyles();

		return (
			<div className={classes.root}>
				<Container className={classes.cardGrid} maxWidth="sm">
					<Typography variant="h3" className={classes.title}>
						<FormattedMessage id="header.series" />
					</Typography>
					<Grid container spacing={4}>
						{this.props.series.data.map(s =>
							<Grid item key={s.id} xs={12} sm={6} md={4}>
								<SeriesCard key={s.id}  series={s} />
							</Grid>)}
					</Grid>
					<Pagination count={this.props.pageCount} page={this.props.currentPageIndex} />
				</Container>
			</div>
		);
	}
}

export default (connect(
	(state) => ({
		series : state.apiReducers.series
	}),
	dispatch => bindActionCreators({
		getSeries
	}, dispatch)
)(SeriesPage));
