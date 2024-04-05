import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { CustomTable, FormHeader } from "components";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import { useStyles } from "./styles";
import api from "services/api";
import { ITableHeadCellDTO } from "data/dtos/components/i-table-head-cell-dto";
import { ICandidaturaDTO } from "data/dtos/operacao/i-candidatura-dto";
import { useAlreadyMounted } from "utils/use-already-mounted";

const headCells: ITableHeadCellDTO[] = [
  {
    id: "nome",
    label: "Nome",
    width: 5,
  },
];

const CandidaturaList: React.FC = () => {
  const [loading, setLoading] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [orderByDirection, setOrderByDirection] = useState(true);
  const [rowsCount, setRowsCount] = useState(0);
  const [candidaturasList, setCandidaturasList] = useState<ICandidaturaDTO[]>(
    []
  );
  const [recordToDelete, setRecordToDelete] = useState<string | null>("");
  const [columnOrder, setColumnOrder] = useState<("ASC" | "DESC")[]>([]);

  const classes = useStyles();
  const alreadyMounted = useAlreadyMounted();

  const loadCandidaturas = async () => {
    setLoading(1);

    await api
      .post("/candidaturas/list", { search, page, rowsPerPage, columnOrder })
      .then(async (listResponse) => {
        const { data } = listResponse.data;
        setCandidaturasList(data);

        await api
          .post("/candidaturas/count", { search })
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
      .delete(`/candidaturas/${recordToDelete}`)
      .then(async () => {
        await loadCandidaturas();
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
        loadCandidaturas();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadCandidaturas();
  }, [orderByDirection, rowsPerPage, page]);

  return (
    <Paper elevation={3} className={classes.paper}>
      <FormHeader
        title="Candidaturas"
        icon={BookmarkOutlinedIcon}
        newRoute="/candidaturas/new"
        helpText="Nesta opção serão informados as vagas aplicadas."
      />

      <CustomTable
        headCells={headCells}
        rows={candidaturasList}
        totalRows={rowsCount}
        handleSearch={setSearch}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        page={page}
        editRoute="/candidaturas/edit"
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

export default CandidaturaList;
