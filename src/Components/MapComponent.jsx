import React from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import Geocoder from './Geocoder';
import { APP_MODES } from '../constants';
import config from '../config';

const Map = ReactMapboxGl({
  accessToken: config.mapbox.publicAccessToken,
});

const MapComponent = ({
  mode,
  layerData,
  updateMemoryLocation,
  onFeatureClicked,
}) => {
  const [points, updatePoints] = React.useState(layerData);
  const [currentMarkerCoords, updateCurrentMarker] = React.useState(null);

  // if in `create` mode, clicking map should leave marker
  // and report coordinates to parent
  const onMapClicked = (_, event) => {
    if (mode === APP_MODES.create) {
      updateCurrentMarker([event.lngLat.lng, event.lngLat.lat]);
      updateMemoryLocation({ lng: event.lngLat.lng, lat: event.lngLat.lat });
    }
  };

  return (
    <Map
      style={config.mapbox.style.dark}
      center={config.mapbox.initialCenter}
      zoom={config.mapbox.initialZoom}
      containerStyle={{
        height: '75vh',
        width: '100%',
        borderRadius: '10px',
      }}
      onClick={onMapClicked}
    >
      {/* search bar */}
      <Geocoder />

      {/* existing memories */}
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

      {/* marker set for leaving a memory */}
      {currentMarkerCoords && (
        <Layer type="circle" paint={{ 'circle-color': '#ffffff' }}>
          <Feature coordinates={currentMarkerCoords} />
        </Layer>
      )}
    </Map>
  );
};

MapComponent.propTypes = {
  mode: PropTypes.string.isRequired,
  layerData: PropTypes.array.isRequired,
  updateMemoryLocation: PropTypes.func.isRequired,
  onFeatureClicked: PropTypes.func.isRequired,
};

export default MapComponent;
