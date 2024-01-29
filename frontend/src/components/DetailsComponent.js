import React from 'react';
import { Typography, Stack, Divider, Box } from '@mui/material';
import MainPaper from './MainPaper';

const DetailsComponent = (props) => {
  const { data } = props;
  return (
    <MainPaper component="div" sx={{ overflow: 'auto', p: 4, height: '370px' }}>
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
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>{description.name}</Typography>
                      <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                        {description.value}
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
