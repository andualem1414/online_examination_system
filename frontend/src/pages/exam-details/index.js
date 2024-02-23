import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import { Grid, Typography } from '@mui/material';

// custom Components
import HeaderDetailsComponent from 'pages/exam-details/HeaderDetailsComponent';
import TableComponent from 'components/TableComponent';
import SearchField from 'components/SearchField';

// Redux Imports
import { fetchQuestions, fetchQuestionDetails } from 'store/reducers/question';
import { fetchExamDetails } from 'store/reducers/exam';
import { fetchExamineeExamDetails } from 'store/reducers/examineeExam';
import { fetchExamineeAnswers } from 'store/reducers/examineeAnswer';
import { useSelector, useDispatch } from 'react-redux';

const ExamDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User
  const user = useSelector((state) => state.user.userDetails);

  const examId = localStorage.getItem('examId');
  const examineeExamId = localStorage.getItem('examineeExamId');

  // Examiner
  const examDetails = useSelector((state) => state.exam.examDetails);
  const questions = useSelector((state) => state.question.questions);
  const loading = useSelector((state) => state.question.loading);

  // Examinee
  const examineeExamDetails = useSelector((state) => state.examineeExam.examineeExamDetails);
  // const examineeAnswers = useSelector((state) => state.examineeAnswer.examineeAnswers);
  const [examineeAnswersList, setExamineeAnswersList] = useState([]);

  const startTime = new Date(examDetails.start_time);
  const endTime = new Date(examDetails.end_time);
  const [currentTime] = useState(new Date());

  const [buttonName, setButtonName] = useState({ name: 'Add Question', disabled: false });

  // Fetch exams and Examinee Exam
  useEffect(() => {
    if (user.user_type === 'EXAMINER') {
      dispatch(fetchExamDetails(examId));
    }
    if (user.user_type === 'EXAMINEE') {
      dispatch(fetchExamineeExamDetails(examineeExamId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // For Updating the Button and For Fetching Questions or Examinee Answers
  useEffect(() => {
    if (startTime.getTime() < currentTime.getTime()) {
      setButtonName({ name: 'Results', disabled: true });

      // If exam is Conducted
      if (endTime.getTime() < currentTime.getTime()) {
        setButtonName({ name: 'Results', disabled: false });
      }
    } else {
      setButtonName({ name: 'Add Question', disabled: false });
    }

    // For Fetching Questions or Examinee Answers
    if (user.user_type === 'EXAMINER') {
      dispatch(fetchQuestions(examDetails.id));
    }
    if (user.user_type === 'EXAMINEE') {
      dispatch(fetchExamineeAnswers(examineeExamDetails.exam.id)).then((data) => {
        if (data.type === 'examineeAnswer/ExamineeAnswers/fulfilled') {
          let list = data.payload.map((answer) => {
            let question = { ...answer.question };
            question['result'] = answer.result;
            return question;
          });

          setExamineeAnswersList(list);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, examDetails, examineeExamDetails]);

  const chipColorSelector = (type) => {
    if (type === 'SHORT_ANSWER') {
      return 'success';
    } else if (type === 'CHOICE') {
      return 'warning';
    } else {
      return 'primary';
    }
  };

  const headCells = [
    {
      id: 'question',
      numeric: false,
      label: 'Question'
    },
    {
      id: 'type',
      numeric: false,
      label: 'Status',
      chip: true,
      chipColor: chipColorSelector
    },
    {
      id: 'point',
      numeric: true,
      label: 'Point'
    },
    user.user_type === 'EXAMINEE' && {
      id: 'result',
      numeric: true,
      label: 'Result'
    }
  ];

  // Change to either Questions or Results
  const handelButtonClick = (buttonName) => {
    if (['CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'].includes(buttonName)) {
      navigate('/my-exams/exam-details/add-question', { state: { questionType: buttonName } });
    } else if (buttonName === 'Question') {
      setButtonName({ name: 'Result', disabled: false });
    } else {
      setButtonName({ name: 'Question', disabled: false });
    }
  };

  // Handle Search form
  const handleSearchOnChange = (e) => {
    console.log(e);
  };

  // For every Questions
  const handleRowClick = (event, id) => {
    if (user.user_type === 'EXAMINER') {
      dispatch(fetchQuestionDetails(id)).then((data) => {
        if (data.type === 'question/questionDetails/fulfilled') {
          const questionType = data.payload.type;
          navigate('/my-exams/exam-details/add-question', {
            state: { questionId: id, questionType: questionType }
          });
        }
      });
    } else {
      // TODO
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* Header Details */}
        <Grid item xs={12}>
          {examineeExamDetails?.exam ||
            (examDetails?.id && (
              <HeaderDetailsComponent
                examDetails={user.user_type === 'EXAMINER' ? examDetails : examineeExamDetails.exam}
                examineeExamDetails={examineeExamDetails}
                buttonName={user.user_type === 'EXAMINER' && buttonName}
                handleButtonClick={handelButtonClick}
              />
            ))}
        </Grid>

        {/* Question List */}
        {user.user_type === 'EXAMINER' ? (
          <Grid item xs={12} md={8} display="block" justifyContent="center">
            {loading ? (
              <div>Loading...</div>
            ) : questions.length > 0 ? (
              <TableComponent
                headCells={headCells}
                rows={questions}
                title="Questions"
                handleRowClick={handleRowClick}
              />
            ) : (
              <Typography variant="h5" textAlign="center">
                Added Questions will be displayed here!
              </Typography>
            )}
          </Grid>
        ) : (
          <Grid item xs={12} md={8} display="block" justifyContent="center">
            {loading ? (
              <div>Loading...</div>
            ) : examineeAnswersList.length > 0 ? (
              <TableComponent
                headCells={headCells}
                rows={examineeAnswersList}
                title="Answers"
                handleRowClick={handleRowClick}
              />
            ) : examineeExamDetails.exam.status === 'Conducted' ? (
              <Typography variant="h5" textAlign="center">
                No Answers Available for this Exam
              </Typography>
            ) : (
              <Typography variant="h5" textAlign="center">
                Result will be avilable after Exam
              </Typography>
            )}
          </Grid>
        )}

        {/* Search and Detail */}
        <Grid item xs={12} md={4} container spacing={2} direction="column">
          <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
            <SearchField handleOnChange={handleSearchOnChange} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ExamDetails;
