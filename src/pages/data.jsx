import React from 'react';
import { useSelector } from 'react-redux'
import Typography from '@mui/material/Typography';

const DataPage = () => {
    const user = useSelector((state) => state.accountReducer.user);

    return (
        <>
            <h1>Data</h1>
            
            <br/>
            <Typography variant="h4" gutterBottom component="div">
                Welcome { user.name }
            </Typography>
        </>
    )
};

export default DataPage;