import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

// to change icon size: 
// styles/themes/default-theme.tsx
// MuiIcon > StyleOverrides > root > fontSize

// to change sub-menu line height
// nestedText > lineHeight

// to change sub-menu bullet properties
// bulletIcon

const drawerWidthOpen = 258
const drawerWidthClosed = 52

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },

  menuContainer: {
    overfloY: 'auto',
    overflowX: 'hidden',
    marginTop: '55px'
  },

  // menu bar opened and closed

  leftMenuOpen: {
    background: 'white',
    whiteSpace: 'nowrap',
    width: `${drawerWidthOpen}px`,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    overflowX: 'hidden',
    overflowY: 'hidden',
    '&:hover': {
      overflowY: 'overlay',
    },
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    boxShadow: '10px 0 5px -5px rgb(0 0 0 / 3%)'
  },

  leftMenuClose: {
    background: 'white',
    overflowX: 'hidden',
    width: `${drawerWidthClosed}px`,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    [theme.breakpoints.up('sm')]: {
      width: `${drawerWidthClosed}px`,
    },
    boxShadow: '10px 0 5px -5px rgb(0 0 0 / 3%)'
  },

  // regular menu options 

  menuOption: {
    marginTop: '0px !important',
    marginBottom: '0px !important',
    paddingTop: '8px !important',
    paddingBottom: '8px !important',
    marginLeft: '-12px !important',
    width: '270px !important',
    fontSize: '14px !important'
  },

  menuOptionBox: {
    display: 'flex',
    color: '#FFF !important',
    borderRadius: '8px',
    width: '100%',
    padding: '3px 6px 4px 22px',
  },

  menuOptionIcon: {
    minWidth: '40px !important',
    marginRight: '-5px !important',
    marginLeft: '-9px !important'
  },

  iconStyle: {
    marginTop: '5px !important',
    color: '#1F0ADF !important',
    fontSize: '25px !important'
  },

  bulletIcon: {
    color: '#1F0ADF',
    fontSize: '6px !important',
    marginTop: '4px'
  },

  colorPrimaryLight: {
    marginTop: '3px',
    color: '#1F0ADF !important',
    fontSize: '14px !important'
  },

  colorTextPrimaryLight: {
    marginTop: '8px !important',
    color: '#1F0ADF !important',
    fontSize: '14px !important'
  },

  // selected menu options 

  menuOptionSelected: {
    marginTop: '8px !important',
    marginBottom: '0px !important',
    paddingTop: '5px !important',
    paddingBottom: '5px !important'
  },

  menuOptionBoxSelected: {
    display: 'flex',
    color: '#FFF !important',
    borderRadius: '8px',
    backgroundColor: theme.palette.primary.main,
    width: '100%',
    padding: '3px 6px 4px 26px',
    marginLeft: '5px',
    marginRight: '-20px'
  },

  menuOptionIconSelected: {
    minWidth: '40px !important',
    marginRight: '-13px !important',
    marginLeft: '-10px !important'
  },

  iconStyleSelected: {
    marginTop: '5px !important',
    marginLeft: '-7px !important',
    color: '#FFF !important',
    fontSize: '25px !important'
  },

  colorWhite: {
    marginTop: '4px !important',
    color: '#FFF !important',
    fontSize: '14px !important'
  },

  colorTextWhite: {
    marginTop: '8px !important',
    color: '#FFF !important',
    fontSize: '14px !important'
  },
  
  // sub-menus

  expandIconDown: {
    marginTop: '4px !important',
    color: '#1F0ADF !important',
    marginRight: '-5px'
  },

  expandIconUp: {
    marginTop: '4px !important',
    color: '#FFF !important'
  },

  nested: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
    paddingLeft: '5px !important'
  },

  nestedSelected: {
    display: 'flex',
    color: '#FFF !important',
    borderRadius: '8px',
    width: '100%',
    padding: '1px 6px 2px 26px',
    marginLeft: '-10px',
    marginRight: '-20px'
  },

  subMenuOptionBox: {
    display: 'flex',
    width: '100%',
    padding: '2px 6px 3px 0px',
    marginLeft: '4px',
    marginRight: '-20px'
  },

  subMenuOptionBoxSelected: {
    display: 'flex',
    borderRadius: '8px',
    backgroundColor: '#F3F3F3',
    width: '100%',
    padding: '2px 6px 3px 0px',
    marginLeft: '4px',
    marginRight: '-20px'
  },

  nestedIcon: {
    marginTop: '10px',
    marginLeft: '18px',
    minWidth: '15px !important',
  },

  nestedText: {
    paddingTop: '2px',
    lineHeight: '2.0 !important',
    margin: '0 !important',
    fontSize: '14px !important'
  },

  lastItem: {
    lineHeight: 0.9,
    padding: 0,
    margin: 0
  }
}));

export { useStyles }
