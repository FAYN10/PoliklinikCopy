import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers//LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { format as formatFns } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import Grid from "@mui/material/Grid";
import { formatIsoToGen } from "utils/formatTime";
import { Button } from "@mui/material";

const RawatJalanHeader = ({ refreshData = () => {} }) => {
  const today = formatFns(new Date(), "MM-dd-yyyy");
  const [filter, setFilter] = useState("no_rm");
  const [filterText, setFilterText] = useState("");
  const [date, setDate] = useState(null);

  const handleChangeFilter = (event) => {
    setFilter(event.target.value);
  };
  const handleChangeDate = (newValue) => {
    setDate(newValue);
  };

  const handleRefreshData = () => {
    setFilter("no_rm");
    setFilterText("");
    setDate(null);
    refreshData({});
  };

  const handleOnSearch = () => {
    let data = {
      datetime_medis: formatIsoToGen(date) || null,
      filter,
      filter_value: "",
    };
    data.filter_value = filterText;
    if (data.filter_value === "") {
      delete data.filter;
      delete data.filter_value;
    } else if (!data.datetime_medis) {
      delete data.datetime_medis;
    }
    refreshData(data);
  };

  return (
    <div className="full-width">
      <Grid container spacing={1} alignItems={"center"}>
        <Grid item md={2}>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Tanggal"
                inputFormat="dd/MM/yyyy"
                value={date}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter}
              label="Filter"
              onChange={handleChangeFilter}
            >
              <MenuItem value={"no_rm"}>No. RM</MenuItem>
              <MenuItem value={"nama_pasien"}>Nama Pasien</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={5}>
          <TextField
            fullWidth
            variant="outlined"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Grid>
        <Grid item md={3}>
          <div className="flex full-height full-width">
            <Button
              type="button"
              color="primary"
              variant="outlined"
              startIcon={<SearchIcon />}
              className="full-width"
              onClick={handleOnSearch}
              size="large"
              sx={{ padding: "14px 21px" }}
            >
              Cari
            </Button>
            <div className="mr-4"></div>
            <Button
              type="button"
              color="warning"
              variant="outlined"
              startIcon={<RefreshIcon />}
              className="full-width"
              onClick={handleRefreshData}
            >
              Reset
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default RawatJalanHeader;
