import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { CustomTable, FormHeader } from "components";
import GroupsIcon from "@mui/icons-material/Groups";
import { useStyles } from "./styles";
import api from "services/api";
import { ITableHeadCellDTO } from "data/dtos/components/i-table-head-cell-dto";
import { ICepDTO } from "data/dtos/comum/i-cep-dto";
import { useAlreadyMounted } from "utils/use-already-mounted";

const headCells: ITableHeadCellDTO[] = [
  {
    id: "codigoCep",
    label: "CEP",
    width: 2,
  },
  {
    id: "logradouro",
    label: "Logradouro",
    width: 6,
  },
  {
    id: "bairro",
    label: "Bairro",
    width: 2,
  },
];

const CepList: React.FC = () => {
  const [loading, setLoading] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [orderByDirection, setOrderByDirection] = useState(true);
  const [rowsCount, setRowsCount] = useState(0);
  const [cepsList, setCepsList] = useState<ICepDTO[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<string | null>("");
  const [columnOrder, setColumnOrder] = useState<("ASC" | "DESC")[]>([]);

  const classes = useStyles();
  const alreadyMounted = useAlreadyMounted();

  const loadCeps = async () => {
    setLoading(1);

    await api
      .post("/ceps/list", { search, page, rowsPerPage, columnOrder })
      .then(async (listResponse) => {
        const { data } = listResponse.data;
        setCepsList(data);

        await api
          .post("/ceps/count", { search })
          .then((countResponse) => {
            const { count } = countResponse.data.data;
            setRowsCount(count);
          })
          .then(() => setLoading(0))
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = async () => {
    await api
      .delete(`/ceps/${recordToDelete}`)
      .then(async () => {
        await loadCeps();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!alreadyMounted) {
        loadCeps();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadCeps();
  }, [orderByDirection, rowsPerPage, page]);

  return (
    <Paper elevation={3} className={classes.paper}>
      <FormHeader
        title="CEP"
        icon={GroupsIcon}
        newRoute="/ceps/new"
        helpText=""
      />

      <CustomTable
        headCells={headCells}
        rows={cepsList}
        totalRows={rowsCount}
        handleSearch={setSearch}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        page={page}
        editRoute="/ceps/edit"
        handleDelete={handleDelete}
        handleRecordToDelete={setRecordToDelete}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        orderByDirection={orderByDirection}
        setOrderByDirection={setOrderByDirection}
      />
    </Paper>
  );
};

export default CepList;
