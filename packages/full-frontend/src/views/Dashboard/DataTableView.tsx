import React from 'react';
import Paper from '@mui/material/Paper';

import {
  TableContainer,
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import {Recurring} from '../../model/Base/Recurring';
import {formatCurrency} from '../../utilities/helpers';

interface DataTableViewProps {
  user: string;
  scenarioId: string;
  recurrings: Recurring[];
  medianLine: number[];
  age: number;
}

const DataTableView: React.FC<DataTableViewProps> = ({user, scenarioId, recurrings, medianLine, age}) => {
  const formatRecurrings = (recurrings: Recurring[]) => {
    const formattedRecurrings = recurrings.map((r) => {
      if (r.startAge != r.endAge) {
        return `${r.title} (${formatCurrency(r.amount * 12)})`;
      } else {
        return `${r.title} (${formatCurrency(r.amount)})`;
      }
    });
    return formattedRecurrings.join(', ');
  };

  const getRecurringsForAge = (recurrings: Recurring[], age: number) => {
    // get all recurrings where age is between start and end age
    const recurringsForAge = recurrings.filter((r) => r.startAge <= age && r.endAge >= age);
    return recurringsForAge;
  };

  return (<>
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Age</TableCell>
            <TableCell align="right">Assets Value</TableCell>
            <TableCell align="right">Recurring</TableCell>
            <TableCell align="right">Note</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medianLine.map((medianAmount, index) => {
            const value = formatCurrency(medianAmount);
            const recurringsForAge = getRecurringsForAge(recurrings, index + age);
            return (
              <TableRow
                key={index}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {index + age}
                </TableCell>
                <TableCell align="right">{value}</TableCell>
                <TableCell align="right">{formatRecurrings(recurringsForAge)}</TableCell>
                <TableCell align="right">{ }</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </>);
};

export default DataTableView;
