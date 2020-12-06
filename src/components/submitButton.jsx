import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Backdrop, Button, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	}
}));


const SubmitButton = ({ busy, label }) => {
	const classes = useStyles();
	return (
		<Button
			type="submit"
			fullWidth
			variant="contained"
			color="primary"
			className={classes.submit}
			disabled={busy}
		>
			{label}

			<Backdrop className={classes.backdrop} open={busy}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</Button>
	);
};

export default SubmitButton;
