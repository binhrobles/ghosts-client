import React from 'react';
import { Page } from '@zeit-ui/react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Reader, Writer, Footer, Map, NavBar } from './Components/index';
import Entry from './common/Entry';
import useObjectWithSessionStorage from './common/useObjectWithSessionStorage';
import { APP_MODES } from './common/constants';
import entryPlaceholder from './entryPlaceholder';

// TODO: placeholder objects
const ghosts = [];

function App() {
  const [isReading, setIsReading] = React.useState(false);
  const [draftEntry, updateDraftEntry] = useObjectWithSessionStorage('entry');
  const [selectedEntry, updateSelectedEntry] = React.useState(null);

  if (!draftEntry) updateDraftEntry(new Entry());

  const readerCloseHandler = () => {
    setIsReading(false);
  };

  const onEntryClicked = (event) => {
    console.log(`feature ${event.feature.properties.idx} clicked`);
    updateSelectedEntry(event.feature.properties.idx);
    setIsReading(true);
  };

  const updateEntryLocation = ({ lng, lat }) => {
    updateDraftEntry((prev) => ({ ...prev, location: { lng, lat } }));
  };

  const map = (
    <Map
      layerData={ghosts}
      updateEntryLocation={updateEntryLocation}
      onFeatureClicked={onEntryClicked}
    />
  );

  return (
    <Router>
      <Page size="large">
        <NavBar />
        <Page.Content>
          <Switch>
            <Route exact path="/">
              <Redirect to={APP_MODES.listen.pathname} />
            </Route>
            <Route exact path={APP_MODES.listen.pathname}>
              <Reader
                isOpen={isReading}
                onClose={readerCloseHandler}
                entry={entryPlaceholder}
              />
              {map}
            </Route>

            <Route path={APP_MODES.speak.pathname}>
              {map}
              <Writer entry={draftEntry} updateEntry={updateDraftEntry} />
            </Route>
          </Switch>
        </Page.Content>
      </Page>
      <Footer />
    </Router>
  );
}

export default App;
