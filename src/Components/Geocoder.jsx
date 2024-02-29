import { useControl } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import config from '../config';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const Geocoder = () => {
  useControl(() =>
    new MapboxGeocoder({
      accessToken: config.mapbox.publicAccessToken,
    }), {
      position: 'top-left'
    }
  );

  return null;
};

export default Geocoder;
