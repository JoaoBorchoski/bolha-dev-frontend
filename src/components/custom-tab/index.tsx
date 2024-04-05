import React from 'react'
import { Box, Typography, Tab, Tabs } from '@mui/material'
import { useStyles } from './styles'

interface ITabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: ITabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{marginTop: 10}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function tabsProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

type Props = {
  currentTab: number,
  handleTabChange: (event: React.SyntheticEvent<Element, Event>, value: any) => void,
  labels: string[]
}

const CustomTab: React.FC<Props> = ({
  currentTab,
  handleTabChange,
  labels
}: Props) => {
	const classes = useStyles()
  
	return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={currentTab} onChange={handleTabChange}>
      {labels.map((label, index) => (<Tab label={label} {...tabsProps(index)} />
      ))}
      </Tabs>
    </Box>
	)
}

export { TabPanel, CustomTab }
