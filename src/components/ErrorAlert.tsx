import axios from 'axios'
import { ErrorBox } from './components'
import { I18N } from '../constants/i18n'

const labels = I18N

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 404:
        return labels.PAYMENT_NOT_FOUND
      case 500:
        return labels.INTERNAL_SERVER_ERROR
      default:
        return labels.SOMETHING_WENT_WRONG
    }
  }
  return labels.SOMETHING_WENT_WRONG
}

interface Props {
  error: unknown
}

export const ErrorAlert = ({ error }: Props) => {
  // add role to announce for screen readers
  return <ErrorBox role="alert">{getErrorMessage(error)}</ErrorBox>
}
