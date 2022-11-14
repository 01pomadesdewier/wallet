import styled from '@emotion/styled';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { formatEther } from '@ethersproject/units';
import React  from 'react';
import { useDispatch } from 'react-redux';
import { Token, setSelectedToken } from '../state/tokenSlice';


const columns: GridColDef[] = [
  { field: 'token', headerName: 'Token Address', width: 400},
  {
    field: 'balance',
    headerName: 'Balance',
    width: 100,
  },
];

export type TokenTableViewProps = {
  tokenBalance: Token[]
};


const Container = styled.div`
  height: 400px;
  width: 100%;
`

export default function TokenTableView(props: TokenTableViewProps) {
  const { tokenBalance } = props;

  const dispatch = useDispatch();

  const rows = tokenBalance.map(({tokenAddress, tokenBalance}: Token, index) => {
    return { 'id': index, 'token': tokenAddress, 'balance': formatEther(tokenBalance) }
  });

  return (
    <Container>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={(params) => {dispatch(setSelectedToken(params.row.token))}}
      />
    </Container>
  );
}