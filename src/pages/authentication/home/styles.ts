import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },

  container: {
    maxHeight: 'calc(100vh - 320px)'
  },

  paper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '20px',
    minHeight: 'calc(100vh - 90px)',
    maxHeight: 'calc(100vh - 90px)',
    height: 'calc(100vh - 90px)',
    width: '100%',
    background: 'rgba(92, 107, 192, 0.2) !important'
  },

  homeText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    fontFamily: 'Roboto',
    fontSize: '24px !important',
    fontWeight: 'bold',
    color: '#fff !important'
  },

  logo: {
    height: '70px',
  }
}))

export { useStyles }
