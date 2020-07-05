import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import SearchIcon from '@material-ui/icons/Search';
import NewBookWidget from '../books/newbookswidget/newbookwidget.jsx';

const useStyles = makeStyles((theme) => ({
	root : {
	  padding : '2px 4px',
	  display : 'flex',
	  alignItems : 'center',
	  width : 400
	},
	home : {
		backgroundImage : 'url(/resources/images/home_background.jpg)',
		backgroundRepeat : 'no-repeat',
		backgroundSize : 'cover',
		backgroundPosition : 'center center',
		//backgroundColor : 'antiquewhite',
		minHeight : '600px'

	},
	contentBox : {
		height : 500,
		padding : '10px 0'
	},
	input : {
	  marginLeft : theme.spacing(1),
	  flex : 1
	},
	iconButton : {
	  padding : 10
	},
	divider : {
	  height : 28,
	  margin : 4
	},
	startButton : {
		marginTop : 16,
		marginBottom : 16,
		maxWidth : 400
	},
	container : {
		padding : '28px 0'
	}

}));

function Home (props)
{
	const classes = useStyles();

	return (
			<>
				<div className={classes.home}>
					<div className={classes.container}>
						<Container maxWidth="sm">
							<Typography variant="h3" align="center" gutterBottom><FormattedMessage id="app"/></Typography>
							<Typography variant="h2" align="center" gutterBottom><FormattedMessage id="slogan" /></Typography>
							<Typography variant="body1" align="center" gutterBottom><FormattedMessage id="home.message" /></Typography>
							<Button variant="contained"
								align="center"
								color="primary"
								size="large"
								fullWidth
								className={classes.startButton}
								component={Link} to="/books">
								<FormattedMessage id="home.getStarted" />
							</Button>

							<Paper component="form" align="center" className={classes.root}>
								<InputBase
									className={classes.input}
									placeholder={props.intl.formatMessage({ id : 'header.search.placeholder' })}
									inputProps={{ 'aria-label' : 'search' }}
								/>
								<Divider className={classes.divider} orientation="vertical" />
								<IconButton type="submit" className={classes.iconButton} aria-label="search">
									<SearchIcon />
								</IconButton>
							</Paper>

						</Container>
					</div>
				</div>
				<div className={classes.container}>
					<Typography variant="h3" align="center" gutterBottom>
						<FormattedMessage id="home.latestBooks" />
					</Typography>
					<NewBookWidget />
				</div>
			</>
	);
}

export default injectIntl(Home);
