import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom Components
import TableComponent from 'components/TableComponent';
import DetailsComponent from 'components/DetailsComponent';
import SearchField from 'components/SearchField';

// Material Ui
import { Grid, Typography } from '@mui/material';

// Redux import
import { useSelector, useDispatch } from 'react-redux';
import { fetchExams } from 'store/reducers/exam';
import { fetchExamineeExams } from 'store/reducers/examineeExam';
import { filterData } from 'utils/utils';

import { fetchAllUsers } from 'store/reducers/user';

const AdminUsers = () => {
  const users = useSelector((state) => state.user.users);
  let [searchValue, setSearchValue] = useState('');

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, []);

  const chipColorSelector = (status) => {
    if (status === 'EXAMINER') {
      return 'success';
    } else {
      return 'primary';
    }
  };

  const headCells = [
    {
      id: 'full_name',
      numeric: false,
      label: 'Full Name'
    },
    {
      id: 'description',
      numeric: false,
      label: 'Description'
    },
    {
      id: 'email',
      numeric: false,
      label: 'Email'
    },
    {
      id: 'user_type',
      numeric: false,
      label: 'User Type',
      chip: true,
      chipColor: chipColorSelector
    }
  ];

  return (
    <Grid container spacing={2}>
      {/* Search for mobile devices */}
      <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
        <SearchField handleOnChange />
      </Grid>
      {/* Exam List */}
      <Grid item xs={12} md={8} display="block" justifyContent="center">
        {users.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={filterData(users, searchValue, 'full_name')}
            title="Users"
            handleRowClick={() => {}}
          />
        ) : (
          <Typography variant="h5" textAlign="center">
            Users will show here!
          </Typography>
        )}
      </Grid>
      {/* Exam Details */}
      <Grid item xs={12} md={4} container spacing={2} direction="column">
        <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
          <SearchField handleSearchOnChange={handleSearchOnChange} />
        </Grid>
        <Grid item>
          <DetailsComponent data={[]} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminUsers;
