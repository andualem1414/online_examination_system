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
import { fetchAllExams, fetchExams } from 'store/reducers/exam';
import { fetchExamineeExams } from 'store/reducers/examineeExam';
import { filterData } from 'utils/utils';

const AdminPayments = () => {
  const payments = useSelector((state) => state.payment.payments);

  const dispatch = useDispatch();
  let [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    dispatch(fetchAllExams());
  }, []);

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
  };
  const chipColorSelector = (status) => {
    if (status === 'Conducted') {
      return 'success';
    } else if (status === 'Live') {
      return 'warning';
    } else {
      return 'primary';
    }
  };
  const headCells = [
    {
      id: 'exam.title',
      numeric: false,
      label: 'Title'
    },
    {
      id: 'examiner.full_name',
      numeric: false,
      label: 'Full Name'
    },

    {
      id: 'amount',
      numeric: false,
      label: 'Amount',
      chip: true,
      chipColor: chipColorSelector
    },
    {
      id: 'created_at',
      numeric: false,
      date: true,
      label: 'Date Created'
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
        {payments.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={filterData(payments, searchValue, 'amount')}
            title="Payments"
            handleRowClick={() => {}}
          />
        ) : (
          <Typography variant="h5" textAlign="center">
            Payment will show here!
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

export default AdminPayments;
