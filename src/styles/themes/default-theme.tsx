import { createTheme } from '@mui/material/styles'

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#1F0ADF",
      light: "#5C6BC0",
      dark: "#5C6BC0",
      contrastText: "#3F51B5 !important"
    },
    secondary: {
      main: "#1F0ADF",
      light: "#5C6BC0",
      dark: "#5C6BC0",
      contrastText: "#3F51B5 !important"
    },
    background: {
      default: "#F3F6F9"
    }
  },

  typography: {
    fontSize: 14,
    allVariants: {
      color: "#1F0ADF"
    },
    button: {
      textTransform: 'none'
    }
  },

  shape: {
    borderRadius: 4
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '.MuiInputLabel-outlined.MuiInputLabel-shrink': {
          backgroundColor: 'white',
          paddingLeft: '5px',
          paddingRight: '5px',
        },
        '.MuiOutlinedInput-root': {
          height: '2.4em'
        },
        '*::-webkit-scrollbar': {
          backgroundColor: '#F3F6F9',
          width: '0.3em'
        },
        '*::-webkit-scrollbar-track': {
          WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)'
        },
        '.MuiToolbar-root': {
          height: '55px !important',
          minHeight: '55px !important'
        },
        '.MuiToolbar-root.MuiToolbar-gutters': {
          paddingLeft: 0,
          marginLeft: 0,
        },
        '.MuiTableCell-root': 
        {
          //borderBottom: 'none !important',
          padding: '5px 10px 5px 10px !important',
          alignItems: 'center',
          lineHeight: '1rem !important'
        },
        '.MuiTableCell-head': 
        {
          fontWeight: 'bold',
          lineHeight: '1rem !important',
          color: '#1F0ADF !important'
        },
        '.MuiTableSortLabel-root': {
          color: '#1F0ADF !important'
        },
        '.MuiTableSortLabel-icon': {
          color: '#1F0ADF !important'
        },
        '.MuiGrid-root': {
          flexGrow: 1,
          marginTop: '0px !important', 
          marginBottom: '0px !important',
          width: '100%'
        },
        '.MuiGrid-item': {
        },
        '.MuiSvgIcon-root': {
          color: "#1F0ADF"
        },
        'textarea': {
          resize: 'none',
          borderRadius: '4px !important',
          width: '100%',
          marginTop: '10px !important',
          padding: '10px',
          outline: 'none !important',
          border: '1px solid #C4C4C4',
          fontFamily: `"Inter", sans-serif`,
          fontSize: 14,
          color: '#605F6A',
          '&:focus': {
            border: '2px solid #2614FE'
          }
        }
      }
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        margin: 'dense',
        autoComplete: 'off',
        fullWidth: true,
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            transitionDelay: "9999s",
            transitionProperty: "background-color, color",
          },
          paddingTop: '7px !important',
          fontSize: '14px !important'
        },
      },
    },

    MuiInputLabel: {
      defaultProps: {
        shrink: true
      }
    },

    MuiButtonBase: {
      defaultProps: {
      }
    },

    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: "#1F0ADF",
        },
        tooltip: {
          backgroundColor: "#1F0ADF",
          fontSize: '0.9em'
        }
      }
    },
    
    MuiIcon: {
      styleOverrides: {
        root: {
          color: "#1F0ADF",
          fontSize: '2rem',
        },
      },
    },
  },

  zIndex: {
    appBar: 1200,
    drawer: 1100
  },

  transitions: {
    duration: {
      standard: 300,
    }
  }
})
