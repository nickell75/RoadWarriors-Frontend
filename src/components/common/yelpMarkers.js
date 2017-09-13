import React, { Component } from 'react';
import { Text } from 'react-native';

import MapView from 'react-native-maps';


class YelpMarkers extends Component {
	render() {

		return (
			<MapView >
        <Text>yelp me</Text>
      </MapView>
		);
	}
 }
				


export default YelpMarkers;