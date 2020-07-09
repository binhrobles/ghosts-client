import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import Geocoder from './Geocoder';
import { APP_MODES } from '../../common/constants';
import config from '../../config';

const Mapbox = ReactMapboxGl({
  accessToken: config.mapbox.publicAccessToken,
  minZoom: config.mapbox.minZoom,
});

const MarkerStyle = {
  'circle-color': '#FFFFFF',
  'circle-blur': 0.7,
  'circle-opacity': 0.95,
  'circle-radius': 10,
};

// if there's a draft entry in localstorage, retrieve it and put it on the map
const getLastMarkerCoords = () => {
  const storedEntry = sessionStorage.getItem('entry');
  if (!storedEntry) return null;
  const entry = JSON.parse(storedEntry);
  return [entry.location.lng, entry.location.lat];
};

const Map = ({
  pathname,
  layerData,
  selectedEntryCenter,
  updateEntryLocation,
}) => {
  const [currentMarkerCoords, updateCurrentMarker] = React.useState(
    getLastMarkerCoords()
  );
  const history = useHistory();
  const { entryId } = useParams();

  // after mapbox finishes rendering, grab the map object reference
  const [globalMap, setGlobalMap] = React.useState(null);
  const onStyleLoad = (_map) => {
    setGlobalMap(_map);
  };

  // on pathname change, triggers resize
  // prevents map from being stuck only rendered on half the screen
  React.useEffect(() => {
    if (globalMap) {
      globalMap.resize();
      if (entryId && selectedEntryCenter) {
        globalMap.flyTo({
          center: selectedEntryCenter,
          zoom: 17,
        });
      }
    }
  }, [globalMap, pathname, entryId, selectedEntryCenter]);

  // if in `create` mode, clicking map should leave marker
  // report coordinates to parent
  const onMapClicked = (_, event) => {
    if (pathname === APP_MODES.speak.pathname) {
      const wrappedCoords = event.lngLat.wrap();
      updateCurrentMarker([wrappedCoords.lng, wrappedCoords.lat]);
      updateEntryLocation({ ...wrappedCoords });
    }
  };

  // fly/zoom to entry before calling parent function
  const handleFeatureClicked = (event) => {
    if (pathname.includes(APP_MODES.listen.pathname)) {
      history.push(
        `${APP_MODES.listen.pathname}/${event.feature.properties.entryId}`
      );
    }
  };

  // when zoomed out, should use simple map
  // when zoomed in, should use satellite imagery
  const onZoom = (_map) => {
    const zoom = _map.getZoom();
    if (
      zoom > config.mapbox.transitionZoom &&
      _map.style !== config.mapbox.style.satellite
    ) {
      _map.setStyle(config.mapbox.style.satellite);
    } else if (
      zoom <= config.mapbox.transitionZoom &&
      _map.style !== config.mapbox.style.dark
    ) {
      _map.setStyle(config.mapbox.style.dark);
    }
  };

  // properties will be passed to the handleFeatureClicked func
  const features = layerData.map((point) => (
    <Feature
      key={point._id}
      properties={{ entryId: point._id, location: point._source.location }}
      coordinates={point._source.location}
      onClick={handleFeatureClicked}
    />
  ));

  return (
    <Mapbox
      style={config.mapbox.style.dark}
      center={config.mapbox.initialCenter}
      zoom={config.mapbox.initialZoom}
      onStyleLoad={onStyleLoad}
      onZoom={onZoom}
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
      <Layer type="circle" paint={MarkerStyle}>
        {features}
      </Layer>

      {/* marker set for leaving a entry */}
      {currentMarkerCoords && (
        <Layer type="circle" paint={MarkerStyle}>
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
  selectedEntryCenter: PropTypes.arrayOf(PropTypes.number),
};

Map.defaultProps = {
  selectedEntryCenter: null,
};

export default Map;
