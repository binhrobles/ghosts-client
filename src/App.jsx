import React from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import Geocoder from './Geocoder';
import config from './config';

function App() {
  const Map = ReactMapboxGl({
    accessToken: config.mapboxPublicAccessToken,
  });

  return (
    <div className="App">
      <Map
        style={config.mapboxStyle}
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
      >
        <Geocoder />
        <Layer
          type="symbol"
          id="marker"
          layout={{ 'icon-color': '#fff', 'icon-image': 'bakery-11' }}
        >
          <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
      </Map>
    </div>
  );
}

export default App;
