import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core'
import './App.css';
import styled from 'styled-components'
import axios from 'axios';
import InformationBox from './component/InfomationBox.js'
import Map from './component/Map.js'
import Table from './component/Table.js'
import { sortData, printStat } from './util.js'
import LineGraph from './component/LineGraph.js'
import 'leaflet/dist/leaflet.css';

const Hero = styled.div``
const Header = styled.div``
const MainBody = styled.div`
  display: flex;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`
const Container = styled.div`
`
const MenuContainer = styled.div`
  max-width: 90vw;
  width: 80vw;
  display: grid;
  grid-template-columns: repeat(4, auto);
  align-items: center;
  justify-items: center;
`

const LeftContainer = styled.div``
const RightContainer = styled.div``

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.080746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    axios.get('https://disease.sh/v3/covid-19/all').then((res) => {
      setCountryInfo(res.data);
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await axios.get('https://disease.sh/v3/covid-19/countries').then((res) => {
        const countries = res.data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2
        }));

        const sortedData = sortData(res.data)
        setTableData(sortedData);
        setMapCountries(res.data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await axios.get(url).then((res) => {
      setCountry(countryCode);
      setCountryInfo(res.data);
      setMapCenter([res.data.countryInfo.lat, res.data.countryInfo.long]);
      setMapZoom(4);
    })
  }

  return (
    <Hero>
      <Header>
        <h1>Covid Tracker</h1>
      </Header>
      <MainBody>
        <LeftContainer>
          <MenuContainer>
            <Container>
              <FormControl className="dropdown">
                <Select variant="outlined" onChange={onCountryChange} value={country}>
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countries.map((country, index) => (
                    <MenuItem key={index} value={country.value}>{country.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Container>
            <InformationBox
              isRed
              active={casesType === 'cases'}
              onClick={(e) => setCasesType('cases')} title="Coronavirus Cases" cases={printStat(countryInfo.todayCases)}
              total={countryInfo.cases}
            />
            <InformationBox
              active={casesType === 'recovered'}
              onClick={(e) => setCasesType('recovered')} title="Recovered"
              cases={printStat(countryInfo.todayRecovered)}
              total={countryInfo.recovered}
            />
            <InformationBox
              isRed
              active={casesType === 'deaths'}
              onClick={(e) => setCasesType('deaths')} title="Deaths"
              cases={printStat(countryInfo.todayDeaths)}
              total={countryInfo.deaths}
            />
          </MenuContainer>
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </LeftContainer>
        <RightContainer>
          <h2>Total Cases</h2>
          <Table countries={tableData}></Table>
          <LineGraph casesType={casesType} />
        </RightContainer>
      </MainBody>
    </Hero>
  );
}

export default App;
