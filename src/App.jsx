import React from 'react';
import { Grid, Page } from '@zeit-ui/react';
import {
  Reader,
  Writer,
  Footer,
  MapComponent,
  NavBar,
} from './Components/index';
import memory from './memoryPlaceholder';
import { APP_MODES, COMPONENT_WIDTHS } from './constants';

// TODO: placeholder objects
const ghosts = [];

function App() {
  const [isReading, setIsReading] = React.useState(false);
  const [appMode, setAppMode] = React.useState(APP_MODES.view);
  const [gridWidths, setGridWidths] = React.useState(COMPONENT_WIDTHS[appMode]);

  const readerCloseHandler = () => {
    setIsReading(false);
  };

  const onMemoryClicked = (event) => {
    console.log(`feature ${event.feature.properties.idx} clicked`);
    setIsReading(true);
  };

  const onTabChangeHandler = (tab) => {
    setAppMode(tab);
    setGridWidths(COMPONENT_WIDTHS[tab]);
  };

  return (
    <>
      <Reader isOpen={isReading} onClose={readerCloseHandler} memory={memory} />
      <Page size="medium">
        <NavBar onTabChangeHandler={onTabChangeHandler} />
        <Page.Content>
          <Grid.Container gap={2} justify="center">
            <Grid
              xs={gridWidths.map.xs}
              sm={gridWidths.map.sm}
              md={gridWidths.map.md}
            >
              <MapComponent
                layerData={ghosts}
                mode={appMode}
                onFeatureClicked={onMemoryClicked}
              />
            </Grid>
            <Grid
              xs={gridWidths.writer.xs}
              sm={gridWidths.writer.sm}
              md={gridWidths.writer.md}
            >
              <Writer />
            </Grid>
          </Grid.Container>
        </Page.Content>
      </Page>
      <Footer />
    </>
  );
}

export default App;
