import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Recurring } from '../../model/Base/Recurring';
import { ChargeType } from '../../model/Base/ChargeType';
import { formatCurrency } from '../../utilities/helpers';
import Button from '@mui/material/Button';

interface RecurringsOneTimesViewProps {
  user: string;
  scenarioId: string;
  data: Recurring[]; // todo get rid of onetime and list of line items.
  onEdit: (recurring: Recurring) => void;
  onDelete: (recurring: Recurring) => void;
}

export const RecurringsOneTimesView: React.FC<RecurringsOneTimesViewProps> = ({ user, scenarioId, data, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Start Age</TableCell>
            <TableCell align="right">End Age</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="right">{row.startAge}</TableCell>
              <TableCell align="right">{row.startAge === row.endAge ? '-' : row.endAge}</TableCell>
              <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
              <TableCell align="right">
                {row.chargeType === ChargeType.EXPENSE ? "Expense" : "Income"}
              </TableCell>
              <TableCell align="center">
                <Button onClick={() => onEdit(row)}>Edit</Button>
                <Button onClick={() => onDelete(row)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}