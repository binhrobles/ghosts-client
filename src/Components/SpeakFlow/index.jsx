import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Card, Row, Input, Spacer, useToasts } from '@zeit-ui/react';
import Editor from './Editor';
import { CreateEntry, EntriesClientContext } from '../../Http/entries';
import Entry from '../../common/Entry';
import { APP_MODES } from '../../common/constants';
import config from '../../config';

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

  const onAttributeChange = (key) => {
    return (event) => {
      if (event.target.value.length < config.maxFieldLength[key]) {
        updateEntry((prev) => {
          const copy = { ...prev };
          copy[key] = event.target.value;
          return copy;
        });
      }
    };
  };

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
      <Card>
        <Input
          label="Titled"
          size="small"
          value={entry.description}
          onChange={onAttributeChange('description')}
          placeholder="Title"
        />
        <Spacer y={1} />
        <Editor entry={entry} updateEntry={updateEntry} />
        <Spacer y={1} />
        <Input
          label="Left by"
          size="small"
          value={entry.submitter}
          onChange={onAttributeChange('submitter')}
          placeholder="anon"
        />
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
