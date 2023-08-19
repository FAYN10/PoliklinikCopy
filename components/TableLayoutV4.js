import { useState, forwardRef, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Box from "@mui/system/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import visuallyHidden from "@mui/utils/visuallyHidden";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PlusIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import NextIcon from "@material-ui/icons/NavigateNext";
import PrevIcon from "@material-ui/icons/NavigateBefore";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import RefreshIcon from "@material-ui/icons/CachedOutlined";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import SpinnerMui from "components/SpinnerMui";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import st from "styles/module/components/Table.module.scss";
import useClientPermission from "custom-hooks/useClientPermission";
import EditIcon from "@material-ui/icons/Edit";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TableLayoutV4 = ({
    baseRoutePath = "/",
    customCreatePath = null,
    title = "Default title",
    customBtnAddTitle = null,
    tableHead = [],
    data = [],
    meta = {},
    dataPerPage = 8,
    isUpdatingData,
    filterOptions = [{ label: "Def label", value: "def_value" }],
    updateDataPerPage = () => { },
    updateDataNavigate = () => { },
    refreshData = () => { },
    deleteData = () => { },
    searchData = () => { },
}) => {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const openAddDialogHandler = () => {
        setOpenAddDialog(true);
    };
    const closeAddDialogHandler = () => {
        setOpenAddDialog(false);
        setNewBmhpData({
            namaBarang: "",
            jumlahBarang: "",
            waktuPemakaian: "",
        });
    };
    const [newBmhpData, setNewBmhpData] = useState({
        namaBarang: "",
        jumlahBarang: "",
        waktuPemakaian: "",
    });
    const addNewBmhpHandler = () => {

    };
    const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState(null);

  const openEditDialogHandler = (data) => {
    setEditData(data);
    setOpenEditDialog(true);
  };

  const closeEditDialogHandler = () => {
    setOpenEditDialog(false);
    setEditData(null);
  };

  const saveEditedDataHandler = () => {

    closeEditDialogHandler();
  };
    const router = useRouter();
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState(tableHead[0].id);
    const [page] = useState(0);
    const [confirmationDelete, setConfirmationDelete] = useState({
        state: false,
        data: {},
    });
    const [searchText, setSearchText] = useState("");
    const { clientPermission } = useClientPermission();
    const [filter, setFilter] = useState(filterOptions[0].value);
    const [selectedFilter, setSelectedFilter] = useState([]);

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
        setSelectedFilter([]);
        refreshData();
    };

    const isPermitted = (payload) => {
        let value = true;
        if (clientPermission.includes("admin")) return value;
        if (
            !clientPermission.includes(`${baseRoutePath.substring(1)}:${payload}`)
        ) {
            value = false;
        }
        return value;
    };

    const handleChangeFilter = (event) => {
        setSearchText("");
        setFilter(event.target.value);
    };

    const handleOnEnterSearch = () => {
        if (!searchText.replace(/\s/g, "").length) {
            setSearchText("");
            return;
        }
        let tempOptions = filterOptions.filter((e) => e.value === filter);
        let tempFilterDisplay = [...selectedFilter];
        tempFilterDisplay = tempFilterDisplay.filter((e) => e.type !== filter);
        tempFilterDisplay.unshift({
            type: filter,
            label: tempOptions[0].label,
            value: searchText,
        });
        setSearchText("");
        setSelectedFilter(tempFilterDisplay);
        searchData(tempFilterDisplay);
    };

    const handleDeleteDisplayFilter = (data) => {
        let tempData = [...selectedFilter];
        tempData = tempData.filter((e) => e.type !== data.type);
        setFilter(data.type);
        setSelectedFilter(tempData);
        searchData(tempData);
    };

    return (
        <>
            <div className={st.container}>
                <div className={st.header}>
                    <h2 className="color-grey-text">{title}</h2>
                    <Button
                        variant="contained"
                        endIcon={<PlusIcon />}
                        disabled={!isPermitted("store")}
                        onClick={openAddDialogHandler} // Aktifkan dialog popup saat tombol Add ditekan
                    >
                        {customBtnAddTitle ? (
                            <>{customBtnAddTitle}</>
                        ) : (
                            <>{title} Baru</>
                        )}
                    </Button>
                </div>
                <Box sx={{ width: "100%", marginY: 4 }}>
                    <Paper sx={{ width: "100%", padding: 2 }}>
                        <Grid container spacing={1} alignItems={"center"}>
                            <Grid item md={2} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="filter-select-label">Filter</InputLabel>
                                    <Select
                                        labelId="filter-select-label"
                                        id="filter-select"
                                        value={filter}
                                        label="Filter"
                                        onChange={handleChangeFilter}
                                    >
                                        {filterOptions.map((e) => (
                                            <MenuItem key={e.value} value={e.value}>
                                                {e.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={8} xs={10}>
                                <TextField
                                    id={`search-${title}`}
                                    label={`Cari ${title}`}
                                    sx={{ width: "100%" }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDownCapture={(e) => {
                                        if (e.key === "Enter") {
                                            handleOnEnterSearch();
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item md={2} xs={2}>
                                <div className="flex justify-end">
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
                            </Grid>
                        </Grid>
                        <div className="flex mt-8">
                            {selectedFilter.map((data) => {
                                return (
                                    <div key={data.type} className="mr-4">
                                        <Chip
                                            label={data.label + ": " + data.value}
                                            onDelete={() => handleDeleteDisplayFilter(data)}
                                        ></Chip>
                                    </div>
                                );
                            })}
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
                                                        page * dataPerPage,
                                                        page * dataPerPage + dataPerPage
                                                    )
                                                    .map((row, idR) => {
                                                        return (
                                                            <TableRow
                                                                hover
                                                                tabIndex={-1}
                                                                key={row.id || idR}
                                                                onDoubleClick={
                                                                    row.id && isPermitted("show")
                                                                        ? () =>
                                                                            router.push(
                                                                                `${baseRoutePath}/${row.id}`
                                                                            )
                                                                        : null
                                                                }
                                                                className="pointer"
                                                            >
                                                                {Object.keys(row).map((obKey, idx) => {
                                                                    if (obKey === "id") return; // Sembunyikan kolom id
                                                                    return (
                                                                        <TableCell
                                                                            key={idx}
                                                                            align="left"
                                                                            padding="none"
                                                                            sx={{
                                                                                paddingLeft: idx === 0 ? 1 : 0,
                                                                                paddingRight: 2,
                                                                            }}
                                                                        >
                                                                            {row[obKey]}
                                                                        </TableCell>
                                                                    );
                                                                })}
                                                                <TableCell
                                                                    align="right"
                                                                    padding="none"
                                                                    sx={{
                                                                        paddingRight: 1,
                                                                        paddingY: 0.8,
                                                                    }}
                                                                >
                                                                    {/* Ikon Edit */}
                                                                    {isPermitted("update") ? (
                                                                        <Tooltip title="Edit" arrow>
                                                                            <IconButton
                                                                                onClick={() => {
                                                                                    // Implement logic to handle editing data
                                                                                }}
                                                                            >
                                                                                <EditIcon color="primary" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <Tooltip title="You don't have permission to edit">
                                                                            <span>
                                                                                <IconButton disabled>
                                                                                    <EditIcon />
                                                                                </IconButton>
                                                                            </span>
                                                                        </Tooltip>
                                                                    )}
                                                                    {/* Ikon Hapus */}
                                                                    {isPermitted("destroy") ? (
                                                                        <Tooltip title="Delete" arrow>
                                                                            <IconButton
                                                                                onClick={(event) => {
                                                                                    event.stopPropagation();
                                                                                    handleOpenConfirmationDelete(row);
                                                                                }}
                                                                            >
                                                                                <DeleteIcon color="error" />
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
                                    <div className="flex justify-end items-center pt-16 pb-8">
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
                                    </div>
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
            <Dialog open={openAddDialog} onClose={closeAddDialogHandler}>
                <DialogTitle>Tambah {title} Baru</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nama Barang"
                        fullWidth
                        variant="outlined"
                        value={newBmhpData.namaBarang}
                        onChange={(e) =>
                            setNewBmhpData({ ...newBmhpData, namaBarang: e.target.value })
                        }
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Jumlah Barang"
                        fullWidth
                        type="number"
                        variant="outlined"
                        value={newBmhpData.jumlahBarang}
                        onChange={(e) =>
                            setNewBmhpData({ ...newBmhpData, jumlahBarang: e.target.value })
                        }
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Waktu Pemakaian"
                        fullWidth
                        type="date"
                        variant="outlined"
                        value={newBmhpData.waktuPemakaian}
                        onChange={(e) =>
                            setNewBmhpData({ ...newBmhpData, waktuPemakaian: e.target.value })
                        }
                        sx={{ marginBottom: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddDialogHandler} color="primary">
                        Batal
                    </Button>
                    <Button onClick={addNewBmhpHandler} color="primary">
                        Tambah
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditDialog} onClose={closeEditDialogHandler}>
        <DialogTitle>Edit Data</DialogTitle>
        <DialogContent>
          {/* Implement form or components for editing data */}
          {/* Use the editData state to fill initial values in the form */}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialogHandler} color="primary">
            Cancel
          </Button>
          <Button onClick={saveEditedDataHandler} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
        </>
    );
};

export default TableLayoutV4;