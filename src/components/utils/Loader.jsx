import React from 'react';
import { CircularProgress } from '@mui/material';

const Loader = () => {
  return (
    <div className='loader'>
        <div>
            <CircularProgress style={{width : "100px",height:"100px"}} />
        </div>
    </div>
  )
}

export default Loader