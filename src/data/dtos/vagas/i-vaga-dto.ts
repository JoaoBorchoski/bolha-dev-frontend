interface IVagaDTO {
  id?: string
  nomeVaga?: string
  paisId?: string
  estadoId?: string
  cidadeId?: string
  descricao?: string
  numeroCandidaturas?: number
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type { IVagaDTO }
