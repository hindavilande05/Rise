import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Position {
  lat: number;
  lon: number;
}

interface Connector {
  connectorType: string;
  ratedPowerKW: number;
  voltageV: number;
  currentA: number;
  currentType: string;
}

interface ChargingStation {
  
  position: Position;
  poi?: {
    name: string;
    rating?: number;
  };
  address?: {
    freeformAddress: string;
  };
  chargingPark?: {
    connectors: Connector[];
  };
  openingHours?: {
    text: string;
  };
}

interface ChargingStationState {
  selectedStation: ChargingStation | null;
}

const initialState: ChargingStationState = {
  selectedStation: null,
};

const chargingStationSlice = createSlice({
  name: 'chargingStation',
  initialState,
  reducers: {
    setSelectedStation(state, action: PayloadAction<ChargingStation>) {
      state.selectedStation = action.payload;
    },
    resetSelectedStation(state) {
      state.selectedStation = null;
    },
  },
});

export const { setSelectedStation, resetSelectedStation } = chargingStationSlice.actions;
export default chargingStationSlice.reducer;
