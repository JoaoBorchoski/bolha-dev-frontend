import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { defaultTheme } from 'styles/themes/default-theme'

ReactDOM.render(
  <ThemeProvider theme={defaultTheme}>
    <CssBaseline />
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById('root'),
)
