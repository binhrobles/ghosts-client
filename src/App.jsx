import React from 'react';
import { Grid, Page } from '@zeit-ui/react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';
import { About, Reader, Writer, Footer, NavBar } from './Components/index';
import Map from './Components/common/Map';
import Entry from './common/Entry';
import {
  CreateClient,
  GetRecentEntries,
  GetEntryById,
  EntriesClientContext,
} from './Http/entries';
import useObjectWithLocalStorage from './common/useObjectWithLocalStorage';
import { APP_MODES } from './common/constants';
import config from './config';

let entriesClient = null;

function App() {
  const [draftEntry, updateDraftEntry] = useObjectWithLocalStorage('entry');

  if (!draftEntry) updateDraftEntry(new Entry());
  if (!entriesClient) entriesClient = CreateClient(config.baseURL);

  // updates namespace, if necessary, on route change
  const [namespace, updateNamespace] = React.useState('public');
  const namespaceMatch = useRouteMatch('/:mode/:namespace');
  React.useEffect(() => {
    if (namespaceMatch && namespaceMatch.params.namespace !== namespace) {
      updateNamespace(namespaceMatch.params.namespace);
    }
  }, [namespaceMatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // render the most recent entries by default
  const [loadedEntries, updateLoadedEntries] = React.useState([]);
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

  // Updates EntryId when route changes
  const [entryId, updateEntryId] = React.useState(null);
  const routeMatch = useRouteMatch(
    `${APP_MODES.listen.pathname}/:namespace/:entryId`
  );
  React.useEffect(() => {
    if (!routeMatch) {
      updateEntryId(null);
    } else if (routeMatch.params.entryId !== entryId) {
      updateEntryId(routeMatch.params.entryId);
    }
  }, [routeMatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Downloads new entry when entryId changes
  const [isLoadingEntry, updateIsLoadingEntry] = React.useState(false);
  const [selectedEntry, updateSelectedEntry] = React.useState(null);
  React.useEffect(() => {
    if (!entryId) return () => {};

    let isMounted = true;
    updateIsLoadingEntry(true);

    // if so, download the selected entry
    (async () => {
      const downloaded = await GetEntryById({
        client: entriesClient,
        namespace,
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
  }, [entryId, namespace]);

  const updateEntryLocation = ({ lng, lat }) => {
    updateDraftEntry((prev) => ({ ...prev, location: { lng, lat } }));
  };

  return (
    <>
      <Page size="large">
        <NavBar namespace={namespace} />
        <Page.Content>
          <Switch>
            <EntriesClientContext.Provider value={entriesClient}>
              <Grid.Container gap={2}>
                {/* site root is pushed to public namespace */}
                <Route exact path="/">
                  <Redirect to={`${APP_MODES.listen.pathname}/${namespace}`} />
                </Route>
                <Route exact path={APP_MODES.listen.pathname}>
                  <Redirect to={`${APP_MODES.listen.pathname}/${namespace}`} />
                </Route>

                {/* save on map rendering by always rendering it, and adjusting render responsively */}
                {/* on xs screens, map takes full width in speak mode, hides on click in read mode */}
                {/* on sm screens, map takes half width in read/speak mode */}
                <Route
                  path="/:mode/:namespace/:entryId?"
                  render={({ match }) => {
                    const isReading = match.params.entryId;
                    const isSpeaking =
                      match.params.mode === APP_MODES.speak.name;
                    const selectedEntryCenter = selectedEntry
                      ? selectedEntry.location
                      : null;

                    return (
                      <Grid
                        xs={isReading ? 0 : 24}
                        sm={isReading || isSpeaking ? 12 : 24}
                      >
                        <Map
                          layerData={loadedEntries}
                          updateEntryLocation={updateEntryLocation}
                          selectedEntryCenter={selectedEntryCenter}
                        />
                      </Grid>
                    );
                  }}
                />

                {/* on xs screens, reader takes full width */}
                {/* on sm screens, reader takes right half width */}
                <Route
                  path={`${APP_MODES.listen.pathname}/:namespace/:entryId`}
                >
                  <Grid xs={24} sm={12}>
                    <Reader entry={selectedEntry} isLoading={isLoadingEntry} />
                  </Grid>
                </Route>

                {/* editor slides under map on xs screens, half width on sm and larger */}
                <Grid xs={24} sm={12}>
                  <Route path={`${APP_MODES.speak.pathname}/:namespace`}>
                    <Writer entry={draftEntry} updateEntry={updateDraftEntry} />
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
    </>
  );
}

export default App;
