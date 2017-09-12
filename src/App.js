import { StackNavigator } from 'react-navigation';
import MapScreen from './components/MapScreen';

const App = StackNavigator({
  Map: { screen: MapScreen },
});

export default App;
