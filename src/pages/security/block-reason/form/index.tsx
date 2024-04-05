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
import { IBlockReasonDTO } from 'data/dtos/security/i-block-reason-dto'

interface IRouteParams {
  id: string
}

const BlockReasonForm: React.FC = () => {
  const [mainError, setMainError] = useState('')

  const params = useParams<IRouteParams>()
  const firstInputElement = useRef(null)
  const classes = useStyles()
  const history = useHistory()

  const validationSchema = yup.object().shape({
    code: yup.string()
      .required('Campo obrigatório'),
    description: yup.string()
      .required('Campo obrigatório'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm<IBlockReasonDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      code: '',
      description: '',
      instructionsToSolve: '',
      isSolvedByPasswordReset: false,
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
        .get(`/block-reasons/${id}`)
        .then(response => {
          const { data } = response.data

          const blockReasonResult = {
            code: data.code,
            description: data.description,
            instructionsToSolve: data.instructionsToSolve,
            isSolvedByPasswordReset: data.isSolvedByPasswordReset,
          }

          return blockReasonResult
        })
        .then((blockReasonResult: IBlockReasonDTO) => {
          reset(blockReasonResult)
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

  const onSubmit = useCallback(async (data: IBlockReasonDTO) => {
    const payLoad: IBlockReasonDTO = {
      code: data.code,
      description: data.description,
      instructionsToSolve: data.instructionsToSolve,
      isSolvedByPasswordReset: data.isSolvedByPasswordReset,
    }

    if (params.id) {
      const { id } = params

      payLoad.id = id

      await api
        .put(`/block-reasons`, payLoad)
        .then(history.push('/block-reasons'))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    } else {
      await api
        .post('/block-reasons', payLoad)
        .then(history.push('/block-reasons/new'))
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
          title="Motivos de Bloqueio"
          icon={ListIcon}
          backRoute="/block-reasons"
          showSaveButton={true}
          helpText="Nesta opção serão informadas quais as razões que um usuário pode ter sua conta bloqueada."
        />

        <FormAlert setMainError={setMainError} mainError={mainError} />

        <Grid container spacing={1} className={mainError === '' ? classes.formContainer : classes.formContainerWithError}>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="code"
              name="code"
              label="Código"
              error={!!errors.code}
              helperText={errors?.code?.message}
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
                maxLength: 3
              }}
              {...register("code",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="description"
              name="description"
              label="Descrição"
              error={!!errors.description}
              helperText={errors?.description?.message}
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
              {...register("description",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="instructionsToSolve"
              name="instructionsToSolve"
              label="Instruções para solução"
              error={!!errors.instructionsToSolve}
              helperText={errors?.instructionsToSolve?.message}
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
              {...register("instructionsToSolve",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormGroup className={classes.checkBox}>
              <Controller
                name="isSolvedByPasswordReset"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                      />
                    }
                    label="Reset de senha"
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

export default BlockReasonForm
