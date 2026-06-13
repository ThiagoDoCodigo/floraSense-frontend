jest.mock('react-native-th-components', () => {
  const { Text, TouchableOpacity } = require('react-native');

  return {
    Typography: ({ children }) => <Text>{children}</Text>,
    Button: ({ label, onPress }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    colors: {
      primary: { main: '#000', faded: '#000' },
      danger: { main: '#000', faded: '#000' },
      success: { main: '#000', light: '#000' },
      text: {
        primary: '#000',
        secondary: '#000',
        muted: '#000',
        inverse: '#000',
      },
      surface: '#000',
      surfaceHighlight: '#000',
      border: '#000',
      background: '#000',
    },
  };
});

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  
  const MockIcon = () => <View testID="mock-icon" />;

  return {
    LineChart: MockIcon,
    Leaf: MockIcon,
    CloudOff: MockIcon,
    RefreshCw: MockIcon,
  };
});
