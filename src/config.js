const config = Object.freeze({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000/dev/'
      : 'https://ghosts.binhrobles.com/',
  googleClientId: '',
  mapboxStyle: 'mapbox://styles/binhrobles/ckbrgp26q1gdk1imt419e9bw8',
  mapboxPublicAccessToken: process.env.REACT_APP_MAPBOX_PUBLIC_ACCESS_TOKEN,
});

export default config;
