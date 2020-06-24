import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Text, Textarea, Divider, Row } from '@zeit-ui/react';
import Memory from '../Memory';

const Writer = ({ memory, updateMemory }) => {
  const onTextChange = (event) => {
    updateMemory((prev) => ({ ...prev, text: event.target.value }));
  };

  return (
    <Card>
      <Card.Content>
        <Text b>Leave A Memory</Text>
      </Card.Content>
      <Divider y={0} />
      <Card.Content>
        <Textarea
          width="100%"
          minHeight="45vh"
          placeholder="What did you remember?"
          value={memory.text}
          onChange={onTextChange}
        />
      </Card.Content>
      <Card.Footer disableAutoMargin>
        <Row style={{ width: '100%' }} justify="end">
          <Button auto>Continue</Button>
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
