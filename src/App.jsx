import React from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import Geocoder from './Geocoder';
import config from './config';

const Map = ReactMapboxGl({
  accessToken: config.mapboxPublicAccessToken,
});

function App() {
  const [points, updatePoints] = React.useState([]);
  const onMapClicked = (_, event) => {
    updatePoints((prev) => prev.concat(event.lngLat));
  };

  const onFeatureClicked = (event) => {
    console.log(`feature ${event.feature.properties.idx} clicked`);
  };

  return (
    <div className="App">
      <Map
        style={config.mapboxStyle}
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
        onClick={onMapClicked}
      >
        <Geocoder />
        <Layer type="circle">
          {points.map((point, idx) => (
            <Feature
              key={point}
              properties={{ idx }}
              coordinates={[point.lng, point.lat]}
              onClick={onFeatureClicked}
            />
          ))}
        </Layer>
      </Map>
    </div>
  );
}

export default App;
