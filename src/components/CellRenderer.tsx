import { Payment, PaymentStatus } from '../types/payment'
import { StatusBadge, TableCell } from './components'
import { format } from 'date-fns'

interface Props {
  type: keyof Payment
  value: string | number
}

export const TableCellResolver = ({ type, value }: Props) => {
  switch (type) {
    case 'amount':
      return <TableCell>{Number(value).toFixed(2)}</TableCell>
    case 'date':
      return (
        <TableCell>{format(new Date(value), 'dd/MM/yyyy, HH:mm:ss')}</TableCell>
      )
    case 'status':
      return (
        <TableCell>
          <StatusBadge status={value as PaymentStatus}>{value}</StatusBadge>
        </TableCell>
      )
    default:
      return <TableCell>{value}</TableCell>
  }
}
