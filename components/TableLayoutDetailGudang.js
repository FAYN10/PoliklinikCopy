import {useState, forwardRef, useEffect, useMemo} from 'react';
import {useRouter} from 'next/router';
import Box from '@mui/system/Box';
import visuallyHidden from '@mui/utils/visuallyHidden';
import Button from '@mui/material/Button';
import PlusIcon from '@material-ui/icons/Add';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import SpinnerMui from 'components/SpinnerMui';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import st from 'styles/module/components/Table.module.scss';
import useClientPermission from 'custom-hooks/useClientPermission';
import DialogAddItem from './modules/gudang/dialogAddItemPurchaseOrder';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const TableLayoutDetail = ({
  baseRoutePath = '/',
  // customCreatePath = null,
  title = 'Default title',
  isBtnAdd = false,
  // isBtnCetak = false,
  isDelete = false,
  customBtnAddTitle = null,
  customBtnCetakTitle = null,
  btnAddHandler = () => {},
  btnEditHandler = () => {},
  tableHead = [],
  data = [],
  // meta = {},
  // dataPerPage = 8,
  isUpdatingData,
  // updateDataPerPage = () => {},
  // updateDataNavigate = () => {},
  // refreshData = () => {},
  deleteData = () => {},
  createData = () => {},
}) => {
  // const router = useRouter();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(tableHead[0].id);
  const [confirmationDelete, setConfirmationDelete] = useState({
    state: false,
    data: {},
  });
  const {clientPermission} = useClientPermission();

  // BOILER-PLATE START
  // --start table operator stuff
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
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function EnhancedTableHead(props) {
    const {order, orderBy, onRequestSort} = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {tableHead.map((headCell, idx) => (
            <TableCell
              key={headCell.id}
              align='left'
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{paddingLeft: idx === 0 ? 1 : 0}}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                className='font-w-600'
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell align='right' padding='normal' />
        </TableRow>
      </TableHead>
    );
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleOpenConfirmationDelete = (payload, idx) => {
    setConfirmationDelete({
      state: true,
      data: payload,
      index: idx,
    });
  };

  const handleCloseConfirmationDelete = () => {
    setConfirmationDelete((prev) => ({
      ...prev,
      state: false,
    }));
  };

  const handleContinueConfirmationDelete = () => {
    deleteData(confirmationDelete.index);
    handleCloseConfirmationDelete();
  };

  // const update = (payload) => {
  //   btnEditHandler(true);
  //   setDataUpdate(payload);
  // };

  const isPermitted = (payload) => {
    let value = true;
    if (clientPermission.includes('admin')) return value;
    if (
      !clientPermission.includes(`${baseRoutePath.substring(1)}:${payload}`)
    ) {
      value = false;
    }
    return value;
  };

  return (
    <>
      <div className={st.container}>
        <div
          className={st.header}
          style={{display: 'flex', justifyContent: 'flex-end'}}
        >
          {isBtnAdd ? (
            <Button
              variant='contained'
              endIcon={<PlusIcon />}
              sx={{marginTop: 1}}
              disabled={!isPermitted('store')}
              onClick={() => btnAddHandler(true)}
            >
              {customBtnCetakTitle ? <>{customBtnAddTitle}</> : <>{title}</>}
            </Button>
          ) : null}
          {/* {isBtnCetak ? (
            <Button
              variant='contained'
              endIcon={<PrintIcon />}
              sx={{marginTop: 1, marginBottom: 1}}
              disabled={!isPermitted('store')}
              onClick={() => btnAddHandler(true)}
            >
              {customBtnCetakTitle ? <>{customBtnCetakTitle}</> : <>{title}</>}
            </Button>
          ) : null} */}
        </div>
        <Box sx={{width: '100%'}}>
          <Paper sx={{width: '100%', padding: 2, marginBottom: 4}}>
            <div>
              {isUpdatingData ? (
                <div
                  className='flex justify-center items-center'
                  style={{height: '200px'}}
                >
                  <SpinnerMui />
                </div>
              ) : data.length !== 0 ? (
                <>
                  <TableContainer>
                    <Table
                      sx={{minWidth: 750}}
                      aria-labelledby={`table${title}`}
                    >
                      <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                      />
                      <TableBody>
                        {stableSort(data, getComparator(order, orderBy)).map(
                          (row, idR) => {
                            return (
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id || idR}
                                onDoubleClick={
                                  row.id && isPermitted('show')
                                    ? () => {
                                        btnEditHandler(true);
                                      }
                                    : null
                                }
                                className='pointer'
                              >
                                {Object.keys(row).map((obKey, idx) => {
                                  // hide id
                                  if (obKey === 'id') return;
                                  return (
                                    <TableCell
                                      key={idx}
                                      align='left'
                                      padding='none'
                                      sx={{
                                        paddingLeft: idx === 0 ? 1 : 0,
                                        paddingRight: 2,
                                        height: 56,
                                        minHeight: 56,
                                      }}
                                    >
                                      {row[obKey]}
                                    </TableCell>
                                  );
                                })}
                                {isDelete ? (
                                  <TableCell
                                    align='right'
                                    padding='none'
                                    sx={{
                                      paddingRight: 1,
                                      paddingY: 0.8,
                                    }}
                                  >
                                    {isPermitted('destroy') ? (
                                      <Tooltip title='Delete' arrow>
                                        <IconButton
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleOpenConfirmationDelete(
                                              row,
                                              idR
                                            );
                                          }}
                                        >
                                          <DeleteIcon color='error' />
                                        </IconButton>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip title="You don't have permission to do this">
                                        <span>
                                          <IconButton disabled>
                                            <DeleteIcon />
                                          </IconButton>
                                        </span>
                                      </Tooltip>
                                    )}
                                  </TableCell>
                                ) : null}
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <div style={{textAlign: 'center', margin: '12 0'}}>
                  Item not found
                </div>
              )}
            </div>
          </Paper>
        </Box>
      </div>

      <Dialog
        open={confirmationDelete.state}
        onClose={handleCloseConfirmationDelete}
        TransitionComponent={Transition}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {/* {`Hapus data ${title} berikut?`} */}
        </DialogTitle>
        <DialogContent>
          {Object.keys(confirmationDelete.data).map((obKey, idx) => {
            // hide id and static number
            if (obKey === 'id' || obKey === 'no') return;
            else
              return (
                <DialogContentText key={idx}>
                  {tableHead[idx].label}: {confirmationDelete.data[obKey]}
                </DialogContentText>
              );
          })}
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleCloseConfirmationDelete}>
            Batal
          </Button>
          <Button color='success' onClick={handleContinueConfirmationDelete}>
            Lanjutkan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableLayoutDetail;
