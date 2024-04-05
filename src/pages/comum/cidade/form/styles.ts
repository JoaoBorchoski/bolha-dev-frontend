import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },

  container: {
    minHeight: 0,
    maxHeight: 'calc(100vh - 320px)',
  },

  paper: {
    padding: '20px',
    minHeight: 'calc(100vh - 85px)',
    maxHeight: 'calc(100vh - 85px)',
    height: 'calc(100vh - 85px)',
    width: '100%',
    marginBottom: '5px'
  },

  formTitle: {
    display: 'flex',
    width: '100%',
    fontFamily: 'Roboto',
    fontSize: '18px',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: theme.palette.primary.main
  },

  formContainer: {
    margin: '12px 20px 10px 0px',
    width: '100%',
    maxHeight: 'calc(100vh - 190px)',
    overflow: 'overlay'
  },

  formContainerWithError: {
    margin: '12px 20px 10px 0px',
    width: '100%',
    maxHeight: 'calc(100vh - 252px)',
    overflow: 'overlay'
  },

  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },

  iconHead: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    width: 1,
    minWidth: 1,
    maxWidth: 1,
  },

  tableIcon: {
  	margin: '-5px',
  	padding: '-5px',
  	lineHeight: 0,
  	fontSize: 20,
  	cursor: 'pointer',
  	color: theme.palette.primary.main,
  },

  actionButton: {
    marginLeft: '10px !important',
  },
  
  submitButton: {
    marginTop: 20,
    justifyContent: 'flex-end',
  },

  checkBox: {
    marginTop: 4,
  }
}))

export { useStyles }
