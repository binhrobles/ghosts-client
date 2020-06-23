import React from 'react';
import {
  Card,
  Text,
  Textarea,
  Divider,
  Grid,
  Link,
  Page,
  Tabs,
  Row,
  User,
} from '@zeit-ui/react';
// import { useSpring, animated } from 'react-spring';
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

  // Map animation
  // const animationProps = useSpring({
  //   config: { friction: 150 },
  //   opacity: 1,
  //   from: { opacity: 0 },
  // });

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
          <Grid.Container gap={2} justify="center">
            <Grid xs={12}>
              <MapComponent
                layerData={ghosts}
                onFeatureClicked={onMemoryClicked}
              />
            </Grid>
            <Grid xs={12}>
              <Card>
                <Card.Content>
                  <Text b>Leave A Memory</Text>
                </Card.Content>
                <Divider y={0} />
                <Card.Content>
                  <Textarea
                    width="100%"
                    minHeight="50vh"
                    placeholder="What did you remember?"
                  />
                </Card.Content>
                <Card.Footer>
                  <Link
                    color
                    target="_blank"
                    href="https://github.com/zeit-ui/react"
                  >
                    Visit source code on GitHub.
                  </Link>
                </Card.Footer>
              </Card>
            </Grid>
          </Grid.Container>
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
