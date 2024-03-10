export default Object.freeze({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : 'https://ghosts-api.binhrobles.com',
  entriesIndexURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/index'
      : 'https://ghosts-entries-production.s3.amazonaws.com/index.geojson',
  mapbox: {
    style: {
      dark: 'mapbox://styles/binhrobles/ckbrgp26q1gdk1imt419e9bw8?optimize=true',
      satellite:
        'mapbox://styles/binhrobles/ckc9tdec23p3s1hn1c71nxh53?optimize=true',
    },
    publicAccessToken: process.env.REACT_APP_MAPBOX_PUBLIC_ACCESS_TOKEN,
    initialViewState: {
      longitude: -100.6,
      latitude: 23.22,
      zoom: 0.85,
    },
    minZoom: 0.9,
    transitionZoom: 14,
  },
  maxFieldLength: {
    // somewhat arbitrary, but my About page, in HTML, about 3 times
    // also helps approximate max entry size at about 10kB, or well under DDB and ES limits
    text: 10000,
    description: 30,
    date: 20,
    submitter: 20,
    tags: 50,
  },
});
