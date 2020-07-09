import React from 'react';
import { Grid, Page } from '@zeit-ui/react';
import {
  HashRouter as Router,
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import { About, Reader, SpeakFlow, Footer, NavBar } from './Components/index';
import Map from './Components/common/Map';
import Entry from './common/Entry';
import {
  CreateClient,
  GetRecentEntries,
  EntriesClientContext,
} from './Http/entries';
import useObjectWithLocalStorage from './common/useObjectWithLocalStorage';
import { APP_MODES } from './common/constants';
import config from './config';

let entriesClient = null;

function App() {
  const [isReading, setIsReading] = React.useState(false);
  const [draftEntry, updateDraftEntry] = useObjectWithLocalStorage('entry');
  const [loadedEntries, updateLoadedEntries] = React.useState([]);
  const [selectedEntryId, updateSelectedEntryId] = React.useState(null);
  const namespace = 'public';

  if (!draftEntry) updateDraftEntry(new Entry());
  if (!entriesClient) entriesClient = CreateClient(config.baseURL);

  // render the most recent entries by default
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      // don't update the component's state if the
      // component is no longer mounted, indicated
      // by the clean up func having been called
      const entries = await GetRecentEntries({
        client: entriesClient,
        namespace,
      });

      if (isMounted) {
        updateLoadedEntries(entries);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [namespace]);

  const readerCloseHandler = () => {
    setIsReading(false);
  };

  const onEntryClicked = (event) => {
    updateSelectedEntryId(event.feature.properties.entryId);
    setIsReading(true);
  };

  const updateEntryLocation = ({ lng, lat }) => {
    updateDraftEntry((prev) => ({ ...prev, location: { lng, lat } }));
  };

  return (
    <Router basename="/">
      <Page size="large">
        <NavBar />
        <Page.Content>
          <Switch>
            <EntriesClientContext.Provider value={entriesClient}>
              <Grid.Container gap={2}>
                {/* on xs screens, map takes full width in all modes */}
                {/* on sm screens, map takes half width in speak mode */}
                <Route
                  path="/(listen|speak)/"
                  render={({ location }) => (
                    <Grid
                      xs={24}
                      sm={
                        location.pathname === APP_MODES.speak.pathname ? 12 : 24
                      }
                    >
                      <Map
                        pathname={location.pathname}
                        onEntryClicked={onEntryClicked}
                        layerData={loadedEntries}
                        updateEntryLocation={updateEntryLocation}
                      />
                    </Grid>
                  )}
                />

                <Route exact path="/">
                  <Redirect to={APP_MODES.listen.pathname} />
                </Route>
                <Route path={APP_MODES.listen.pathname}>
                  <Grid xs={24}>
                    <Reader
                      isOpen={isReading}
                      onClose={readerCloseHandler}
                      namespace={namespace}
                      entryId={selectedEntryId}
                    />
                  </Grid>
                </Route>

                {/* editor slides under map on xs screens, half width on sm and larger */}
                <Grid xs={24} sm={12}>
                  <Route path={APP_MODES.speak.pathname}>
                    <SpeakFlow
                      entry={draftEntry}
                      updateEntry={updateDraftEntry}
                    />
                  </Route>
                </Grid>
              </Grid.Container>

              <Route path={APP_MODES.about.pathname}>
                <About />
              </Route>
            </EntriesClientContext.Provider>
          </Switch>
        </Page.Content>
      </Page>
      <Footer />
    </Router>
  );
}

export default App;
