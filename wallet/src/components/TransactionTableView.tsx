import styled from '@emotion/styled';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formatEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import React  from 'react';

const columns: GridColDef[] = [
  { field: 'from', headerName: 'From', width: 200 },
  { field: 'to', headerName: 'To', width: 200 },
  { field: 'amount', headerName: 'Amount', width: 100},
  { field: 'blockNumber', headerName: 'Block Number', width: 200 },
];

export type TransactionTableViewProps = {
  transactions: Transaction[];
};

export type Transaction = {
  from: string;
  to: string;
  amount: BigNumber;
  blockNumber: string;
}

const Container = styled.div`
  height: 400px;
  width: 100%;
`

export default function TransactionTableView(props: TransactionTableViewProps) {
  const { transactions } = props;
  const rows = transactions.map((tx, index) => {
    const amount = formatEther(tx.amount);
    const from = tx.from;
    const to = tx.to;
    const blockNumber = tx.blockNumber;
    return { 'id': index, from, to, amount, blockNumber}
  });

  return (
    <Container>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </Container>
  );
}