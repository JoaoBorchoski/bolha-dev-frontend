import { useContext } from 'react'
import { ApplicationContext } from 'contexts/application-context'

export function useApplication() {
	const application = useContext(ApplicationContext)

	return application
}
