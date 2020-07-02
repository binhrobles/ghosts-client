import React from 'react';
import { Page } from '@zeit-ui/react';
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
import useObjectWithSessionStorage from './common/useObjectWithSessionStorage';
import { APP_MODES } from './common/constants';
import entryPlaceholder from './entryPlaceholder';
import config from './config';

let entriesClient = null;

function App() {
  const [isReading, setIsReading] = React.useState(false);
  const [draftEntry, updateDraftEntry] = useObjectWithSessionStorage('entry');
  const [loadedEntries, updateLoadedEntries] = React.useState([]);
  const [selectedEntry, updateSelectedEntry] = React.useState(null);
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
    console.log(`feature ${event.feature.properties.id} clicked`);
    updateSelectedEntry(event.feature.properties.id);
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
              <Route exact path="/">
                <Redirect to={APP_MODES.listen.pathname} />
              </Route>
              <Route path={APP_MODES.listen.pathname}>
                <Reader
                  isOpen={isReading}
                  onClose={readerCloseHandler}
                  entry={entryPlaceholder}
                />
                <Map
                  layerData={loadedEntries}
                  onFeatureClicked={onEntryClicked}
                />
              </Route>

              <Route path={APP_MODES.speak.pathname}>
                <SpeakFlow
                  updateEntryLocation={updateEntryLocation}
                  entry={draftEntry}
                  updateEntry={updateDraftEntry}
                />
              </Route>

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
