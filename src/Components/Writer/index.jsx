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
import Memory from '../../Memory';

const Writer = ({ memory, updateMemory }) => {
  const onSubmit = () => {
    // TODO: assert text/location exist
    // TODO: assert date is parseable
    console.log(memory);
  };

  return (
    <Card>
      <Card.Content>
        <Description title="Leave Something" />
      </Card.Content>
      <Divider y={0} />
      <Card.Content>
        <Editor memory={memory} updateMemory={updateMemory} />
        <Spacer x={1} />
        <Metadata memory={memory} updateMemory={updateMemory} />
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
  memory: PropTypes.objectOf(Memory).isRequired,
  updateMemory: PropTypes.func.isRequired,
};

export default Writer;
