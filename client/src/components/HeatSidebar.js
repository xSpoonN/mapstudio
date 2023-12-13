import { useEffect, useState, useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { Button, TextField, ClickAwayListener,  Divider, Box, Typography} from '@mui/material';


export default function HeatMapSidebar({ mapData}) {


    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            <Typography variant="h6" style={{ margin: '10px' }}>{'Heat Map'}</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
           
        </Box>
    );
}