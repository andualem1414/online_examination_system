import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// redux
import { useDispatch, useSelector } from 'react-redux';

// Material Ui
import { Grid, Stack, Typography, Chip, Avatar } from '@mui/material';
import MainPaper from 'components/MainPaper';
import { fetchExamineeExamDetails } from 'store/reducers/examineeExam';
import { fetchSpecificExamineeAnswers } from 'store/reducers/examineeAnswer';

// Custom Components
import TableComponent from 'components/TableComponent';
import SearchField from 'components/SearchField';
import DetailsComponent from 'components/DetailsComponent';

const ExamineeResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const examineeExamId = localStorage.getItem('examineeExamId');
  const examineeExamDetails = useSelector((state) => state.examineeExam.examineeExamDetails);
  const answersForSpecificExaminee = useSelector(
    (state) => state.examineeAnswer.answersForSpecificExaminee
  );

  useEffect(() => {
    dispatch(fetchExamineeExamDetails(examineeExamId)).then((data) => {
      if (data.type === 'examineeExam/ExamineeExamDetails/fulfilled') {
        console.log(data, examineeExamId);

        dispatch(
          fetchSpecificExamineeAnswers({
            examId: data?.payload?.exam?.id,
            userId: data?.payload?.examinee?.id
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

  const Detailsdata = [
    {
      title: 'Examinee Details',
      descriptions: [
        {
          name: 'Total Questions',
          value: examineeExamDetails?.exam?.questions_count
        },
        {
          name: 'Total Flags',
          value: examineeExamDetails?.flags
        }
      ]
    }
  ];
  const handleRowClick = (e, id) => {
    localStorage.setItem('examineeAnswerId', id);
    navigate('/my-exams/exam-details/examinee-result/question-details');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <MainPaper sx={{ p: 3 }}>
          <Grid item container xs={12}>
            <Grid item xs={6} md={10} sx={{ px: 1 }}>
              {console.log(examineeExamDetails?.examinee?.profile_picture)}
              <Stack direction="row" display="flex" alignItems="center" spacing={2}>
                {examineeExamDetails?.examinee?.profile_picture ? (
                  <Avatar
                    alt="profile user"
                    src={examineeExamDetails?.examinee?.profile_picture}
                    sx={{ width: 62, height: 62 }}
                  />
                ) : (
                  <Avatar alt="profile user" sx={{ width: 62, height: 62 }} />
                )}
                <Typography variant="h5">{examineeExamDetails?.examinee?.full_name}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2} display="flex" alignItems="center" justifyContent="flex-end">
              <Stack direction="row" display="flex" alignItems="center">
                <Typography variant="h5" sx={{ mr: 2 }}>
                  Result:
                </Typography>
                <Stack direction="column" sx={{ mr: 6 }}>
                  <Chip
                    color="success"
                    variant="light"
                    label={
                      <Typography variant="h3">
                        {examineeExamDetails.score} / {examineeExamDetails?.exam?.total_mark}
                      </Typography>
                    }
                  />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </MainPaper>
      </Grid>
      <Grid item xs={12} md={8}>
        {console.log(answersForSpecificExaminee)}
        {answersForSpecificExaminee.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={answersForSpecificExaminee}
            title="Question"
            handleRowClick={handleRowClick}
          />
        ) : (
          <Typography variant="h5" textAlign="center">
            Question List will be avilable after exam
          </Typography>
        )}
      </Grid>
      <Grid item container xs={12} md={4} spacing={1}>
        <Grid item xs={12} sx={{ display: { xs: 'none', md: 'block' } }}>
          <SearchField handleOnChange={() => {}} />
        </Grid>
        <Grid item xs={12}>
          <DetailsComponent data={Detailsdata} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ExamineeResult;
