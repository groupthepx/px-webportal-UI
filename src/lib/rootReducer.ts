// src/redux/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import counter1Reducer from './slices/counter1Slice';
import { apiSlice } from '@/utils/apiSlice';
import { RESET_STATE, ResetStateAction } from './userActions';

const appReducer = combineReducers({
  counter1Reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: ResetStateAction): RootState => {
  if (action.type === RESET_STATE) {
    // Reset the entire state when this action is triggered
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
