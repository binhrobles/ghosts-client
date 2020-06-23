const config = Object.freeze({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000/dev/'
      : 'https://ghosts.binhrobles.com/',
  googleClientId: '',
  mapbox: {
    style: {
      dark: 'mapbox://styles/binhrobles/ckbrgp26q1gdk1imt419e9bw8',
    },
    publicAccessToken: process.env.REACT_APP_MAPBOX_PUBLIC_ACCESS_TOKEN,
    initialCenter: [168.5891032768925, 42.83886200405351],
    initialZoom: [0.8],
  },
});

export default config;
