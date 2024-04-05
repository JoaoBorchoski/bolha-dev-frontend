import React from 'react'
import { Route as ReactDOMRoute, RouteProps as ReactDOMRouteProps, Redirect } from 'react-router-dom'
import { useAuth } from 'hooks/auth'
import DefaultLayout from 'components/layouts/default'
import AuthenticationLayout from 'components/layouts/authentication'

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean
  component: React.FC<{}>
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth()

  const Layout = user ? DefaultLayout : AuthenticationLayout

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Layout>
            <Component />
          </Layout>
        ) : (
          <Layout>
            <Redirect
              to={{
                pathname: isPrivate ? '/' : '/home',
                state: { from: location },
              }}
            />
          </Layout>
        )
      }}
    />
  )
}

export default Route
