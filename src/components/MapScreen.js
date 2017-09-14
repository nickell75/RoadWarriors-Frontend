import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import Polyline from '@mapbox/polyline';
import { Button, CardSection, Input } from './common';
import restaurantImg from './imgs/restaurantgourmet.png';
import gasImg from './imgs/gazstation.png';
import SearchBox from './SearchBox';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ReactMaps extends Component {

  // set state with initial values for initial position of user, the marker position
  constructor(props) {
    super(props);

    this.state = {
      initialPosition: {
        latitude: 37.784517,
        longitude: -122.397194,
        latitudeDelta: 0,
        longitudeDelta: 0
      },
      markerPosition: {
        latitude: 0,
        longitude: 0
      },
      yelpMarkers: [],
      gasMarkers: [],
      destinationLoc: '',
      coords: [],
      polylines: []

    };
  }

  watchID: ?number = null

  componentDidMount() {
    console.log(this.state.destinationLoc);
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

      axios.all([
        axios({ method: 'get', url: `https://api.yelp.com/v3/businesses/search?term=food&latitude=${this.state.markerPosition.latitude}&longitude=${this.state.markerPosition.longitude}&radius=8500`, headers: { 'authorization': 'Bearer wtE8XDeiJULwkLUzO5z8_ZCGuMvnOMwVojZfWDTEXAAq5w5DqT7aF294pBuDY7SaKAjk7fSORTo0gjR4XiUhr2vBYJL4IPScLJffkvslOfuCp60CQbUTUEyzrv2xWXYx' } }).catch(response => { console.log(response); }),
        axios({ method: 'get', url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.78825,-122.4324&radius=8500&type=gas_station&key=AIzaSyCd4XV6oELQ949KGvp7-ODsqlyjgzQ4_KU` }).catch(response => { console.log(response); })
        ])
        .then(axios.spread((yelpData, gasData) => {
          this.setState({
            yelpMarkers: yelpData.data.businesses,
            gasMarkers: gasData.data.results
          });
        }))
        .catch(response =>
          console.log(response)
        );
      });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  destinationParser(destination) {
    return destination.split(" ").join('+');
  }

  getDirections() {

    const {markerPosition, destinationLoc } = this.state;
    const origin_latitude = this.state.markerPosition.latitude;
    const origin_longitude = this.state.markerPosition.longitude;
    const origin_position = `${origin_latitude},${origin_longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${ origin_position }&destination=${ this.destinationParser(destinationLoc)}&key=AIzaSyDv46VRrktCpx1fCm3piqCSsMRajVCd6rk`;

    axios.post(url).then(response => {
      let points = Polyline.decode(response.data.routes[0].overview_polyline.points);
      let coords = points.map((point) => {
        return  {
              latitude : point[0],
              longitude : point[1]
          }
      })

      let polyline = (
      <MapView.Polyline
            coordinates={coords}
            strokeWidth={8}
            strokeColor="blue"
      />
      );

      this.setState((prevState) => {
      return {
        polylines: [...prevState.polylines, polyline]
      }
    });

    return polyline;
  }).catch(error => {
      alert(error);
    });

 }

  render() {
    return (

      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={this.state.initialPosition}
          finalRegion={this.state.destinationLoc}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton
          zoomEnabled
          scrollEnabled
        >

        <MapView.Marker
          coordinate={this.state.markerPosition}>
          <View style={styles.radius}>
            <View style={styles.marker} />
          </View>
        </MapView.Marker>

        {this.state.polylines}


        {this.state.yelpMarkers.map((marker, index) => {
            return (
               <MapView.Marker
                  key={index}
                  image={restaurantImg}
                  coordinate={{
                     latitude: marker.coordinates.latitude,
                     longitude: marker.coordinates.longitude,
                  }}
                />
             );
         })}

        {this.state.gasMarkers.map((marker, index) => {
          return (
            <MapView.Marker
              key={index}
              image={gasImg}
              coordinate={{
                  latitude: marker.geometry.location.lat,
                  longitude: marker.geometry.location.lng,
              }}
            />
          );
        })}
      </MapView>

      <SearchBox>
          <CardSection>
            <Input
              placeholder="Where to?"
              value={this.state.destinationLoc}
              onChangeText={destinationLoc => this.setState({ destinationLoc })}
            />
          </CardSection>
          <CardSection>
            <Button onPress={() => this.getDirections.bind(this)}>
              Go
            </Button>
          </CardSection>
        </SearchBox>
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
});

export default ReactMaps;
