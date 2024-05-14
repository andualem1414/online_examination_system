import MainCard from 'components/MainCard';
import { Stack, Typography, Divider, Button, IconButton } from '@mui/material';

import AnimateButton from 'components/@extended/AnimateButton';

import {
  Backdrop,
  Modal,
  Fade,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import React, { useEffect } from 'react';
import ChecklistIcon from '@mui/icons-material/Checklist';
import SendIcon from '@mui/icons-material/Send';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import DeleteIcon from '@mui/icons-material/Delete';

import { createRules, deleteRules, fetchRules } from 'store/reducers/user';

import { useSelector, useDispatch } from 'react-redux';
import MainPaper from 'components/MainPaper';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { useSnackbar } from 'notistack';

const Rules = () => {
  let dispatch = useDispatch();

  const user = useSelector((state) => state.user.userDetails);
  const rules = useSelector((state) => state.user.rules);
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(fetchRules(user.id)).then((data) => {
      console.log(data);
    });
  }, []);

  return (
    <>
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
        zIndex={999}
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
              Create a Rule
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Formik
              initialValues={{
                rule: '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                rule: Yup.string().required('Rule is required')
              })}
              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                  dispatch(createRules(values)).then((data) => {
                    if (data.type === 'user/createRules/fulfilled') {
                      enqueueSnackbar('Successfully added a rule', {
                        variant: 'success'
                      });
                      handleClose();
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
            >
              {({
                errors,
                setFieldValue,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container direction="row" spacing={3}>
                    {/* Exam code Input */}
                    <Grid item xs={12} md={8}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="rule">Rule</InputLabel>
                        <OutlinedInput
                          id="rule"
                          type="text"
                          multiline
                          value={values.rule}
                          name="rule"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter Your New Rule Here"
                          fullWidth
                          sx={{ borderRadius: '14px' }}
                          error={Boolean(touched.rule && errors.rule)}
                        />
                        {touched.rule && errors.rule && (
                          <FormHelperText error id="standard-weight-helper-text-rule">
                            {errors.rule}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    {/* Join Button*/}
                    <Grid item xs={12} md={4}>
                      {/* Create or Update Button */}
                      <AnimateButton>
                        <Button
                          disableElevation
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          color="primary"
                          sx={{ mt: 3.4, height: '53px' }}
                        >
                          Add Rule
                        </Button>
                      </AnimateButton>
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
          </MainPaper>
        </Fade>
      </Modal>

      <Stack display="flex" alignItems="center">
        <MainCard sx={{ p: 4, width: '50%' }}>
          <Stack direction="row" sx={{ mb: 2 }} spacing={2} alignItems="center">
            <ChecklistIcon sx={{ fontSize: 32 }} />
            <Typography variant="h3">Exam Taking Rules</Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
            <SendIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 18 }}>You can't change Tabs while in exam</Typography>
          </Stack>
          <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
            <SendIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 18 }}>You can't exit fullScreen</Typography>
          </Stack>
          <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
            <SendIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 18 }}>
              Your face should match your profile picture
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
            <SendIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 18 }}>Only you should be in the exam</Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          {user.user_type === 'EXAMINER' && rules.length > 0 ? (
            rules?.map((rule) => {
              return (
                <Stack
                  direction="row"
                  sx={{ mb: 2, ml: 2 }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <SendIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: 18 }}>{rule.rule}</Typography>
                  </Stack>
                  <IconButton aria-label="delete" onClick={() => dispatch(deleteRules(rule.id))}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              );
            })
          ) : (
            <Typography variant="h5" textAlign="center" sx={{ mb: 3 }}>
              {user.user_type === 'EXAMINER'
                ? 'Add your custom Rule'
                : 'Custom Rules will be added for exams'}
            </Typography>
          )}
          <Divider sx={{ mb: 3 }} />

          <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
            <WarningRoundedIcon color="error" sx={{ fontSize: 22 }} />
            <Typography color="secondary" sx={{ fontSize: 16 }}>
              Failure to adhere to the rules outlined above will result in automatic
              disqualification from the examination.
            </Typography>
          </Stack>
          {user.user_type === 'EXAMINER' && (
            <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} justifyContent="flex-end">
              <Button variant="contained" sx={{ width: '150px' }} onClick={() => setOpen(true)}>
                Add rule
              </Button>
            </Stack>
          )}
        </MainCard>
      </Stack>
    </>
  );
};

export default Rules;
