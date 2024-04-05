import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { CustomTable, FormHeader } from "components";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useStyles } from "./styles";
import api from "services/api";
import { ITableHeadCellDTO } from "data/dtos/components/i-table-head-cell-dto";
import { ICidadeDTO } from "data/dtos/comum/i-cidade-dto";
import { useAlreadyMounted } from "utils/use-already-mounted";

const headCells: ITableHeadCellDTO[] = [
  {
    id: "uf",
    label: "UF",
    width: 1,
  },
  {
    id: "nomeCidade",
    label: "Cidade",
    width: 10,
  },
];

const CidadeList: React.FC = () => {
  const [loading, setLoading] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [orderByDirection, setOrderByDirection] = useState(true);
  const [rowsCount, setRowsCount] = useState(0);
  const [cidadesList, setCidadesList] = useState<ICidadeDTO[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<string | null>("");
  const [columnOrder, setColumnOrder] = useState<("ASC" | "DESC")[]>([]);

  const classes = useStyles();
  const alreadyMounted = useAlreadyMounted();

  const loadCidades = async () => {
    setLoading(1);

    await api
      .post("/cidades/list", { search, page, rowsPerPage, columnOrder })
      .then(async (listResponse) => {
        const { data } = listResponse.data;
        setCidadesList(data);

        await api
          .post("/cidades/count", { search })
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
      .delete(`/cidades/${recordToDelete}`)
      .then(async () => {
        await loadCidades();
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
        loadCidades();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadCidades();
  }, [orderByDirection, rowsPerPage, page]);

  return (
    <Paper elevation={3} className={classes.paper}>
      <FormHeader
        title="Cidades"
        icon={ApartmentIcon}
        newRoute="/cidades/new"
        helpText=""
      />

      <CustomTable
        headCells={headCells}
        rows={cidadesList}
        totalRows={rowsCount}
        handleSearch={setSearch}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        page={page}
        editRoute="/cidades/edit"
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

export default CidadeList;
