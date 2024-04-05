import React, { useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
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

interface IResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainError, setMainError] = useState("");

  const history = useHistory();
  const location = useLocation();

  const classes = useStyles();

  const validationSchema = yup.object().shape({
    password: yup.string().required("Senha obrigatória"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Confirmação incorreta"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetPasswordFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = useCallback(
    async (data: IResetPasswordFormData) => {
      try {
        setIsLoading(true);

        const { password, password_confirmation } = data;
        const token = location.search.replace("?token=", "");

        if (!token) {
          throw new Error();
        }

        await api.post("/password/reset", {
          password,
          password_confirmation,
          token,
        });

        setIsLoading(false);
        history.push("/");
      } catch (err) {
        setIsLoading(false);
        setMainError("Erro ao resetar a senha!");
      }
    },
    [location.search, history]
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

            <h3 className={classes.formTitle}>Resetar senha</h3>

            <TextField
              required
              id="password"
              label="Digite sua senha"
              type="password"
              autoFocus
              autoComplete="new-password"
              variant="outlined"
              error={Boolean(errors.password)}
              {...register("password", { onChange: (e) => handleChange(e) })}
            />

            <TextField
              required
              id="password_confirmation"
              label="Digite sua senha"
              type="password"
              autoComplete="new-password"
              variant="outlined"
              error={Boolean(errors.password_confirmation)}
              {...register("password_confirmation", {
                onChange: (e) => handleChange(e),
              })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2, mb: 1 }}
            >
              Resetar
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

export default ResetPassword;
