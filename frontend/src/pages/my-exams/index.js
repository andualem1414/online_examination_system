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

const MyExam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.userDetails);
  const exams = useSelector((state) => state.exam.exams);
  const examineeExams = useSelector((state) => state.examineeExam.examineeExams);
  const [examineeExamsList, setExamineeExamsList] = useState([]);
  const loading = useSelector((state) => state.exam.loading);

  // const error = useSelector((state) => state.exam.error);

  const chipColorSelector = (status) => {
    if (status === 'Conducted') {
      return 'success';
    } else if (status === 'Live') {
      return 'warning';
    } else {
      return 'primary';
    }
  };

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
          value: 20
        },
        {
          name: 'Pass Mark',
          value: 10
        }
      ]
    },

    {
      title: 'Examinee Details',
      descriptions: [
        {
          name: 'Number of Examinee',
          value: 20
        }
      ]
    }
  ];

  const handleSearchOnChange = (e) => {
    console.log(e);
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
      <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
        <SearchField handleOnChange />
      </Grid>

      <Grid item xs={12} md={8} display="block" justifyContent="center">
        {loading ? (
          <div>Loading...</div>
        ) : exams.length > 0 || examineeExamsList.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={
              user.user_type === 'EXAMINEE'
                ? examineeExams.map((examineeExam) => examineeExam.exam)
                : exams
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
