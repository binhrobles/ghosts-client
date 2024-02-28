import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Card, Row, Input, Spacer, useToasts } from '@zeit-ui/react';
import Editor from './Editor';
import { CreateEntry } from '../../Http/entries';
import Entry from '../../common/Entry';
import { APP_MODES } from '../../common/constants';
import config from '../../config';

const Writer = ({ entry, updateEntry }) => {
  const [, setToast] = useToasts();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
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
    setIsSubmitting(true);
    if (await CreateEntry({ entry })) {
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
    setIsSubmitting(false);
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
        <Card.Footer>
          <Row style={{ width: '100%' }} justify="end">
            <Button
              auto
              type="secondary"
              loading={isSubmitting}
              onClick={onSubmit}
            >
              Submit
            </Button>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

Writer.propTypes = {
  entry: PropTypes.shape({
    description: PropTypes.string,
  }).isRequired,
  updateEntry: PropTypes.func.isRequired,
};

export default Writer;
