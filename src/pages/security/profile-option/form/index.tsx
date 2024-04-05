import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Box, Paper, Grid, TextField, MenuItem } from '@mui/material'
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHeader, FormAlert } from 'components'
import ListIcon from '@mui/icons-material/List'
import * as yup from 'yup'
import { useStyles } from './styles'
import api from 'services/api'
import { IProfileOptionDTO } from 'data/dtos/security/i-profile-option-dto'

interface IRouteParams {
  id: string
}

const ProfileOptionForm: React.FC = () => {
  const [mainError, setMainError] = useState('')
  const [profiles, setProfiles] = useState([])
  const [menuOptions, setMenuOptions] = useState([])

  const params = useParams<IRouteParams>()
  const firstInputElement = useRef(null)
  const classes = useStyles()
  const history = useHistory()

  const validationSchema = yup.object().shape({
    profileId: yup.string()
      .required('Campo obrigatório'),
    menuOptionKey: yup.string()
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
  } = useForm<IProfileOptionDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      profileId: null,
      menuOptionKey: '',
      permitAll: false,
      permitCreate: false,
      permitRestore: false,
      permitUpdate: false,
      permitDelete: false,
      disabled: false,
    }
  })

  // initial load

  useEffect(() => {
    async function loadData() {

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

      // select Opção de Menu

      await api
        .post('/menu-options/select')
        .then(response => {
          const { data } = response.data

          return data
        })
        .then((menuOptionsResult) => {
          setMenuOptions(menuOptionsResult)
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
        .get(`/profile-options/${id}`)
        .then(response => {
          const { data } = response.data

          const profileOptionResult = {
            profileId: data.profileId.id,
            menuOptionKey: data.menuOptionKey.id,
            permitAll: data.permitAll,
            permitCreate: data.permitCreate,
            permitRestore: data.permitRestore,
            permitUpdate: data.permitUpdate,
            permitDelete: data.permitDelete,
            disabled: data.disabled,
          }

          return profileOptionResult
        })
        .then((profileOptionResult: IProfileOptionDTO) => {
          reset(profileOptionResult)
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

  const onSubmit = useCallback(async (data: IProfileOptionDTO) => {
    const payLoad: IProfileOptionDTO = {
      profileId: data.profileId,
      menuOptionKey: data.menuOptionKey,
      permitAll: data.permitAll,
      permitCreate: data.permitCreate,
      permitRestore: data.permitRestore,
      permitUpdate: data.permitUpdate,
      permitDelete: data.permitDelete,
      disabled: data.disabled,
    }

    if (params.id) {
      const { id } = params

      payLoad.id = id

      await api
        .put(`/profile-options`, payLoad)
        .then(history.push('/profile-options'))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    } else {
      await api
        .post('/profile-options', payLoad)
        .then(history.push('/profile-options/new'))
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
          title="Opções do Perfil"
          icon={ListIcon}
          backRoute="/profile-options"
          showSaveButton={true}
          helpText="Nesta opção serão relacionadas as opções de menu possíveis de serem acessadas por cada perfil."
        />

        <FormAlert setMainError={setMainError} mainError={mainError} />

        <Grid container spacing={0} className={classes.formContainer}>

          <Grid container item xs={12} spacing={1}>
            <Grid item xs={7}>
              <TextField
                id="profileId"
                name="profileId"
                label="Perfil"
                error={!!errors.profileId}
                helperText={errors?.profileId?.message}
                variant="filled"
                margin="dense"
                size="small"
                fullWidth={true}
                value={`${watch().profileId}`}
                select
                autoFocus
                inputRef={firstInputElement}
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

          <Grid container item xs={12} spacing={1}>
            <Grid item xs={7}>
              <TextField
                id="menuOptionKey"
                name="menuOptionKey"
                label="Opção de Menu"
                error={!!errors.menuOptionKey}
                helperText={errors?.menuOptionKey?.message}
                variant="filled"
                margin="dense"
                size="small"
                fullWidth={true}
                value={`${watch().menuOptionKey}`}
                select
                {...register("menuOptionKey", { onChange: (e) => {
                  setValue("menuOptionKey", e.target.value)
                  handleChange(e)
                }})}
              >
              {menuOptions.map((menuOption) => (
                <MenuItem
                  key={menuOption.id}
                  value={menuOption.id}
                >
                  {menuOption.label}
                </MenuItem>
              ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={1}>
            <Grid item xs={6}>
              <FormGroup className={classes.checkBox}>
                <Controller
                  name="permitAll"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => field.onChange(e.target.checked)}
                          checked={field.value}
                        />
                      }
                      label="Todos"
                    />
                  )}
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={1}>
            <Grid item xs={6}>
              <FormGroup className={classes.checkBox}>
                <Controller
                  name="permitCreate"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => field.onChange(e.target.checked)}
                          checked={field.value}
                        />
                      }
                      label="Incluir"
                    />
                  )}
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={1}>
            <Grid item xs={6}>
              <FormGroup className={classes.checkBox}>
                <Controller
                  name="permitRestore"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => field.onChange(e.target.checked)}
                          checked={field.value}
                        />
                      }
                      label="Recuperar"
                    />
                  )}
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={1}>
            <Grid item xs={6}>
              <FormGroup className={classes.checkBox}>
                <Controller
                  name="permitUpdate"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => field.onChange(e.target.checked)}
                          checked={field.value}
                        />
                      }
                      label="Alterar"
                    />
                  )}
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={1}>
            <Grid item xs={6}>
              <FormGroup className={classes.checkBox}>
                <Controller
                  name="permitDelete"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => field.onChange(e.target.checked)}
                          checked={field.value}
                        />
                      }
                      label="Deletar"
                    />
                  )}
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={1}>
            <Grid item xs={6}>
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

        </Grid>
      </Box>
    </Paper>
  )
}

export default ProfileOptionForm
