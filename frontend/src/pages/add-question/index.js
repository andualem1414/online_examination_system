import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createQuestion } from 'store/reducers/question';
import { useDispatch, useSelector } from 'react-redux';

// Material-UI
import {
  Button,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Select,
  MenuItem
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

// Third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { updateQuestion } from 'store/reducers/question';

// Custon Components
import AnimateButton from 'components/@extended/AnimateButton';
import MainPaper from 'components/MainPaper';
import TableComponent from 'components/TableComponent';
import DeleteQuestion from './DeleteQuestion';
import { fetchExamDetails } from 'store/reducers/exam';

const AddQuestion = () => {
  const examId = localStorage.getItem('examId');
  const questionDetails = useSelector((state) => state.question.questionDetails);
  const examDetails = useSelector((state) => state.exam.examDetails);

  const { questionType, questionId } = useLocation().state;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [choices, setChoices] = useState(questionId ? JSON.parse(questionDetails.choices) : []);
  const [inputValue, setInputValue] = React.useState('');

  // For Deleting Question
  let [deleteModal, setDeleteModal] = useState(false);
  let handleDeleteClose = () => setDeleteModal(false);
  let handleDeleteOpen = () => setDeleteModal(true);

  const initialValues = questionId
    ? {
        exam: examId,
        question: questionDetails.question,
        description: questionDetails.description,
        answer: questionDetails.answer,
        point: questionDetails.point,
        choices: JSON.parse(questionDetails.choices),
        type: questionDetails.type,
        submit: null
      }
    : {
        exam: examId,
        question: '',
        description: '',
        answer: questionType === 'TRUE_FALSE' ? 'True' : '',
        point: 0,
        choices: choices,
        type: questionType,
        submit: null
      };

  useEffect(() => {
    dispatch(fetchExamDetails(examId));
  }, []);

  const handleClick = () => {
    const asciiValue = 65 + choices.length;
    const char = String.fromCharCode(asciiValue);
    const data = {
      id: choices.length + 1,
      identifier: char,
      choice: inputValue
    };
    setChoices([...choices, data]);
  };

  const handleRowClick = (event, id) => {
    const newChoices = choices.filter((item) => item.id !== id);
    setChoices(newChoices);
  };

  const headCells = [
    {
      id: 'identifier',
      numeric: false,
      label: 'Identifier'
    },
    {
      id: 'choice',
      numeric: false,
      label: 'Choice'
    }
  ];

  return (
    <>
      <DeleteQuestion
        questionId={questionDetails.id}
        deleteModal={deleteModal}
        handleDeleteClose={handleDeleteClose}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          question: Yup.string().required('Question is required'),
          answer: Yup.string().required('Answer is required'),
          point: Yup.number('Please Enter a valid Integer')
            .integer('Must be a valid Integer')
            .required('Point is required'),
          choices: Yup.array()
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            values.choices = JSON.stringify(choices);

            questionId
              ? dispatch(updateQuestion({ id: questionDetails.id, data: values })).then((data) => {
                  if (data.type === 'question/updateQuestion/fulfilled') {
                    enqueueSnackbar('Question Updated Successfully', { variant: 'success' });
                  }
                  if (data.type === 'question/updateQuestion/rejected') {
                    enqueueSnackbar(data.error.message, { variant: 'error' });
                  }
                })
              : dispatch(createQuestion(values)).then((data) => {
                  if (data.type === 'question/createQuestion/fulfilled') {
                    enqueueSnackbar('Question Created Successfully', { variant: 'success' });
                  }
                  if (data.type === 'question/createQuestion/rejected') {
                    enqueueSnackbar(data.error.message, { variant: 'error' });
                  }
                });

            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
        onChange
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} direction="column" spacing={2} container>
                {/* Question Input */}
                <Grid item>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="question">Question</InputLabel>
                    <OutlinedInput
                      id="question"
                      type="text"
                      multiline
                      value={values.question}
                      name="question"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter Your Question Here"
                      fullWidth
                      sx={{ borderRadius: '14px' }}
                      error={Boolean(touched.question && errors.question)}
                    />
                    {touched.question && errors.question && (
                      <FormHelperText error id="standard-weight-helper-text-question">
                        {errors.question}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <OutlinedInput
                      id="description"
                      type="text"
                      multiline
                      value={values.description}
                      name="description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter Your description Here"
                      fullWidth
                      sx={{ borderRadius: '14px' }}
                      error={Boolean(touched.description && errors.description)}
                    />
                    {touched.description && errors.description && (
                      <FormHelperText error id="standard-weight-helper-text-description">
                        {errors.description}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Answer Input */}
                {questionType === 'SHORT_ANSWER' && (
                  <Grid item>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="answer">Answer</InputLabel>
                      <OutlinedInput
                        id="answer"
                        type="text"
                        multiline
                        value={values.answer}
                        name="answer"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{ borderRadius: '14px' }}
                        placeholder="Enter Your answer Here"
                        fullWidth
                        error={Boolean(touched.answer && errors.answer)}
                      />
                      {touched.answer && errors.answer && (
                        <FormHelperText error id="standard-weight-helper-text-answer">
                          {errors.answer}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                )}

                {questionType === 'CHOICE' && (
                  <Grid item>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="answer">Answer</InputLabel>
                      {/* <OutlinedInput
                        id="answer"
                        type="text"
                        multiline
                        value={values.answer}
                        name="answer"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{ borderRadius: '14px' }}
                        placeholder="Enter Your answer Here"
                        fullWidth
                        error={Boolean(touched.answer && errors.answer)}
                      /> */}
                      <Select
                        id="answer"
                        name="answer"
                        value={values.answer}
                        label="Age"
                        onChange={handleChange}
                        sx={{ borderRadius: '14px' }}
                        error={Boolean(touched.answer && errors.answer)}
                      >
                        {choices.map((choice) => (
                          <MenuItem value={choice.identifier}>{choice.identifier}</MenuItem>
                        ))}
                      </Select>
                      {touched.answer && errors.answer && (
                        <FormHelperText error id="standard-weight-helper-text-answer">
                          {errors.answer}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                )}

                {questionType === 'TRUE_FALSE' && (
                  <Grid item>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="answer">Answer</InputLabel>

                      <RadioGroup
                        name="answer"
                        id="answer"
                        value={values.answer}
                        onChange={handleChange}
                        error={Boolean(touched.answer && errors.answer)}
                      >
                        <FormControlLabel value="True" control={<Radio />} label="True" />
                        <FormControlLabel value="False" control={<Radio />} label="False" />
                      </RadioGroup>
                      {touched.answer && errors.answer && (
                        <FormHelperText error id="standard-weight-helper-text-answer">
                          {errors.answer}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                )}

                {/* choice selector if the question type is choice */}
                {questionType === 'CHOICE' && (
                  <Grid item container display="flex" spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                      <Grid item container spacing={2}>
                        <Grid item xs={9}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="choice">Add Choice</InputLabel>
                            <OutlinedInput
                              id="choice"
                              type="text"
                              name="choice"
                              onBlur={handleBlur}
                              value={inputValue}
                              onChange={(event) => setInputValue(event.target.value)}
                              placeholder="Add Your Choice Here"
                              fullWidth
                              sx={{ borderRadius: '14px' }}
                              error={Boolean(touched.choice && errors.choice)}
                            />
                            {touched.choice && errors.choice && (
                              <FormHelperText error id="standard-weight-helper-text-choice">
                                {errors.choice}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={3} display="flex">
                          <Button
                            variant="outlined"
                            sx={{ my: 3.3, height: '43px' }}
                            fullWidth
                            onClick={handleClick}
                          >
                            Add
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <TableComponent
                        headCells={headCells}
                        rows={choices}
                        title="Choices"
                        handleRowClick={handleRowClick}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>

              {/* Question Detail */}
              <Grid item xs={12} md={4}>
                <MainPaper
                  component="div"
                  sx={{ display: 'flex', overflow: 'auto', p: 4, height: '370px' }}
                >
                  <Stack direction="column" flex={1} justifyContent="space-between">
                    <Stack direction="column" spacing={2}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Question Details
                      </Typography>
                      <Divider sx={{ mt: 1 }} />

                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h5" htmlFor="point">
                          Point:
                        </Typography>
                        <OutlinedInput
                          id="point"
                          type="number"
                          value={values.point}
                          name="point"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{ width: '100px', borderRadius: 4 }}
                          error={Boolean(touched.point && errors.point)}
                        />
                      </Stack>
                      {touched.point && errors.point && (
                        <FormHelperText error id="standard-weight-helper-text-point">
                          {errors.point}
                        </FormHelperText>
                      )}
                      <Stack
                        sx={{ mb: 1 }}
                        alignItems="center"
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          Question Type:
                        </Typography>
                        <Typography>{questionType}</Typography>
                      </Stack>
                      <Stack
                        sx={{ mb: 1 }}
                        alignItems="center"
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          Exam:
                        </Typography>
                        <Typography>{examDetails?.title}</Typography>
                      </Stack>
                    </Stack>
                    {questionId && examDetails?.status !== 'Conducted' && (
                      <AnimateButton>
                        <Button
                          disableElevation
                          fullWidth
                          size="large"
                          onClick={() => handleDeleteOpen()}
                          variant="contained"
                          color="error"
                        >
                          Delete Question
                        </Button>
                      </AnimateButton>
                    )}
                    {(!examId || examDetails?.status !== 'Conducted') && (
                      <AnimateButton>
                        <Button
                          disableElevation
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          {questionId ? 'Update Question' : 'Add Question'}
                        </Button>
                      </AnimateButton>
                    )}
                  </Stack>
                </MainPaper>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddQuestion;
