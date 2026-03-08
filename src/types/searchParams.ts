import z from 'zod'
import { CURRENCIES } from '../constants'

export const SearchParamsSchema = z.object({
  search: z.string(),
  currency: z.enum(CURRENCIES).or(z.literal('')).optional(),
  page: z.number(),
  pageSize: z.number(),
})

export type SearchParams = z.infer<typeof SearchParamsSchema>
