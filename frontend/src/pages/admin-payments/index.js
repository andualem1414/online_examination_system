import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from 'api/axios';

// Custom Components
import TableComponent from 'components/TableComponent';
import DetailsComponent from 'components/DetailsComponent';
import SearchField from 'components/SearchField';

// Material Ui
import { Grid, Typography } from '@mui/material';

// Redux import
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllExams, fetchExams } from 'store/reducers/exam';
import { fetchExamineeExams } from 'store/reducers/examineeExam';
import { filterData } from 'utils/utils';
import { fetchAllPayments } from 'store/reducers/payments';
const checkPaymentAPI = async (paymentCode) => {
  try {
    const response = await axiosPrivate.get(`exams/payments/check/`, {
      params: { payment_code: paymentCode }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch code', error);
  }
};
const AdminPayments = () => {
  const payments = useSelector((state) => state.payment.payments);

  const dispatch = useDispatch();
  let [searchValue, setSearchValue] = useState('');
  let [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    dispatch(fetchAllPayments()).then(() => {
      payments.map((payment) => {
        setTotalAmount((prev) => prev + payment.amount);
      });
    });
  }, []);

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
  };
  const chipColorSelector = (status) => {
    if (status === 'Conducted') {
      return 'success';
    } else if (status === 'Live') {
      return 'warning';
    } else {
      return 'primary';
    }
  };
  const headCells = [
    {
      id: 'exam.title',
      numeric: false,
      label: 'Title'
    },
    {
      id: 'examiner.full_name',
      numeric: false,
      label: 'Full Name'
    },

    {
      id: 'amount',
      numeric: false,
      label: 'Amount',
      chip: true,
      chipColor: chipColorSelector
    },
    {
      id: 'created_at',
      numeric: false,
      date: true,
      label: 'Date Created'
    }
  ];
  const Detailsdata = [
    {
      title: 'Payment Details',
      descriptions: [
        {
          name: 'Number of payments',
          value: payments.length
        },
        {
          name: 'Total amount',
          value: totalAmount
        }
      ]
    }
  ];
  const handleRowClick = (event, id) => {
    let payment = payments.find((p) => p.id === id);
    checkPaymentAPI(payment.payment_code).then((response) => {
      let url = `https://checkout.chapa.co/checkout/test-payment-receipt/${response.reference}`;
      window.open(url, '_blank');
    });
  };

  return (
    <Grid container spacing={2}>
      {/* Search for mobile devices */}
      <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
        <SearchField handleOnChange />
      </Grid>
      {/* Exam List */}
      <Grid item xs={12} md={8} display="block" justifyContent="center">
        {payments.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={filterData(payments, searchValue, ['amount'])}
            title="Payments"
            handleRowClick={handleRowClick}
          />
        ) : (
          <Typography variant="h5" textAlign="center">
            Payment will show here!
          </Typography>
        )}
      </Grid>
      {/* Exam Details */}
      <Grid item xs={12} md={4} container spacing={2} direction="column">
        <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
          <SearchField handleSearchOnChange={handleSearchOnChange} />
        </Grid>
        <Grid item>
          <DetailsComponent data={Detailsdata} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminPayments;
