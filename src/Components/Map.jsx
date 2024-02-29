import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import Geocoder from './Geocoder';
import { APP_MODES } from '../common/constants';
import config from '../config';
import { coordArrayFromLocation } from '../common/utils';

import 'mapbox-gl/dist/mapbox-gl.css';

const MarkerStyle = {
  'circle-color': '#FFFFFF',
  'circle-blur': 0.7,
  'circle-opacity': 0.95,
  'circle-radius': 10,
};

const EntryLayer = {
  id: 'entries',
  type: 'circle',
  paint: MarkerStyle,
}

// if there's a draft entry in localstorage, retrieve it and put it on the map
const getLastMarkerCoords = () => {
  const storedEntry = sessionStorage.getItem('entry');
  if (!storedEntry) return null;
  const entry = JSON.parse(storedEntry);
  return entry.location;
};

const Map = ({ layerData, updateEntryLocation }) => {
  const history = useHistory();
  const { mode, entryId } = useParams();

  // draft entry marker
  const [currentMarkerCoords, updateCurrentMarker] = React.useState(
    getLastMarkerCoords()
  );

  const currentEntry = entryId ? layerData.find((entry) => entry.id === entryId) : null;

  // after mapbox finishes rendering, grab the map object reference
  const [globalMap, setGlobalMap] = React.useState(null);
  const onStyleData = (event) => {
    setGlobalMap(event.target);
  };

  // on mode / entryId change, triggers resize
  // prevents map from being stuck only rendered on half the screen
  React.useEffect(() => {
    if (globalMap) {
      globalMap.resize();

      if (currentEntry) {
        globalMap.flyTo({
          center: currentEntry.location,
          zoom: 16,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalMap, mode, entryId]);

  // if in `speak` mode, clicking map should leave marker
  // report coordinates to parent
  const onMapClicked = (event) => {
    if (mode === APP_MODES.LISTEN && event.features && event.features[0]) {
      history.push(`/${mode}/${event.features[0].properties.entryId}`);
    } else if (mode === APP_MODES.SPEAK) {
      const wrappedCoords = event.lngLat.wrap();
      updateCurrentMarker(wrappedCoords);
      updateEntryLocation(wrappedCoords);
    }
  };

  // when zoomed out, should use simple map
  // when zoomed in, should use satellite imagery
  // TODO: is there a smoother / more gradual way to do this?
  const onZoomEnd = (event) => {
    const zoom = event.target.getZoom();
    if (
      zoom > config.mapbox.transitionZoom &&
      event.target.style !== config.mapbox.style.satellite
    ) {
      event.target.setStyle(config.mapbox.style.satellite);
    } else if (
      zoom <= config.mapbox.transitionZoom &&
      event.target.style !== config.mapbox.style.dark
    ) {
      event.target.setStyle(config.mapbox.style.dark);
    }
  };

  // properties will be passed to the handleEntryClicked func
  // TODO: pull this layerData into an updating GeoJSON document?
  // TOOD: reconcile differing data structures bw layerData and entries
  const entries = {
    type: 'FeatureCollection',
    features: layerData.map(({ id, location}) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coordArrayFromLocation(location),
        },
        properties: { entryId: id },
      };
    }),
  };

  return (
    <ReactMapGL
      mapboxAccessToken={config.mapbox.publicAccessToken}
      initialViewState={config.mapbox.initialViewState}
      minZoom={config.mapbox.minZoom}
      reuseMaps={true}
      mapStyle={config.mapbox.style.dark}
      onStyleData={onStyleData}
      onZoomEnd={onZoomEnd}
      onClick={onMapClicked}
      interactiveLayerIds={[EntryLayer.id]}
      style={{
        height: '70vh',
        borderRadius: '2%',
      }}
    >
      {/* search bar */}
      { mode === APP_MODES.SPEAK && <Geocoder /> }

      {/* existing entries */}
      <Source type='geojson' data={entries}>
        <Layer {...EntryLayer} />
      </Source>

      {/* marker set for leaving a entry */}
      {/* {currentMarkerCoords && (
        <Layer type="circle" paint={MarkerStyle}>
          <Feature coordinates={coordArrayFromLocation(currentMarkerCoords)} />
        </Layer>
      )} */}
    </ReactMapGL>
  );
};

Map.propTypes = {
  layerData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      location: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      })
    })
  ).isRequired,
  updateEntryLocation: PropTypes.func.isRequired,
};

export default Map;
