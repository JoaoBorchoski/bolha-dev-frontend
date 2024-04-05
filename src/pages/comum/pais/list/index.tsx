import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { CustomTable, FormHeader } from "components";
import PublicIcon from "@mui/icons-material/Public";
import { useStyles } from "./styles";
import api from "services/api";
import { ITableHeadCellDTO } from "data/dtos/components/i-table-head-cell-dto";
import { IPaisDTO } from "data/dtos/comum/i-pais-dto";
import { useAlreadyMounted } from "utils/use-already-mounted";

const headCells: ITableHeadCellDTO[] = [
  {
    id: "codigoPais",
    label: "Código País",
    width: 2,
  },
  {
    id: "nomePais",
    label: "Nome do País",
    width: 9,
  },
];

const PaisList: React.FC = () => {
  const [loading, setLoading] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [orderByDirection, setOrderByDirection] = useState(true);
  const [rowsCount, setRowsCount] = useState(0);
  const [paisesList, setPaisesList] = useState<IPaisDTO[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<string | null>("");
  const [columnOrder, setColumnOrder] = useState<("ASC" | "DESC")[]>([]);

  const classes = useStyles();
  const alreadyMounted = useAlreadyMounted();

  const loadPaises = async () => {
    setLoading(1);

    await api
      .post("/paises/list", { search, page, rowsPerPage, columnOrder })
      .then(async (listResponse) => {
        const { data } = listResponse.data;
        setPaisesList(data);

        await api
          .post("/paises/count", { search })
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
      .delete(`/paises/${recordToDelete}`)
      .then(async () => {
        await loadPaises();
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
        loadPaises();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadPaises();
  }, [orderByDirection, rowsPerPage, page]);

  return (
    <Paper elevation={3} className={classes.paper}>
      <FormHeader
        title="Países"
        icon={PublicIcon}
        newRoute="/paises/new"
        helpText=""
      />

      <CustomTable
        headCells={headCells}
        rows={paisesList}
        totalRows={rowsCount}
        handleSearch={setSearch}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        page={page}
        editRoute="/paises/edit"
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

export default PaisList;
