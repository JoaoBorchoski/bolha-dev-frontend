import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
}));

export { useStyles }
