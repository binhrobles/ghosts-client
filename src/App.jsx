import React from 'react';
import { Grid, Page } from '@zeit-ui/react';
import { Switch, Redirect, Route, useParams } from 'react-router-dom';
import { About, Reader, Map, Writer, Footer, NavBar } from './Components/index';
import entriesClient from './Http/entries';
import useObjectWithLocalStorage from './common/useObjectWithLocalStorage';
import { APP_MODES } from './common/constants';

const Content = () => {
  const { mode, entryId } = useParams();
  const [draftEntry, updateDraftEntry] = useObjectWithLocalStorage('entry');

  // Content visibility controls
  const isReading = Boolean(entryId);
  const isSpeaking = mode === APP_MODES.SPEAK;

  // download Entries GeoJSON on page load
  const [entriesIndex, updateEntriesIndex] = React.useState({
    type: 'FeatureCollection',
    features: [],
  });
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      // don't update the component's state if the
      // component is no longer mounted, indicated
      // by the clean up func having been called
      const entries = await entriesClient.GetEntries();

      if (isMounted) {
        updateEntriesIndex(entries);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Downloads new entry when entryId changes
  const [isLoadingEntry, updateIsLoadingEntry] = React.useState(false);
  const [selectedEntry, updateSelectedEntry] = React.useState(null);
  React.useEffect(() => {
    if (!entryId) return () => {};

    let isMounted = true;
    updateIsLoadingEntry(true);

    // if so, download the selected entry
    (async () => {
      const downloaded = await entriesClient.GetEntryById({
        id: entryId,
      });

      if (isMounted) {
        updateSelectedEntry(downloaded);
        updateIsLoadingEntry(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [entryId]);

  return (
    <>
      {/* save on map rendering by always rendering it, and adjusting render responsively */}
      {/* on xs screens, map takes full width in speak mode, hides on click in read mode */}
      {/* on sm screens, map takes half width in read/speak mode */}
      <Grid
        className="map"
        xs={isReading ? false : 24}
        sm={isReading || isSpeaking ? 12 : 24}
      >
        <Map
          entriesIndex={entriesIndex}
          draftEntry={draftEntry}
          updateDraftEntry={updateDraftEntry}
        />
      </Grid>

      {/* on xs screens, text takes full width */}
      {/* on sm screens, text takes right half width */}
      {isReading && (
        <Grid className="text" xs={24} sm={12}>
          <Reader entry={selectedEntry} isLoading={isLoadingEntry} />
        </Grid>
      )}

      {/* on xs screens, disabled */}
      {/* on sm screens, text takes right half width */}
      {isSpeaking && (
        <Grid className="text" xs={false} sm={12}>
          <Writer entry={draftEntry} updateEntry={updateDraftEntry} />
        </Grid>
      )}
    </>
  );
};

const App = () => (
  <>
    <Page size="large">
      <NavBar />

      <Page.Content>
        <Switch>
          <Route path={`/${APP_MODES.ABOUT}`}>
            <About />
          </Route>

          <Grid.Container gap={2} justify="center" style={{ height: '70vh' }}>
            <Route exact path="/">
              <Redirect to={`/${APP_MODES.LISTEN}`} />
            </Route>

            <Route path="/:mode/:entryId?">
              <Content />
            </Route>
          </Grid.Container>
        </Switch>
      </Page.Content>
    </Page>

    <Footer />
  </>
);

export default App;
