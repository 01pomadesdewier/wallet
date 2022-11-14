import styled from '@emotion/styled';
import { TextField, Button, Grid } from '@material-ui/core';
import { Alert, AlertTitle } from '@mui/material';
import { useContractFunction, Goerli } from '@usedapp/core';
import { ethers, BigNumber, Contract } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectKey } from '../state/privateKeySlice';
import { selectSelectedToken, deductTokenBalance } from '../state/tokenSlice';
import TransactionTableView, { Transaction } from './TransactionTableView';
import contractAbi from "../contracts/sanicTokenAbi.json";

const TransactionContainer = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
`;


export default function TransactionView() {

  const dispatch = useDispatch();
  const privateKey = useSelector(selectKey);
  const selectedToken = useSelector(selectSelectedToken);

  const [recipientWallet, setRecipientWallet] = useState(
    ""
  );

  const [recipientAmount, setRecipientAmount] = useState(BigNumber.from('0'));

  const [transactions, setStransactions] = useState([] as Transaction[]);

  // Sanic by default
  let contractToken = '0xd1e79236D39ed502611B41345AF9730a02b2fA2D';
  if (selectedToken) {
    contractToken = selectedToken;
  }

  const contractInterface = new ethers.utils.Interface(contractAbi);
  const contract = new Contract(contractToken, contractInterface);

  const { state, send: transfer } = useContractFunction(contract, 'transfer', { chainId: Goerli.chainId, privateKey: privateKey , transactionName: 'transfer' })

  const handleRecipientAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isValidAddress = ethers.utils.isAddress(event.target.value);
    if (isValidAddress) {
      setRecipientWallet(event.target.value);
    }
  }

  const handleRecipientAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    let amount = BigNumber.from('0');
    try {
      amount = BigNumber.from(event.target.value);
    } catch (error) {
      console.log(error);
    }
    setRecipientAmount(amount);
  }

  const status = state.status;

  const sendTx = () => {
    transfer(recipientWallet, parseEther(recipientAmount.toString())).then((response) => {
      if (response && response.status === 1) {
        const event = (response as any).events.find((event: any) => event.event === 'Transfer');
        const [from, to, value] = event.args;
        const transaction: Transaction = {
          from,
          to,
          amount: value as BigNumber,
          blockNumber: event.blockNumber,
        };
        setStransactions(oldArray => [...oldArray, transaction]);
        dispatch(deductTokenBalance({tokenAddress: contractToken, tokenBalance: parseEther(recipientAmount.toString()).toString()}));
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  if (!selectedToken || !privateKey) {
    return <TransactionContainer>
      <Alert severity="warning">
        <AlertTitle>Need Token and Private Key</AlertTitle>
        Please provide <strong>wallet private key</strong> and select <strong>ERC-20 token address</strong> from the table
      </Alert>
    </TransactionContainer>;
  }

  return <TransactionContainer>
  <Grid container alignItems="center" direction="column" spacing={2}>
    <Grid item>
      <TextField
        id="recipient-address"
        name="Recipient address"
        label="Recipient address"
        type="string"
        value={recipientWallet}
        onChange={handleRecipientAddress}
      />
    </Grid>

    <Grid item>
      <TextField
        id="recipient-amount"
        name="Recipient amount"
        label="Amount to send"
        type="string"
        value={recipientAmount}
        onChange={handleRecipientAmount}
      />
    </Grid>

    <Grid item>
      <Button variant="contained" onClick={() => sendTx()}
        disabled={
          recipientWallet === '' ||
          recipientAmount.isZero() ||
          privateKey === '' || privateKey === undefined ||
          status === 'PendingSignature' || status === 'Mining'
        }
      >
        Send Crypto
      </Button>

      <Alert severity="info">Transaction status: {status}</Alert>
    </Grid>

    <TransactionTableView transactions={transactions}/>

  </Grid>
  </TransactionContainer>;
}
