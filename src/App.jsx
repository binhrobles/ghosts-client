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
  const [draftEntry, updateDraftEntry] = useObjectWithLocalStorage('entry');
  const [loadedEntries, updateLoadedEntries] = React.useState([]);
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

  const updateEntryLocation = ({ lng, lat }) => {
    updateDraftEntry((prev) => ({ ...prev, location: { lng, lat } }));
  };

  // on xs screens, map takes full width in speak mode, hides on click in read mode
  // on sm screens, map takes half width in read/speak mode
  const ResponsiveMapWrapper = ({ location, match }) => {
    const isReading = match.params && match.params.entryId;
    const isSpeaking = location.pathname === APP_MODES.speak.pathname;

    return (
      <Grid xs={24} sm={isReading || isSpeaking ? 12 : 24}>
        <Map
          pathname={location.pathname}
          layerData={loadedEntries}
          updateEntryLocation={updateEntryLocation}
        />
      </Grid>
    );
  };

  return (
    <Router basename="/">
      <Page size="large">
        <NavBar />
        <Page.Content>
          <Switch>
            <EntriesClientContext.Provider value={entriesClient}>
              <Grid.Container gap={2}>
                {/* site root is pushed to listen route */}
                <Route exact path="/">
                  <Redirect to={APP_MODES.listen.pathname} />
                </Route>
                {/* save on map rendering by always rendering it, and adjusting render responsively */}
                <Route
                  path="/(listen|speak)/:entryId?"
                  render={ResponsiveMapWrapper}
                />

                {/* on xs screens, reader takes full width */}
                {/* on sm screens, reader takes right half width */}
                <Route path={`${APP_MODES.listen.pathname}/:entryId`}>
                  <Grid xs={24} sm={12}>
                    {/* TODO: should this really be a prop, and not read from the path? */}
                    <Reader namespace={namespace} />
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
