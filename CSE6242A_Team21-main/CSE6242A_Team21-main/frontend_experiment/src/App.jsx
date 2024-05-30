  import { React, useEffect, useState } from "react";
import Directions from "./components/Directions.jsx";
import MParameters from "./components/MParameters.jsx";
import "./App.css";

import {
	APIProvider,
	Map,
	AdvancedMarker,
	useMap,
	useMapsLibrary,
} from "@vis.gl/react-google-maps";

const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

const containerStyle = {
	width: "700px",
	height: "400px",
};

function App() {
	const [markers, setMarkers] = useState([]); //also use for formsubmit when submit is pressed
	const MY_MAP_ID = "MY_MAP";
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [duration, setDuration] = useState("")

	const { isLoaded } = APIProvider({
		id: "google-map-script",
		googleMapsApiKey: API_KEY,
	});

	const onMapClick = (e) => {
		const newMarker = {
			lat: e.detail.latLng.lat,
			lng: e.detail.latLng.lng,
		};

		setMarkers((current) => [...current, newMarker]);
	};

	useEffect(() => {
		if (markers.length === 3) {
			const newMarker = markers.slice(2);
			setMarkers(newMarker);
		}
		console.log(markers);
	}, [markers]);

	const showResultsOnSubmit = () => {
		setFormSubmitted(true);
	};

	////////////////////////////////////////////////////////////////////////////////////
	return (
		<APIProvider apiKey={API_KEY}>
			<div className="fullContainer">
				<h1 className="websiteTitle">Accident Prediction</h1>
				<p className="explanation">
					Choose your location and parameters and click submit to see the ML
					prediction model and explanatory AI at work!
				</p>
				<div className="parameterContainer">
					<div className="leftContainer">
						<p>1. Choose your location</p>
						<Map
							mapId={MY_MAP_ID}
							style={containerStyle}
							defaultCenter={{ lat: 33.7754, lng: -84.3974 }}
							defaultZoom={9}
							gestureHandling={"greedy"}
							onClick={onMapClick}
							fullscreenControl={false}
						>
							{markers.map((marker, index) => (
								<AdvancedMarker
									key={index}
									position={{
										lat: marker.lat,
										lng: marker.lng,
									}}
								/>
							))}
							<Directions markers={markers} setDuration={setDuration}/>
						</Map>
					</div>
					<div className="rightContainer">
						<p style={{ alignSelf: "center" }}>2. Choose your parameters</p>
						<MParameters markers={markers} duration={duration} changeDivMethod={showResultsOnSubmit} />
					</div>
				</div>
				{formSubmitted ? (
					<div className="resultsContainer">


						<div className="mlResults1">
							<h2 className="title">Your predicted accident severity score is </h2>
							<h2 id="actualScore"></h2>
							
						</div>
						<p style={{paddingBottom: '15px'}}>See the chart and description below to understand what this score means!</p>
						
						<div className="mlResults">
							
							
							<img id="smodel" src="" alt="" />
							<p>
							<h2 className="title">Accident Severity Likelihood</h2>
								The figure above indicates the probability of how severe an accident will be, provided an accident does occur under the user-inputted conditions. The list below describes the severity scale from 1 to 4.
							<ul>
								<li>1 - minor</li>
								<li>2 - moderate</li>
								<li>3 - serious, not life threatening</li>
								<li>4 - severe, life threatening</li>
							</ul>
							</p>

							
						</div>
					
					</div>
				) : (
					<div></div>
				)}
			</div>
		</APIProvider>
	);
}

export default App;
