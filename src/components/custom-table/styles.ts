import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'
import { alpha } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: '20px',
    minHeight: 'calc(100vh - 120px)',
    maxHeight: 'calc(100vh - 120px)',
    height: 'calc(100vh - 120px)',
    width: '100%'
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

  search: {
    position: 'relative',
    border: '1px solid #E0E0E0',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginTop: '20px',
    marginBottom: '15px',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(0),
      width: 'auto',
    },
  },

  tableContainer: {
    height: 'calc(100vh - 300px)'
  },

  inputInput: {
    padding: '5px 15px 5px 15px',
    width: '100%'
  },

  linearProgressOn: {
    marginRight: '15px',
    width: '100%'
  },

  linearProgressOff: {
    visibility: 'hidden',
  },

  tablePaper: {
    width: '100%',
    overflow: 'hidden'
  },

  rowTableIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
    minWidth: '45px',
    width: '45px'
  },

  tableIcon: {
    fontSize: 20,
    cursor: 'pointer',
    color: theme.palette.primary.main,
    marginTop: '3px',
    marginLeft: '7px'
  },

  tableRow: {
    borderBottom: '1px solid black !important'
  },

  pagination: {
    marginTop: 'calc(100vh - 312px)',
  }
}))

export { useStyles }
