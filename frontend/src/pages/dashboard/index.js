import { useEffect, useState } from 'react';

// material-ui
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// project import
import OrdersTable from './OrdersTable';
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import SalesColumnChart from './SalesColumnChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllExams } from 'store/reducers/exam';
import { fetchAllPayments } from 'store/reducers/payments';
import { fetchAllUsers } from 'store/reducers/user';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// sales report status
const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const [value, setValue] = useState('today');
  const [slot, setSlot] = useState('week');

  const dispatch = useDispatch();

  const users = useSelector((state) => state.user.users);
  const exams = useSelector((state) => state.exam.exams);
  const payments = useSelector((state) => state.payment.payments);

  const differenceInDays = (date) => {
    const currentDate = new Date();
    const currentDateInMilliseconds = currentDate.getTime();
    const dateToCheckInMilliseconds = new Date(date).getTime();
    const differenceInDays = parseInt(
      (currentDateInMilliseconds - dateToCheckInMilliseconds) / (1000 * 60 * 60 * 24)
    );

    return differenceInDays;
  };

  const percentageThisWeek = (items) => {
    const lastWeek = items.filter(
      (item) => differenceInDays(item.created_at) > 7 && differenceInDays(item.created_at) < 14
    ).length;
    const currentWeek = items.filter((item) => differenceInDays(item.created_at) <= 7).length;
    const percentage =
      lastWeek === 0 ? currentWeek - lastWeek : (currentWeek - lastWeek) / lastWeek;

    return percentage * 100;
  };

  useEffect(() => {
    dispatch(fetchAllExams());
    dispatch(fetchAllPayments());
    dispatch(fetchAllUsers());
  }, []);

  console.log(
    exams.filter((exam) => {
      console.log(differenceInDays(exam.created_at));
    })
  );

  const examsWeekData = [
    exams.filter((exam) => differenceInDays(exam.created_at) === 1).length,
    exams.filter((exam) => differenceInDays(exam.created_at) === 2).length,
    exams.filter((exam) => differenceInDays(exam.created_at) === 3).length,
    exams.filter((exam) => differenceInDays(exam.created_at) === 4).length,
    exams.filter((exam) => differenceInDays(exam.created_at) === 5).length,
    exams.filter((exam) => differenceInDays(exam.created_at) === 6).length,
    exams.filter((exam) => differenceInDays(exam.created_at) === 7).length
  ];

  const twoWeeks = [
    {
      name: 'week 1',
      data: [
        exams.filter((exam) => differenceInDays(exam.created_at) === 1).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 2).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 3).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 4).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 5).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 6).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 7).length
      ]
    },
    {
      name: 'week 2',
      data: [
        exams.filter((exam) => differenceInDays(exam.created_at) === 8).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 9).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 10).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 11).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 12).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 13).length,
        exams.filter((exam) => differenceInDays(exam.created_at) === 14).length
      ]
    }
  ];
  console.log(examsWeekData);
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}

      <Grid item xs={12} sm={6} md={4}>
        <AnalyticEcommerce
          title="Total Exam Created"
          count={exams.length}
          percentage={percentageThisWeek(exams)}
          isLoss={percentageThisWeek(exams) > 0 ? false : true}
          extra={`There are ${
            exams.filter((exam) => differenceInDays(exam.created_at) <= 7).length
          } exams added this week`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AnalyticEcommerce
          title="Total Users Joined"
          count={users.length}
          percentage={percentageThisWeek(users)}
          isLoss={percentageThisWeek(users) > 0 ? false : true}
          extra={`There are ${
            users.filter((user) => differenceInDays(user.created_at) <= 7).length
          } users added this week`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AnalyticEcommerce
          title="Total Payments made"
          count={payments.length}
          percentage={percentageThisWeek(payments)}
          isLoss={percentageThisWeek(payments) > 0 ? false : true}
          extra="1,943"
        />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Compared with the past week</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart twoWeeks={twoWeeks} slot={slot} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Exams overview</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                This Week Statistics
              </Typography>
              <Typography variant="h3">{exams.length}</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart examsWeekData={examsWeekData} />
        </MainCard>
      </Grid>

      {/* row 3 */}
      {/* <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Analytics Report</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Company Finance Growth" />
              <Typography variant="h5">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Company Expenses Ratio" />
              <Typography variant="h5">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Business Risk Cases" />
              <Typography variant="h5">Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid> */}

      {/* row 4 */}
      {/* <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Sales Report</Typography>
          </Grid>
          <Grid item>
            <TextField
              id="standard-select-currency"
              size="small"
              select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 1.75 }}>
          <Stack spacing={1.5} sx={{ mb: -12 }}>
            <Typography variant="h6" color="secondary">
              Net Profit
            </Typography>
            <Typography variant="h4">$1560</Typography>
          </Stack>
          <SalesColumnChart />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Transaction History</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: 'success.main',
                    bgcolor: 'success.lighter'
                  }}
                >
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">Order #002434</Typography>}
                secondary="Today, 2:00 AM"
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    78%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'primary.lighter'
                  }}
                >
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">Order #984947</Typography>}
                secondary="5 August, 1:45 PM"
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: 'error.main',
                    bgcolor: 'error.lighter'
                  }}
                >
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">Order #988784</Typography>}
                secondary="7 hours ago"
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Help & Support Chat
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Typical replay within 5 min
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Need Help?
            </Button>
          </Stack>
        </MainCard>
      </Grid> */}
    </Grid>
  );
};

export default DashboardDefault;
