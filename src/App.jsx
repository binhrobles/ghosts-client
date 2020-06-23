import React from 'react';
import { Link, Page, Tabs, Row, User } from '@zeit-ui/react';
import Github from '@zeit-ui/react-icons/github';
import Reader from './Reader';
import MapComponent from './MapComponent';
import memory from './memoryPlaceholder';

// TODO: placeholder objects
const ghosts = [];

function App() {
  const [isReading, setIsReading] = React.useState(false);

  const readerCloseHandler = () => {
    setIsReading(false);
  };

  const onMemoryClicked = (event) => {
    console.log(`feature ${event.feature.properties.idx} clicked`);
    setIsReading(true);
  };

  return (
    <>
      <Reader isOpen={isReading} onClose={readerCloseHandler} memory={memory} />
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
          <MapComponent layerData={ghosts} onFeatureClicked={onMemoryClicked} />
        </Page.Content>
      </Page>
      <Page.Footer>
        <Row align="bottom" justify="center">
          <Link href="https://github.com/binhrobles/ghosts-client">
            <Github />
          </Link>
        </Row>
      </Page.Footer>
    </>
  );
}

export default App;
