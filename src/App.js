import { StackNavigator } from 'react-navigation';
import MapScreen from './components/MapScreen';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';

const App = StackNavigator({
  Login: { screen: LoginForm },
  Map: { screen: MapScreen },
  Register: { screen: RegistrationForm }
});

export default App;
