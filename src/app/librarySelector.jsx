import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import { FormattedMessage } from 'react-intl';
import Footer from '../components/footer';

import { libraryService } from '../services';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	}
}));

const LibrarySelectorPage = () => {
	const history = useHistory();
	const classes = useStyles();
	const [libraries, setLibraries] = useState([]);
	const [createLink, setCreateLink] = useState(null);
	useEffect(() => {
		libraryService.getLibraries()
			.then((response) => {
				setLibraries(response.data)
				if (response.links.create) {
					setCreateLink(response.links.create);
				}
			})
	}, []);

	const selectLibrary = (selectedLibrary) => {
		libraryService.setSelectedLibrary(selectedLibrary);
		history.push('/');
	}

	return (
		<Container component="main" maxWidth="xs">
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					<FormattedMessage id="library.select" />
				</Typography>
				{libraries && libraries.map(l => (
					<Card onClick={() => selectLibrary(l)}>
						<CardContent>
							<Typography variant="h5" component="h2">
								{l.name}
							</Typography>
						</CardContent>
					</Card>
				))}

				{createLink && <a href="/admin"><FormattedMessage id="admin.library.add" /></a>}
			</div>
			<Box mt={8}>
				<Footer />
			</Box>
		</Container>
	)
};

export default LibrarySelectorPage;
