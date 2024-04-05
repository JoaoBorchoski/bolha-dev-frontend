import React from 'react'
import { Alert } from '@mui/material'

type Props = {
  setMainError: React.Dispatch<React.SetStateAction<string>>
  mainError: string
}

const FormAlert: React.FC<Props> = ({
  setMainError,
  mainError
}: Props) => {
	return (
    <Alert
      onClose={() => setMainError('')}
      style={{
        display: (mainError === '') ? 'none' : '',
        marginTop: '20px',
        marginBottom: '10px'
      }}
      severity="error"
    >
      {mainError}
    </Alert>
	)
}

export { FormAlert }
