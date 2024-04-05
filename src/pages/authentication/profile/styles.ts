import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '1rem',
    padding: '20px',
    minHeight: 'calc(100vh - 120px)',
    maxHeight: 'calc(100vh - 120px)',
    height: 'calc(100vh - 120px)',
    width: '100%',
    background: 'rgba(92, 107, 192, 0.2) !important'
  },

  avatarContainer: {
    cursor: 'pointer',
    userSelect: 'none'
  },

  profileImage: {
    width: 200,
    height: 200,
    borderRadius: '50%'
  },

  icon: {
    height: '200px'
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
    color: theme.palette.primary.contrastText
  },

  divider: {
    backgroundColor: theme.palette.primary.main,
  }
}))

export { useStyles }
