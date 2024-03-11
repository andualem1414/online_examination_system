import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid, Typography } from '@mui/material';

// Custom Components
import TableComponent from 'components/TableComponent';
import DetailsComponent from 'components/DetailsComponent';
import SearchField from 'components/SearchField';

// Redux import
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublicExams } from 'store/reducers/exam';
import { filterData } from 'utils/utils';

const PublicExam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const exams = useSelector((state) => state.exam.exams);
  const loading = useSelector((state) => state.exam.loading);

  let [searchValue, setSearchValue] = useState('');

  const chipColorSelector = (status) => {
    return 'primary';
  };
  useEffect(() => {
    dispatch(fetchPublicExams());
  }, []);
  /*
  headCells should contain the following
  id: name of the cell
  numeric: type of the cell if it is numeric
  chip if it is a chip
  chip color for the changing the chip color
  */

  const headCells = [
    {
      id: 'title',
      numeric: false,
      label: 'Title'
    },
    {
      id: 'description',
      numeric: false,
      label: 'Description'
    },
    {
      id: 'created_at',
      numeric: false,
      date: true,
      label: 'Date Created',
      chip: true,
      chipColor: chipColorSelector
    }
  ];
  const Detailsdata = [
    {
      title: 'Exam Details',
      descriptions: [
        {
          name: 'Number of exams',
          value: exams.length
        },
        {
          name: 'New',
          value: exams.length / 2
        },
        {
          name: 'This Year',
          value: exams.length
        }
      ]
    }
  ];

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
  };
  const handleRowClick = (event, id) => {
    localStorage.setItem('examId', id);

    navigate('/public-exams/public-exam-details');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
        <SearchField handleOnChange />
      </Grid>
      {console.log(exams)}
      <Grid item xs={12} md={8} display="block" justifyContent="center">
        {loading ? (
          <div>Loading...</div>
        ) : exams.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={filterData(exams, searchValue, 'title')}
            title="Exams"
            handleRowClick={handleRowClick}
          />
        ) : (
          <Typography variant="h5" textAlign="center">
            There are no Public exams Yet!
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} md={4} container spacing={2} direction="column">
        <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
          <SearchField handleSearchOnChange={handleSearchOnChange} />
        </Grid>
        <Grid item>
          <DetailsComponent data={Detailsdata} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PublicExam;
