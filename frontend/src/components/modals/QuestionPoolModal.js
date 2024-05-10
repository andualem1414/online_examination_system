import React, { useEffect, useState } from 'react';
import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack
} from '@mui/material';
import { useSnackbar } from 'notistack';

import MainPaper from 'components/MainPaper';
import { useNavigate } from 'react-router-dom';
// Custom Components
import TableComponent from 'components/TableComponent';
import TableComponentSelector from 'components/TableComponentSelector';
import DetailsComponent from 'components/DetailsComponent';
import SearchField from 'components/SearchField';

//Redux import
import { useSelector, useDispatch } from 'react-redux';
import { filterData } from 'utils/utils';
import {
  createQuestionPool,
  fetchQuestionDetails,
  fetchQuestionPool,
  fetchQuestions
} from 'store/reducers/question';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const QuestionPoolModal = (props) => {
  const { open, handleClose } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [selected, setSelected] = React.useState([]);

  const user = useSelector((state) => state.user.userDetails);
  const questionPool = useSelector((state) => state.question.questionPool);
  const questionDetails = useSelector((state) => state.question.questionDetails);
  const loading = useSelector((state) => state.question.loading);
  const [innerModal, setInnerModal] = useState(false);
  let [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    dispatch(fetchQuestionPool());
  }, []);

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
      numeric: false,
      label: 'Point'
    }
  ];

  const handleRowClick = (event, id) => {
    dispatch(fetchQuestionDetails(id)).then((data) => {
      if (data.type === 'question/questionDetails/fulfilled') {
        setInnerModal(true);
      }
    });
  };

  const handleButtonClick = () => {
    const examId = localStorage.getItem('examId');
    const data = {
      exam: examId,
      ids: JSON.stringify(selected)
    };
    dispatch(createQuestionPool(data)).then((data) => {
      if (data.type === 'question/createQuestionPool/fulfilled') {
        enqueueSnackbar('Question Added Successfully', {
          variant: 'success'
        });
        dispatch(fetchQuestions(examId));
      }
    });
  };
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title1"
        aria-describedby="transition-modal-description1"
        open={innerModal}
        onClose={() => setInnerModal(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
        zIndex={999}
      >
        <MainPaper
          component="div"
          sx={{
            p: 4,
            pb: 8,
            width: { xs: '70vw', md: '50vw' },
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h5">Question:</Typography>
          <Divider />
          <Typography sx={{ m: 2 }}>{questionDetails.question}</Typography>
          <Typography variant="h5">Description:</Typography>
          <Divider />
          <Typography sx={{ m: 2 }}>{questionDetails.description}</Typography>
        </MainPaper>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
        zIndex={990}
      >
        <Fade in={open}>
          <MainPaper
            component="div"
            sx={{
              p: 4,
              pb: 8,
              width: { xs: '80vw', md: '60vw' },
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Title */}
            <Typography variant="h4" textAlign="center" sx={{ pb: 2 }}>
              Question Pool
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              {/* Search for mobile devices */}
              <Grid item xs={12}>
                <SearchField handleSearchOnChange={handleSearchOnChange} />
              </Grid>
              {/* Exam List */}
              {console.log(questionPool)}
              <Grid item xs={12} md={12} display="block" justifyContent="center">
                {questionPool?.length > 0 ? (
                  <TableComponentSelector
                    headCells={headCells}
                    rows={filterData(questionPool, searchValue, ['question', 'description'])}
                    selected={selected}
                    setSelected={setSelected}
                    chipColorSelector={chipColorSelector}
                    handleRowClick={handleRowClick}
                  />
                ) : (
                  <Typography variant="h5" textAlign="center">
                    Questions you Create will show here!
                  </Typography>
                )}
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    handleButtonClick();
                  }}
                >
                  Add Questions
                </Button>
              </Grid>
            </Grid>
          </MainPaper>
        </Fade>
      </Modal>
    </>
  );
};

export default QuestionPoolModal;
