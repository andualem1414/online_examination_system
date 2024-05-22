import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom Components
import TableComponent from 'components/TableComponent';
import DetailsComponent from 'components/DetailsComponent';
import SearchField from 'components/SearchField';
import { useSnackbar } from 'notistack';
// Material Ui
import { Grid, Typography } from '@mui/material';

// Redux import
import { useSelector, useDispatch } from 'react-redux';
import { fetchExams } from 'store/reducers/exam';
import { fetchExamineeExams } from 'store/reducers/examineeExam';
import { filterData } from 'utils/utils';

import { deleteUser, fetchAllUsers } from 'store/reducers/user';
import Confirmation from 'components/modals/Confirmation';

const AdminUsers = () => {
  const users = useSelector((state) => state.user.users);
  let [searchValue, setSearchValue] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const [openConfimation, setOpenConfimation] = useState(false);
  const [deleteId, setdeleteId] = useState(null);

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
  };
  const Detailsdata = [
    {
      title: 'Users Details',
      descriptions: [
        {
          name: 'Number of exams',
          value: users.length
        },
        {
          name: 'Examiners',
          value: users.filter((user) => user.user_type === 'EXAMINER').length
        },
        {
          name: 'Examinees',
          value: users.filter((user) => user.user_type === 'EXAMINEE').length
        }
      ]
    }
  ];
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

  const handleRowClick = (event, id) => {
    setdeleteId(id);
    setOpenConfimation(true);
  };

  const handleConfimationClose = () => {
    setOpenConfimation(false);
  };
  const handleConfimationClick = () => {
    if (deleteId) {
      dispatch(deleteUser(deleteId)).then((data) => {
        if (data.type === 'user/deleteUser/fulfilled') {
          enqueueSnackbar('User Deleted', { variant: 'success' });
        } else {
          enqueueSnackbar('Failed to Delete User', { variant: 'error' });
        }
      });
    }
    setOpenConfimation(false);
  };
  return (
    <>
      <Confirmation
        openConfimation={openConfimation}
        handleConfimationClose={handleConfimationClose}
        handleConfimationClick={handleConfimationClick}
        warning="Are you sure you want to delete this user?"
        ConfirmButton="Delete User"
      />
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
              rows={filterData(users, searchValue, ['full_name'])}
              title="Users"
              handleRowClick={handleRowClick}
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
            <DetailsComponent data={Detailsdata} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminUsers;
