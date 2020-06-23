import React from 'react';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { MapContext } from 'react-mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import config from './config';

const Geocoder = () => {
  const map = React.useContext(MapContext);

  React.useEffect(() => {
    map.addControl(
      new MapboxGeocoder({
        accessToken: config.mapbox.publicAccessToken,
      })
    );
  }, [map]);

  return null;
};

export default Geocoder;
