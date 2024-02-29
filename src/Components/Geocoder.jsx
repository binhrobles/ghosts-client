import { useControl } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import config from '../config';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const Geocoder = () => {
  useControl(() => {
    const ctrl = new MapboxGeocoder({
      accessToken: config.mapbox.publicAccessToken,
    });
    return ctrl;
  }, {
    position: 'top-left'
  });
};

export default Geocoder;
