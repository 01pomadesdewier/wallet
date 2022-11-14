import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers, BigNumber } from 'ethers';
import { RootState } from './store';

// Define a type for the slice state
interface TokenState {
  tokens: Token[] // maintain global set of tokens in our wallet
  selectedToken: string
}

// Define the initial state using that type
const initialState: TokenState = {
  tokens: [], // DAI address
  selectedToken: ''
}

export type Token = {
  tokenAddress: string;
  tokenBalance: string;
}

export const tokenSlice = createSlice({
  name: 'token',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addToken: (state, { payload: token }: PayloadAction<Token>) => {
      const { tokenAddress, tokenBalance } = token;
      const isValidAddress = ethers.utils.isAddress(tokenAddress);
      if (isValidAddress) {
        state.tokens.push({tokenAddress, tokenBalance});
      } else {
        console.log('Token Slice addToken: invalid address provided');
      }
    },
    deductTokenBalance: (state, { payload: token }: PayloadAction<Token>) => {
      const { tokenAddress, tokenBalance } = token;
      state.tokens.forEach((el) => {
        if (el.tokenAddress === tokenAddress) {
          el.tokenBalance = BigNumber.from(el.tokenBalance).sub(tokenBalance).toString();
        }
      });
    },
    setSelectedToken: (state, { payload: tokenAddress }: PayloadAction<string>) => {
      const isValidAddress = ethers.utils.isAddress(tokenAddress);
      if (isValidAddress) {
        state.selectedToken = tokenAddress;
      } else {
        console.log('Token Slice setSelectedToken: invalid address provided');
      }
    }
  }
})

export const { addToken, setSelectedToken, deductTokenBalance } = tokenSlice.actions
export const selectTokens = (state: RootState) => {return state.token.tokens;};
export const selectSelectedToken = (state: RootState) => state.token.selectedToken;

export default tokenSlice.reducer
