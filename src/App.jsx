import React from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { Link, Page, Text, Tabs, Modal, Row, User } from '@zeit-ui/react';
import Github from '@zeit-ui/react-icons/github';
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

  const modalCloseHandler = () => {
    updatePoints((prev) => prev.concat(currentPoint));
    setModalOpen(false);
  };

  return (
    <>
      <Page size="medium">
        <Page.Header>
          <Row justify="space-between">
            <Tabs initialValue="1">
              <Tabs.Item label="reminisce" value="1" />
              <Tabs.Item label="leave a memory" value="2" />
            </Tabs>
            <User
              src="https://zeit.co/api/www/avatar/?u=evilrabbit&s=160"
              name="Binh"
            />
          </Row>
        </Page.Header>

        <Page.Content>
          <Map
            style={config.mapboxStyle}
            center={[168.5891032768925, 42.83886200405351]}
            zoom={[0.8]}
            containerStyle={{
              height: '75vh',
              width: 'auto',
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
        </Page.Content>
      </Page>
      <Page.Footer>
        <Row align="bottom" justify="center">
          <Link href="https://github.com/binhrobles/ghosts-client">
            <Github />
          </Link>
        </Row>
      </Page.Footer>

      <Modal open={isModalOpen} onClose={modalCloseHandler}>
        <Modal.Title>6/29/2007</Modal.Title>
        <Modal.Content style={{ maxHeight: '50vh', overflow: 'scroll' }}>
          <Text p>
            Our mission is to make cloud computing accessible to everyone. We
            build products for developers and designers. And those who aspire to
            become one. Our mission is to make cloud computing accessible Our
            mission is to make cloud computing accessible to everyone. We Our
            mission is to make cloud computing accessible to everyone. We Our
            mission is to make cloud computing accessible to everyone. We Our
            mission is to make cloud computing accessible to everyone. We Our
            mission is to make cloud computing accessible to everyone. We
          </Text>
          <Text p>
            Our mission is to make cloud computing accessible to everyone. We
            Our mission is to make cloud computing accessible to everyone. We
            Our mission is to make cloud computing accessible to everyone. We
            build products for developers and designers. And those who aspire to
            become one. build products for developers and designers. And those
            who aspire to become one. build products for developers and
            designers. And those who aspire to become one. build products for
          </Text>
          <Text p>
            developers and designers. And those who aspire to become one. build
            products for developers and designers. And those who aspire to
            become one. build products for developers and designers. And those
            who aspire to become one. build products for developers and
            designers. And those who aspire to become one. build products for
            developers and designers. And those who aspire to become one. to
            everyone. We build products for developers and designers. And those
            who aspire to become one. Our mission is to make cloud computing
            accessible to everyone. We build products for developers and
            designers. And those who aspire to become one. Our mission is to
            make cloud computing accessible to everyone. We build products for
            developers and designers. And those who aspire to become one. Our
            mission is to make cloud computing accessible to everyone. We build
            products for developers and designers. And those who aspire to
            become one.
          </Text>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default App;
