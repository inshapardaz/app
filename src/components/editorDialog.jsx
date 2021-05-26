import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogContent, AppBar, Slide, Toolbar, IconButton, Typography, Container } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: "relative",
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	}
}));

const EditorDialog = ({ show, busy, title, onCancelled, children, submitButton }) => {
	const classes = useStyles();

	return (
		<Dialog
			fullScreen
			open={show}
			onClose={() => onCancelled()}
			TransitionComponent={Transition}
			disableEscapeKeyDown={busy}
			disableBackdropClick={busy}
		>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={() => onCancelled()}
						disabled={busy}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						{title}
					</Typography>
				</Toolbar>
			</AppBar>
			<DialogContent>
				<Container maxWidth="lg">
					{children}
				</Container>
			</DialogContent>
		</Dialog >
	);
};

export default EditorDialog;
