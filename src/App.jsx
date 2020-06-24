import React from 'react';
import { Grid, Page } from '@zeit-ui/react';
import {
  Reader,
  Writer,
  Footer,
  MapComponent,
  NavBar,
} from './Components/index';
import Memory from './Memory';
import useObjectWithSessionStorage from './common/useObjectWithSessionStorage';
import memoryPlaceholder from './memoryPlaceholder';
import { APP_MODES, COMPONENT_WIDTHS } from './constants';

// TODO: placeholder objects
const ghosts = [];

function App() {
  const [appMode, setAppMode] = React.useState(APP_MODES.view);
  const [isReading, setIsReading] = React.useState(false);
  const [memory, updateMemory] = useObjectWithSessionStorage('memory');
  const [gridWidths, setGridWidths] = React.useState(COMPONENT_WIDTHS[appMode]);

  // initialize memory in session, if one didn't exist
  React.useEffect(() => {
    if (!memory) updateMemory(new Memory());
  }, []);

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

  const updateMemoryLocation = ({ lng, lat }) => {
    updateMemory((prev) => ({ ...prev, location: { lng, lat } }));
  };

  return (
    <>
      <Reader
        isOpen={isReading}
        onClose={readerCloseHandler}
        memory={memoryPlaceholder}
      />
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
                updateMemoryLocation={updateMemoryLocation}
                onFeatureClicked={onMemoryClicked}
              />
            </Grid>
            <Grid
              xs={gridWidths.writer.xs}
              sm={gridWidths.writer.sm}
              md={gridWidths.writer.md}
            >
              <Writer memory={memory} updateMemory={updateMemory} />
            </Grid>
          </Grid.Container>
        </Page.Content>
      </Page>
      <Footer />
    </>
  );
}

export default App;
