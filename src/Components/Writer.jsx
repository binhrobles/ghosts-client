import React from 'react';
import { Button, Card, Text, Textarea, Divider, Row } from '@zeit-ui/react';

const Writer = () => {
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

export default Writer;
