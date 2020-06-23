import React from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import Geocoder from './Geocoder';
import config from './config';

const Map = ReactMapboxGl({
  accessToken: config.mapboxPublicAccessToken,
});

function App() {
  const [points, updatePoints] = React.useState([]);
  const createMarker = (_, event) => {
    updatePoints((prev) => prev.concat(event.lngLat));
  };

  return (
    <div className="App">
      <Map
        style={config.mapboxStyle}
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
        onClick={createMarker}
      >
        <Geocoder />
        <Layer type="circle">
          {points.map((point) => (
            <Feature key={point} coordinates={[point.lng, point.lat]} />
          ))}
        </Layer>
      </Map>
    </div>
  );
}

export default App;
