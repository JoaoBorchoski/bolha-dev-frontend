import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
import { CustomTable, FormHeader } from 'components'
import ListIcon from '@mui/icons-material/List'
import { useStyles } from './styles'
import api from 'services/api'
import { IModuleDTO } from 'data/dtos/security/i-module-dto'
import { ITableHeadCellDTO } from 'data/dtos/components/i-table-head-cell-dto'
import { useAlreadyMounted } from 'utils/use-already-mounted';

const headCells: ITableHeadCellDTO[] = [
  {
    id: 'name',
    label: 'Nome',
    width: 11
  },
]

const ModuleList: React.FC = () => {
  const [loading, setLoading] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [orderByDirection, setOrderByDirection] = useState(true)
  const [rowsCount, setRowsCount] = useState(0)
  const [modulesList, setModulesList] = useState<IModuleDTO[]>([])
  const [recordToDelete, setRecordToDelete] = useState<string | null>('')
  const [columnOrder, setColumnOrder] = useState<('ASC' | 'DESC')[]>([])

  const classes = useStyles()
  const alreadyMounted = useAlreadyMounted();

  const loadModules = async () => {
    setLoading(1)

    await api
      .post('/modules/list', {search, page, rowsPerPage, columnOrder})
      .then(async listResponse => {
        const { data } = listResponse.data
        setModulesList(data)

        await api
          .post('/modules/count', {search})
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
      .delete(`/modules/${recordToDelete}`)
      .then(async () => {
        await loadModules()
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
        loadModules()
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [search])


  useEffect(() => {
    loadModules()
  }, [orderByDirection, rowsPerPage, page])


  return (
    <Paper elevation={3} className={classes.paper}>

      <FormHeader
        title="Módulos"
        icon={ListIcon}
        newRoute="/modules/new"
        helpText="Nesta opção serão informados os módulos da Aplicação."
      />

      <CustomTable
        headCells={headCells}
        rows={modulesList}
        totalRows={rowsCount}
        handleSearch={setSearch}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        page={page}
        editRoute="/modules/edit"
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

export default ModuleList
