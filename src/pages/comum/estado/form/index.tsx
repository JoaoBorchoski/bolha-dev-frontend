import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Box, Paper, Grid, TextField, InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import NumericInput from "material-ui-numeric-input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormHeader, FormAlert } from "components";
import PublicIcon from "@mui/icons-material/Public";
import * as yup from "yup";
import { useStyles } from "./styles";
import api from "services/api";
import { IEstadoDTO } from "data/dtos/comum/i-estado-dto";

interface IRouteParams {
  id: string;
}

const EstadoForm: React.FC = () => {
  const [mainError, setMainError] = useState("");

  const params = useParams<IRouteParams>();
  const firstInputElement = useRef(null);
  const classes = useStyles();
  const history = useHistory();

  const validationSchema = yup.object().shape({
    codigoIbge: yup.string().required("Campo obrigatório"),
    uf: yup.string().required("Campo obrigatório"),
    nomeEstado: yup.string().required("Campo obrigatório"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<IEstadoDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      codigoIbge: "",
      uf: "",
      nomeEstado: "",
    },
  });

  // initial load

  useEffect(() => {
    async function loadData() {}

    loadData();
  }, []);

  // main data load

  useEffect(() => {
    async function loadData() {
      const { id } = params;

      // form data

      await api
        .get(`/estados/${id}`)
        .then((response) => {
          const { data } = response.data;

          const estadoResult = {
            codigoIbge: data.codigoIbge,
            uf: data.uf,
            nomeEstado: data.nomeEstado,
          };

          return estadoResult;
        })
        .then((estadoResult: IEstadoDTO) => {
          reset(estadoResult);
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

  const onSubmit = useCallback(async (data: IEstadoDTO) => {
    const payLoad: IEstadoDTO = {
      codigoIbge: data.codigoIbge,
      uf: data.uf,
      nomeEstado: data.nomeEstado,
    };

    if (params.id) {
      const { id } = params;

      payLoad.id = id;

      await api
        .put(`/estados`, payLoad)
        .then(history.push("/estados"))
        .catch((error) => {
          console.log(error.response.data);
          setMainError(error.response.data.data.name);
          return error.response.data.data;
        });
    } else {
      await api
        .post("/estados", payLoad)
        .then(history.push("/estados/new"))
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
          title="Estados"
          icon={PublicIcon}
          backRoute="/estados"
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
              id="codigoIbge"
              label="Código IBGE"
              error={!!errors.codigoIbge}
              helperText={errors?.codigoIbge?.message}
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
                maxLength: 60,
              }}
              {...register("codigoIbge", { onChange: (e) => handleChange(e) })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              id="uf"
              label="UF"
              error={!!errors.uf}
              helperText={errors?.uf?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                maxLength: 2,
              }}
              {...register("uf", { onChange: (e) => handleChange(e) })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              id="nomeEstado"
              label="Nome do Estado"
              error={!!errors.nomeEstado}
              helperText={errors?.nomeEstado?.message}
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
              {...register("nomeEstado", { onChange: (e) => handleChange(e) })}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EstadoForm;
