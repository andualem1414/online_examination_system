import React from 'react';

// custom component
import MainPaper from 'components/MainPaper';

// Material Ui
import { InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchField = (props) => {
  const { handleSearchOnChange } = props;
  return (
    <MainPaper component="form" sx={{ p: '2px 10px', display: 'flex', alignItems: 'center', height: '50px' }}>
      <InputBase onChange={handleSearchOnChange} sx={{ ml: 1, flex: 1 }} placeholder="Search..." />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </MainPaper>
  );
};

export default SearchField;
