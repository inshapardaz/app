import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { getSeries } from '../../state/actions/apiActions';

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
		bullet : {
			display : 'inline-block',
			margin : '0 2px',
			transform : 'scale(0.8)'
		},
		title : {
			fontSize : 14
		},
		pos : {
			marginBottom : 12
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
				<Container className={classes.cardGrid} maxWidth="md">
					<Grid container spacing={4}>
						{this.props.series.data.map(s =>
							<Card key={s.id} className={classes.root}>
								<CardContent>
									<Typography variant="h5" component="h2">
										{s.name}
									</Typography>
									<Typography variant="body2" component="p">
										{s.description}
									</Typography>
								</CardContent>
							</Card>)}
					</Grid>
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
