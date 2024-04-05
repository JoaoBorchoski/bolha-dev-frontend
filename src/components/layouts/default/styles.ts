import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

const drawerWidth = 260
const contentLeftOpen = drawerWidth
const contentLeftClose = 55

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden',
    '*:hover::-webkit-scrollbar': {
      width: '0.6em'
    },
  },

  mainContentWrapper: {
    display: 'flex',
    grow: 1,
    position: 'fixed',
    top: '50px',
    maxHeight: 'calc(100vh - 50px)',
    overflow: 'overlay',
    padding: '20px 20px 0px 20px'
  },

  mainContentWrapperOpen: {
    left: contentLeftOpen,
    width: `calc(100% - ${contentLeftOpen}px)`,
    transition: theme.transitions.create(['left', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    paddingBottom: '5px'
  },

  mainContentWrapperClose: {
    left: contentLeftClose,
    width: `calc(100% - ${contentLeftClose}px)`,
    transition: theme.transitions.create(['left', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    paddingBottom: '5px'
  },
}));

export { useStyles }
