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

const MyExam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.userDetails);
  const exams = useSelector((state) => state.exam.exams);
  const examineeExams = useSelector((state) => state.examineeExam.examineeExams);
  const loading = useSelector((state) => state.exam.loading);
  let [searchValue, setSearchValue] = useState('');

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
    if (user.user_type === 'EXAMINER') {
      dispatch(fetchExams());
    }

    if (user.user_type === 'EXAMINEE') {
      dispatch(fetchExamineeExams());
    }
  }, []);

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

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
  };

  // for every exams
  const handleRowClick = (event, id) => {
    if (user.user_type === 'EXAMINEE') {
      const examineeExam = examineeExams.find((examineeExam) => examineeExam.exam.id === id);

      localStorage.setItem('examineeExamId', examineeExam.id);
    } else {
      localStorage.setItem('examId', id);
    }
    navigate('/my-exams/exam-details');
  };

  return (
    <Grid container spacing={2}>
      {/* Search for mobile devices */}
      <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
        <SearchField handleOnChange />
      </Grid>
      {/* Exam List */}
      <Grid item xs={12} md={8} display="block" justifyContent="center">
        {loading ? (
          <div>Loading...</div>
        ) : exams.length > 0 || examineeExams.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={
              user.user_type === 'EXAMINEE'
                ? examineeExams.map((examineeExam) => examineeExam.exam)
                : filterData(exams, searchValue, 'title')
            }
            title="Exams"
            handleRowClick={handleRowClick}
          />
        ) : user.user_type === 'EXAMINEE' ? (
          <Typography variant="h5" textAlign="center">
            Exams you Join will show here!
          </Typography>
        ) : (
          <Typography variant="h5" textAlign="center">
            Exams you create will show here!
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

export default MyExam;
