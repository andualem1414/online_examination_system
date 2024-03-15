import MainCard from 'components/MainCard';
import { Stack, Typography, Divider } from '@mui/material';
import React from 'react';
import ChecklistIcon from '@mui/icons-material/Checklist';
import SendIcon from '@mui/icons-material/Send';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

const Rules = () => {
  return (
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
          <Typography sx={{ fontSize: 18 }}>Your face should match your profile picture</Typography>
        </Stack>
        <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
          <SendIcon sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: 18 }}>Only you should be in the exam</Typography>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
          <WarningRoundedIcon color="error" sx={{ fontSize: 22 }} />
          <Typography color="secondary" sx={{ fontSize: 16 }}>
            Failure to adhere to the rules outlined above will result in automatic disqualification
            from the examination.
          </Typography>
        </Stack>
      </MainCard>
    </Stack>
  );
};

export default Rules;
