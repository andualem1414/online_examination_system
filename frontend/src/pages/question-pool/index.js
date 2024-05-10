import { React, useEffect, useState } from 'react';

import { Switch, Dropdown } from 'antd';
import { Grid, Typography, Button, Stack, Divider, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Custom Components
import TableComponent from 'components/TableComponent';
import DetailsComponent from 'components/DetailsComponent';
import SearchField from 'components/SearchField';
import MainPaper from 'components/MainPaper';

// Redux import
import { useSelector, useDispatch } from 'react-redux';
import { filterData } from 'utils/utils';
import { fetchQuestionDetails, fetchQuestionPool } from 'store/reducers/question';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const QuestionPool = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.userDetails);
  const questionPool = useSelector((state) => state.question.questionPool);
  const loading = useSelector((state) => state.question.loading);

  useEffect(() => {
    dispatch(fetchQuestionPool());
  }, []);
  let [searchValue, setSearchValue] = useState('');

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
  };

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
      id: 'description',
      numeric: false,
      label: 'Description'
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

  const handleRowClick = (event, id) => {
    dispatch(fetchQuestionDetails(id)).then((data) => {
      if (data.type === 'question/questionDetails/fulfilled') {
        console.log(data?.payload);
        localStorage.setItem('examId', data?.payload?.exam);
        const questionType = data.payload.type;
        navigate('/my-exams/exam-details/add-question', {
          state: { questionId: id, questionType: questionType }
        });
      }
    });
  };
  const handleButtonClick = (buttonName) => {
    localStorage.removeItem('examId');
    navigate('/my-exams/exam-details/add-question', { state: { questionType: buttonName } });
  };

  const items = [
    {
      key: '1',
      label: <Typography onClick={(e) => handleButtonClick('CHOICE')}>Choice</Typography>
    },

    {
      key: '2',
      label: <Typography onClick={(e) => handleButtonClick('TRUE_FALSE')}>True/False</Typography>
    },

    {
      key: '3',
      label: (
        <Typography onClick={(e) => handleButtonClick('SHORT_ANSWER')}>Short Answer</Typography>
      )
    }
  ];

  return (
    <Grid container spacing={2}>
      {/* Search for mobile devices */}
      <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
        <SearchField handleOnChange />
      </Grid>
      {/* Exam List */}
      {console.log(questionPool)}
      <Grid item xs={12} md={8} display="block" justifyContent="center">
        {loading ? (
          <div>Loading...</div>
        ) : questionPool?.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={filterData(questionPool, searchValue, ['title'])}
            title="Exams"
            handleRowClick={handleRowClick}
          />
        ) : (
          <Typography variant="h5" textAlign="center">
            Questions you Create will show here!
          </Typography>
        )}
      </Grid>
      {/* Exam Details */}
      <Grid item xs={12} md={4} container spacing={2} direction="column">
        <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
          <SearchField handleSearchOnChange={handleSearchOnChange} />
        </Grid>
        <Grid item>
          <MainPaper
            component="div"
            sx={{ display: 'flex', overflow: 'auto', p: 4, height: '370px' }}
          >
            <Stack direction="column" flex={1} justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Question Details
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Stack
                  sx={{ pl: 2, mt: 1.5 }}
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>Number of questions</Typography>
                  <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                    <Chip label={questionPool.length} variant="light" color="primary" />
                  </Typography>
                </Stack>
                <Stack
                  sx={{ pl: 2, mt: 1.5 }}
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>Number of True/False</Typography>
                  <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                    <Chip
                      label={questionPool.filter((e) => e.type === 'TRUE_FALSE').length}
                      variant="light"
                      color="primary"
                    />
                  </Typography>
                </Stack>
                <Stack
                  sx={{ pl: 2, mt: 1.5 }}
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>Number of Choice</Typography>
                  <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                    <Chip
                      label={questionPool.filter((e) => e.type === 'CHOICE').length}
                      variant="light"
                      color="primary"
                    />
                  </Typography>
                </Stack>
                <Stack
                  sx={{ pl: 2, mt: 1.5 }}
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>Number of Short Answers</Typography>
                  <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                    <Chip
                      label={questionPool.filter((e) => e.type === 'SHORT_ANSWER').length}
                      variant="light"
                      color="primary"
                    />
                  </Typography>
                </Stack>
              </Box>
              <Dropdown menu={{ items }} placement="bottom">
                <Button variant="contained" color="success" startIcon={<ExpandMoreIcon />}>
                  Add Question
                </Button>
              </Dropdown>
            </Stack>
          </MainPaper>

          {/* <DetailsComponent data={Detailsdata} /> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QuestionPool;
