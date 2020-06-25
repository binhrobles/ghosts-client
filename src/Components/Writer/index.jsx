import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Description,
  Divider,
  Row,
  Spacer,
} from '@zeit-ui/react';
import Metadata from './Metadata';
import Editor from './Editor';
import Entry from '../../common/Entry';

const Writer = ({ entry, updateEntry }) => {
  const onSubmit = () => {
    // TODO
    // assert text/description/location exist
    // assert date is parseable
    // send to backend
    // clear session storage ?
    console.log(entry);
  };

  return (
    <Card>
      <Card.Content>
        <Description title="Leave Something" />
      </Card.Content>
      <Divider y={0} />
      <Card.Content>
        <Editor entry={entry} updateEntry={updateEntry} />
        <Spacer x={1} />
        <Metadata entry={entry} updateEntry={updateEntry} />
      </Card.Content>
      <Card.Footer>
        <Row style={{ width: '100%' }} justify="end">
          <Button auto onClick={onSubmit}>
            Submit
          </Button>
        </Row>
      </Card.Footer>
    </Card>
  );
};

Writer.propTypes = {
  entry: PropTypes.instanceOf(Entry).isRequired,
  updateEntry: PropTypes.func.isRequired,
};

export default Writer;
