/* eslint-disable react-hooks/exhaustive-deps */
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
import { filterData, olderThanWeek } from 'utils/utils';

const PublicExam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [searchValue, setSearchValue] = useState('');

  const exams = useSelector((state) => state.exam.exams);
  const loading = useSelector((state) => state.exam.loading);

  const chipColorSelector = (date) => {
    if (olderThanWeek(date)) {
      return 'success';
    } else {
      return 'primary';
    }
  };

  useEffect(() => {
    dispatch(fetchPublicExams());
  }, []);

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
      id: 'questions_count',
      numeric: true,
      label: 'Questions'
    },
    {
      id: 'created_at',
      numeric: true,
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
          value: exams.filter((exam) => olderThanWeek(exam.created_at)).length
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
      {/* Search for mobile device */}
      <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
        <SearchField handleOnChange />
      </Grid>

      {/* Table component */}
      <Grid item xs={12} md={8} display="block" justifyContent="center">
        {loading ? (
          <div>Loading...</div>
        ) : exams.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={filterData(exams, searchValue, ['title', 'description'])}
            title="Exams"
            handleRowClick={handleRowClick}
          />
        ) : (
          <Typography variant="h5" textAlign="center">
            There are no public exams yet!
          </Typography>
        )}
      </Grid>

      {/* Search and Details card */}
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
