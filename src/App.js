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

const Hero = styled.div`
  background: #EFF4FF;
  height: 100%;
`
const Header = styled.div`
  height: 56px;
  background: #0D47A1;
`
const Title = styled.div`
  h1 {
    font-size: 70px;
    text-align: center;
    font-weight: 800;
    line-height: 70px;
  }

  margin: 30px 0px;
`
const MainBody = styled.div`
  display: flex;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`
const Container = styled.div``
const MenuContainer = styled.div`
  max-width: 80vw;
  width: 80vw;
  display: grid;
  grid-template-columns: repeat(4, auto);
  align-items: center;
  justify-items: center;

  @media (max-width: 1200px) {
    max-width: 100vw;
    width: 100vw;
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, auto);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(1, auto);
  }
`

const LeftContainer = styled.div``
const RightContainer = styled.div`
  margin-left: 20px;

  @media (max-width: 900px) {
    margin-left: 0px;
  }

`
const RightBox = styled.div`
  height: auto
  max-width: 15vw;
  width: 15vw;
  background: #0D47A1;
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.25), 0px 1px 3px rgba(0, 0, 0, 0.15);
  border-radius: 30px;

  h2 {
    color: white;
    font-weight: bold;
    font-size: 25px;
  }

  @media (max-width: 1200px) {
    max-width: 100vw;
    width: 94%;
  }
  @media (max-width: 900px) {
    max-width: 100vw;
    width: 93%;
  }
  @media (max-width: 700px) {
    max-width: 100vw;
    width: 90%;
  }
`

const LineGraphBox = styled.div`
  margin-top: 10px;
  background: white;
  border-radius: 20px;
  padding: 5px;
`

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
      </Header>
      <Title>
        <h1>Covid Tracker</h1>
      </Title>
      <MainBody>
        <LeftContainer>
          <MenuContainer>
            <Container>
              <FormControl className="dropdown">
                <Select className="selections" variant="outlined" onChange={onCountryChange} value={country}>
                  <MenuItem className="selected" value="worldwide">Worldwide</MenuItem>
                  {countries.map((country, index) => (
                    <MenuItem className="selected" key={index} value={country.value}>{country.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Container>
            <InformationBox
              isRed
              active={casesType === 'cases'}
              onClick={(e) => setCasesType('cases')} title="Coronavirus Cases" cases={printStat(countryInfo.todayCases)}
              total={printStat(countryInfo.cases)}
            />
            <InformationBox
              active={casesType === 'recovered'}
              onClick={(e) => setCasesType('recovered')} title="Recovered"
              cases={printStat(countryInfo.todayRecovered)}
              total={printStat(countryInfo.recovered)}
            />
            <InformationBox
              isRed
              active={casesType === 'deaths'}
              onClick={(e) => setCasesType('deaths')} title="Deaths"
              cases={printStat(countryInfo.todayDeaths)}
              total={printStat(countryInfo.deaths)}
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
        <RightBox>
          <h2>Total Cases</h2>
          <Table countries={tableData}></Table>
          <h2>Daily Change: {casesType}</h2>
          <LineGraphBox>
              <LineGraph casesType={casesType} />
          </LineGraphBox>
          </RightBox>
        </RightContainer>
      </MainBody>
    </Hero>
  );
}

export default App;
