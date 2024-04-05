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
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
} from "@mui/material";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import NumericInput from "material-ui-numeric-input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormHeader, FormAlert } from "components";
import DvrOutlinedIcon from "@mui/icons-material/DvrOutlined";
import * as yup from "yup";
import { useStyles } from "./styles";
import api from "services/api";
import { IVagaDTO } from "data/dtos/vagas/i-vaga-dto";

interface IRouteParams {
  id: string;
}

const VagaForm: React.FC = () => {
  const [mainError, setMainError] = useState("");
  const [paisesA, setPaisesA] = useState([]);
  const [estadosB, setEstadosB] = useState([]);
  const [cidadesC, setCidadesC] = useState([]);

  const params = useParams<IRouteParams>();
  const firstInputElement = useRef(null);
  const classes = useStyles();
  const history = useHistory();

  const validationSchema = yup.object().shape({
    nomeVaga: yup.string().required("Campo obrigatório"),
    descricao: yup.string().required("Campo obrigatório"),
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm<IVagaDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nomeVaga: "",
      paisId: "",
      estadoId: "",
      cidadeId: "",
      descricao: "",
      numeroCandidaturas: 0,
      desabilitado: false,
    },
  });

  // initial load

  useEffect(() => {
    async function loadData() {
      // select País

      await api
        .post("/paises/select")
        .then((response) => {
          const { data } = response.data;

          return data;
        })
        .then((paisesResult) => {
          setPaisesA(paisesResult);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });

      // select UF

      await api
        .post("/estados/select")
        .then((response) => {
          const { data } = response.data;

          return data;
        })
        .then((estadosResult) => {
          setEstadosB(estadosResult);
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
          setCidadesC(cidadesResult);
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
        .get(`/vagas/${id}`)
        .then((response) => {
          const { data } = response.data;

          const vagaResult = {
            nomeVaga: data.nomeVaga,
            paisId: data.paisId.id,
            estadoId: data.estadoId.id,
            cidadeId: data.cidadeId.id,
            descricao: data.descricao,
            numeroCandidaturas: data.numeroCandidaturas,
            desabilitado: data.desabilitado,
          };

          return vagaResult;
        })
        .then((vagaResult: IVagaDTO) => {
          reset(vagaResult);
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

  const onSubmit = useCallback(async (data: IVagaDTO) => {
    const payLoad: IVagaDTO = {
      nomeVaga: data.nomeVaga,
      paisId: data.paisId,
      estadoId: data.estadoId,
      cidadeId: data.cidadeId,
      descricao: data.descricao,
      numeroCandidaturas: data.numeroCandidaturas,
      desabilitado: data.desabilitado,
    };

    if (params.id) {
      const { id } = params;

      payLoad.id = id;

      await api
        .put(`/vagas`, payLoad)
        .then(history.push("/vagas"))
        .catch((error) => {
          console.log(error.response.data);
          setMainError(error.response.data.data.name);
          return error.response.data.data;
        });
    } else {
      await api
        .post("/vagas", payLoad)
        .then(history.push("/vagas/new"))
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
          title="Procurar Vagas"
          icon={DvrOutlinedIcon}
          backRoute="/vagas"
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
              id="nomeVaga"
              label="Nome da Vaga"
              error={!!errors.nomeVaga}
              helperText={errors?.nomeVaga?.message}
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
                maxLength: 100,
              }}
              {...register("nomeVaga", { onChange: (e) => handleChange(e) })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              id="paisId"
              label="País"
              error={!!errors.paisId}
              helperText={errors?.paisId?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              value={`${watch().paisId}`}
              select
              {...register("paisId", {
                onChange: (e) => {
                  setValue("paisId", e.target.value);
                  handleChange(e);
                },
              })}
            >
              {paisesA.map((pais) => (
                <MenuItem key={pais.id} value={pais.id}>
                  {pais.nomePais}
                </MenuItem>
              ))}
            </TextField>
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
              {estadosB.map((estado) => (
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
              {cidadesC.map((cidade) => (
                <MenuItem key={cidade.id} value={cidade.id}>
                  {cidade.nomeCidade}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="descricao"
              label="Descrição"
              error={!!errors.descricao}
              helperText={errors?.descricao?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                maxLength: 255,
              }}
              {...register("descricao", { onChange: (e) => handleChange(e) })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <NumericInput
              label="Número de Candidaturas"
              precision={2}
              decimalChar=","
              thousandChar="."
              variant="outlined"
              value={getValues("numeroCandidaturas")}
              {...register("numeroCandidaturas", {
                onChange: (e) => {
                  setValue("numeroCandidaturas", e.target.value);
                  handleChange(e);
                },
              })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormGroup className={classes.checkBox}>
              <Controller
                name="desabilitado"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                      />
                    }
                    label="Desabilitado"
                  />
                )}
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default VagaForm;
