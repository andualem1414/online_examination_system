import React from 'react';

// Material UI
import { Modal, Button, Stack, Typography } from '@mui/material';

// Custom Component
import MainPaper from '../MainPaper';

const Confirmation = (props) => {
  const {
    openConfimation,
    handleConfimationClose,
    handleConfimationClick,
    warning,
    ConfirmButton
  } = props;

  return (
    <Modal
      open={openConfimation}
      onClose={handleConfimationClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <MainPaper
        sx={{
          p: 4,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '80vw', md: '40vw' }
        }}
      >
        <Typography sx={{ mb: 2 }} variant="h5" id="child-modal-title">
          {warning}
        </Typography>
        <Typography variant="subtitle3" id="child-modal-description">
          This action cannot be reversed!
        </Typography>
        <Stack direction="row" sx={{ mt: 1 }} justifyContent="flex-end">
          <Button onClick={handleConfimationClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => handleConfimationClick()}
            color="error"
            variant="contained"
            sx={{ ml: 1 }}
          >
            {ConfirmButton}
          </Button>
        </Stack>
      </MainPaper>
    </Modal>
  );
};

export default Confirmation;
