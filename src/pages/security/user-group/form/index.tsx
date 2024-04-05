import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Box, Paper, Grid, TextField, InputLabel } from '@mui/material'
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHeader, FormAlert } from 'components'
import ListIcon from '@mui/icons-material/List'
import * as yup from 'yup'
import { useStyles } from './styles'
import api from 'services/api'
import { IUserGroupDTO } from 'data/dtos/security/i-user-group-dto'

interface IRouteParams {
  id: string
}

const UserGroupForm: React.FC = () => {
  const [mainError, setMainError] = useState('')

  const params = useParams<IRouteParams>()
  const firstInputElement = useRef(null)
  const classes = useStyles()
  const history = useHistory()

  const validationSchema = yup.object().shape({
    name: yup.string()
      .required('Campo obrigatório'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm<IUserGroupDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      disabled: false,
    }
  })

  // initial load

  useEffect(() => {
    async function loadData() {
    }

    loadData()
  }, [])


  // main data load

  useEffect(() => {
    async function loadData() {
      const { id } = params

      // form data

      await api
        .get(`/user-groups/${id}`)
        .then(response => {
          const { data } = response.data

          const userGroupResult = {
            name: data.name,
            disabled: data.disabled,
          }

          return userGroupResult
        })
        .then((userGroupResult: IUserGroupDTO) => {
          reset(userGroupResult)
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

  const onSubmit = useCallback(async (data: IUserGroupDTO) => {
    const payLoad: IUserGroupDTO = {
      name: data.name,
      disabled: data.disabled,
    }

    if (params.id) {
      const { id } = params

      payLoad.id = id

      await api
        .put(`/user-groups`, payLoad)
        .then(history.push('/user-groups'))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    } else {
      await api
        .post('/user-groups', payLoad)
        .then(history.push('/user-groups/new'))
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
          title="Grupos de Usuários"
          icon={ListIcon}
          backRoute="/user-groups"
          showSaveButton={true}
          helpText="Nesta opção serão informados os grupos de usuários da aplicação."
        />

        <FormAlert setMainError={setMainError} mainError={mainError} />

        <Grid container spacing={1} className={mainError === '' ? classes.formContainer : classes.formContainerWithError}>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="name"
              name="name"
              label="Nome"
              error={!!errors.name}
              helperText={errors?.name?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              autoFocus
              inputRef={firstInputElement}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                maxLength: 60
              }}
              {...register("name",
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

export default UserGroupForm
