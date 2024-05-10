import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom Components
import TableComponent from 'components/TableComponent';
import DetailsComponent from 'components/DetailsComponent';
import SearchField from 'components/SearchField';

// Material Ui
import { Grid, Typography, Stack, Divider, Chip, Tooltip } from '@mui/material';

// Redux import
import { useSelector, useDispatch } from 'react-redux';
import { fetchExams } from 'store/reducers/exam';
import { fetchExamineeExams } from 'store/reducers/examineeExam';
import { filterData } from 'utils/utils';

import { fetchAllExams } from 'store/reducers/exam';
import { fetchRecentActions } from 'store/reducers/user';
import MainPaper from 'components/MainPaper';

const RecentActions = () => {
  const recentActions = useSelector((state) => state.user.recentActions);
  let [changes, setChanges] = useState([]);

  const dispatch = useDispatch();
  let [searchValue, setSearchValue] = useState('');

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
  };
  const chipColorSelector = (status) => {
    if (status === 'create') {
      return 'success';
    } else if (status === 'update') {
      return 'warning';
    } else {
      return 'error';
    }
  };

  const handleRowClick = (event, id) => {
    let recentAction = recentActions.find((recentAction) => recentAction.id === id);
    if (recentAction.action_display === 'create' || recentAction.action_display === 'delete') {
      for (const key in recentAction.changes) {
        if (key === 'id') {
          setChanges([[key, recentAction.changes[key]]]);
          return;
        }
      }
    }
    let currentChange = recentAction.changes;
    let newChanges = [];

    for (const key in currentChange) {
      // Access the value using the key
      const value = currentChange[key];
      newChanges.push([key, value]);
    }
    setChanges(newChanges);
  };

  const headCells = [
    {
      id: 'object_repr',
      numeric: false,
      label: 'Title'
    },
    {
      id: 'action_display',
      numeric: false,
      label: 'Action',
      chip: true,
      chipColor: chipColorSelector
    },
    {
      id: 'timestamp',
      numeric: false,
      date: true,
      label: 'Timestamp'
    }
  ];

  useEffect(() => {
    dispatch(fetchRecentActions());
  }, []);

  return (
    <Grid container spacing={2}>
      {/* Search for mobile devices */}
      <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
        <SearchField handleOnChange />
      </Grid>
      {/* Exam List */}
      <Grid item xs={12} md={7} display="block" justifyContent="center">
        {recentActions?.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={filterData(recentActions, searchValue, ['title'])}
            title="Recent Actions"
            handleRowClick={handleRowClick}
          />
        ) : (
          <Typography variant="h5" textAlign="center">
            Recent Actions will show here!
          </Typography>
        )}
      </Grid>
      {/* Exam Details */}
      <Grid item xs={12} md={5} container spacing={2} direction="column">
        <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
          <SearchField handleSearchOnChange={handleSearchOnChange} />
        </Grid>
        <Grid item>
          <MainPaper component="div" sx={{ overflow: 'auto', p: 4, height: '370px' }}>
            <Stack>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Changes Details
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Grid container sx={{ width: '100%', my: 2 }}>
                <Grid item xs={12} container>
                  <Grid xs={4} item>
                    <Typography variant="h5">Field</Typography>
                  </Grid>

                  <Grid xs={4} item>
                    <Typography variant="h5">From</Typography>
                  </Grid>
                  <Grid xs={4} item>
                    <Typography variant="h5">to</Typography>
                  </Grid>
                </Grid>
              </Grid>

              {changes?.map((change) => {
                let from = change[1][0];
                let to = change[1][1];

                return (
                  <Grid item xs={12} container sx={{ my: 1 }}>
                    <Grid xs={4} item>
                      <Typography variant="subtitle">{change[0]}</Typography>
                    </Grid>

                    <Grid xs={4} item>
                      <Tooltip title={from}>
                        <Chip label={from} sx={{ width: '150px' }} color="error" variant="light" />
                      </Tooltip>
                    </Grid>
                    <Grid xs={4} item>
                      <Tooltip title={to}>
                        <Chip label={to} sx={{ width: '150px' }} color="success" variant="light" />
                      </Tooltip>
                    </Grid>
                  </Grid>
                );
              })}
            </Stack>
          </MainPaper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RecentActions;
