// types and hooks
import { type FormEvent, useState } from 'react'
import { useFetchTableData } from '../hooks/useFetchTableData'
import { type SearchParams, SearchParamsSchema } from '../types/searchParams'

//components
import {
  ClearButton,
  Container,
  FilterRow,
  PaginationButton,
  PaginationRow,
  SearchButton,
  SearchInput,
  Select,
  Title,
} from './components'
import { DataTable } from './DataTable'
import { ErrorAlert } from './ErrorAlert'

// constants
import { CURRENCIES } from '../constants'
import { I18N } from '../constants/i18n'

// rename easier to type
const labels = I18N

const defaultFilters: SearchParams = {
  search: '',
  page: 1,
  pageSize: 5,
  currency: '',
}

//logic is co-located, file is only 130 lines and no reuse. Would extract if it grew or became independently testable
export const PaymentsPage = () => {
  // draft and commmit state rather than update on user input
  const [inputValue, setInputValue] = useState('')
  const [filters, setFilters] = useState<SearchParams>(defaultFilters)

  // if this was filtering was more complex I would probably add react-hook-form and maybe combie with shadcn datatable to add more complex ui responsiveness and user interactivity.

  const hasChanges =
    inputValue !== defaultFilters.search ||
    filters.currency !== defaultFilters.currency ||
    filters.search !== defaultFilters.search

  const {
    data: paymentResponse,
    error,
    //isLoading in a production app I would handle loading states but data resolves instantly causing visual flash
  } = useFetchTableData(filters)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!hasChanges) return
    // zod validation here: single source of truth, fail gracefully, no malformed requests
    const result = SearchParamsSchema.safeParse({
      ...filters,
      search: inputValue,
      page: 1, // reset back to page one on anything that narrows results
    })

    if (result.success) {
      setFilters(result.data)
    }
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
    setInputValue('')
  }

  return (
    <Container>
      <Title>{labels.PAGE_TITLE}</Title>
      <form onSubmit={handleSubmit} role="search">
        {/* keeping this in here tightly coupled to the state */}
        <FilterRow>
          <SearchInput
            value={inputValue}
            placeholder={labels.SEARCH_PLACEHOLDER}
            aria-label={labels.SEARCH_LABEL}
            type="search"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Select
            aria-label={labels.CURRENCY_FILTER_LABEL}
            onChange={(e) =>
              //in production I would debounce these currency calls in case of quick selections changes
              setFilters((prev) => ({
                ...prev,
                currency: e.target.value,
                page: 1, // we want to reset back to page one
              }))
            }
            value={filters.currency}
          >
            {/* wont disable this as "" is valid in the api */}
            <option value="">{labels.CURRENCIES_OPTION}</option>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <SearchButton type="submit" disabled={!hasChanges}>
            {labels.SEARCH_BUTTON}
          </SearchButton>
          {hasChanges && (
            <ClearButton type="button" onClick={handleClearFilters}>
              {labels.CLEAR_FILTERS}
            </ClearButton>
          )}
        </FilterRow>
      </form>

      {error ? (
        <ErrorAlert error={error} />
      ) : (
        // default to an empty array for now need to implement proper laoding states
        <>
          <DataTable payments={paymentResponse?.payments ?? []} />
          <PaginationRow>
            <PaginationButton
              disabled={filters.page <= 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              {labels.PREVIOUS_BUTTON}
            </PaginationButton>
            {labels.PAGE_LABEL} {paymentResponse?.page}
            <PaginationButton
              disabled={
                !paymentResponse ||
                paymentResponse.payments.length < filters.pageSize
              }
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              {labels.NEXT_BUTTON}
            </PaginationButton>
          </PaginationRow>
        </>
      )}
    </Container>
  )
}
