import React, { useState, useEffect } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import { useAuth } from 'hooks/auth'
import { SvgIconProps, Box } from '@mui/material'
import api from 'services/api'
import { useApplication } from 'hooks/use-application'
import { useStyles } from "./styles"
import { SideMenu, AppHeader } from './components'

interface SubMenuOption {
  id: string
  icon: React.ReactElement<SvgIconProps>
  text: string
  route: string
}

export interface MenuOption {
  id: string
  icon: React.ReactElement<SvgIconProps>
  text: string
  route: string
  subMenuOptions: SubMenuOption[]
}

const DefaultLayout: React.FC = ({ children }) => {
  const [userMenu, setUserMenu] = useState<MenuOption[]>([])
  const { menuOpen } = useApplication();

  const { signOut } = useAuth();

  useIdleTimer({
    timeout: 1000 * 60 * 15,
    onIdle: () => {
      signOut()
    }
  })

  useEffect(() => {
    async function loadData() {
      await api
        .post('/users-security/get-menu')
        .then(response => {
          const { data } = response.data

          return data
        })
        .then((stateResult) => {
          setUserMenu(stateResult)
        })
        .catch(error => {
          console.log(error)
          return error
        })
    }

    loadData()
  }, [])


  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <AppHeader />
      <SideMenu options={userMenu} />
      <Box className={ `${classes.mainContentWrapper} ${menuOpen ? classes.mainContentWrapperOpen : classes.mainContentWrapperClose}` }>
        { children }
      </Box>
    </Box>
  )
}

export default DefaultLayout
