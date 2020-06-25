import React from 'react';
import { Grid, Page } from '@zeit-ui/react';
import { Reader, Writer, Footer, Map, NavBar } from './Components/index';
import Entry from './common/Entry';
import useObjectWithSessionStorage from './common/useObjectWithSessionStorage';
import entryPlaceholder from './entryPlaceholder';
import { APP_MODES, COMPONENT_WIDTHS } from './common/constants';

// TODO: placeholder objects
const ghosts = [];

function App() {
  const [appMode, setAppMode] = React.useState(APP_MODES.view);
  const [isReading, setIsReading] = React.useState(false);
  const [entry, updateEntry] = useObjectWithSessionStorage('entry');
  const [gridWidths, setGridWidths] = React.useState(COMPONENT_WIDTHS[appMode]);

  if (!entry) updateEntry(new Entry());

  const readerCloseHandler = () => {
    setIsReading(false);
  };

  const onEntryClicked = (event) => {
    console.log(`feature ${event.feature.properties.idx} clicked`);
    setIsReading(true);
  };

  const onTabChangeHandler = (tab) => {
    setAppMode(tab);
    setGridWidths(COMPONENT_WIDTHS[tab]);
  };

  const updateEntryLocation = ({ lng, lat }) => {
    updateEntry((prev) => ({ ...prev, location: { lng, lat } }));
  };

  return (
    <>
      <Reader
        isOpen={isReading}
        onClose={readerCloseHandler}
        entry={entryPlaceholder}
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
              <Map
                layerData={ghosts}
                mode={appMode}
                updateEntryLocation={updateEntryLocation}
                onFeatureClicked={onEntryClicked}
              />
            </Grid>
            <Grid
              xs={gridWidths.writer.xs}
              sm={gridWidths.writer.sm}
              md={gridWidths.writer.md}
            >
              <Writer entry={entry} updateEntry={updateEntry} />
            </Grid>
          </Grid.Container>
        </Page.Content>
      </Page>
      <Footer />
    </>
  );
}

export default App;
