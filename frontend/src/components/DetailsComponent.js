import React from 'react';
import { Typography, Stack, Divider, Box, Chip } from '@mui/material';
import MainPaper from './MainPaper';

const DetailsComponent = (props) => {
  const { data } = props;
  return (
    <MainPaper component="div" sx={{ overflow: 'auto', p: 4, height: '400px' }}>
      <Stack>
        {data.map((item) => {
          return (
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {item.title}
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box sx={{ pl: 2, mt: 1.5, mb: 3 }}>
                {item.descriptions.map((description) => {
                  return (
                    <Stack
                      sx={{ mb: 1 }}
                      alignItems="center"
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography>{description.name}</Typography>
                      <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                        <Chip label={description.value} variant="light" color="primary" />
                      </Typography>
                    </Stack>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </MainPaper>
  );
};

export default DetailsComponent;
