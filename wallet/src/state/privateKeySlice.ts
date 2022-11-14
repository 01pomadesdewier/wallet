import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';

// Define a type for the slice state
interface PrivateKeyState {
  key: string
}

// Define the initial state using that type
const initialState: PrivateKeyState = {
  key: ''
}

export const privateKeySlice = createSlice({
  name: 'privateKey',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPrivateKey: (state, { payload: key }: PayloadAction<string>) => {
      state.key = key;
    },
  }
})

export const { setPrivateKey } = privateKeySlice.actions
export const selectKey = (state: RootState) => state.privateKey.key;

export default privateKeySlice.reducer
