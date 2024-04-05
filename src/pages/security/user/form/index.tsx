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
import { IUserDTO } from 'data/dtos/security/i-user-dto'

interface IRouteParams {
  id: string
}

const UserForm: React.FC = () => {
  const [mainError, setMainError] = useState('')
  const [userGroups, setUserGroups] = useState([])
  const [blockReasons, setBlockReasons] = useState([])

  const params = useParams<IRouteParams>()
  const firstInputElement = useRef(null)
  const classes = useStyles()
  const history = useHistory()

  const validationSchema = yup.object().shape({
    userGroupId: yup.string()
      .required('Campo obrigatório'),
    name: yup.string()
      .required('Campo obrigatório'),
    email: yup.string()
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
  } = useForm<IUserDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      userGroupId: null,
      name: '',
      email: '',
      password: '',
      isAdmin: false,
      isSuperUser: false,
      isBlocked: false,
      blockReasonId: null,
      mustChangePasswordNextLogon: false,
      isDisabled: false,
      avatar: '',
    }
  })

  // initial load

  useEffect(() => {
    async function loadData() {

      // select Grupo de Usuários

      await api
        .post('/user-groups/select')
        .then(response => {
          const { data } = response.data

          return data
        })
        .then((userGroupsResult) => {
          setUserGroups(userGroupsResult)
        })
        .catch(error => {
          console.log(error)
          return error
        })

      // select Motivo do Bloqueio

      await api
        .post('/block-reasons/select')
        .then(response => {
          const { data } = response.data

          return data
        })
        .then((blockReasonsResult) => {
          setBlockReasons(blockReasonsResult)
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
        .get(`/users-security/${id}`)
        .then(response => {
          const { data } = response.data

          const userResult = {
            userGroupId: data.userGroupId === null ? null : data.userGroupId.id,
            name: data.name,
            email: data.email,
            password: '',
            isAdmin: data.isAdmin,
            isSuperUser: data.isSuperUser,
            isBlocked: data.isBlocked,
            blockReasonId: data.blockReasonId === null ? null : data.blockReasonId.id,
            mustChangePasswordNextLogon: data.mustChangePasswordNextLogon,
            isDisabled: data.isDisabled,
            avatar: data.avatar,
          }

          return userResult
        })
        .then((userResult: IUserDTO) => {
          reset(userResult)
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

  const onSubmit = useCallback(async (data: IUserDTO) => {
    const payLoad: IUserDTO = {
      userGroupId: data.userGroupId,
      name: data.name,
      email: data.email,
      password: data.password,
      isAdmin: data.isAdmin,
      isSuperUser: data.isSuperUser,
      isBlocked: data.isBlocked,
      blockReasonId: data.blockReasonId,
      mustChangePasswordNextLogon: data.mustChangePasswordNextLogon,
      isDisabled: data.isDisabled,
      avatar: data.avatar,
    }

    if (params.id) {
      const { id } = params

      payLoad.id = id

      await api
        .put(`/users-security`, payLoad)
        .then(history.push('/users'))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    } else {
      await api
        .post('/users-security', payLoad)
        .then(history.push('/users/new'))
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
          title="Usuários"
          icon={ListIcon}
          backRoute="/users"
          showSaveButton={true}
          helpText="Nesta opção serão informados dados do usuário."
        />

        <FormAlert setMainError={setMainError} mainError={mainError} />

        <Grid container spacing={1} className={mainError === '' ? classes.formContainer : classes.formContainerWithError}>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="userGroupId"
              name="userGroupId"
              label="Grupo de Usuários"
              error={!!errors.userGroupId}
              helperText={errors?.userGroupId?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              value={`${watch().userGroupId}`}
              select
              autoFocus
              inputRef={firstInputElement}
              {...register("userGroupId", { onChange: (e) => {
                setValue("userGroupId", e.target.value)
                handleChange(e)
              }})}
            >
            {userGroups.map((userGroup) => (
              <MenuItem
                key={userGroup.id}
                value={userGroup.id}
              >
                {userGroup.name}
              </MenuItem>
            ))}
            </TextField>
          </Grid>

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
            <TextField
              id="email"
              name="email"
              label="EMail"
              error={!!errors.email}
              helperText={errors?.email?.message}
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
              {...register("email",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="password"
              name="password"
              label="Senha"
              type="password"
              error={!!errors.password}
              helperText={errors?.password?.message}
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
              {...register("password",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormGroup className={classes.checkBox}>
              <Controller
                name="isAdmin"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                      />
                    }
                    label="Administrador"
                  />
                )}
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormGroup className={classes.checkBox}>
              <Controller
                name="isSuperUser"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                      />
                    }
                    label="Super usuário"
                  />
                )}
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormGroup className={classes.checkBox}>
              <Controller
                name="mustChangePasswordNextLogon"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                      />
                    }
                    label="Troca a senha próximo logon"
                  />
                )}
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormGroup className={classes.checkBox}>
              <Controller
                name="isBlocked"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                      />
                    }
                    label="Bloqueado"
                  />
                )}
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="blockReasonId"
              name="blockReasonId"
              label="Motivo do Bloqueio"
              error={!!errors.blockReasonId}
              helperText={errors?.blockReasonId?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              value={`${watch().blockReasonId}`}
              select
              {...register("blockReasonId", { onChange: (e) => {
                setValue("blockReasonId", e.target.value)
                handleChange(e)
              }})}
            >
            {blockReasons.map((blockReason) => (
              <MenuItem
                key={blockReason.id}
                value={blockReason.id}
              >
                {blockReason.description}
              </MenuItem>
            ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="avatar"
              name="avatar"
              label="Avatar"
              error={!!errors.avatar}
              helperText={errors?.avatar?.message}
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
              {...register("avatar",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormGroup className={classes.checkBox}>
              <Controller
                name="isDisabled"
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
  )
}

export default UserForm
