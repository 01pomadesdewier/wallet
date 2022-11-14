import styled from '@emotion/styled';
import { DAppProvider, Goerli } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';
import React from 'react';
import Footer from './components/Footer';
import { blue, pink } from "@mui/material/colors";
import TransactionView from './components/TransactionView';
import WalletView from './components/WalletView';
import logo from "./logo.gif";
import "./App.css";

import { Container, createTheme, ThemeProvider, CssBaseline } from '@material-ui/core';

const Media = styled.img`
  height: 40vmin;
  pointer-events: none;
`;

export const appTheme = createTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
});

const config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: getDefaultProvider('goerli', {
      alchemy: `${process.env.ALCHEMY_API_KEY}`,
    })
  },
}

function App() {
  return (
    <DAppProvider config={config}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <div className="App">
          <Media src={logo} alt="logo" />
          <Container maxWidth="sm">
            <WalletView/>
            <TransactionView/>
          </Container>
          <Footer />
        </div>
      </ThemeProvider>
    </DAppProvider>
  );
}

export default App;
