import React, { useState, useEffect } from "react";
import "./MParameters.css";

const MParameters = ({ markers, duration, changeDivMethod }) => {
	const [formData, setFormData] = useState({
		Start_Time: "2024-04-11T10:00:00",
		End_Time: "2024-04-11T11:30:00",
		weather: "Clear",
		Timezone: "US/Pacific",
		temperature: 0,
		Turning_Loop: false,
		No_Exit: false,
		Crossing: false,
		Station: false,
		Junction: false,
		Stop: false,
		Traffic_Signal: false,
		markersState: [],
		Start_Lat: 0,
		Start_Lng: 0,
		End_Lat: 0,
		End_Lng: 0,
		durationState: 0,
	});

	const handleChange = (e) => {
		const { id, value, type, checked } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[id]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (formData.markersState.length < 2) {
			return;
		} else {
			var newForm = {
				"Start_Lat": formData.markersState[0].lat,
				"Start_Lng": formData.markersState[0].lng,
				"End_Lat": formData.markersState[1].lat,
				"End_Lng": formData.markersState[1].lng,
				"Start_Time": convertTimeToDate(formData.Start_Time),
				"End_Time": calculateFutureTime(formData.Start_Time, formData.durationState),
				"Weather_Condition": formData.weather,
				"Timezone": formData.Timezone,
				"Turning_Loop": formData.Turning_Loop,
				"No_Exit": formData.No_Exit,
				"Crossing": formData.Crossing,
				"Junction": formData.Junction,
				"Stop": formData.Stop,
				"Traffic_Signal": formData.Traffic_Signal

			}
			// var newForm = {
			// 	...formData,
			// 	Start_Time: convertTimeToDate(formData.Start_Time),
			// 	End_Time: calculateFutureTime(formData.Start_Time, formData.durationState)
			// }

			console.log(newForm);
			fetch('http://localhost:5001/api/example', {
				// mode: "no-cors",
				method: "POST",
				
				headers: {
					
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newForm),
			})
			.then((response) => {
				return response.json()})
			.then((data) => {
				
				// console.log(data)
				var actualResult = data.severity_score[0]
				var sModelToShow = data.severity_probabilities
				var sModelToShow2 = atob(sModelToShow)
				const byteArray = new Uint8Array(sModelToShow2.length);
				for (let i = 0; i < sModelToShow2.length; i++) {
				byteArray[i] = sModelToShow2.charCodeAt(i);
				}
				const blob = new Blob([byteArray], { type: 'image/png' });
				const imageUrl = URL.createObjectURL(blob);
				document.getElementById('smodel').src = imageUrl;
				document.getElementById('actualScore').textContent = actualResult;
			})
			.then(changeDivMethod())
			.catch((error) => console.error("Error:", error));
			//changeDivMethod(); //take this out when api call actually works
		}
	};

	function calculateFutureTime(startTime, duration) {
		try {
			const isoDate = convertTimeToDate(startTime);
			const secondsFromEpoch = convertDateStringToSeconds(isoDate);
			const futureTimeInSeconds = secondsFromEpoch + duration;
			const futureDate = new Date(futureTimeInSeconds * 1000);
			return futureDate.toString();
		} catch (error) {
			console.error("Error in processing time:", error);
			return null;  // Return null or an appropriate error message
		}
	}

	function convertTimeToDate(timeStr) {
		const now = new Date();
    	const timeParts = timeStr.split(':');

    	if (timeParts.length !== 2) {
        	console.log('Invalid time format: Expecting "hh:mm"');
    	}

    	const hour = parseInt(timeParts[0], 10);
    	const minute = parseInt(timeParts[1], 10);

    	if (isNaN(hour) || hour < 0 || hour > 23) {
        	console.log('Invalid hour value');
    	}
    	if (isNaN(minute) || minute < 0 || minute > 59) {
        	console.log('Invalid minute value');
    	}

    	now.setHours(hour, minute, 0, 0);

    	return now.toString();
	}

	function convertDateStringToSeconds(dateString) {
		const date = new Date(dateString);
		const milliseconds = date.getTime();
		const seconds = Math.floor(milliseconds / 1000);
		return seconds;
	}

	useEffect(() => {
		// Log or do other operations with new markers
		if (markers.length === 1 && formData.markersState.length < 1) {
			console.log(markers[0].lat);
			setFormData((prevData) => ({
				...prevData,
				Start_Lat: markers[0].lat,
				Start_Lng: markers[0].lng,
				markersState: markers,
			}));
			//console.log("Markers updated:", formData.markersState, formData.Start_Lat, formData.Start_Lng);
		}
		else if (markers.length === 2 && formData.markersState.length < 2) {
			setFormData((prevData) => ({
				...prevData,
				End_Lat: markers[1].lat,
				End_Lng: markers[1].lng,
				markersState: markers,
			}));
			//console.log("Markers updated:", formData.markersState, formData.End_Lat, formData.End_Lng);
		}
	}, [markers]); // Depend on markers to trigger this effect
	
	useEffect(() => {
		console.log("Updated formData:", formData);
	}, [formData]); // This useEffect will run after formData updates
	
	useEffect(() => {
		setFormData((prevData) => ({
				...prevData,
				durationState: duration,
			}));
	}, [duration]); // This useEffect will run after duration updates

	return (
		<form>
			<div className="hFormContainer">
				<label id="date" htmlFor="date">
					Future Date
				</label>
				<input
					type="text"
					id="Date"
					placeholder="Type DD/MM/YYYY"
					onChange={handleChange}
				/>
			</div>
			<div className="hFormContainer">
				<label id="time" htmlFor="time">
					Time Of Day
				</label>
				<input
					type="text"
					id="Start_Time"
					placeholder="Type in 24hr time eg. 22:45"
					onChange={handleChange}
				/>
			</div>
			<div className="hFormContainer">
				<label id="timezone" htmlFor="timezone">
					Timezone
				</label>
				<select id="timezone" onChange={handleChange}>
					<option value="">Select</option>
					<option value="USEastern">US/Eastern</option>
					<option value="USPacific">US/Pacific</option>
					<option value="USCentral'">US/Central</option>
					<option value="USMountain">US/Mountain</option>
				</select>
			</div>
			{/* <div className="hFormContainer">
				<label id="temperature" htmlFor="temperature">
					Temperature
				</label>
				<input
					type="text"
					id="temperature"
					placeholder='Type "70" for 70 deg F'
					onChange={handleChange}
				/>
			</div> */}
			<div className="hFormContainer">
				<label id="weather" htmlFor="weather">
					Weather
				</label>
				<select id="weather" onChange={handleChange}>
					<option value="">Select</option>
					<option value="Clear">Clear</option>
					<option value="Windy">Windy</option>
					<option value="Partly Cloudy">Partly Cloudy</option>
					<option value="Mostly Cloudy">Mostly Cloudy</option>
					<option value="Haze">Haze</option>
					<option value="Fog">Fog</option>
					<option value="Smoke">Smoke</option>
					<option value="Light Drizzle">Light Drizzle </option>
					<option value="Drizzle">Drizzle </option>
					<option value="Light Rain">Light Rain</option>
					<option value="Rain">Rain</option>
					<option value="Heavy Rain">Heavy Rain</option>
					<option value="Light Sleet">Light Sleet</option>
					<option value="Light Snow">Light Snow</option>
					<option value="Snow">Snow</option>
					<option value="Heavy Snow">Heavy Snow</option>
					<option value="Light Thunderstorms">Light Thunderstorms</option>
					<option value="Thunderstorms">Thunderstorms</option>
					<option value="Wintry Mix">Wintry Mix</option>
				</select>
			</div>
			<div className="vFormContainer">
				<label id="roadLabel">Road Features</label>
				<div className="checkboxContainer">
					<div className="checkboxColumn">
						<input
							type="checkbox"
							id="Turning_Loop"
							checked={formData.Turning_Loop}
							onChange={handleChange}
						/>
						<label htmlFor="Turning_Loop">Turning Loop</label>

						<input
							type="checkbox"
							id="Crossing"
							checked={formData.Crossing}
							onChange={handleChange}
						/>
						<label htmlFor="crossing">Crossing</label>

						<input
							type="checkbox"
							id="Station"
							checked={formData.Station}
							onChange={handleChange}
						/>
						<label htmlFor="station">Station</label>

						<input
							type="checkbox"
							id="Stop"
							checked={formData.Stop}
							onChange={handleChange}
						/>
						<label htmlFor="stop">Stop</label>
					</div>
					<div className="checkboxColumn">
						<input
							type="checkbox"
							id="No_Exit"
							checked={formData.No_Exit}
							onChange={handleChange}
						/>
						<label htmlFor="No_Exit">No Exit</label>

						<input
							type="checkbox"
							id="Junction"
							checked={formData.Junction}
							onChange={handleChange}
						/>
						<label htmlFor="junction">Junction</label>

						<input
							type="checkbox"
							id="Traffic_Signal"
							checked={formData.Traffic_Signal}
							onChange={handleChange}
						/>
						<label htmlFor="trafficSignal">Traffic Signal</label>
					</div>
				</div>
			</div>
			<button className="submit-btn" onClick={handleSubmit}>
				Submit
			</button>
		</form>
	);
};

export default MParameters;
