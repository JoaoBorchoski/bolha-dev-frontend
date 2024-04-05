import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Container, Divider, Paper, TextField, Typography } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import * as yup from 'yup'
import { useStyles } from "./styles"
import { yupResolver } from '@hookform/resolvers/yup'
import { IProfileDTO } from 'data/dtos/components/i-profile-dto'
import { useForm } from 'react-hook-form'
import api from 'services/api'
import { useAuth } from 'hooks/auth'
import { IUserDTO } from 'data/dtos/security/i-user-dto'

const Profile: React.FC = () => {
  const [mainError, setMainError] = useState('')
  
  const classes = useStyles()

  const fileInputRef = useRef(null)

  const { user, updateUser } = useAuth()

  const validationSchema = yup.object().shape({
    name: yup.string().nullable(true).required('Campo obrigatório'),
    password: yup
      .string()
      .when({
        is: (val: any) => val !== null && val?.length > 0,
        then: yup.string().min(5, 'Senha deve possuir no mínimo 5 caracteres'),
        otherwise: yup.string().nullable(true),
      }),
    repeatPassword: yup.string().oneOf([yup.ref('password'), null], 'Senhas devem ser idênticas')
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm<IProfileDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: null,
      password: '',
      repeatPassword: null
    }
  })

  useEffect(() => {
    async function loadData() {
      await api
        .get(`/users/profile`)
        .then(res => {
          const { data } = res.data

          const profileResult = {
            name: data.name,
          }

          return profileResult
        })
        .then(profileResult => {
          reset(profileResult)
        })
        .catch(err => console.log(err))
    }

    loadData()
  }, [])

  const onSubmit = useCallback(async (data) => {
    const payload: IUserDTO = {
      name: data.name
    }

    if (data.password && data.password != '') {
      payload.password = data.password
    }

    await api
      .patch('/users/profile', payload)
      .catch(err => console.log(err))
  }, [])

  const handleChange = (formField: any) => {
    setMainError('')
  }

  const handleFileChange = async (event: any) => {
    const avatar = event.target.files[0]

    const formData = new FormData()
    formData.append('avatar', avatar)

    await api
      .patch('/users/avatar', formData)
      .then(res => {
        const { data: avatarUrl } = res.data
        updateUser({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: avatarUrl
        })
      })
      .catch(err => console.log(err))
  }

  const handleLabelClick = () => {
    fileInputRef.current.click()
  }

  return (
    <Paper elevation={3} className={classes.paper}>
      <Container maxWidth="md" className={classes.avatarContainer} onClick={handleLabelClick}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {
            user.avatar_url
              ? <img src={user.avatar_url} className={classes.profileImage}/>
              : <AccountCircle sx={{ fontSize: '200px' }} color="primary"/>
          }          

          <Typography variant="h6">
            Clique para enviar uma imagem
          </Typography>
        </Box>

        <input
          accept=".jpg,.jpeg,.png"
          type='file'
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Container>

      <Container maxWidth="md">
        <Divider variant='fullWidth' className={classes.divider} />
      </Container>

      <Container
        maxWidth="md"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        data-testid="form"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h4">
            Informações básicas
          </Typography>

          <TextField
            id="name"
            autoComplete='none'
            label="Nome"
            error={!!errors.name}
            helperText={errors?.name?.message}
            variant="outlined"
            margin="dense"
            size="small"
            fullWidth={true}
            InputProps={{
              style:{ height: '3em' }
            }}
            InputLabelProps={{
              shrink: true,
              style: { backgroundColor: '#D4DAED' }
            }}
            inputProps={{
              maxLength: 100,
            }}
            {...register("name",
              { onChange: (e) => handleChange(e) }
            )}
          />

          <TextField
            id="password"
            autoComplete='none'
            label="Senha"
            error={!!errors.password}
            helperText={errors?.password?.message}
            variant="outlined"
            margin="dense"
            size="medium"
            type="password"
            fullWidth={true}
            InputProps={{
              style:{ height: '3em' }
            }}
            InputLabelProps={{
              shrink: true,
              style: { backgroundColor: '#D4DAED' }
            }}
            inputProps={{
              maxLength: 100
            }}
            {...register("password",
              { onChange: (e) => handleChange(e) }
            )}
          />

          <TextField
            id="repeatPassword"
            autoComplete='none'
            label="Repita a senha"
            error={!!errors.repeatPassword}
            helperText={errors?.repeatPassword?.message}
            variant="outlined"
            margin="dense"
            size="small"
            type="password"
            fullWidth={true}
            InputProps={{
              style:{ height: '3em' }
            }}
            InputLabelProps={{
              shrink: true,
              style: { backgroundColor: '#D4DAED' }
            }}
            inputProps={{
              maxLength: 100
            }}
            {...register("repeatPassword",
              { onChange: (e) => handleChange(e) }
            )}
          />

          <Box display="flex" alignItems="center" justifyContent="center">
            <Button type="submit" variant="contained" color="primary">Salvar</Button>
          </Box>
        </Box>
      </Container>
    </Paper>
  )
}

export default Profile
