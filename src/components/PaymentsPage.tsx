import {
  ClearButton,
  Container,
  FilterRow,
  SearchButton,
  SearchInput,
  Select,
  Title,
} from './components'
import { I18N } from '../constants/i18n'
import {
  SearchParams,
  SearchParamsSchema,
  useFetchTableData,
} from '../hooks/useFetchTableData'
import { FormEvent, useState } from 'react'
import { DataTable } from './DataTable'
import { ErrorAlert } from './ErrorAlert'
import { CURRENCIES } from '../constants'

// rename easier to type
const labels = I18N

const defaultFilters: SearchParams = {
  search: '',
  page: 1,
  pageSize: 5,
  currency: '',
}

export const PaymentsPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [filters, setFilters] = useState<SearchParams>(defaultFilters)

  const hasChanges =
    inputValue !== defaultFilters.search ||
    filters.currency !== defaultFilters.currency ||
    filters.search !== defaultFilters.search

  const { data: paymentResponse, error } = useFetchTableData(filters)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!hasChanges) return
    // zod validation here: single source of truth, fail gracefully, no malformed requests
    const result = SearchParamsSchema.safeParse({
      ...filters,
      search: inputValue,
    })

    if (result.success) {
      setFilters(result.data)
    }
    // todo error handling
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
    setInputValue('')
  }

  return (
    <Container>
      <Title>{labels.PAGE_TITLE}</Title>
      <form onSubmit={handleSubmit} role="search">
        {/* keeping this in herem tightly coupled to the state */}
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
              setFilters((prev) => ({
                ...prev,
                currency: e.target.value,
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
        <DataTable payments={paymentResponse?.payments ?? []} />
      )}
    </Container>
  )
}
