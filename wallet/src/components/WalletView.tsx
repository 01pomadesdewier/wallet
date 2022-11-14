import { formatEther } from '@ethersproject/units';
import { Typography, TextField, Button, Paper } from '@material-ui/core';
import { Stack } from '@mui/material';
import { useEtherBalance, useTokenBalance, ChainId } from '@usedapp/core';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectKey, setPrivateKey } from '../state/privateKeySlice';
import { selectTokens, addToken, Token } from '../state/tokenSlice';
import TokenTableView from './TokenTableView';

export default function WalletView() {

  const dispatch = useDispatch();
  const privateKey = useSelector(selectKey);

  const tokens = useSelector(selectTokens);

  const [wallet, setWallet] = useState(''
  );

  const [erc20, setERC20] = useState(''
    // '0xd1e79236D39ed502611B41345AF9730a02b2fA2D'
    // address of Sanic ERC20 token on testnet
  );

  const etherBalance = useEtherBalance(wallet, {chainId: ChainId.Goerli}); // you can use just this for ether balance
  const [isValidToken, setIsValidToken] = useState(true);

  const [isValidWallet, setIsValidWallet] = useState(true);

  const handleChangePrivateKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPrivateKey(event.target.value));
  }

  const handleChangeWallet = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isValidAddress = ethers.utils.isAddress(event.target.value);
    if (isValidAddress) {
      setWallet(event.target.value);
      setIsValidWallet(true);
    }
  }

  const handleChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isValidAddress = ethers.utils.isAddress(event.target.value);

    if (isValidAddress) {
      setERC20(event.target.value);
      setIsValidToken(true);
    }
  }

  const balance = useTokenBalance(erc20, wallet, {chainId: ChainId.Goerli});

  const handleOnClick = () => {
    const isValidAddress = ethers.utils.isAddress(erc20);
    if (isValidAddress && balance) {
      dispatch(addToken({tokenAddress: erc20, tokenBalance: balance ? balance.toString(): '0'}));
    }
  };

  const rows: Token[] = [];
  if (tokens) {
    tokens.forEach((token: Token) => {
      rows.push({
        tokenAddress: token.tokenAddress,
        tokenBalance: token.tokenBalance,
      });
    });
  }

  return <Paper
    style={{
      display: "grid",
      gridRowGap: "20px",
      padding: "20px",
    }}
  >
    <TextField
      id="private-key-input"
      name="Private Key"
      label="Private Key"
      type="string"
      value={privateKey}
      onChange={handleChangePrivateKey}
      helperText="Wallet Private Key"
    />

    <TextField
      error={!isValidWallet}
      id="wallet-input"
      name="Wallet Address"
      label="Wallet Address"
      type="string"
      onChange={handleChangeWallet}
      helperText="ETH Goerli Testnet wallet address"
    />

    <Stack spacing={2} direction="row">
      <TextField
        error={!isValidToken}
        id="token-input"
        name="Token Address"
        label="Token Address"
        type="string"
        onChange={handleChangeToken}
        helperText="ETH Goerli Testnet token address"
      />
      <Button variant="contained" onClick={handleOnClick} disabled={!isValidToken || !erc20 || !balance}>Add token</Button>
    </Stack>

    {etherBalance && (
        <Typography variant="h6">ETH Wallet Balance: {formatEther(etherBalance)}</Typography>
    )}

    <TokenTableView tokenBalance={rows}/>

  </Paper>;

}
