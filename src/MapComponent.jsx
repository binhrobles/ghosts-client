import React from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import Geocoder from './Geocoder';
import config from './config';

const Map = ReactMapboxGl({
  accessToken: config.mapboxPublicAccessToken,
});
const initialCenter = [168.5891032768925, 42.83886200405351];
const initialZoom = [0.8];

const MapComponent = ({ onFeatureClicked }) => {
  const [points, updatePoints] = React.useState([]);

  const onMapClicked = (_, event) => {
    updatePoints((prev) => prev.concat(event.lngLat));
  };

  return (
    <Map
      style={config.mapboxStyle}
      center={initialCenter}
      zoom={initialZoom}
      containerStyle={{
        height: '75vh',
        width: 'auto',
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
  onFeatureClicked: PropTypes.func.isRequired,
};

export default MapComponent;
