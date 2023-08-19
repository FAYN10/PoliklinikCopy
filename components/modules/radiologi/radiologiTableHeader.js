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
import SelectAsync from "components/SelectAsync";
import { getListOptionPoliklinik } from "api/poliklinik";
import { getListOptionDoctor } from "api/doctor";
import { formatIsoToGen } from "utils/formatTime";
import { Button } from "@mui/material";

const RadiologiTableHeader = ({ refreshData = () => {} }) => {
  const today = formatFns(new Date(), "MM-dd-yyyy");
  const [filter, setFilter] = useState("no_rm");
  const [filterText, setFilterText] = useState("");
  const [date, setDate] = useState(null);
  const [poliRef, setPoliRef] = useState({
    values: {
      id: "",
      name: "",
    },
    touched: false,
    errors: false,
  });
  const [doctorRef, setDoctorRef] = useState({
    values: {
      DR_ID: "",
      NAME: "",
    },
    touched: false,
    errors: false,
  });

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
    setPoliRef({
      values: {
        id: "",
        name: "",
      },
      touched: false,
      errors: false,
    });
    setDoctorRef({
      values: {
        DR_ID: "",
        NAME: "",
      },
      touched: false,
      errors: false,
    });
    refreshData({});
  };

  const handleOnSearch = () => {
    let data = {
      datetime_medis: formatIsoToGen(date) || null,
      filter,
      filter_value: "",
    };
    if (filter === "no_rm" || filter === "nama_pasien") {
      data.filter_value = filterText;
    } else if (filter === "poli") {
      data.filter_value = poliRef.values.id;
    } else if (filter === "doctor") {
      data.filter_value = poliRef.values.DR_ID;
    }
    if (data.filter_value === "") {
      delete data.filter;
      delete data.filter_value;
    } else if (!data.datetime_medis) {
      delete data.datetime_medis;
    }
    refreshData(data);
  };

  const renderFieldFilter =
    filter === "no_rm" || filter === "nama_pasien" ? (
      <TextField
        fullWidth
        variant="outlined"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    ) : filter === "poli" ? (
      <SelectAsync
        id="poli"
        labelField="Poliklinik"
        labelOptionRef="name"
        valueOptionRef="id"
        handlerRef={poliRef}
        handlerFetchData={getListOptionPoliklinik}
        handlerOnChange={(value) => {
          if (value) {
            setPoliRef((e) => ({
              ...e,
              values: {
                ...value,
              },
            }));
          } else {
            setPoliRef((e) => ({
              ...e,
              values: {
                id: "",
                name: "",
              },
            }));
          }
        }}
      />
    ) : filter === "doctor" ? (
      <SelectAsync
        id="doctor"
        labelField="Dokter"
        labelOptionRef="NAME"
        valueOptionRef="DR_ID"
        handlerRef={doctorRef}
        handlerFetchData={getListOptionDoctor}
        handlerOnChange={(value) => {
          if (value) {
            setDoctorRef((e) => ({
              ...e,
              values: {
                ...value,
              },
            }));
          } else {
            setDoctorRef((e) => ({
              ...e,
              values: {
                DR_ID: "",
                NAME: "",
              },
            }));
          }
        }}
      />
    ) : null;

  return (
    <div className="full-width">
      <Grid container spacing={1} alignItems={"center"}>
        <Grid item md={3}>
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
              <MenuItem value={"poli"}>Poli</MenuItem>
              <MenuItem value={"doctor"}>Dokter</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={9}>
          {renderFieldFilter}
        </Grid>
        <Grid item md={6}>
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
        <Grid item md={6}>
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

export default RadiologiTableHeader;
