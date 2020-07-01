import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Row } from '@zeit-ui/react';
import Map from '../common/Map';
import Editor from './Editor';
import Metadata from './Metadata';
import { CreateClient, CreateEntry } from '../../Http/entries';
import Entry from '../../common/Entry';
import config from '../../config';

const STAGE = {
  LOCATION: 0,
  WRITING: 1,
  METADATA: 2,
};
let entriesClient = null;

const ButtonComponent = ({ onClick, label }) => {
  return (
    <Button auto type="secondary" onClick={onClick}>
      {label}
    </Button>
  );
};

const SpeakFlow = ({ updateEntryLocation, entry, updateEntry }) => {
  const [stage, updateStage] = React.useState(STAGE.LOCATION);

  if (!entriesClient) entriesClient = CreateClient(config.baseURL);

  const onSubmit = () => {
    console.log(entry);
    // TODO
    // assert text/description/location exist
    // assert date is parseable
    // clear session storage ?

    // send to backend
    CreateEntry({ client: entriesClient, namespace: 'public', entry });
  };

  if (stage === STAGE.LOCATION) {
    return (
      <Card>
        <Map updateEntryLocation={updateEntryLocation} />
        <Card.Footer>
          <Row style={{ width: '100%' }} justify="end">
            <ButtonComponent
              label="Continue"
              onClick={() => updateStage(STAGE.WRITING)}
            />
          </Row>
        </Card.Footer>
      </Card>
    );
  }

  if (stage === STAGE.WRITING) {
    return (
      <Card>
        <Editor entry={entry} updateEntry={updateEntry} />
        <Card.Footer>
          <Row style={{ width: '100%' }} justify="space-between">
            <ButtonComponent
              label="Back"
              onClick={() => updateStage(STAGE.LOCATION)}
            />
            <ButtonComponent
              label="Continue"
              onClick={() => updateStage(STAGE.METADATA)}
            />
          </Row>
        </Card.Footer>
      </Card>
    );
  }

  return (
    <Card>
      <Metadata entry={entry} updateEntry={updateEntry} />
      <Card.Footer>
        <Row style={{ width: '50%' }} justify="space-between">
          <ButtonComponent
            label="Back"
            onClick={() => updateStage(STAGE.WRITING)}
          />
          <ButtonComponent label="Submit" onClick={onSubmit} />
        </Row>
      </Card.Footer>
    </Card>
  );
};

SpeakFlow.propTypes = {
  updateEntryLocation: PropTypes.func.isRequired,
  entry: PropTypes.instanceOf(Entry).isRequired,
  updateEntry: PropTypes.func.isRequired,
};

ButtonComponent.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SpeakFlow;
