import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// redux
import { useDispatch, useSelector } from 'react-redux';

// Material Ui
import { Grid, Stack, Typography, Chip } from '@mui/material';
import MainPaper from 'components/MainPaper';
import { fetchExamineeExamDetails } from 'store/reducers/examineeExam';
import { fetchSpecificExamineeAnswers } from 'store/reducers/examineeAnswer';

// Custom Components
import TableComponent from 'components/TableComponent';
import SearchField from 'components/SearchField';

const ExamineeResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const examineeExamId = localStorage.getItem('examineeAnswerId');
  const examineeExamDetails = useSelector((state) => state.examineeExam.examineeExamDetails);
  const answersForSpecificExaminee = useSelector(
    (state) => state.examineeAnswer.answersForSpecificExaminee
  );

  useEffect(() => {
    dispatch(fetchExamineeExamDetails(examineeExamId)).then((data) => {
      if (data.type === 'examineeExam/ExamineeExamDetails/fulfilled') {
        dispatch(
          fetchSpecificExamineeAnswers({
            examId: examineeExamDetails?.exam?.id,
            userId: examineeExamDetails?.examinee?.id
          })
        );
      }
    });
  }, []);

  const chipColorSelector = (num) => {
    if (num === 0) {
      return 'error';
    } else {
      return 'success';
    }
  };

  const headCells = [
    {
      id: 'question.question',
      numeric: false,
      label: 'Question'
    },
    {
      id: 'result',
      numeric: false,
      label: 'Result',
      chip: true,
      chipColor: chipColorSelector
    },
    {
      id: 'question.type',
      numeric: false,
      label: 'Type'
    }
  ];

  const handleRowClick = (e, id) => {
    localStorage.setItem('examineeAnswerId', id);
    navigate('/my-exams/exam-details/examinee-result/question-details');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <MainPaper sx={{ p: 4 }}>
          <Grid item container xs={12}>
            <Grid item xs={10}>
              {examineeExamDetails?.examinee?.username}
            </Grid>
            <Grid item xs={2}>
              <Stack direction="row">
                <Typography variant="h5" sx={{ mr: 5.4 }}>
                  Result:
                </Typography>
                <Stack direction="column" sx={{ mr: 6 }}>
                  <Chip
                    color="success"
                    variant="light"
                    label={<Typography variant="h5">9/10{examineeExamDetails.score}</Typography>}
                  />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </MainPaper>
      </Grid>
      <Grid item xs={12} md={8}>
        {console.log(answersForSpecificExaminee)}
        <TableComponent
          headCells={headCells}
          rows={answersForSpecificExaminee}
          title="Question"
          handleRowClick={handleRowClick}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
          <SearchField handleOnChange={() => {}} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ExamineeResult;
