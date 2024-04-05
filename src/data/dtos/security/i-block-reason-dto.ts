interface IBlockReasonDTO {
  id?: string
  code?: string
  description?: string
  instructionsToSolve?: string
  isSolvedByPasswordReset?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type { IBlockReasonDTO }
