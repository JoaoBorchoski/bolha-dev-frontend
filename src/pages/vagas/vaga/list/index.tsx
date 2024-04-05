import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { CustomTable, FormHeader } from "components";
import DvrOutlinedIcon from "@mui/icons-material/DvrOutlined";
import { useStyles } from "./styles";
import api from "services/api";
import { ITableHeadCellDTO } from "data/dtos/components/i-table-head-cell-dto";
import { IVagaDTO } from "data/dtos/vagas/i-vaga-dto";
import { useAlreadyMounted } from "utils/use-already-mounted";

const headCells: ITableHeadCellDTO[] = [
  {
    id: "nomeVaga",
    label: "Nome da Vaga",
    width: 5,
  },
];

const VagaList: React.FC = () => {
  const [loading, setLoading] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [orderByDirection, setOrderByDirection] = useState(true);
  const [rowsCount, setRowsCount] = useState(0);
  const [vagasList, setVagasList] = useState<IVagaDTO[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<string | null>("");
  const [columnOrder, setColumnOrder] = useState<("ASC" | "DESC")[]>([]);

  const classes = useStyles();
  const alreadyMounted = useAlreadyMounted();

  const loadVagas = async () => {
    setLoading(1);

    await api
      .post("/vagas/list", { search, page, rowsPerPage, columnOrder })
      .then(async (listResponse) => {
        const { data } = listResponse.data;
        setVagasList(data);

        await api
          .post("/vagas/count", { search })
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
      .delete(`/vagas/${recordToDelete}`)
      .then(async () => {
        await loadVagas();
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
        loadVagas();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadVagas();
  }, [orderByDirection, rowsPerPage, page]);

  return (
    <Paper elevation={3} className={classes.paper}>
      <FormHeader
        title="Procurar Vagas"
        icon={DvrOutlinedIcon}
        newRoute="/vagas/new"
        helpText=""
      />

      <CustomTable
        headCells={headCells}
        rows={vagasList}
        totalRows={rowsCount}
        handleSearch={setSearch}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        page={page}
        editRoute="/vagas/edit"
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

export default VagaList;
