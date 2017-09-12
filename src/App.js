import { StackNavigator } from 'react-navigation';
import MapScreen from './components/MapScreen';
import LoginForm from './components/LoginForm';

const App = StackNavigator({
  Login: { screen: LoginForm },
  Map: { screen: MapScreen }
});

export default App;
