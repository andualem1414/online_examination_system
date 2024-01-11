import { React, useState } from 'react';
import { Box } from '@mui/material';
import TableComponent from 'components/TableComponent';

// project import

const MyExam = () => {
  function createData(id, name, calories, fat, carbs, protein, color) {
    return {
      id,
      name,
      calories,
      fat,
      carbs,
      protein,
      color
    };
  }

  let [rows, setRows] = useState([
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
      id: 'name',
      numeric: false,
      label: 'Dessert (100g serving)'
    },
    {
      id: 'calories',
      numeric: true,
      label: 'Calories'
    },
    {
      id: 'fat',
      numeric: true,
      label: 'Fat'
    },
    {
      id: 'carbs',
      numeric: true,
      label: 'Carbs',
      chip: true,
      chipColor: chipColorSelector
    },

    {
      id: 'protein',
      numeric: true,
      label: 'Protein (g)'
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <TableComponent headCells={headCells} rows={rows} title="Exams" />
    </Box>
  );
};

export default MyExam;
