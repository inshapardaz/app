import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
	banner: {
		backgroundImage: props => props.background ? `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${props.background}")` :
			'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("/images/series_background.jpg")',
		backgroundRepeat: 'no-repeat',
		backgroundColor: 'grey',
		backgroundSize: 'cover',
		minHeight: 75,
		padding: 200,
		margin: '0 auto'
	},
	bannerTitle: {
		textAlign: 'center',
		fontSize: 40,
		color: '#fff'
	},
	bannerAction: {
		textAlign: 'center',
		paddingTop: 20
	}
});

const SerieBanner = ({ title, subTitle, createLink, onCreate, background }) => {
	const classes = useStyles({ background });
	const renderSubTitle = () => {
		if (subTitle) {
			return <div className={classes.banner_subtitle}>{subTitle}</div>;
		}

		return null;
	};
	const renderAction = () => {
		if (createLink) {
			return (<div className={classes.bannerAction}>
				<Button variant="contained" color="primary" onClick={onCreate}>
					<FormattedMessage id="series.action.create" />
				</Button>
			</div>);
		}

		return null;
	};

	return (
		<div className={classes.banner}>
			<div className={classes.bannerTitle}>{title}</div>
			{renderSubTitle()}
			{renderAction()}
		</div>
	);
};

export default SerieBanner;
