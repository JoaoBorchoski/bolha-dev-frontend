import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Box, Paper, Grid, TextField, InputLabel, MenuItem } from '@mui/material'
import { Checkbox } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHeader, FormAlert } from 'components'
import ListIcon from '@mui/icons-material/List'
import * as yup from 'yup'
import { useStyles } from './styles'
import api from 'services/api'
import { INavigationDTO } from 'data/dtos/security/i-navigation-dto'

interface IRouteParams {
  id: string
}

const NavigationForm: React.FC = () => {
  const [mainError, setMainError] = useState('')
  const [users, setUsers] = useState([])

  const params = useParams<IRouteParams>()
  const firstInputElement = useRef(null)
  const classes = useStyles()
  const history = useHistory()

  const validationSchema = yup.object().shape({
    userId: yup.string()
      .required('Campo obrigatório'),
    navigationDate: yup.string()
      .required('Campo obrigatório'),
    route: yup.string()
      .required('Campo obrigatório'),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    control
  } = useForm<INavigationDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      userId: null,
      route: '',
    }
  })

  // initial load

  useEffect(() => {
    async function loadData() {

      // select Usuário

      await api
        .post('/users/select')
        .then(response => {
          const { data } = response.data

          return data
        })
        .then((usersResult) => {
          setUsers(usersResult)
        })
        .catch(error => {
          console.log(error)
          return error
        })
    }

    loadData()
  }, [])


  // main data load

  useEffect(() => {
    async function loadData() {
      const { id } = params

      // form data

      await api
        .get(`/navigations/${id}`)
        .then(response => {
          const { data } = response.data

          const navigationResult = {
            userId: data.userId.id,
            navigationDate: data.navigationDate,
            route: data.route,
          }

          return navigationResult
        })
        .then((navigationResult: INavigationDTO) => {
          reset(navigationResult)
        })
        .catch(error => {
          console.log(error)
          return error
        })
    }

    if (params.id) {
      loadData()
    }
  }, [params, params.id])


  // data save

  const onSubmit = useCallback(async (data: INavigationDTO) => {
    const payLoad: INavigationDTO = {
      userId: data.userId,
      navigationDate: data.navigationDate,
      route: data.route,
    }

    if (params.id) {
      const { id } = params

      payLoad.id = id

      await api
        .put(`/navigations`, payLoad)
        .then(history.push('/navigations'))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    } else {
      await api
        .post('/navigations', payLoad)
        .then(history.push('/navigations/new'))
        .then(() => reset())
        .then(() => setTimeout(() => { firstInputElement.current.focus() }, 0))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    }
  }, [])


  const handleChange = (formField: any) => {
    setMainError('')
  }


  return (
    <Paper elevation={3} className={classes.paper}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        data-testid="form"
      >
        <FormHeader
          title="Navegação"
          icon={ListIcon}
          backRoute="/navigations"
          showSaveButton={true}
          helpText="Nesta opção serão armazenados os históricos de navegação do usuário pelas diversas áreas da aplicação."
        />

        <FormAlert setMainError={setMainError} mainError={mainError} />

        <Grid container spacing={1} className={mainError === '' ? classes.formContainer : classes.formContainerWithError}>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="userId"
              name="userId"
              label="Usuário"
              error={!!errors.userId}
              helperText={errors?.userId?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              value={`${watch().userId}`}
              select
              autoFocus
              inputRef={firstInputElement}
              {...register("userId", { onChange: (e) => {
                setValue("userId", e.target.value)
                handleChange(e)
              }})}
            >
            {users.map((user) => (
              <MenuItem
                key={user.id}
                value={user.id}
              >
                {user.name}
              </MenuItem>
            ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="navigationDate"
              name="navigationDate"
              label="Data"
              error={!!errors.navigationDate}
              helperText={errors?.navigationDate?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              type="date"
              InputLabelProps={{
                shrink: true
              }}
              {...register("navigationDate",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="route"
              name="route"
              label="Rota"
              error={!!errors.route}
              helperText={errors?.route?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                maxLength: 500
              }}
              {...register("route",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

        </Grid>
      </Box>
    </Paper>
  )
}

export default NavigationForm
