import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
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

const getLastMarkerCoords = () => {
  const storedEntry = sessionStorage.getItem('entry');
  if (!storedEntry) return null;
  const entry = JSON.parse(storedEntry);
  return [entry.location.lng, entry.location.lat];
};

const Map = ({ pathname, layerData, updateEntryLocation, onEntryClicked }) => {
  const [currentMarkerCoords, updateCurrentMarker] = React.useState(
    getLastMarkerCoords()
  );
  const [viewport, setViewport] = React.useState({
    latitude: config.mapbox.initialCenter[1],
    longitude: config.mapbox.initialCenter[0],
    zoom: config.mapbox.initialZoom,
  });
  const history = useHistory();
  // TODO: use react-router-dom.useParams to zoom to entryId if specified

  // after mapbox finishes rendering, grab the map object reference
  const [globalMap, setGlobalMap] = React.useState(null);
  const onStyleLoad = (_map) => {
    setGlobalMap(_map);
  };

  // on pathname change, triggers resize
  // prevents map from being stuck only rendered on half the screen
  React.useEffect(() => {
    if (globalMap) globalMap.resize();
  }, [globalMap, pathname]);

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
    event.map.flyTo({
      center: JSON.parse(event.feature.properties.location),
      zoom: 17,
    });
    history.push(
      `${APP_MODES.listen.pathname}/${event.feature.properties.entryId}`
    );
    onEntryClicked(event);
  };

  // when zoomed out, should use simple map
  // when zoomed in, should use satellite imagery
  const onZoomEnd = (_map) => {
    if (
      _map.getZoom() > config.mapbox.transitionZoom &&
      _map.style !== config.mapbox.style.satellite
    ) {
      _map.setStyle(config.mapbox.style.satellite);
    } else if (
      _map.getZoom() <= config.mapbox.transitionZoom &&
      _map.style !== config.mapbox.style.dark
    ) {
      _map.setStyle(config.mapbox.style.dark);
    }
  };

  // properties will be passed to the onEntryClicked func
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
      latitude={viewport.latitude}
      longitude={viewport.longitude}
      zoom={viewport.zoom}
      onStyleLoad={onStyleLoad}
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
  onEntryClicked: PropTypes.func.isRequired,
};

export default Map;
