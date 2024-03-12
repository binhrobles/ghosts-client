import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Card, Row, useToasts } from '@zeit-ui/react';
import Editor from './Editor';
import { CreateEntry } from '../../Http/entries';
import Entry from '../../common/Entry';
import { APP_MODES } from '../../common/constants';

const Writer = ({ entry, updateEntry }) => {
  const [, setToast] = useToasts();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const history = useHistory();

  const onSubmit = async () => {
    // send to backend
    setIsSubmitting(true);
    if (await CreateEntry({ entry })) {
      setToast({ text: 'Thanks for sharing.' });

      // reset local storage + state
      updateEntry(new Entry());

      // redirect back to home
      history.push(`/${APP_MODES.LISTEN}`);
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
        <Editor entry={entry} updateEntry={updateEntry} />
        <Card.Footer>
          <Row style={{ width: '100%' }} justify="end">
            <Button
              auto
              disabled={!(entry && entry.location && entry.text)}
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
