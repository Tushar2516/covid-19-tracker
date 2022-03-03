import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem, Card, CardContent} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, preetyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
	const [countries, setCountries] = useState([]); //For DropDown Country List
	const [country, setCountry] = useState("Worldwide"); // For Select Perticular Country
  const [countryInfo, setCountryInfo] = useState({}); // For Storing The Perticular Country Information
  const [tableData, setTableData] = useState([]); // For Table Data
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796}); //For Map 
  const [mapZoom, setMapZoom] = useState(3); // For Map Zoom
  const [mapCountries, setMapCountries] = useState([]); 
  const [casesType, setCasesType] = useState("cases");

  

	// -----Country Fetching From API----------
	useEffect(() => {
		// ASYNC -- Send A Request , Wait For It, Do Something
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country, // United Kingdom, United States
						value: country.countryInfo.iso2, //UK,USA
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
					setCountries(countries);
				});
		};
		getCountriesData();
  }, []);
   //Code Only Once When Component Load Not Again---------------

  // --------For Worldwide Data Fatching-------
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
        setCountryInfo(data);
    });
  }, [])
  // ----------------------------------------

	// ---------Select Country OnChange--------
	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
    setCountry(countryCode);
    
    const url = countryCode === 'Worldwide' 
    ? 'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

   await fetch(url)
    .then((response) => response.json())
    .then((data) => {
        setCountry(countryCode);
        // All Of The Data From The Country Response
        setCountryInfo(data);
        console.log(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        console.log(setMapCenter);
        setMapZoom(4);
        
    });
  }; 

  // console.log(countryInfo);
  //-----------------------------------------

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h2> COVID-19 TRACKER</h2>
					<FormControl className="app__dropdown">
						<Select
							varient="outlined"
							onChange={onCountryChange}
							value={country}
						>
							{/* Listing All Countries Through Loop */}
							<MenuItem value="Worldwide">Worldwide</MenuItem>
							{
								//JSX Bracket
								countries.map((country) => (
									<MenuItem value={country.value}>{country.name}</MenuItem>
								))
							}
						</Select>
					</FormControl>
				</div>

				<div className="app__stats">
          <InfoBox 
            isRed
            active = {casesType === "cases" }
            onClick={(e) =>setCasesType('cases')}
            title="COVID-19 CASES"
            cases={preetyPrintStat(countryInfo.todayCases)} 
            total={preetyPrintStat(countryInfo.cases)} />
           
          <InfoBox 
            active = {casesType === "recovered" }
            onClick={(e) =>setCasesType('recovered')}
            title="COVID-19 RECOVER"
            cases={preetyPrintStat(countryInfo.todayRecovered)}
            total={preetyPrintStat(countryInfo.recovered)} />

          <InfoBox 
            isRed
            active = {casesType === "deaths" }
            onClick={(e) =>setCasesType('deaths')}
            title="COVID-19 DEATH"
            cases={preetyPrintStat(countryInfo.todayDeaths)}
            total={preetyPrintStat(countryInfo.deaths)} />
				</div>

				{/* Map  */}
        <Map
        casesType={casesType}
         center={mapCenter}
         zoom={mapZoom}
         countries={mapCountries}
         />
			</div>


      <Card className="app__right">        
        <CardContent>
          {/* Table  */}
				  <h3>Live Cases By Coutry</h3>
          <Table countries={tableData} />
          {/* Graph  */}          
            <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph clasaName="app__graph" casesType={casesType} />
        </CardContent>        
      </Card>

		</div>
	);
}

export default App;
