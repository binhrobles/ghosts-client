import React from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import Geocoder from './Geocoder';
import { APP_MODES } from '../../common/constants';
import config from '../../config';

const Mapbox = ReactMapboxGl({
  accessToken: config.mapbox.publicAccessToken,
  minZoom: config.mapbox.minZoom,
});

const getLastMarkerCoords = () => {
  const storedEntry = sessionStorage.getItem('entry');
  if (!storedEntry) return null;
  const entry = JSON.parse(storedEntry);
  return [entry.location.lng, entry.location.lat];
};

const Map = ({
  pathname,
  layerData,
  updateEntryLocation,
  onFeatureClicked,
}) => {
  const [currentMarkerCoords, updateCurrentMarker] = React.useState(
    getLastMarkerCoords()
  );
  const [viewport, setViewport] = React.useState({
    latitude: config.mapbox.initialCenter[1],
    longitude: config.mapbox.initialCenter[0],
    zoom: config.mapbox.initialZoom,
  });

  // if in `create` mode, clicking map should leave marker
  // report coordinates to parent
  const onMapClicked = (_, event) => {
    if (pathname === APP_MODES.speak.pathname) {
      const wrappedCoords = event.lngLat.wrap();
      updateCurrentMarker([wrappedCoords.lng, wrappedCoords.lat]);
      updateEntryLocation({ ...wrappedCoords });
    }
  };

  // when zoomed out, should use simple map
  // when zoomed in, should use satellite imagery
  const onZoomEnd = (map) => {
    if (
      map.getZoom() > config.mapbox.transitionZoom &&
      map.style !== config.mapbox.style.satellite
    ) {
      map.setStyle(config.mapbox.style.satellite);
    } else if (
      map.getZoom() <= config.mapbox.transitionZoom &&
      map.style !== config.mapbox.style.dark
    ) {
      map.setStyle(config.mapbox.style.dark);
    }
  };

  // properties will be passed to the onEntryClicked func
  const features = layerData.map((point) => (
    <Feature
      key={point._id}
      properties={{ entryId: point._id }}
      coordinates={point._source.location}
      onClick={onFeatureClicked}
    />
  ));

  return (
    <Mapbox
      style={config.mapbox.style.dark}
      latitude={viewport.latitude}
      longitude={viewport.longitude}
      zoom={viewport.zoom}
      onViewportChange={setViewport}
      onZoomEnd={onZoomEnd}
      onClick={onMapClicked}
      containerStyle={{
        height: '70vh',
        width: '100%',
        borderRadius: '2%',
      }}
    >
      {/* search bar */}
      <Geocoder />

      {/* existing entries */}
      <Layer type="circle" paint={{ 'circle-color': '#F81CE5' }}>
        {features}
      </Layer>

      {/* marker set for leaving a entry */}
      {currentMarkerCoords && (
        <Layer type="circle" paint={{ 'circle-color': '#ffffff' }}>
          <Feature coordinates={currentMarkerCoords} />
        </Layer>
      )}
    </Mapbox>
  );
};

Map.propTypes = {
  pathname: PropTypes.string.isRequired,
  layerData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
    })
  ).isRequired,
  updateEntryLocation: PropTypes.func.isRequired,
  onFeatureClicked: PropTypes.func.isRequired,
};

export default Map;
