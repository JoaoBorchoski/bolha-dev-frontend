import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
import { CustomTable, FormHeader } from 'components'
import ListIcon from '@mui/icons-material/List'
import { useStyles } from './styles'
import api from 'services/api'
import { INavigationDTO } from 'data/dtos/security/i-navigation-dto'
import { ITableHeadCellDTO } from 'data/dtos/components/i-table-head-cell-dto'
import { useAlreadyMounted } from 'utils/use-already-mounted';

const headCells: ITableHeadCellDTO[] = [
  {
    id: 'name',
    label: 'Usuário',
    width: 3
  },
  {
    id: 'navigationDate',
    label: 'Data',
    width: 2
  },
  {
    id: 'route',
    label: 'Rota',
    width: 6
  },
]

const NavigationList: React.FC = () => {
  const [loading, setLoading] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [orderByDirection, setOrderByDirection] = useState(true)
  const [rowsCount, setRowsCount] = useState(0)
  const [navigationsList, setNavigationsList] = useState<INavigationDTO[]>([])
  const [recordToDelete, setRecordToDelete] = useState<string | null>('')
  const [columnOrder, setColumnOrder] = useState<('ASC' | 'DESC')[]>([])

  const classes = useStyles()
  const alreadyMounted = useAlreadyMounted();

  const loadNavigations = async () => {
    setLoading(1)

    await api
      .post('/navigations/list', {search, page, rowsPerPage, columnOrder})
      .then(async listResponse => {
        const { data } = listResponse.data
        setNavigationsList(data)

        await api
          .post('/navigations/count', {search})
          .then(countResponse => {
            const { count } = countResponse.data.data
            setRowsCount(count)
          })
          .then(() => setLoading(0))
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })
  }


  const handleDelete = async () => {
    await api
      .delete(`/navigations/${recordToDelete}`)
      .then(async () => {
        await loadNavigations()
      })
      .catch(error => {
        console.log(error.response.data)
      })
  }


  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
    setPage(newPage);
  }


  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!alreadyMounted) {
        loadNavigations()
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [search])


  useEffect(() => {
    loadNavigations()
  }, [orderByDirection, rowsPerPage, page])


  return (
    <Paper elevation={3} className={classes.paper}>

      <FormHeader
        title="Navegação"
        icon={ListIcon}
        newRoute="/navigations/new"
        helpText="Nesta opção serão armazenados os históricos de navegação do usuário pelas diversas áreas da aplicação."
      />

      <CustomTable
        headCells={headCells}
        rows={navigationsList}
        totalRows={rowsCount}
        handleSearch={setSearch}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        page={page}
        editRoute="/navigations/edit"
        handleDelete={handleDelete}
        handleRecordToDelete={setRecordToDelete}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        orderByDirection={orderByDirection}
        setOrderByDirection={setOrderByDirection}
      />

    </Paper>
  )
}

export default NavigationList
