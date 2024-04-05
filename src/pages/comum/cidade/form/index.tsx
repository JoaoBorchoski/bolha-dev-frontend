import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Box,
  Paper,
  Grid,
  TextField,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { FormControl } from "@mui/material";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import NumericInput from "material-ui-numeric-input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormHeader, FormAlert } from "components";
import ApartmentIcon from "@mui/icons-material/Apartment";
import * as yup from "yup";
import { useStyles } from "./styles";
import api from "services/api";
import { ICidadeDTO } from "data/dtos/comum/i-cidade-dto";

interface IRouteParams {
  id: string;
}

const CidadeForm: React.FC = () => {
  const [mainError, setMainError] = useState("");
  const [estadosA, setEstadosA] = useState([]);

  const params = useParams<IRouteParams>();
  const firstInputElement = useRef(null);
  const classes = useStyles();
  const history = useHistory();

  const validationSchema = yup.object().shape({
    estadoId: yup.string().required("Campo obrigatório"),
    nomeCidade: yup.string().required("Campo obrigatório"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm<ICidadeDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      estadoId: "",
      codigoIbge: "",
      nomeCidade: "",
    },
  });

  // initial load

  useEffect(() => {
    async function loadData() {
      // select UF

      await api
        .post("/estados/select")
        .then((response) => {
          const { data } = response.data;

          return data;
        })
        .then((estadosResult) => {
          setEstadosA(estadosResult);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }

    loadData();
  }, []);

  // main data load

  useEffect(() => {
    async function loadData() {
      const { id } = params;

      // form data

      await api
        .get(`/cidades/${id}`)
        .then((response) => {
          const { data } = response.data;

          const cidadeResult = {
            estadoId: data.estadoId.id,
            codigoIbge: data.codigoIbge,
            nomeCidade: data.nomeCidade,
          };

          return cidadeResult;
        })
        .then((cidadeResult: ICidadeDTO) => {
          reset(cidadeResult);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }

    if (params.id) {
      loadData();
    }
  }, [params, params.id]);

  // data save

  const onSubmit = useCallback(async (data: ICidadeDTO) => {
    const payLoad: ICidadeDTO = {
      estadoId: data.estadoId,
      codigoIbge: data.codigoIbge,
      nomeCidade: data.nomeCidade,
    };

    if (params.id) {
      const { id } = params;

      payLoad.id = id;

      await api
        .put(`/cidades`, payLoad)
        .then(history.push("/cidades"))
        .catch((error) => {
          console.log(error.response.data);
          setMainError(error.response.data.data.name);
          return error.response.data.data;
        });
    } else {
      await api
        .post("/cidades", payLoad)
        .then(history.push("/cidades/new"))
        .then(() => reset())
        .then(() =>
          setTimeout(() => {
            firstInputElement.current.focus();
          }, 0)
        )
        .catch((error) => {
          console.log(error.response.data);
          setMainError(error.response.data.data.name);
          return error.response.data.data;
        });
    }
  }, []);

  const handleChange = (formField: any) => {
    setMainError("");
  };

  return (
    <Paper elevation={3} className={classes.paper}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        data-testid="form"
      >
        <FormHeader
          title="Cidades"
          icon={ApartmentIcon}
          backRoute="/cidades"
          showSaveButton={true}
          helpText=""
        />

        <FormAlert setMainError={setMainError} mainError={mainError} />

        <Grid
          container
          spacing={1}
          className={
            mainError === ""
              ? classes.formContainer
              : classes.formContainerWithError
          }
        >
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              id="estadoId"
              label="UF"
              error={!!errors.estadoId}
              helperText={errors?.estadoId?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              value={`${watch().estadoId}`}
              select
              autoFocus
              inputRef={firstInputElement}
              {...register("estadoId", {
                onChange: (e) => {
                  setValue("estadoId", e.target.value);
                  handleChange(e);
                },
              })}
            >
              {estadosA.map((estado) => (
                <MenuItem key={estado.id} value={estado.id}>
                  {estado.uf}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              id="codigoIbge"
              label="Código IBGE"
              error={!!errors.codigoIbge}
              helperText={errors?.codigoIbge?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                maxLength: 60,
              }}
              {...register("codigoIbge", { onChange: (e) => handleChange(e) })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              id="nomeCidade"
              label="Cidade"
              error={!!errors.nomeCidade}
              helperText={errors?.nomeCidade?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                maxLength: 60,
              }}
              {...register("nomeCidade", { onChange: (e) => handleChange(e) })}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CidadeForm;
