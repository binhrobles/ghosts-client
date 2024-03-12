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
  type: 'circle',
  paint: MarkerStyle,
};

const Map = ({ entriesIndex, draftEntry, updateDraftEntry }) => {
  const history = useHistory();
  const { mode, entryId } = useParams();

  const selectedEntry =
    entryId &&
    entriesIndex.features.find((feature) => feature.properties.id === entryId);

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

      if (selectedEntry) {
        globalMap.flyTo({
          center: selectedEntry.geometry.coordinates,
          zoom: 16,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalMap, mode, entryId]);

  const onMapClicked = (event) => {
    // if in `listen` mode, clicking map should navigate to entry
    if (mode === APP_MODES.LISTEN && event.features && event.features[0]) {
      history.push(`/${mode}/${event.features[0].properties.id}`);
    } else if (mode === APP_MODES.SPEAK) {
      // if in `speak` mode, clicking map should leave marker
      // and report coordinates to parent state
      console.log('clicked', event.lngLat.wrap());

      updateDraftEntry((prev) => ({
        ...prev,
        location: { ...event.lngLat.wrap() },
      }));
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

  const draftFeature = draftEntry &&
    draftEntry.location && {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coordArrayFromLocation(draftEntry.location),
      },
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
      interactiveLayerIds={['entries']}
      style={{
        height: '70vh',
        borderRadius: '2%',
      }}
    >
      {/* search bar */}
      {mode === APP_MODES.SPEAK && <Geocoder />}

      {/* existing entries */}
      <Source id="entry-source" type="geojson" data={entriesIndex}>
        <Layer id="entries" {...EntryLayer} />
      </Source>

      {/* marker set for leaving a entry */}
      {draftEntry && draftEntry.location && mode === APP_MODES.SPEAK && (
        <Source id="draft-source" type="geojson" data={draftFeature}>
          <Layer id="draft" {...EntryLayer} />
        </Source>
      )}
    </ReactMapGL>
  );
};

Map.propTypes = {
  entriesIndex: PropTypes.shape({
    features: PropTypes.arrayOf(
      PropTypes.shape({
        properties: PropTypes.shape({
          id: PropTypes.string,
        }),
        geometry: PropTypes.shape({
          coordinates: PropTypes.array,
        }),
      })
    ),
  }).isRequired,
  draftEntry: PropTypes.shape({
    text: PropTypes.string,
  }).isRequired,
  updateDraftEntry: PropTypes.func.isRequired,
};

export default Map;
