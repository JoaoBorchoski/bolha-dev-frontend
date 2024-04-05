import { createContext, useState, ReactNode } from 'react'

type ApplicationContextType = {
	menuOpen: boolean
	setMenuOpen: (menuOpen: boolean) => void
}

interface Props {
	children?: ReactNode
}

export const ApplicationContext = createContext({} as ApplicationContextType)

export function ApplicationProvider({ children }: Props) {
	const [menuOpen, setMenuOpen] = useState<boolean>(true)

	return (
		<ApplicationContext.Provider
			value={{
				menuOpen,
				setMenuOpen
			}}
		>
			{children}
		</ApplicationContext.Provider>
	)
}
