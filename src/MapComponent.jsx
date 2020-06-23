import React from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import Geocoder from './Geocoder';
import config from './config';

const Map = ReactMapboxGl({
  accessToken: config.mapbox.publicAccessToken,
});

const MapComponent = ({ layerData, onFeatureClicked }) => {
  const [points, updatePoints] = React.useState(layerData);

  const onMapClicked = (_, event) => {
    updatePoints((prev) => prev.concat(event.lngLat));
  };

  return (
    <Map
      style={config.mapbox.style.dark}
      center={config.mapbox.initialCenter}
      zoom={config.mapbox.initialZoom}
      containerStyle={{
        height: '75vh',
        width: 'auto',
        borderRadius: '10px',
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
  );
};

MapComponent.propTypes = {
  layerData: PropTypes.array.isRequired,
  onFeatureClicked: PropTypes.func.isRequired,
};

export default MapComponent;
