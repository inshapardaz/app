import React from 'react';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from '../header';
import Footer from '../footer';

const useStyles = () => makeStyles((theme) => ({
	root : {
		padding : theme.spaces(48)
	}
}));
const classes = useStyles();

export const fullWidthLayout  = (props) =>
{
    const { children } = props;
    return (
        <>
            <CssBaseline />
            <Header />
                <main className={classes.root}>
                    {children}
                </main>
            <Divider />
            <Footer />
        </>
    );
};
