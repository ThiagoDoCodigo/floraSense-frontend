process.env.EXPO_PUBLIC_API_URL = 'http://api-teste.local';
import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn().mockResolvedValue({ isConnected: true, isInternetReachable: true }),
  addEventListener: jest.fn(),
  useNetInfo: jest.fn().mockReturnValue({ isConnected: true, isInternetReachable: true }),
}));

jest.mock('react-native/Libraries/Interaction/InteractionManager', () => ({
  runAfterInteractions: (callback) => {
    callback();
    return { cancel: jest.fn() };
  },
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockReturnValue(inset),
  };
});
jest.mock('react-native-ble-plx', () => ({
  BleManager: jest.fn().mockImplementation(() => ({
    startDeviceScan: jest.fn(),
    stopDeviceScan: jest.fn(),
    connectToDevice: jest.fn(),
  })),
}));

jest.mock('react-native-base64', () => ({
  encode: jest.fn((str) => str),
  decode: jest.fn((str) => str),
}));