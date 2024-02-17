import React, { useState } from 'react';

// custom components
import MainCard from 'components/MainCard';

// ant design
import { Switch, Dropdown } from 'antd';

// Material Ui
import { Typography, Stack, Chip, Grid, Button, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const HeaderDetailsComponent = (props) => {
  const { examDetails, buttonName, handleButtonClick } = props;
  const date = new Date(examDetails.start_time);

  const [copied, setCopied] = useState(false);

  // Copy code to Clipboard
  const handleCopyClick = async (textCopied) => {
    const text = textCopied.target.innerText;
    try {
      await navigator.clipboard.writeText(text.slice(5, -1));
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      // Handle error gracefully, e.g., display an error message
    }
  };

  const handleDropdownButtonClick = (e) => {
    handleButtonClick(e.target.innerText);
  };

  const items = [
    {
      key: '1',
      label: <Typography onClick={handleDropdownButtonClick}>Choice</Typography>
    },

    {
      key: '2',
      label: <Typography onClick={handleDropdownButtonClick}>True/False</Typography>
    },

    {
      key: '3',
      label: <Typography onClick={handleDropdownButtonClick}>Short Answer</Typography>
    }
  ];

  return (
    <MainCard>
      <Grid container spacing={2}>
        {/* Exam title */}
        <Grid item xs={12} md={3} display="flex" justifyContent="flex-start" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {examDetails.title}
          </Typography>
        </Grid>

        {/* Exam description for small screen */}
        <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
          <Typography>{examDetails.description}</Typography>
        </Grid>

        <Grid item xs={12} md={5}>
          {/* Exam controls */}
          <Stack direction="row" justifyContent="flex-start" spacing={{ xs: 1, sm: 2, md: 4 }}>
            {/* TODO change comparision !== */}
            {examDetails.status === 'Conducted' && (
              <Chip
                sx={{ px: 1 }}
                icon={<EditIcon color="secondary" fontSize="small" />}
                label={<Typography>Edit</Typography>}
                onClick={() => {}}
                variant="outlined"
              />
            )}
            <Tooltip title="Copy" arrow>
              <Chip
                sx={{ borderRadius: 4 }}
                onClick={handleCopyClick}
                arial
                label={copied ? <Typography>Copied!</Typography> : <Typography variant="h6">Code: {examDetails.exam_code}</Typography>}
              />
            </Tooltip>
            <Stack direction="row" alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Typography variant="h5" sx={{ mr: 1 }}>
                Public:
              </Typography>
              <Switch checked={true} onChange={() => {}} inputProps={{ 'aria-label': 'controlled' }} />
            </Stack>
          </Stack>
        </Grid>

        {/* public switcher for mobile Devices */}
        <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
          <Stack direction="row" alignItems="center" sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Typography variant="h5" sx={{ mr: 1 }}>
              Public:
            </Typography>
            <Switch checked={true} onChange={() => {}} inputProps={{ 'aria-label': 'controlled' }} />
          </Stack>
        </Grid>

        {/* Time and Date shower */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ pr: 6 }}
          display="flex"
          justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
          alignItems="flex-start"
        >
          <Typography variant="h5" sx={{ mr: 2 }}>
            Start time:
          </Typography>
          <Stack direction="column">
            <Typography>{date.toDateString()}</Typography>
            <Typography variant="subtitle2" color="secondary">
              {date.toLocaleTimeString()}
            </Typography>
          </Stack>
        </Grid>

        {/* Exam Discription */}
        <Grid item xs={8} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography>{examDetails.description}</Typography>
        </Grid>

        {/* Interchangable Main Button */}
        <Grid item xs={12} md={4} sx={{ pr: 6 }} display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems="center">
          {buttonName.name === 'Add Question' ? (
            <Dropdown menu={{ items }} placement="bottom">
              <Button disabled={buttonName.disabled} variant="contained" color="success" startIcon={<AddCircleOutlineIcon />}>
                {buttonName.name}
              </Button>
            </Dropdown>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={(e) => {
                handleButtonClick(e.target.innerText);
                console.log(e);
              }}
              disabled={buttonName.disabled}
            >
              {buttonName.name}
            </Button>
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default HeaderDetailsComponent;
