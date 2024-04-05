import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Box, Paper, Grid, TextField, InputLabel, Select, MenuItem,FormGroup, FormControlLabel, Checkbox, Fab  } from '@mui/material'
import { Table, TableBody, Typography, Collapse } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHeader, FormAlert } from 'components'
import ListIcon from '@mui/icons-material/List'
import * as yup from 'yup'
import { useStyles } from './styles'
import api from 'services/api'
import { IProfileDTO } from 'data/dtos/security/i-profile-dto'
import { IMenuOptionDTO } from 'data/dtos/security/i-menu-option-dto'
import { IProfileOptionDTO } from 'data/dtos/security/i-profile-option-dto'
import { IUserGroupDTO } from 'data/dtos/security/i-user-group-dto'

interface IRouteParams {
  id: string
}

const ProfileForm: React.FC = () => {
  const [mainError, setMainError] = useState('')
  const [menuOptionsList, setMenuOptionsList] = useState<IMenuOptionDTO[]>([])
  const [userGroupSelect, setUserGroupSelect] = useState<IUserGroupDTO[]>([])
  const [moduleCollapseState, setModuleCollapseState] = useState<boolean[]>(new Array(100).fill(true))
  const [allModulesCollapseState, setAllModulesCollapseState] = useState(true)

  const params = useParams<IRouteParams>()
  const firstInputElement = useRef(null)
  const classes = useStyles()
  const history = useHistory()

  let currentModuleTitle = ''
  let modulesList: Array<string> = new Array()
  let moduleCount = -1
  let menuOptionCount = -1

  const validationSchema = yup.object().shape({
    name: yup.string()
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
  } = useForm<IProfileDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      userGroupId: '',
      name: '',
      disabled: false,
      menuOptions: []
    }
  })


  const { fields, replace } = useFieldArray({
    name: 'menuOptions', 
    control
  })


  // initial load

  useEffect(() => {
    const loadData = async () => {
      await api
        .post('/menu-options/all')
        .then(async listResponse => {
          const { data } = listResponse.data
          setMenuOptionsList(data)
        })
        .catch(error => {
          console.log(error)
        })

      await api
        .post('/user-groups/select')
        .then(async listResponse => {
          const { data } = listResponse.data
          setUserGroupSelect(data)
        })
        .catch(error => {
          console.log(error)
        })
    }

    loadData()
  }, [])


  // main data load

  useEffect(() => {
    const loadData = async () => {
      const { id } = params

      // form data

      await api
        .get(`/profiles/${id}`)
        .then(response => {
          const { data } = response.data

          const profileResult = {
            userGroupId: data.userGroupId,
            name: data.name,
            disabled: data.disabled,
            menuOptions: data.menuOptions
          }

          return profileResult
        })
        .then((profileResult: IProfileDTO) => {
          reset(profileResult)
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

  const onSubmit = useCallback(async (data: IProfileDTO) => {
    const payLoad: IProfileDTO = {
      userGroupId: data.userGroupId,
      name: data.name,
      disabled: data.disabled,
      menuOptions: data.menuOptions
    }

    console.log('===> ', data.menuOptions)

    if (params.id) {
      const { id } = params

      payLoad.id = id

      await api
        .put(`/profiles`, payLoad)
        .then(history.push('/profiles'))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    } else {
      await api
        .post('/profiles', payLoad)
        .then(history.push('/profiles/new'))
        .then(() => reset())
        .then(() => setModuleCollapseState(new Array(100).fill(true)))
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

  const handleClick = (moduleTitle: string) => {
    const index = modulesList.indexOf(moduleTitle)
    setModuleCollapseState(prevState => prevState.map((item, idx) => idx === index ? !item : item))
  }

  const handleToggle = () => {
    const collapsed = !allModulesCollapseState
    setAllModulesCollapseState(collapsed)
    setModuleCollapseState(new Array(100).fill(collapsed))
  }

  const renderModuleTitle = (moduleTitle: string) => {
    if (moduleTitle !== currentModuleTitle) {
      currentModuleTitle = moduleTitle;
      modulesList.push(moduleTitle)
      moduleCount += 1

      return (
        <>
          <Grid item xs={12}>
            <Typography className={classes.moduleTitle} variant="h6">
              Módulo: {moduleTitle}
              { moduleCollapseState[moduleCount] == true 
                ? <ExpandMore onClick={() => handleClick(moduleTitle) } className={classes.moduleIcon} /> 
                : <ExpandLess onClick={() => handleClick(moduleTitle) } className={classes.moduleIcon} /> 
              }
            </Typography>
          </Grid>
        </>
      )
    }
  }

  const renderTableTitle = (tableTitle: string, route: string) => {
    if (route === '') {
      return (
        <Collapse 
          orientation="vertical" 
          in={!moduleCollapseState[moduleCount]}
          className={classes.collapse}
        >
          <Grid container item xs={12} spacing={0}>
            <Grid item xs={12}>
                <Typography className={classes.tableTitle} variant="h6">{tableTitle}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography className={classes.tableHeaderTitle}>Opção de Menu</Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography className={classes.tableHeader}>Todos</Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography className={classes.tableHeader}>Inclui</Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography className={classes.tableHeader}>Exibe</Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography className={classes.tableHeader}>Altera</Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography className={classes.tableHeader}>Exclui</Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography className={classes.tableHeader}>Inativo</Typography>
            </Grid>
          </Grid>
        </Collapse>
      )
    }
  }

  const renderTableBody = (menuOptionLabel: string, menuOptionKey: string, menuRoute: string) => {
    menuOptionCount += 1

    return (
      <Collapse 
        orientation="vertical" 
        in={!moduleCollapseState[moduleCount]}
        className={menuRoute !== '' ? classes.collapse : classes.invisible}
      >
        <input 
          type="hidden" 
          name={`menuOptions.${menuOptionCount}.menuOptionKey`} 
          value={menuOptionKey} 
          {...register(`menuOptions.${menuOptionCount}.menuOptionKey`)} 
        />

        <Grid container item xs={12} spacing={0} style={{marginRight: 2}}>
          <Grid item xs={6}>
              <Typography className={classes.tableBody}>{menuOptionLabel}</Typography>
          </Grid>
          <Grid item xs={1}>
            <FormGroup className={classes.tableCheckBox}>
              <Controller
                defaultValue={false}
                name={`menuOptions.${menuOptionCount}.permitAll`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    onChange={(e) => field.onChange(e.target.checked)}
                    checked={field.value}
                  />
                )}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={1}>
            <FormGroup className={classes.tableCheckBox}>
              <Controller
                defaultValue={false}
                name={`menuOptions.${menuOptionCount}.permitCreate`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    onChange={(e) => field.onChange(e.target.checked)}
                    checked={field.value}
                  />
                )}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={1}>
            <FormGroup className={classes.tableCheckBox}>
              <Controller
                defaultValue={false}
                name={`menuOptions.${menuOptionCount}.permitRestore`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    onChange={(e) => field.onChange(e.target.checked)}
                    checked={field.value}
                  />
                )}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={1}>
            <FormGroup className={classes.tableCheckBox}>
              <Controller
                defaultValue={false}
                name={`menuOptions.${menuOptionCount}.permitUpdate`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    onChange={(e) => field.onChange(e.target.checked)}
                    checked={field.value}
                  />
                )}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={1}>
            <FormGroup className={classes.tableCheckBox}>
              <Controller
                defaultValue={false}
                name={`menuOptions.${menuOptionCount}.permitDelete`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    onChange={(e) => field.onChange(e.target.checked)}
                    checked={field.value}
                  />
                )}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={1}>
            <FormGroup className={classes.tableCheckBox}>
              <Controller
                defaultValue={false}
                name={`menuOptions.${menuOptionCount}.disabled`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    onChange={(e) => field.onChange(e.target.checked)}
                    checked={field.value}
                  />
                )}
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Collapse>
    )
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
          title="Perfis"
          icon={ListIcon}
          backRoute="/profiles"
          showSaveButton={true}
          helpText="Nesta opção serão informados os perfis de acesso à aplicação."
        />

        <FormAlert setMainError={setMainError} mainError={mainError} />

        <Grid container spacing={0} className={classes.formContainer}>
          <Grid container item xs={12} spacing={1}>
            <Grid item xs={8}>
              <TextField
                id="userGroupId"
                name="userGroupId"
                label="Grupo de Usuário"
                error={!!errors.userGroupId}
                helperText={errors?.userGroupId?.message}
                variant="filled"
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
              {userGroupSelect.map((userGroup) => (
                <MenuItem
                  key={userGroup.id}
                  value={userGroup.id}
                >
                  {userGroup.name}
                </MenuItem>
              ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2}>
            <Grid item xs={8}>
              <TextField
                id="name"
                name="name"
                label="Nome"
                error={!!errors.name}
                helperText={errors?.name?.message}
                variant="filled"
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

            <Grid item xs={1} className={classes.checkBoxContainer}>
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

            <Grid item xs={3} className={classes.toggleOpenCloseContainer}>
              <Fab size="small" aria-label="collapse" className={classes.moduleIconToggle}>
                { allModulesCollapseState == true 
                  ? <ExpandMore onClick={() => handleToggle()} className={classes.moduleIcon} /> 
                  : <ExpandLess onClick={() => handleToggle()} className={classes.moduleIcon} /> 
                }
              </Fab>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={0} className={classes.modulesContainer}>
            {menuOptionsList.map((menuOption) => (
            <>
              { renderModuleTitle(menuOption.moduleName) }
              { renderTableTitle(menuOption.label, menuOption.route) }
              { renderTableBody(menuOption.label, menuOption.key, menuOption.route) }
            </>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default ProfileForm
