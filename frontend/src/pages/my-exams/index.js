import { React, useState } from 'react';
import { InputBase, IconButton, Grid } from '@mui/material';
import TableComponent from 'components/TableComponent';
import MainPaper from 'components/MainPaper';
import SearchIcon from '@mui/icons-material/Search';
import DetailsComponent from 'components/DetailsComponent';

// project import

function InputField(props) {
  const { handleOnChange } = props;
  return (
    <MainPaper component="form" sx={{ p: '2px 10px', display: 'flex', alignItems: 'center', height: '50px' }}>
      <InputBase onChange={handleOnChange} sx={{ ml: 1, flex: 1 }} placeholder="Search..." />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </MainPaper>
  );
}

const MyExam = () => {
  function createData(id, dessert, calories, fat, carbs, protein, color) {
    return {
      id,
      dessert,
      calories,
      fat,
      carbs,
      protein,
      color
    };
  }

  let [rows] = useState([
    createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
    createData(2, 'Donut', 452, 25.0, 51, 4.9),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
    createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
    createData(9, 'KitKat', 518, 26.0, 65, 7.0),
    createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
    createData(11, 'Marshmallow', 318, 0, 81, 2.0),
    createData(12, 'Nougat', 360, 19.0, 9, 37.0),
    createData(13, 'Oreo', 437, 18.0, 63, 4.0)
  ]);

  /*
  headCells should contain the following
  id: name of the cell
  numeric: type of the cell if it is numeric
  chip if it is a chip
  chip color for the changing the chip color
  */

  const chipColorSelector = (carbs) => {
    if (carbs > 50) {
      return 'success';
    } else {
      return 'error';
    }
  };

  const headCells = [
    {
      id: 'dessert',
      numeric: false,
      label: 'Dessert (100g serving)'
    },
    {
      id: 'calories',
      numeric: true,
      label: 'Calories',
      chip: true,
      chipColor: chipColorSelector
    },
    {
      id: 'fat',
      numeric: true,
      label: 'Fat',
      chip: true,
      chipColor: chipColorSelector
    },
    {
      id: 'carbs',
      numeric: true,
      label: 'Carbs'
    },

    {
      id: 'protein',
      numeric: true,
      label: 'Protein (g)'
    }
  ];

  const data = [
    {
      title: 'Exam Details',
      descriptions: [
        {
          name: 'Number of exams',
          value: 20
        },
        {
          name: 'Pass Mark',
          value: 10
        }
      ]
    },

    {
      title: 'Examinee Details',
      descriptions: [
        {
          name: 'Number of Examinee',
          value: 20
        }
      ]
    }
  ];

  const handleOnChange = (e) => {
    console.log(e);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
        <InputField handleOnChange />
      </Grid>
      <Grid item xs={12} md={8}>
        <TableComponent headCells={headCells} rows={rows} title="Exams" />
      </Grid>
      <Grid item xs={12} md={4} container spacing={2} direction="column">
        <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
          <InputField handleOnChange={handleOnChange} />
        </Grid>
        <Grid item>
          <DetailsComponent data={data} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MyExam;
