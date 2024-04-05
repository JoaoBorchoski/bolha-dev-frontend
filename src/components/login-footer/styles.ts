import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
	footer: {
    flexDirection: 'column',
    justifyContent: 'center',
		alignItems: 'center',
  	marginTop: 'auto',
  	backgroundColor: '#E7EAED',
  	padding: '10px 10px 15px 10px'
	},

	copyright: {
    flexDirection: 'column',
    justifyContent: 'center',
		alignItems: 'center',
		paddingTop: '4px'
	},

	policy: {
    flexDirection: 'column',
    justifyContent: 'center',
		alignItems: 'center',
	}
}))

export { useStyles }
