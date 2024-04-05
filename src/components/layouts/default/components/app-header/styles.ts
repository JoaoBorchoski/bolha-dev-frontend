import { Theme } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'

const drawerWidth = 258
const appBarHeight = 55

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'sticky',
      width: '100%',
    },

    appBar: {
      height: `${appBarHeight}px`
    },

    profileImage: {
      width: 25,
      height: 25,
      borderRadius: '50%'
    },

    logoArea: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 0,
      height: `${appBarHeight}px`,
      width: `${drawerWidth}px`,
      backgroundColor: theme.palette.primary.main
    },

    logo: {
      height: '50px',
      width: '200px',
      marginLeft: '0',
      marginRight: '[##main-logo-margin-right##]',
    },
    
    hamburguerMenuContainer: {
      marginLeft: '5px !important',
      backgoundColor: '#FFF !important'
    },

    hamburguerMenu: {
      width: '40px',
      height: '40px',
      color: '#fff !important',
      fontSize: '1.7rem !important',
      marginLeft: '0'
    },
    
    mainMenu: {
      width: '100%',
      maxWidth: drawerWidth,
      backgroundColor: theme.palette.background.paper,
    },

    renderMenu: {
      top: '-100px !important'
    },

    formControl: {
      marginLeft: 15,
      padding: '1px 20px 1px 20px',
      minWidth: 250,
      borderRadius: theme.shape.borderRadius,
      color: 'var(--toolbarColor)',
      backgroundColor: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.common.white,
      },
    },

    whiteColor: {
      color: '#FFF',
    },

    toolBarColor: {
      color: theme.palette.background.paper,
      "&:focus": {
        background: 'inherit',
      },
    },

    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },

    drawerPaper: {
      width: drawerWidth,
    },

    drawerContainer: {
      overflow: 'overlay',
    },

    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      paddingTop: '90px',
    },

    grow: {
      flexGrow: 1,
    },

    menuButton: {
      marginRight: theme.spacing(2),
    },
    
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },

    sectionDesktop: {
      marginTop: '0px',
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },

    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },

    appIcon: {
      color: theme.palette.primary.main
    }
  }),
)

export { useStyles }
