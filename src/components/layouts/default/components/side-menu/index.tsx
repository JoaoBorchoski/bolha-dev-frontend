import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, List, ListItem, ListItemIcon, ListItemText, Collapse, SvgIconProps, Icon } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useApplication } from 'hooks/use-application'

import { useStyles } from "./styles"

interface ISubMenuOption {
	id: string
	icon: React.ReactElement<SvgIconProps>
	text: string
	route: string
}

export interface IMenuOption {
	id: string
	icon: React.ReactElement<SvgIconProps>
	text: string
	route: string
	subMenuOptions: ISubMenuOption[]
}

interface IMenuProps {
	options: IMenuOption[]
}

const SideMenu: React.FC<IMenuProps> = ({ options }) => {
	const [currentItem, setCurrentItem] = useState('000')
	const [currentSubItem, setCurrentSubItem] = useState('')
  const { menuOpen, setMenuOpen } = useApplication();

	const classes = useStyles()
  const history = useHistory()

	const handleClick = (item: string) => {
		if (item !== '000') {
			if (currentItem === item) {
				setCurrentItem('')
			} else {
				setCurrentItem(item)
			}

			setMenuOpen(true)
		} else {
			setCurrentItem('000')
			setMenuOpen(true)
			history.push('/home')
		}
	}

	const handleClickSubMenu = (item: string, route: string) => {
		if (currentItem === item) {
			setCurrentSubItem('')
		} else {
			setCurrentSubItem(item)
		}

		history.push(route)
	}

	useEffect(() => {
		if (menuOpen) {
			setCurrentItem(currentItem)
		} else {
			setCurrentItem('')			
		}
	}, [menuOpen])

	const renderSubMenu = (subMenuOptions: ISubMenuOption[]) => {
		return (subMenuOptions.map(({ id, icon, text, route }) => (<ListItem key={id} button className={classes.nested} onClick={() => handleClickSubMenu(id, route)} >
					<Box className={currentSubItem === id ? classes.subMenuOptionBoxSelected : classes.subMenuOptionBox}>
						<ListItemIcon className={classes.nestedIcon}>
							<Icon className={classes.bulletIcon}>lens</Icon>
						</ListItemIcon>
						<ListItemText disableTypography primary={text} className={classes.nestedText} />
					</Box>
				</ListItem>
			))
		)
	}

	return (
		<Box className={menuOpen ? classes.leftMenuOpen : classes.leftMenuClose}>
			<Box className={classes.menuContainer}>
			 <List
					component="nav"
					aria-labelledby="nested-list-subheader"
				>
					<ListItem key={'000'} button className={classes.menuOption} onClick={() => handleClick('000')}>
						<Box className={currentItem === '000' ? classes.menuOptionBoxSelected : classes.menuOptionBox}>
							<ListItemIcon className={currentItem === '000' ? classes.menuOptionIconSelected : classes.menuOptionIcon} >
								<Icon className={currentItem === '000' ? classes.iconStyleSelected : classes.iconStyle}>{'house'}</Icon>
							</ListItemIcon>
							<ListItemText disableTypography primary='Home' className={currentItem === '000' ? classes.colorTextWhite : classes.colorTextPrimaryLight} />
						</Box>
					</ListItem>
					{options.map(({ id, icon, text, route, subMenuOptions }) => (
						<div>
							{ subMenuOptions.length > 0 ? (<ListItem key={id} button className={classes.menuOption} onClick={() => handleClick(id)}>
									<Box className={currentItem === id ? classes.menuOptionBoxSelected : classes.menuOptionBox}>
										<ListItemIcon className={currentItem === id ? classes.menuOptionIconSelected : classes.menuOptionIcon} >
											<Icon className={currentItem === id ? classes.iconStyleSelected : classes.iconStyle}>{icon}</Icon>
										</ListItemIcon>
										<ListItemText disableTypography primary={text} className={currentItem === id ? classes.colorTextWhite : classes.colorTextPrimaryLight} />
										{ menuOpen ? currentItem === id ? <ExpandLess className={classes.expandIconUp} /> : <ExpandMore className={classes.expandIconDown}/>  : null }
									</Box>
								</ListItem>
							) : (<ListItem key={id} button className={classes.menuOption} onClick={() => history.push(route)} >
									<ListItemIcon className={currentItem === id ? classes.menuOptionIconSelected : classes.menuOptionIcon} >
										<Icon className={currentItem === id ? classes.iconStyleSelected : classes.iconStyle}>{icon}</Icon>
									</ListItemIcon>
									<ListItemText disableTypography primary={text} className={classes.nestedText} />
								</ListItem>
							)}

							<Collapse in={currentItem === id} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									{ renderSubMenu(subMenuOptions) }
									{ subMenuOptions.length > 0 ? <div className={classes.lastItem}>&nbsp;</div> : "" }
								</List>
							</Collapse>
						</div>
					))}
				</List>
			</Box>
		</Box>		
	)
}

export default SideMenu
