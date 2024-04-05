import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Box, Paper, Grid, TextField, MenuItem } from '@mui/material'
import { Checkbox } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHeader, FormAlert } from 'components'
import ListIcon from '@mui/icons-material/List'
import * as yup from 'yup'
import { useStyles } from './styles'
import api from 'services/api'
import { IUserProfileDTO } from 'data/dtos/security/i-user-profile-dto'

interface IRouteParams {
  id: string
}

const UserProfileForm: React.FC = () => {
  const [mainError, setMainError] = useState('')
  const [users, setUsers] = useState([])
  const [profiles, setProfiles] = useState([])

  const params = useParams<IRouteParams>()
  const firstInputElement = useRef(null)
  const classes = useStyles()
  const history = useHistory()

  const validationSchema = yup.object().shape({
    userId: yup.string()
      .required('Campo obrigatório'),
    profileId: yup.string()
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
  } = useForm<IUserProfileDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      userId: null,
      profileId: null,
    }
  })

  // initial load

  useEffect(() => {
    async function loadData() {

      // select Usuário

      await api
        .post('/users-security/select')
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

      // select Perfil

      await api
        .post('/profiles/select')
        .then(response => {
          const { data } = response.data

          return data
        })
        .then((profilesResult) => {
          setProfiles(profilesResult)
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
        .get(`/users-profiles/${id}`)
        .then(response => {
          const { data } = response.data

          const userProfileResult = {
            userId: data.userId.id,
            profileId: data.profileId.id,
          }

          return userProfileResult
        })
        .then((userProfileResult: IUserProfileDTO) => {
          reset(userProfileResult)
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

  const onSubmit = useCallback(async (data: IUserProfileDTO) => {
    const payLoad: IUserProfileDTO = {
      userId: data.userId,
      profileId: data.profileId,
    }

    if (params.id) {
      const { id } = params

      payLoad.id = id

      await api
        .put(`/users-profiles`, payLoad)
        .then(history.push('/users-profiles'))
        .then(() => setTimeout(() => { firstInputElement.current.focus() }, 0))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    } else {
      await api
        .post('/users-profiles', payLoad)
        .then(history.push('/users-profiles/new'))
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
          title="Usuários x Perfis"
          icon={ListIcon}
          backRoute="/users-profiles"
          showSaveButton={true}
          helpText="Nesta opção serão relacionados os perfis a cada usuário que acessa a aplicação."
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
              id="profileId"
              name="profileId"
              label="Perfil"
              error={!!errors.profileId}
              helperText={errors?.profileId?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              value={`${watch().profileId}`}
              select
              {...register("profileId", { onChange: (e) => {
                setValue("profileId", e.target.value)
                handleChange(e)
              }})}
            >
            {profiles.map((profile) => (
              <MenuItem
                key={profile.id}
                value={profile.id}
              >
                {profile.name}
              </MenuItem>
            ))}
            </TextField>
          </Grid>

        </Grid>
      </Box>
    </Paper>
  )
}

export default UserProfileForm
