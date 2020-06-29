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
import { CreateClient, CreateEntry } from '../../Http/entries';
import config from '../../config';

let entriesClient = null;

const Writer = ({ entry, updateEntry }) => {
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
