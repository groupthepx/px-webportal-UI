// src/redux/actions/userActions.ts
import { apiSlice } from '@/utils/apiSlice';
import { Action, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export const RESET_STATE = 'RESET_STATE';

export type ResetStateAction = Action<typeof RESET_STATE>;

export const resetState = (): ResetStateAction => ({
  type: RESET_STATE,
});

// Enhanced reset function that also clears API cache
export const clearAllData = (): ThunkAction<void, RootState, unknown, Action> =>
  (dispatch) => {
    // Reset Redux state
    dispatch(resetState());
    
    // Invalidate specific API tags to ensure fresh data on next login
    dispatch(apiSlice.util.invalidateTags([
      'withdraw', 'member', 'profile', 'kyc'
    ]));
    
    // Clear entire RTK Query cache
    dispatch(apiSlice.util.resetApiState());
  };
