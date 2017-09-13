import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MapView from 'react-native-maps';
import restaurantImg from '../imgs/restaurantgourmet.png';

class YelpMarkers extends Component {
		
	showMarker(marker) {
		return (
		<MapView.Marker
			key={marker.id.toString()}
			coordinate={{
				latitude: marker.coordinates.latitude,
				longitude: marker.coordinates.longitude					
			}}
			image={restaurantImg}
		/>
		);
	}

	// render() {
	// 	const yelpMarkers = this.props.yelpMarkers;

	// 	return (
	// 		<View>
	// 			{ 
	// 				yelpMarkers.map(marker => { 
	// 				return this.showMarker(marker);
	// 				}) 
	// 			}
	// 		</View>

	showTheMarker(yelpMarkers) {
		if (yelpMarkers.length > 0) {
			return (
					{
						latitude: 37.98825,
						longitude: -122.4324		
					}
			);
		}
	}

	// 	);
	// }
	render() {
	const yelpMarkers = this.props.yelpMarkers;
		return (
				<MapView.Marker
					coordinate={this.showTheMarker(yelpMarkers)}

				image={restaurantImg}
				/>
		);
	}
}
		
	// 	return (
	// 		<MapView.Marker

	// 			coordinate={{
	// 				latitude: yelpMarkers.coordinates.latitude,
	// 				longitude: yelpMarkers.coordinates.longitude					
	// 			}}
	// 			image={restaurantImg}
	// 		/>

	// 	);

export default YelpMarkers;
