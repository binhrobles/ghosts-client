import React from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { Page, Textarea, Modal } from '@zeit-ui/react';
import Geocoder from './Geocoder';
import config from './config';

const Map = ReactMapboxGl({
  accessToken: config.mapboxPublicAccessToken,
});

function App() {
  const [points, updatePoints] = React.useState([]);
  const [currentPoint, updateCurrentPoint] = React.useState([]);
  const [isModalOpen, setModalOpen] = React.useState(false);

  const onMapClicked = (_, event) => {
    updateCurrentPoint(event.lngLat);
    setModalOpen(true);
  };

  const onFeatureClicked = (event) => {
    console.log(`feature ${event.feature.properties.idx} clicked`);
  };

  const modalCloseHandler = (event) => {
    updatePoints((prev) => prev.concat(currentPoint));
    setModalOpen(false);
  };

  return (
    <Page size="medium">
      <Page.Header>
        <h3>Reminisce</h3>
      </Page.Header>
      <Page.Content>
        Click a place to add a memory.
        <Map
          style={config.mapboxStyle}
          center={[168.5891032768925, 42.83886200405351]}
          zoom={[0.8]}
          containerStyle={{
            height: '80vh',
            width: '80vw',
          }}
          onClick={onMapClicked}
        >
          <Geocoder />
          <Layer type="circle">
            {points.map((point, idx) => (
              <Feature
                key={point}
                properties={{ idx }}
                coordinates={[point.lng, point.lat]}
                onClick={onFeatureClicked}
              />
            ))}
          </Layer>
        </Map>
        <Modal open={isModalOpen} onClose={modalCloseHandler}>
          <Modal.Title>Modal</Modal.Title>
          <Modal.Subtitle>{currentPoint.toString()}</Modal.Subtitle>
          <Modal.Content>
            <Textarea width="100%" placeholder="What are you remembering?" />
          </Modal.Content>
          <Modal.Action passive onClick={() => setModalOpen(false)}>
            Cancel
          </Modal.Action>
          <Modal.Action>Submit</Modal.Action>
        </Modal>
      </Page.Content>
    </Page>
  );
}

export default App;
