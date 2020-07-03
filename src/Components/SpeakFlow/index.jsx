import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Card, Row, Spacer, useToasts } from '@zeit-ui/react';
import Editor from './Editor';
import Metadata from './Metadata';
import { CreateEntry, EntriesClientContext } from '../../Http/entries';
import Entry from '../../common/Entry';
import { APP_MODES } from '../../common/constants';

const ButtonComponent = ({ onClick, label }) => {
  return (
    <Button auto type="secondary" onClick={onClick}>
      {label}
    </Button>
  );
};

const SpeakFlow = ({ entry, updateEntry }) => {
  const [, setToast] = useToasts();
  const entriesClient = React.useContext(EntriesClientContext);
  const history = useHistory();

  const onSubmit = async () => {
    // TODO
    // assert text/description/location exist
    // loading indication screens

    // send to backend
    if (
      await CreateEntry({ client: entriesClient, namespace: 'public', entry })
    ) {
      setToast({ text: 'Thanks for sharing.' });

      // reset local storage + state
      updateEntry(new Entry());

      // redirect back to home
      history.push(APP_MODES.listen.pathname);
    } else {
      setToast({
        type: 'error',
        text: 'There was an issue trying to save this ☹️',
      });
    }
  };

  return (
    <>
      <Card style={{ marginTop: '2vh' }}>
        <h4>Leave Something</h4>
        <Spacer y={1} />
        <Editor entry={entry} updateEntry={updateEntry} />
        <Spacer y={1} />
        <Metadata entry={entry} updateEntry={updateEntry} />
        <Card.Footer>
          <Row style={{ width: '100%' }} justify="end">
            <ButtonComponent label="Submit" onClick={onSubmit} />
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

SpeakFlow.propTypes = {
  entry: PropTypes.instanceOf(Entry).isRequired,
  updateEntry: PropTypes.func.isRequired,
};

ButtonComponent.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SpeakFlow;
