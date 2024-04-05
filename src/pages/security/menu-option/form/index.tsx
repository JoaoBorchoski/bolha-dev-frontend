import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Box, Paper, Grid, TextField, InputLabel, MenuItem } from '@mui/material'
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHeader, FormAlert } from 'components'
import ListIcon from '@mui/icons-material/List'
import * as yup from 'yup'
import { useStyles } from './styles'
import api from 'services/api'
import { IMenuOptionDTO } from 'data/dtos/security/i-menu-option-dto'

interface IRouteParams {
  id: string
}

const MenuOptionForm: React.FC = () => {
  const [mainError, setMainError] = useState('')
  const [modules, setModules] = useState([])

  const params = useParams<IRouteParams>()
  const firstInputElement = useRef(null)
  const classes = useStyles()
  const history = useHistory()

  const validationSchema = yup.object().shape({
    moduleId: yup.string()
      .required('Campo obrigatório'),
    sequence: yup.string()
      .required('Campo obrigatório'),
    label: yup.string()
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
  } = useForm<IMenuOptionDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      moduleId: null,
      sequence: '',
      label: '',
      route: '',
      icon: '',
      key: '',
      disabled: false,
    }
  })

  // initial load

  useEffect(() => {
    async function loadData() {

      // select Modulo

      await api
        .post('/modules/select')
        .then(response => {
          const { data } = response.data

          return data
        })
        .then((modulesResult) => {
          setModules(modulesResult)
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
        .get(`/menu-options/${id}`)
        .then(response => {
          const { data } = response.data

          const menuOptionResult = {
            moduleId: data.moduleId.id,
            sequence: data.sequence,
            label: data.label,
            route: data.route,
            icon: data.icon,
            key: data.key,
            disabled: data.disabled,
          }

          return menuOptionResult
        })
        .then((menuOptionResult: IMenuOptionDTO) => {
          reset(menuOptionResult)
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

  const onSubmit = useCallback(async (data: IMenuOptionDTO) => {
    const payLoad: IMenuOptionDTO = {
      moduleId: data.moduleId,
      sequence: data.sequence,
      label: data.label,
      route: data.route,
      icon: data.icon,
      key: data.key,
      disabled: data.disabled,
    }

    if (params.id) {
      const { id } = params

      payLoad.id = id

      await api
        .put(`/menu-options`, payLoad)
        .then(history.push('/menu-options'))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    } else {
      await api
        .post('/menu-options', payLoad)
        .then(history.push('/menu-options/new'))
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
          title="Opções de Menu"
          icon={ListIcon}
          backRoute="/menu-options"
          showSaveButton={true}
          helpText="Nesta opção serão informados os menus de opção da aplicação."
        />

        <FormAlert setMainError={setMainError} mainError={mainError} />

        <Grid container spacing={1} className={mainError === '' ? classes.formContainer : classes.formContainerWithError}>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="moduleId"
              name="moduleId"
              label="Modulo"
              error={!!errors.moduleId}
              helperText={errors?.moduleId?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              value={`${watch().moduleId}`}
              select
              autoFocus
              inputRef={firstInputElement}
              {...register("moduleId", { onChange: (e) => {
                setValue("moduleId", e.target.value)
                handleChange(e)
              }})}
            >
            {modules.map((module) => (
              <MenuItem
                key={module.id}
                value={module.id}
              >
                {module.name}
              </MenuItem>
            ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="sequence"
              name="sequence"
              label="Sequência"
              error={!!errors.sequence}
              helperText={errors?.sequence?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                maxLength: 20
              }}
              {...register("sequence",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="label"
              name="label"
              label="Título"
              error={!!errors.label}
              helperText={errors?.label?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                maxLength: 60
              }}
              {...register("label",
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
                maxLength: 100
              }}
              {...register("route",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="icon"
              name="icon"
              label="Ícone"
              error={!!errors.icon}
              helperText={errors?.icon?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                maxLength: 20
              }}
              {...register("icon",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="key"
              name="key"
              label="Identificador"
              error={!!errors.key}
              helperText={errors?.key?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                maxLength: 255
              }}
              {...register("key",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormGroup className={classes.checkBox}>
              <Controller
                name="disabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                      />
                    }
                    label="Inativo"
                  />
                )}
              />
            </FormGroup>
          </Grid>

        </Grid>
      </Box>
    </Paper>
  )
}

export default MenuOptionForm
