import React from 'react';
import { Card, Text, Textarea, Divider, Link } from '@zeit-ui/react';

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
          minHeight="50vh"
          placeholder="What did you remember?"
        />
      </Card.Content>
      <Card.Footer>
        <Link color target="_blank" href="https://github.com/zeit-ui/react">
          Visit source code on GitHub.
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default Writer;
