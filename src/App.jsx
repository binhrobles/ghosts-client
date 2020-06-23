import React from 'react';
import { Grid, Link, Page, Tabs, Row, User } from '@zeit-ui/react';
// import { useSpring, animated } from 'react-spring';
import Github from '@zeit-ui/react-icons/github';
import Reader from './Reader';
import Writer from './Writer';
import MapComponent from './MapComponent';
import memory from './memoryPlaceholder';

// TODO: placeholder objects
const ghosts = [];

const APP_VIEWS = {
  home: 'home',
  create: 'create',
};

const COMPONENT_WIDTHS = {
  home: {
    map: {
      sm: 24,
      md: 24,
    },
    writer: {
      sm: 0,
      md: 0,
    },
  },
  create: {
    map: {
      sm: 0,
      md: 12,
    },
    writer: {
      sm: 24,
      md: 12,
    },
  },
};

function App() {
  const [isReading, setIsReading] = React.useState(false);
  const [appView, setAppView] = React.useState(APP_VIEWS.home);
  const [gridWidths, setGridWidths] = React.useState(COMPONENT_WIDTHS[appView]);

  const readerCloseHandler = () => {
    setIsReading(false);
  };

  const onMemoryClicked = (event) => {
    console.log(`feature ${event.feature.properties.idx} clicked`);
    setIsReading(true);
  };

  const onTabChangeHandler = (tab) => {
    setAppView(tab);
    setGridWidths(COMPONENT_WIDTHS[tab]);
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
            <Tabs
              initialValue={appView}
              onChange={onTabChangeHandler}
              hideDivider
            >
              <Tabs.Item label="reminisce" value={APP_VIEWS.home} />
              <Tabs.Item label="leave a memory" value={APP_VIEWS.create} />
            </Tabs>
            <User
              src="https://zeit.co/api/www/avatar/?u=evilrabbit&s=160"
              name="Binh"
            />
          </Row>
        </Page.Header>

        <Page.Content>
          <Grid.Container gap={2} justify="center">
            <Grid sm={gridWidths.map.sm} md={gridWidths.map.md}>
              <MapComponent
                layerData={ghosts}
                onFeatureClicked={onMemoryClicked}
              />
            </Grid>
            <Grid sm={gridWidths.writer.sm} md={gridWidths.writer.md}>
              <Writer />
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
