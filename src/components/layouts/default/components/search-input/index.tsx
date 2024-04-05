import React from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import { useStyles } from "./styles"

const SearchInput: React.FC = () => {
	const classes = useStyles()
  
  return (
    <Paper
      component="form"
      className={classes.container}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: '14px !important' }}
        placeholder='Pesquisar'
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchInput
