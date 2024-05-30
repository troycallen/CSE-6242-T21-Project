import { React, useEffect, useState } from "react";
import "../App.css";
import {
	APIProvider,
	Map,
	AdvancedMarker,
	useMap,
	useMapsLibrary,
} from "@vis.gl/react-google-maps";

function Directions({ markers, setDuration }) {
	const map = useMap();
	const routesLibrary = useMapsLibrary("routes");
	const [directionsService, setDirectionsService] = useState();
	const [directionsRenderer, setDirectionsRenderer] = useState();
	const [routes, setRoutes] = useState([]);
	const [routeIndex, setRouteIndex] = useState(0);
	const selected = routes[routeIndex];
	const leg = selected?.legs[0];

	// Initialize directions service and renderer
	useEffect(() => {
		if (!routesLibrary || !map) return;
		setDirectionsService(new routesLibrary.DirectionsService());
		setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
	}, [routesLibrary, map]);

	// Use directions service
	useEffect(() => {
		if (markers.length !== 2 || !directionsService || !directionsRenderer) {
			return;
		} else if (markers.length == 2) {
			
			const origin = markers[0];
			const destination = markers[1];

			directionsService
				.route({
					origin: origin,
					destination: destination,
					travelMode: google.maps.TravelMode.DRIVING,
					provideRouteAlternatives: true,
				})
				.then((response) => {
					directionsRenderer.setDirections(response);
					setRoutes(response.routes);
					setDuration(response.routes[0].legs[0].duration.value);
					// console.log(response.routes[0].overview_path);
					console.log(response);
					// directionsRenderer.setMap(null);
					// directionsRenderer.setDirections(null);
				});
				
				// directionsRenderer.setMap(null);
			// return () => {
			// 	directionsRenderer.set('directions', null);
			// 	directionsRenderer.setMap(null);
			// }
			
			
		} else if (markers.length ==1) {
			setRoutes(null)
			directionsRenderer.set('directions', null);
			directionsRenderer.setMap(null);
		}
	}, [directionsService, directionsRenderer, markers]);

	// Update direction route
	useEffect(() => {
		if (!directionsRenderer) {
			return;
		} else if (markers.length == 2) {
			console.log("hi");
			directionsRenderer.setRouteIndex(routeIndex);
		}
		
	}, [routeIndex, directionsRenderer, markers]);

	if (!leg) return null;

	return (
		<div className="directions">
			<h2>{selected.summary}</h2>
			<p>
				{leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
			</p>
			<p>Distance: {leg.distance?.text}</p>
			<p>Duration: {leg.duration?.text}</p>

			<h2>Other Routes</h2>
			<ul>
				{routes.map((route, index) => (
					<li key={route.summary}>
						<button onClick={() => setRouteIndex(index)}>{route.summary}</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Directions;
