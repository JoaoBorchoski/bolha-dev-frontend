import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  LinearProgress,
  Alert,
} from "@mui/material";
import { useStyles } from "./styles";
// import logoImage from 'assets/transparent-pixel.png'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoginFooter from "components/login-footer";
import api from "services/api";

interface IForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainError, setMainError] = useState("");

  const history = useHistory();
  const classes = useStyles();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Nome is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is requred"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = useCallback(
    async (data: IForgotPasswordFormData) => {
      try {
        setIsLoading(true);

        await api.post("/password/forgot", {
          email: data.email,
        });

        setIsLoading(false);
        history.push("/");
      } catch (err) {
        setIsLoading(false);
        setMainError("Erro ao solicitar reset de senha!");
      }
    },
    [history]
  );

  const handleChange = (formField: any) => {
    setMainError("");
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.mainWrapper}>
        <Paper elevation={3} className={classes.paperWrapper}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            data-testid="form"
            className={classes.formBox}
          >
            {/* <img src={logoImage} className={classes.logoImage} alt="Logo" /> */}

            <h3 className={classes.formTitle}>Recuperar Senha</h3>

            <TextField
              required
              id="email"
              label="Digite seu e-mail"
              type="email"
              autoFocus
              variant="outlined"
              error={Boolean(errors.email)}
              {...register("email", { onChange: (e) => handleChange(e) })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2, mb: 1 }}
            >
              Recuperar
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2" data-testid="signup-link">
                  Voltar ao Login
                </Link>
              </Grid>
              <Grid item xs className={classes.signupLink}>
                <span />
              </Grid>
            </Grid>

            {isLoading && <LinearProgress className={classes.linearProgress} />}

            {mainError !== "" && (
              <Alert severity="error" className={classes.alert}>
                {mainError}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>

      <LoginFooter />
    </Box>
  );
};

export default ForgotPassword;
