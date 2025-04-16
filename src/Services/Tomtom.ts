import axios from 'axios';
import { EVRouteResponse } from '../types/apiTypes';

const API_KEY = 'UkAy5vXjPlyFW09VQYsnbG1PJvnMxN5B'; 

// 🌍 Fetch autocomplete suggestions
export const getAutocompleteSuggestions = async (query: string) => {
  const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${API_KEY}&limit=5`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
};

// 🚘 Calculate EV route

export const getEVRoute = async (
  start: { lat: number; lon: number },
  end: { lat: number; lon: number }
): Promise<{
  summary: { lengthInMeters: number; travelTimeInSeconds: number };
  route: { latitude: number; longitude: number }[];
  chargingStations: { latitude: number; longitude: number }[];
}> => {
  const endpoint = `https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/${start.lat},${start.lon}:${end.lat},${end.lon}/json?key=${API_KEY}&vehicleEngineType=electric&constantSpeedConsumptionInkWhPerHundredkm=32,10.87:77,18.01&currentChargeInkWh=20&maxChargeInkWh=40&minChargeAtDestinationInkWh=4&criticalMinChargeAtDestinationInkWh=2&minChargeAtChargingStopsInkWh=4`;

  const body = {
    chargingParameters: {
      batteryCurve: [
        { stateOfChargeInkWh: 50.0, maxPowerInkW: 200 },
        { stateOfChargeInkWh: 70.0, maxPowerInkW: 100 },
        { stateOfChargeInkWh: 80.0, maxPowerInkW: 40 },
      ],
      chargingConnectors: [
        {
          currentType: 'AC3',
          plugTypes: ['IEC_62196_Type_2_Outlet'],
          efficiency: 0.9,
          baseLoadInkW: 0.2,
          maxPowerInkW: 11,
        },
        {
          currentType: 'DC',
          plugTypes: ['IEC_62196_Type_2_Outlet'],
          voltageRange: { minVoltageInV: 0, maxVoltageInV: 500 },
          efficiency: 0.9,
          baseLoadInkW: 0.2,
          maxPowerInkW: 150,
        },
        {
          currentType: 'DC',
          plugTypes: ['IEC_62196_Type_2_Outlet'],
          voltageRange: { minVoltageInV: 500, maxVoltageInV: 2000 },
          efficiency: 0.9,
          baseLoadInkW: 0.2,
        },
      ],
      chargingTimeOffsetInSec: 60,
    },
  };

  try {
    const response = await axios.post<EVRouteResponse>(endpoint, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    const route = response.data.routes?.[0];
    const leg = route?.legs?.[0];
    const points =
      leg?.points?.map((pt) => ({
        latitude: pt.latitude,
        longitude: pt.longitude,
      })) || [];

    const stations =
      route?.chargingParkings?.map((station) => ({
        latitude: station.position.latitude,
        longitude: station.position.longitude,
      })) || [];

    console.log('Full API response:', JSON.stringify(response.data, null, 2));

    return {
      summary: route?.summary || {
        lengthInMeters: 0,
        travelTimeInSeconds: 0,
      },
      route: points,
      chargingStations: stations,
    };
  } catch (error) {
    console.error('EV routing error:', error);
    return {
      summary: { lengthInMeters: 0, travelTimeInSeconds: 0 },
      route: [],
      chargingStations: [],
    };
  }
};

