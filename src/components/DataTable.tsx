import { Payment } from '../types/payment'
import {
  Table,
  TableBodyWrapper,
  TableHeader,
  TableHeaderRow,
  TableHeaderWrapper,
  TableRow,
  TableWrapper,
} from './components'
import { I18N } from '../constants/i18n'
import { TableCellResolver } from './CellRenderer'

// rename easier to type
const labels = I18N

// retrieve the headers from the contants
const tableHeaders = Object.entries(labels)
  .filter(([k]) => k.includes('TABLE_HEADER'))
  .map(([, v]) => v)

const displayColumns: (keyof Payment)[] = [
  'id',
  'date',
  'amount',
  'customerName',
  'currency',
  'status',
]

interface Props {
  payments: Payment[]
}

export const DataTable = ({ payments }: Props) => {
  return (
    <TableWrapper>
      <Table>
        <TableHeaderWrapper>
          <TableHeaderRow>
            {tableHeaders.map((s) => (
              <TableHeader scope="col" key={s}>
                {s}
              </TableHeader>
            ))}
          </TableHeaderRow>
        </TableHeaderWrapper>
        <TableBodyWrapper aria-live="polite">
          {payments.map((p: Payment) => (
            <TableRow key={p.id}>
              {displayColumns.map((col) => (
                <TableCellResolver key={col} type={col} value={p[col]} />
              ))}
            </TableRow>
          ))}
        </TableBodyWrapper>
      </Table>
    </TableWrapper>
  )
}
