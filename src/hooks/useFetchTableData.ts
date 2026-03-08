import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { type PaymentSearchResponse } from '../types/payment'
import { type SearchParams } from '../types/searchParams'

const STALE_TIME = 5000 // 5 seconds
const QUERY_KEY = 'payments'
const BASE_URL = '/api/payments'

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
