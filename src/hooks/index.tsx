import React from 'react'

import { ApplicationProvider } from '../contexts/application-context'
import { AuthProvider } from './auth'

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ApplicationProvider>
      {children}
    </ApplicationProvider>
  </AuthProvider>
)

export default AppProvider
