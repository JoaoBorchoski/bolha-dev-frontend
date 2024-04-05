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
import GroupsIcon from "@mui/icons-material/Groups";
import * as yup from "yup";
import { useStyles } from "./styles";
import api from "services/api";
import { ICepDTO } from "data/dtos/comum/i-cep-dto";

interface IRouteParams {
  id: string;
}

const CepForm: React.FC = () => {
  const [mainError, setMainError] = useState("");
  const [estadosA, setEstadosA] = useState([]);
  const [cidadesB, setCidadesB] = useState([]);

  const params = useParams<IRouteParams>();
  const firstInputElement = useRef(null);
  const classes = useStyles();
  const history = useHistory();

  const validationSchema = yup.object().shape({
    codigoCep: yup.string().required("Campo obrigatório"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm<ICepDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      codigoCep: "",
      logradouro: "",
      bairro: "",
      estadoId: "",
      cidadeId: "",
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

      // select Cidade

      await api
        .post("/cidades/select")
        .then((response) => {
          const { data } = response.data;

          return data;
        })
        .then((cidadesResult) => {
          setCidadesB(cidadesResult);
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
        .get(`/ceps/${id}`)
        .then((response) => {
          const { data } = response.data;

          const cepResult = {
            codigoCep: data.codigoCep,
            logradouro: data.logradouro,
            bairro: data.bairro,
            estadoId: data.estadoId.id,
            cidadeId: data.cidadeId.id,
          };

          return cepResult;
        })
        .then((cepResult: ICepDTO) => {
          reset(cepResult);
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

  const onSubmit = useCallback(async (data: ICepDTO) => {
    const payLoad: ICepDTO = {
      codigoCep: data.codigoCep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      estadoId: data.estadoId,
      cidadeId: data.cidadeId,
    };

    if (params.id) {
      const { id } = params;

      payLoad.id = id;

      await api
        .put(`/ceps`, payLoad)
        .then(history.push("/ceps"))
        .catch((error) => {
          console.log(error.response.data);
          setMainError(error.response.data.data.name);
          return error.response.data.data;
        });
    } else {
      await api
        .post("/ceps", payLoad)
        .then(history.push("/ceps/new"))
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
          title="CEP"
          icon={GroupsIcon}
          backRoute="/ceps"
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
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              id="codigoCep"
              label="CEP"
              error={!!errors.codigoCep}
              helperText={errors?.codigoCep?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              autoFocus
              inputRef={firstInputElement}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                maxLength: 8,
              }}
              {...register("codigoCep", { onChange: (e) => handleChange(e) })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              id="logradouro"
              label="Logradouro"
              error={!!errors.logradouro}
              helperText={errors?.logradouro?.message}
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
              {...register("logradouro", { onChange: (e) => handleChange(e) })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              id="bairro"
              label="Bairro"
              error={!!errors.bairro}
              helperText={errors?.bairro?.message}
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
              {...register("bairro", { onChange: (e) => handleChange(e) })}
            />
          </Grid>

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
              id="cidadeId"
              label="Cidade"
              error={!!errors.cidadeId}
              helperText={errors?.cidadeId?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              value={`${watch().cidadeId}`}
              select
              {...register("cidadeId", {
                onChange: (e) => {
                  setValue("cidadeId", e.target.value);
                  handleChange(e);
                },
              })}
            >
              {cidadesB.map((cidade) => (
                <MenuItem key={cidade.id} value={cidade.id}>
                  {cidade.nomeCidade}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CepForm;
