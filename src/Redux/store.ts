import { configureStore } from '@reduxjs/toolkit';
import chargingStationReducer from './chargingStationSlice';

export const store = configureStore({
  reducer: {
    chargingStation: chargingStationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
