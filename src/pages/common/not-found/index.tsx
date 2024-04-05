import React, { useEffect } from 'react'
import { Paper, Typography } from '@mui/material'
import { useStyles } from "./styles"

const NotFound: React.FC = () => {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography variant="h5" className={classes.formTitle}>
        Não Achado
      </Typography>
    </Paper>
  )
}

export default NotFound
