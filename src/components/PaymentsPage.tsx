import {
  ClearButton,
  Container,
  FilterRow,
  SearchButton,
  SearchInput,
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

  const hasChanges = inputValue !== defaultFilters.search //Todo extend to other filters in next steps

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
        <FilterRow>
          <SearchInput
            value={inputValue}
            placeholder={labels.SEARCH_PLACEHOLDER}
            aria-label={labels.SEARCH_LABEL}
            type="search"
            onChange={(e) => setInputValue(e.currentTarget.value)}
          />
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
