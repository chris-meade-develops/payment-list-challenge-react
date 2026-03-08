import z from 'zod'
import { CURRENCIES } from '../constants'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { PaymentSearchResponse } from '../types/payment'

const STALE_TIME = 5000 // 5 seconds
const QUERY_KEY = 'payments'
const BASE_URL = '/api/payments'

export const SearchParamsSchema = z.object({
  search: z.string(),
  currency: z.enum(CURRENCIES).or(z.literal('')).optional(),
  page: z.number(),
  pageSize: z.number(),
})

export type SearchParams = z.infer<typeof SearchParamsSchema>

const fetchPaymentsFromAPI = async (
  searchParams: SearchParams,
): Promise<PaymentSearchResponse> => {
  // axios in the deps, handles serialisation of params and requests, validation will happen before we hit this function
  const { data } = await axios.get(BASE_URL, { params: searchParams })
  return data
}

export const useFetchTableData = (searchParams: SearchParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, searchParams],
    queryFn: () => fetchPaymentsFromAPI(searchParams),
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData, // prevent table disappearing on new data load
  })
}
