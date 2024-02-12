import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// Mui components
import {
  Typography,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';

// custom components
import MainPaper from 'components/MainPaper';

// icons
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

// redux
import { useDispatch } from 'react-redux';
import { changeExam } from 'store/reducers/exam';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableToolbar(props) {
  const { title } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 3 },
        pr: { xs: 1, sm: 3 }
      }}
    >
      <Typography sx={{ flex: '100%' }} variant="h5" id="tableTitle" component="div">
        {title}
      </Typography>

      <Tooltip title="Filter list">
        <IconButton color="primary">
          <DownloadRoundedIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ backgroundColor: 'secondary.100' }}>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ pl: { xs: 1, sm: index === 0 ? 3 : 1 }, pr: { xs: 1, sm: index === headCells.length - 1 ? 3 : 1 } }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCells: PropTypes.object.isRequired
};

export default function EnhancedTable(props) {
  const { headCells, rows, title } = props;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(headCells[0].name);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, id) => {
    dispatch(changeExam({ examId: id }));
    return navigate('/my-exams/exam-details');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = React.useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).sort(getComparator(order, orderBy)),
    [order, orderBy, page, rows, rowsPerPage]
  );

  return (
    <MainPaper sx={{ width: '100%', mb: 2 }}>
      <EnhancedTableToolbar title={title} />
      <Divider />
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} headCells={headCells} />
          <TableBody>
            {visibleRows.map((row, index) => {
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  tabIndex={-1}
                  key={row.id}
                  sx={{ cursor: 'pointer' }}
                >
                  {headCells.map((cell, index) => {
                    let name = cell.id;

                    return (
                      <TableCell
                        sx={{ pl: { xs: 1, sm: index === 0 ? 3 : 1 }, pr: { xs: 1, sm: index === headCells.length - 1 ? 3 : 1 } }}
                        align={cell.numeric ? 'right' : 'left'}
                        component="th"
                        scope="row"
                        padding="none"
                      >
                        {cell?.chip ? <Chip size="small" variant="light" label={row[name]} color={cell.chipColor(row[name])} /> : row[name]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </MainPaper>
  );
}

EnhancedTable.propTypes = {
  headCells: PropTypes.array,
  title: PropTypes.string,
  rows: PropTypes.object
};
