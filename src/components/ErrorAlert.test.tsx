import { render, screen } from '@testing-library/react'
import { ErrorAlert } from './ErrorAlert'
import { I18N } from '../constants/i18n'
import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom'

const labels = I18N

const createAxiosError = (status: number): AxiosError => {
  return new AxiosError(
    'Request failed',
    String(status),
    undefined,
    undefined,
    {
      status,
      data: {},
      statusText: '',
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    },
  )
}

describe('ErrorAlert', () => {
  test('displays payment not found for 404', () => {
    render(<ErrorAlert error={createAxiosError(404)} />)
    expect(screen.getByText(labels.PAYMENT_NOT_FOUND)).toBeInTheDocument()
  })
  test('displays server error for 500', () => {
    render(<ErrorAlert error={createAxiosError(500)} />)
    expect(screen.getByText(I18N.INTERNAL_SERVER_ERROR)).toBeInTheDocument()
  })

  test('displays generic message for other status codes', () => {
    render(<ErrorAlert error={createAxiosError(403)} />)
    expect(screen.getByText(I18N.SOMETHING_WENT_WRONG)).toBeInTheDocument()
  })

  test('displays generic message for non-axios errors', () => {
    render(<ErrorAlert error={new Error('network failure')} />)
    expect(screen.getByText(I18N.SOMETHING_WENT_WRONG)).toBeInTheDocument()
  })

  test('has alert role for accessibility', () => {
    render(<ErrorAlert error={new Error('test')} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
