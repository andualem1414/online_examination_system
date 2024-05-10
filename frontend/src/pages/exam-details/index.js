import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import { Grid, Typography, Button } from '@mui/material';

// custom Components
import HeaderDetailsComponent from 'pages/exam-details/HeaderDetailsComponent';
import TableComponent from 'components/TableComponent';
import SearchField from 'components/SearchField';
import DetailsComponent from 'components/DetailsComponent';

// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import question, { fetchQuestions, fetchQuestionDetails } from 'store/reducers/question';
import { fetchExamDetails } from 'store/reducers/exam';
import {
  fetchExamineeExamDetails,
  fetchExamineesForSpecificExams
} from 'store/reducers/examineeExam';
import { fetchExamineeAnswers } from 'store/reducers/examineeAnswer';

import { filterData, secondsToHMS } from 'utils/utils';
import { generateWordDocument } from 'utils/wordCreator';
import { excelCreator } from 'utils/excelCreator';
import QuestionPoolModal from 'components/modals/QuestionPoolModal';

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
  const questionDetails = useSelector((state) => state.question.questionDetails);

  const loading = useSelector((state) => state.question.loading);

  // Examinee
  const examineeExamDetails = useSelector((state) => state.examineeExam.examineeExamDetails);
  const examineesForSpecificExams = useSelector(
    (state) => state.examineeExam.examineesForSpecificExams
  );
  const examineeAnswers = useSelector((state) => state.examineeAnswer.examineeAnswers);

  const [questionPoolSelectorModal, setQuestionPoolSelectorModal] = useState(false);
  const startTime = new Date(examDetails.start_time);
  const endTime = new Date(examDetails.end_time);
  const [currentTime] = useState(new Date());

  const [buttonName, setButtonName] = useState({ name: 'Add Question', disabled: false });
  let [searchValue, setSearchValue] = useState('');

  const handleClose = () => {
    setQuestionPoolSelectorModal(false);
  };
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
      dispatch(fetchQuestions(examDetails?.id));
    }
    if (user.user_type === 'EXAMINEE') {
      dispatch(fetchExamineeAnswers(examineeExamDetails.exam?.id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examDetails, examineeExamDetails]);

  const chipColorSelector = (type) => {
    if (type === 'SHORT_ANSWER') {
      return 'success';
    } else if (type === 'CHOICE') {
      return 'warning';
    } else {
      return 'primary';
    }
  };

  const flagsChipColorSelector = (type) => {
    if (type === 0) {
      return 'success';
    } else {
      return 'primary';
    }
  };

  const scoreChipColorSelector = (type) => {
    if (type === 0) {
      return 'error';
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
      label: 'Type',
      chip: true,
      chipColor: chipColorSelector
    },
    {
      id: 'point',
      numeric: true,
      label: 'Point'
    }
  ];

  const headCellsForExamineeAnswer = [
    {
      id: 'question.question',
      numeric: false,
      label: 'Question'
    },
    {
      id: 'question.type',
      numeric: false,
      label: 'Type',
      chip: true,
      chipColor: chipColorSelector
    },
    {
      id: 'question.point',
      numeric: true,
      label: 'Point'
    },
    {
      id: 'result',
      numeric: true,
      label: 'Result',
      chip: true,
      chipColor: scoreChipColorSelector
    }
  ];

  const headCellsForExaminees = [
    {
      id: 'examinee.full_name',
      numeric: false,
      label: 'Student'
    },
    {
      id: 'flags',
      numeric: true,
      label: 'Flags',
      chip: true,
      chipColor: flagsChipColorSelector
    },
    {
      id: 'score',
      numeric: true,
      label: 'Scores',
      chip: true,
      chipColor: scoreChipColorSelector
    },

    {
      id: 'total_time',
      numeric: true,
      label: 'Total Time'
    }
  ];

  // Change to either Questions or Results
  const handleButtonClick = (buttonName) => {
    if (['CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'].includes(buttonName)) {
      // Add Question based on the Type of Question
      navigate('/my-exams/exam-details/add-question', { state: { questionType: buttonName } });
    } else if (buttonName === 'Questions') {
      if (startTime.getTime() < currentTime.getTime()) {
        setButtonName({ name: 'Results', disabled: true });

        // If exam is Conducted
        if (endTime.getTime() < currentTime.getTime()) {
          setButtonName({ name: 'Results', disabled: false });
        }
      } else {
        setButtonName({ name: 'Add Question', disabled: false });
      }
    } else {
      dispatch(fetchExamineesForSpecificExams(examId)).then((data) => {
        console.log(data);
      });
      setButtonName({ name: 'Questions', disabled: false });
    }
  };

  // Handle Search form
  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
    console.log(e.target.value);
  };

  // For every Questions
  const handleRowClick = (event, id) => {
    if (user.user_type === 'EXAMINER') {
      if (buttonName.name === 'Questions') {
        localStorage.setItem('examineeExamId', id);
        navigate('/my-exams/exam-details/examinee-result');
      } else {
        dispatch(fetchQuestionDetails(id)).then((data) => {
          if (data.type === 'question/questionDetails/fulfilled') {
            const questionType = data.payload.type;
            navigate('/my-exams/exam-details/add-question', {
              state: { questionId: id, questionType: questionType }
            });
          }
        });
      }
    } else {
      localStorage.setItem('examineeAnswerId', id);
      navigate('/my-exams/exam-details/question-details');
    }
  };

  const download = (event) => {
    generateWordDocument(event, questions, examDetails);
  };
  const examineeListDownload = (event) => {
    excelCreator(event, examineesForSpecificExams);
  };

  const Detailsdata = [
    {
      title: 'Exam Details',
      descriptions: [
        {
          name: examDetails.status === 'Live' ? 'Remaining Time' : 'Duration',
          value:
            user.user_type === 'EXAMINER'
              ? secondsToHMS(examDetails.duration)
              : secondsToHMS(examineeExamDetails?.exam?.duration)
        },
        {
          name: 'End Time',
          value:
            user.user_type === 'EXAMINER'
              ? endTime.toLocaleTimeString()
              : new Date(examineeExamDetails?.exam?.end_time).toLocaleTimeString()
        },
        {
          name: 'Number of Questions',
          value: user.user_type === 'EXAMINER' ? questions.length : examineeAnswers.length
        },
        {
          name: 'Total Marks',
          value:
            user.user_type === 'EXAMINER'
              ? examDetails.total_mark
              : examineeExamDetails?.exam?.total_mark
        }
      ]
    }
  ];

  if (user.user_type === 'EXAMINER') {
    Detailsdata.push({
      title: 'Examinee Details',
      descriptions: [
        {
          name: 'Number of Joined Examinees ',
          value: examineesForSpecificExams.length
        }
      ]
    });
  }

  return (
    <>
      <QuestionPoolModal open={questionPoolSelectorModal} handleClose={handleClose} />
      <Grid container spacing={2}>
        {/* Header Details */}
        <Grid item xs={12}>
          {((user.user_type === 'EXAMINEE' && examineeExamDetails?.exam) ||
            (user.user_type === 'EXAMINER' && examDetails?.id)) && (
            <HeaderDetailsComponent
              examDetails={user.user_type === 'EXAMINER' ? examDetails : examineeExamDetails.exam}
              examineeExamDetails={examineeExamDetails}
              buttonName={user.user_type === 'EXAMINER' && buttonName}
              handleButtonClick={handleButtonClick}
              setQuestionPoolSelectorModal={setQuestionPoolSelectorModal}
            />
          )}
        </Grid>

        {/* Question List */}
        {user.user_type === 'EXAMINER' ? (
          <Grid item xs={12} md={8} display="block" justifyContent="center">
            {loading ? (
              <div>Loading...</div>
            ) : buttonName.name === 'Questions' ? (
              examineesForSpecificExams.length > 0 ? (
                <TableComponent
                  headCells={headCellsForExaminees}
                  rows={filterData(examineesForSpecificExams, searchValue, ['full_name'])}
                  title="Examinees"
                  handleRowClick={handleRowClick}
                  download={examineeListDownload}
                />
              ) : (
                <Typography variant="h5" textAlign="center">
                  Examinees joined your exam will be listed here!
                </Typography>
              )
            ) : questions.length > 0 ? (
              <TableComponent
                headCells={headCells}
                rows={filterData(questions, searchValue, ['question'])}
                title="Questions"
                handleRowClick={handleRowClick}
                download={user.user_type === 'EXAMINER' && download}
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
            ) : examineeAnswers.length > 0 &&
              examineeExamDetails?.id &&
              examineeExamDetails?.exam?.status === 'Conducted' ? (
              <TableComponent
                headCells={headCellsForExamineeAnswer}
                rows={examineeAnswers}
                title="Answers"
                handleRowClick={handleRowClick}
              />
            ) : examineeExamDetails?.id && examineeExamDetails?.exam?.status === 'Conducted' ? (
              <Typography variant="h5" textAlign="center">
                No Answers available for this Exam
              </Typography>
            ) : (
              <Typography variant="h5" textAlign="center">
                Question Results will be avilable after Exam
              </Typography>
            )}
          </Grid>
        )}

        {/* Search and Detail */}
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

export default ExamDetails;
