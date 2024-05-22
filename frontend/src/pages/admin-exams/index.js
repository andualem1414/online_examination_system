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

import { fetchAllExams } from 'store/reducers/exam';

const AdminExams = () => {
  const exams = useSelector((state) => state.exam.exams);
  const Detailsdata = [
    {
      title: 'Exam Details',
      descriptions: [
        {
          name: 'Number of exams',
          value: exams.length
        },
        {
          name: 'Conducted',
          value: exams.filter((exam) => exam.status === 'Conducted').length
        },
        {
          name: 'Scheduled',
          value: exams.filter((exam) => exam.status === 'Scheduled').length
        },
        {
          name: 'Live',
          value: exams.filter((exam) => exam.status === 'Live').length
        }
      ]
    }
  ];
  const dispatch = useDispatch();
  let [searchValue, setSearchValue] = useState('');

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
      id: 'status',
      numeric: false,
      label: 'Status',
      chip: true,
      chipColor: chipColorSelector
    }
  ];

  useEffect(() => {
    dispatch(fetchAllExams());
  }, []);
  return (
    <Grid container spacing={2}>
      {/* Search for mobile devices */}
      <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
        <SearchField handleOnChange />
      </Grid>
      {/* Exam List */}
      <Grid item xs={12} md={8} display="block" justifyContent="center">
        {exams.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={filterData(exams, searchValue, ['title'])}
            title="Exams"
            handleRowClick={() => {}}
          />
        ) : (
          <Typography variant="h5" textAlign="center">
            Exams will show here!
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
  );
};

export default AdminExams;
