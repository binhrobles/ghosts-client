import React from 'react';
import { Grid, Page } from '@zeit-ui/react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';
import { About, Reader, Map, Writer, Footer, NavBar } from './Components/index';
import Entry from './common/Entry';
import entriesClient from './Http/entries';
import useObjectWithLocalStorage from './common/useObjectWithLocalStorage';
import { APP_MODES } from './common/constants';

function App() {
  const [draftEntry, updateDraftEntry] = useObjectWithLocalStorage('entry');

  if (!draftEntry) updateDraftEntry(new Entry());

  // render the most recent entries by default
  const [loadedEntries, updateLoadedEntries] = React.useState([]);
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      // don't update the component's state if the
      // component is no longer mounted, indicated
      // by the clean up func having been called
      const entries = await entriesClient.GetRecentEntries();

      if (isMounted) {
        updateLoadedEntries(entries);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Updates EntryId when route changes
  // TODO: Built in React Router way of doing this?? seems like rework
  const [entryId, updateEntryId] = React.useState(null);

  const routeMatch = useRouteMatch('/listen/:entryId');
  React.useEffect(() => {
    if (!routeMatch) {
      updateEntryId(null);
    } else {
      if (routeMatch.params.entryId !== entryId) {
        updateEntryId(routeMatch.params.entryId);
      }
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
      console.log(`fetching ${entryId}`);
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

  const updateEntryLocation = ({ lng, lat }) => {
    updateDraftEntry((prev) => ({ ...prev, location: { lng, lat } }));
  };

  return (
    <>
      <Page size="large">
        <NavBar />
        <Page.Content>
          <Switch>
            <Route path={APP_MODES.about.pathname}>
              <About />
            </Route>

            <Grid.Container gap={2}>
              <Route exact path="/">
                {/* TODO: activate listen tab */}
                <Redirect to={APP_MODES.listen.pathname} />
              </Route>

              {/* save on map rendering by always rendering it, and adjusting render responsively */}
              {/* on xs screens, map takes full width in speak mode, hides on click in read mode */}
              {/* on sm screens, map takes half width in read/speak mode */}
              <Route
                path="/:mode/:entryId?"
                render={({ match }) => {
                  const isReading = Boolean(match.params.entryId);
                  const isSpeaking =
                    match.params.mode === APP_MODES.speak.name;

                  // TODO: if entryId, download entryId

                  return (
                    <>
                      <Grid
                        className='map'
                        sm={isReading || isSpeaking ? 12 : 24}
                      >
                        <Map
                          layerData={loadedEntries}
                          updateEntryLocation={updateEntryLocation}
                          selectedEntryCenter={selectedEntry?.location}
                        />
                      </Grid>

                      <Switch>
                        {/* on xs screens, reader takes full width */}
                        {/* on sm screens, reader takes right half width */}
                        <Grid className='text' xs={24} sm={12}>
                          <Route
                            path={`${APP_MODES.listen.pathname}/:entryId`}
                          >
                            <Reader entry={selectedEntry} isLoading={isLoadingEntry} />
                          </Route>

                          <Route path={APP_MODES.speak.pathname}>
                            <Writer entry={draftEntry} updateEntry={updateDraftEntry} />
                          </Route>
                        </Grid>
                      </Switch>
                    </>
                  );
                }}
              />

            </Grid.Container>

          </Switch>
        </Page.Content>
      </Page>
      <Footer />
    </>
  );
}

export default App;
