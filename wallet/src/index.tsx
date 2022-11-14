import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from 'react-redux';
import App from "./App";
import {
  Mainnet,
  DAppProvider,
  Config,
} from "@usedapp/core";
import { store } from './state/store'
import reportWebVitals from "./reportWebVitals";
import { getDefaultProvider } from "ethers";

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider("mainnet"),
  },
  gasLimitBufferPercentage: 10, // The percentage by which the transaction may exceed the estimated gas limit.
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>

    <DAppProvider config={config}>
        <App />
    </DAppProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
