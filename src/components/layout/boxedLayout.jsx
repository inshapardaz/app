import React from 'react';
import Divider from '@material-ui/core/Divider';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Header from '../header';
import Footer from '../footer';


export const boxedLayout = (props) =>
{
	const { children } = props;
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
