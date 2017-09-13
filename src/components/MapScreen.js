import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Keyboard,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Card, CardSection, Input } from './common';
import axios from 'axios';
import YelpMarkers from './common/yelpMarkers';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ReactMaps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      },
      markerPosition: {
        latitude: 0,
        longitude: 0
      },
      destination: '',
      yelpMarkers: [],
    };
  }

  watchID: ?number = null

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = parseFloat(position.coords.latitude);
      let long = parseFloat(position.coords.longitude);

      let initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      };

      this.setState({ initialPosition: initialRegion });
      this.setState({ markerPosition: initialRegion });
    },
    (error) => alert(JSON.stringify(error)),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });

    this.watchID = navigator.geolocation.watchPosition((position) => {
      let lat = parseFloat(position.coords.latitude);
      let long = parseFloat(position.coords.longitude);

      let lastRegion = {
        latitude: lat,
        longitude: long,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA
      };

      this.setState({ initialPosition: lastRegion });
      this.setState({ markerPosition: lastRegion });
    });
    
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
    
  }

  getDirections() {
    axios({
      method: 'get',
      url: 'https://api.yelp.com/v3/businesses/search?location=${this.state.destination}',
      headers: {'authorization': 'Bearer wtE8XDeiJULwkLUzO5z8_ZCGuMvnOMwVojZfWDTEXAAq5w5DqT7aF294pBuDY7SaKAjk7fSORTo0gjR4XiUhr2vBYJL4IPScLJffkvslOfuCp60CQbUTUEyzrv2xWXYx'} 
    }).then(
      response => console.log(response)
    );

  }


  render() {
    return (
      
        <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={this.state.initialPosition}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton
              showsTraffic
              zoomEnabled
              scrollEnabled
            >

              <MapView.Marker
                coordinate={this.state.markerPosition}>
                <View style={styles.radius}>
                  <View style={styles.marker} />
                </View>
              </MapView.Marker>

              <Card>
                <CardSection>
                  <Input
                  placeholder="Where to?"
                  value={this.state.destination}
                  onChangeText={destination => this.setState({ destination })}
                  />
                </CardSection>

                <CardSection>
                  <Button onPress={this.getDirections}>
                    Go Noob!
                  </Button>
                </CardSection>
              </Card>

              <YelpMarkers yelpMarkers={this.state.yelpMarkers}/>
              
            </MapView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {

  }
});

export default ReactMaps;
