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
import { useAuth } from "hooks/auth";
import { useStyles } from "./styles";
// import logoImage from 'assets/transparent-pixel.png'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoginFooter from "components/login-footer";

interface ISignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainError, setMainError] = useState("");

  const { signIn } = useAuth();
  const history = useHistory();
  const classes = useStyles();

  const validationSchema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is requred"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = useCallback(
    async (data: ISignInFormData) => {
      try {
        setIsLoading(true);

        await signIn({
          email: data.email,
          password: data.password,
        });

        setIsLoading(false);
        history.push("/home");
      } catch (err) {
        setIsLoading(false);
        setMainError("Erro ao acessar. Verifique email ou senha!");
      }
    },
    [signIn, history]
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

            <h3 className={classes.formTitle}>Login</h3>

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

            <TextField
              required
              id="password"
              label="Digite sua senha"
              type="password"
              autoComplete="new-password"
              variant="outlined"
              error={Boolean(errors.password)}
              {...register("password", { onChange: (e) => handleChange(e) })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2, mb: 1 }}
            >
              Acessar
            </Button>

            <Grid container>
              <Grid item xs>
                <Link
                  href="/forgot-password"
                  variant="body2"
                  data-testid="signup-link"
                >
                  Esqueceu sua senha?
                </Link>
              </Grid>
              <Grid item xs className={classes.signupLink}>
                <Link href="/signup" variant="body2" data-testid="signup-link">
                  Crie sua conta!
                </Link>
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

export default SignIn;
