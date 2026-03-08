import {
  Container,
  Table,
  TableBodyWrapper,
  TableHeader,
  TableHeaderRow,
  TableHeaderWrapper,
  TableRow,
  TableWrapper,
  Title,
} from './components'
import { I18N } from '../constants/i18n'
import { useFetchTableData } from '../hooks/useFetchTableData'
import { Payment } from '../types/payment'
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

export const PaymentsPage = () => {
  const { data: paymentResponse } = useFetchTableData({
    search: '',
    page: 1,
    pageSize: 5,
  })

  return (
    <Container>
      <Title>{labels.PAGE_TITLE}</Title>
      <TableWrapper>
        <Table>
          <TableHeaderWrapper>
            <TableHeaderRow>
              {tableHeaders.map((s) => (
                <TableHeader>{s}</TableHeader>
              ))}
            </TableHeaderRow>
          </TableHeaderWrapper>
          <TableBodyWrapper>
            {paymentResponse?.payments.map((p: Payment) => (
              <TableRow key={p.id}>
                {displayColumns.map((col) => (
                  <TableCellResolver key={col} type={col} value={p[col]} />
                ))}
              </TableRow>
            ))}
          </TableBodyWrapper>
        </Table>
      </TableWrapper>
    </Container>
  )
}
