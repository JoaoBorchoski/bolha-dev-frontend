import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },

  container: {
    maxHeight: 'calc(100vh - 320px)',
  },

  paper: {
    padding: '20px',
    minHeight: 'calc(100vh - 90px)',
    maxHeight: 'calc(100vh - 90px)',
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

  formContainer: {
    margin: '12px 20px 10px 0px',
    width: '99%',
    maxHeight: 'calc(100vh - 200px)',
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

  checkBoxContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  checkBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10
  },

  tableContainer: {
    width: '100%',
  },

  moduleTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(242,242,242)',
    padding: '12px 20px 7px 20px !important',
    marginTop: '10px !important',
    color: theme.palette.primary.light,
    fontWeight: 'bold',
    borderTopRightRadius: theme.shape.borderRadius,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottom: '2px solid',
    borderColor: theme.palette.primary.main
  },

  tableTitle: {
    backgroundColor: '#F3F6F9',
    padding: '5px 20px 10px 20px !important',
    marginTop: '10px !important',
    color: theme.palette.primary.light,
    fontWeight: 'bold',
    borderTopRightRadius: theme.shape.borderRadius,
    borderTopLeftRadius: theme.shape.borderRadius
  },

  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F6F9',
    padding: '2px 20px 5px 20px !important',
    color: theme.palette.primary.light,
    borderBottom: '1px solid',
    borderColor: theme.palette.primary.light
  },

  tableHeaderTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F3F6F9',
    padding: '2px 20px 5px 20px !important',
    color: theme.palette.primary.light,
    border: 'none',
    borderBottom: '1px solid',
    borderColor: theme.palette.primary.light
  },

  tableBody: {
    backgroundColor: '#FFF',
    padding: '9px 20px 9px 20px !important',
    color: theme.palette.primary.light,
    border: 'none',
    borderBottom: '1px solid',
    borderColor: '#E0E0E0 !important',
    boxShadow: 'none !important'
  },

  tableCheckBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid',
    borderColor: '#E0E0E0 !important',
    margin: 0
  },

  moduleIcon: {
    cursor: 'pointer',
    width: '1.5em !important',
    height: '1.5em !important'
  },

  moduleClosed: {
    display: 'none',
    opacity: 0,
    transition: 'all .1s ease'
  },

  moduleOpened: {
    display: 'block',
    opacity: 1,
    transition: 'all .1s ease'
  },

  modulesContainer: {
    paddingRight: '10px',
    width: '99%',
    boxShadow: 'none !important'
  },

  collapse: {
    width: '100%', 
    boxShadow: 'none'
  },

  toggleOpenCloseContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  moduleIconToggle: {
    backgroundColor: 'rgb(242,242,242)',
    color: theme.palette.primary.light,
    marginTop: '2px !important',
    marginRight: '28px !important'
  },

  invisible: {
    display: 'none'
  }
}))

export { useStyles }
