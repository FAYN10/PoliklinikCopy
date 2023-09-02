import { useState, forwardRef, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import NextIcon from "@material-ui/icons/NavigateNext";
import PrevIcon from "@material-ui/icons/NavigateBefore";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import visuallyHidden from "@mui/utils/visuallyHidden";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import RefreshIcon from "@material-ui/icons/CachedOutlined";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import SpinnerMui from "components/SpinnerMui";
import Slide from "@mui/material/Slide";
import useDebounce from "custom-hooks/useDebounce";
import st from "styles/module/components/Table.module.scss";
import { TablePagination } from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormRawatInapTable = ({
  baseRoutePath = "/",
  title = "Default title",
  tableHead = [],
  data = [],
  meta = {},
  dataPerPage = 8,
  isUpdatingData,
  updateDataPerPage,
  updateDataNavigate,
  isSearchAvailable = true,
  searchData = () => {},
  refreshData = () => {},
  deleteData = () => {},
  isCustomHeader = false,
  customHeader = <>custom header</>,
  customCreatePath = null,
  selectData = () => {},
}) => {
  const router = useRouter();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(tableHead[0].id);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [confirmationDelete, setConfirmationDelete] = useState({
    state: false,
    data: {},
  });
  const [searchText, setSearchText] = useState("");
  const memoizedSearchText = useMemo(() => searchText, [searchText]);
  const debouncedSearchText = useDebounce(memoizedSearchText, 500);

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
    return order === "desc"
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
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {tableHead.map((headCell, idx) => (
            <TableCell
              key={headCell.id}
              align="left"
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{ paddingLeft: idx === 0 ? 1 : 0 }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                className="font-w-600"
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell align="right" padding="normal" />
        </TableRow>
      </TableHead>
    );
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * dataPerPage - data.length) : 0;
  // --end table operator stuff

  const handleOpenConfirmationDelete = (payload) => {
    setConfirmationDelete({
      state: true,
      data: payload,
    });
  };

  const handleCloseConfirmationDelete = () => {
    setConfirmationDelete((prev) => ({
      ...prev,
      state: false,
    }));
  };

  const handleContinueConfirmationDelete = () => {
    deleteData(confirmationDelete.data.id);
    handleCloseConfirmationDelete();
  };

  const handleNavigate = (payload) => {
    updateDataNavigate(payload);
  };

  const handleRefresh = () => {
    setSearchText("");
    refreshData();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(
    () => {
      if (debouncedSearchText) {
        searchData(debouncedSearchText);
      }
    },
    // eslint-disable-next-line
    [debouncedSearchText] // Only call effect if debounced search term change
  );

  return (
    <>
      <div className={st.container}>
        <div className={st.header}></div>
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", padding: 2 }}>
            <div className="mb-16 flex items-center">
              {isCustomHeader ? (
                customHeader
              ) : (
                <>
                  {isSearchAvailable && (
                    <div style={{ width: "100%" }}>
                      <TextField
                        id={`search-${title}`}
                        label={`Cari ${title}`}
                        sx={{ width: "40%" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        value={searchText}
                        onChange={(e) => {
                          if (e.target.value.length === 0) {
                            handleRefresh();
                          } else {
                            setSearchText(e.target.value);
                          }
                        }}
                      />
                    </div>
                  )}
                  <div style={{ marginLeft: "auto" }}>
                    <Tooltip title="Refresh Data" arrow>
                      <span>
                        <IconButton
                          onClick={isUpdatingData ? null : handleRefresh}
                        >
                          <RefreshIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                </>
              )}
            </div>
            <div>
              {isUpdatingData ? (
                <div
                  className="flex justify-center items-center"
                  style={{ height: "200px" }}
                >
                  <SpinnerMui />
                </div>
              ) : data.length !== 0 ? (
                <>
                  <TableContainer>
                    <Table
                      sx={{ minWidth: 750 }}
                      aria-labelledby={`table${title}`}
                    >
                      <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                      />
                      <TableBody>
                        {stableSort(data, getComparator(order, orderBy))
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, idR) => {
                            return (
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id || idR}
                                onDoubleClick={() => selectData(row)}
                                className="pointer"
                              >
                                {Object.keys(row).map((obKey, idx) => {
                                  // hide medis_id & alamat
                                  if (
                                    obKey === "medis_id" ||
                                    obKey === "alamat"
                                  )
                                    return;
                                  return (
                                    <TableCell
                                      key={idx}
                                      align="left"
                                      padding="none"
                                      sx={{
                                        paddingLeft: idx === 0 ? 1 : 0,
                                        paddingRight: 2,
                                        paddingY: 0.8,
                                      }}
                                    >
                                      {row[obKey]}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}

                        {emptyRows > 0 && (
                          <TableRow
                            style={{
                              height: (dense ? 33 : 53) * emptyRows,
                            }}
                          >
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[8, 16, 24, 32]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                  {/* <div className="flex justify-end items-center pt-16 pb-8">
                    <div>
                      <span className="font-16 mr-16">Rows per page</span>
                      <Select
                        labelId="select-row-per-page"
                        id="select-row-per-page"
                        onChange={updateDataPerPage}
                        value={dataPerPage}
                      >
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={16}>16</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={34}>34</MenuItem>
                      </Select>
                    </div>
                    <div>
                      <Tooltip title="Previous" arrow>
                        <span>
                          <IconButton
                            disabled={meta.prev_page === null}
                            onClick={
                              meta.prev_page !== null
                                ? () => handleNavigate(meta.prev_page)
                                : null
                            }
                          >
                            <PrevIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Next" arrow>
                        <span>
                          <IconButton
                            disabled={meta.next_page === null}
                            onClick={
                              meta.next_page !== null
                                ? () => handleNavigate(meta.next_page)
                                : null
                            }
                          >
                            <NextIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </div> */}
                </>
              ) : (
                <div style={{ textAlign: "center", margin: "12 0" }}>
                  No data found
                </div>
              )}
            </div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default FormRawatInapTable;
