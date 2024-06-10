import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapWrapper from '../components/Map/MapWrapper';
import { Container, Row, Col, Form, Button, ToggleButtonGroup, ToggleButton, Alert } from 'react-bootstrap';
import '../styles/HomePage.css';

const HomePage = () => {
    const [location, setLocation] = useState({ lat: 26.1158, lon: 91.7086, zoom: 10 });
    const navigate = useNavigate();
    const [unit, setUnit] = useState('metric');
    const [recentSearches, setRecentSearches] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(storedSearches);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const latValue = parseFloat(e.target.elements.lat.value);
        const lonValue = parseFloat(e.target.elements.lon.value);

        if (isNaN(latValue) || isNaN(lonValue)) {
            setError('Please enter valid latitude and longitude');
            return;
        }
        updateRecentSearch(latValue, lonValue);
        navigate(`/weather?lat=${latValue}&lon=${lonValue}&unit=${unit}`);
    };
    const handleMapClick = (lat, lon) => {
        updateRecentSearch(lat, lon);
        navigate(`/weather?lat=${lat}&lon=${lon}&unit=${unit}`);
    }
    const updateRecentSearch = (lat, lon) => {
        const newSearch = { lat, lon };
        const updatedSearches = [newSearch, ...recentSearches.filter(search => search.lat !== lat || search.lon !== lon)];
        setRecentSearches(updatedSearches.slice(0, 3));
        console.log(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches.slice(0, 3)));
    }
    const searchByCity = (e) => {
        e.preventDefault();
        const city = e.target.elements.city.value;
        let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=597019841e8a32229b4eaaccde27015a`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const lat = data[0].lat;
                    const lon = data[0].lon;
                    updateRecentSearch(lat, lon);
                    navigate(`/weather?lat=${lat}&lon=${lon}&unit=${unit}`);
                } else {
                    setError('City not found');
                }
            })
            .catch(error => console.log(error));
    }
    return (
        <Container className="HomePage">
            <Row className="my-4">
                <Col>
                    <h1 className="text-center">Weather Map App</h1>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Row className='formSubmit'>
                            <Col md={3}>
                                <Form.Label>Units</Form.Label>
                                <ToggleButtonGroup type="radio" name="units" defaultValue={unit} onChange={setUnit}>
                                    <ToggleButton  className={unit === 'metric' ? 'correct' : 'wrong'} id="tbg-radio-1" value={'metric'}>
                                        Celsius
                                    </ToggleButton>
                                    <ToggleButton className={unit === 'imperial' ? 'correct' : 'wrong'} id="tbg-radio-2" value={'imperial'}>
                                        Fahrenheit
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="lat">
                                    <Form.Label>Latitude</Form.Label>
                                    <Form.Control type="number" name="lat" step="0.01" defaultValue={location.lat} required />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="lon">
                                    <Form.Label>Longitude</Form.Label>
                                    <Form.Control type="number" name="lon" step="0.01" defaultValue={location.lon} required />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="d-flex align-items-end submit_btn">
                                <Button type="submit" className="w-100 btns">Get Weather</Button>
                            </Col>
                        </Row>
                    </Form>
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </Col>
            </Row>
            <Row>
                <Form onSubmit={searchByCity} className='citySearch'>
                    <Col md={3} className='cityLabel'>
                        <Form.Group controlId="city">
                            <Form.Label>Search city</Form.Label>
                            <Form.Control type="text" name="city" required />
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex align-items-end submit_btn">
                        <Button type="submit" className="w-100 btns">Get Weather by City</Button>
                    </Col>
                </Form>
            </Row>
            <Row className="mb-4">
                <Col>
                    <h5>Recent Searches</h5>
                    {recentSearches.map((search, index) => (
                        <Button
                            className='recentSearch'
                            key={index}
                            variant="link"
                            onClick={() => handleMapClick(search.lat, search.lon)}
                        >
                            {`Lat: ${search.lat}, Lon: ${search.lon}`}
                        </Button>
                    ))}
                </Col>
            </Row>
            <Row>
                <Col>
                    <MapWrapper className='map' lat={location.lat} lon={location.lon} zoom={location.zoom} onMapClick={handleMapClick} />
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;