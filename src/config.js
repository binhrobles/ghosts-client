const config = Object.freeze({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'https://ghosts-api.binhrobles.com/binhrobles'
      : 'https://ghosts-api.binhrobles.com/prod',
  googleClientId: '',
  mapbox: {
    style: {
      dark: 'mapbox://styles/binhrobles/ckbrgp26q1gdk1imt419e9bw8',
    },
    publicAccessToken: process.env.REACT_APP_MAPBOX_PUBLIC_ACCESS_TOKEN,
    initialCenter: [170, 22],
    initialZoom: [0.85],
  },
});

export default config;
