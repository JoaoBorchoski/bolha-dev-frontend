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
import { IPaisDTO } from "data/dtos/comum/i-pais-dto";

interface IRouteParams {
  id: string;
}

const PaisForm: React.FC = () => {
  const [mainError, setMainError] = useState("");

  const params = useParams<IRouteParams>();
  const firstInputElement = useRef(null);
  const classes = useStyles();
  const history = useHistory();

  const validationSchema = yup.object().shape({
    codigoPais: yup.string().required("Campo obrigatório"),
    nomePais: yup.string().required("Campo obrigatório"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<IPaisDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      codigoPais: "",
      nomePais: "",
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
        .get(`/paises/${id}`)
        .then((response) => {
          const { data } = response.data;

          const paisResult = {
            codigoPais: data.codigoPais,
            nomePais: data.nomePais,
          };

          return paisResult;
        })
        .then((paisResult: IPaisDTO) => {
          reset(paisResult);
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

  const onSubmit = useCallback(async (data: IPaisDTO) => {
    const payLoad: IPaisDTO = {
      codigoPais: data.codigoPais,
      nomePais: data.nomePais,
    };

    if (params.id) {
      const { id } = params;

      payLoad.id = id;

      await api
        .put(`/paises`, payLoad)
        .then(history.push("/paises"))
        .catch((error) => {
          console.log(error.response.data);
          setMainError(error.response.data.data.name);
          return error.response.data.data;
        });
    } else {
      await api
        .post("/paises", payLoad)
        .then(history.push("/paises/new"))
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
          title="Países"
          icon={PublicIcon}
          backRoute="/paises"
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
              id="codigoPais"
              label="Código País"
              error={!!errors.codigoPais}
              helperText={errors?.codigoPais?.message}
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
              {...register("codigoPais", { onChange: (e) => handleChange(e) })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              id="nomePais"
              label="Nome do País"
              error={!!errors.nomePais}
              helperText={errors?.nomePais?.message}
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
              {...register("nomePais", { onChange: (e) => handleChange(e) })}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PaisForm;
