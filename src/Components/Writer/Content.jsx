import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Grid,
  Input,
  Radio,
  Text,
  Textarea,
  Spacer,
} from '@zeit-ui/react';
import Memory, { TTL } from '../../Memory';
import { WRITER_MODES } from './constants';

const ContentComponent = ({ memory, updateMemory, writerView }) => {
  const onAttributeChange = (key) => {
    return (event) => {
      updateMemory((prev) => {
        const copy = { ...prev };
        copy[key] = event.target.value;
        return copy;
      });
    };
  };
  const onTtlChange = (ttl) => {
    updateMemory((prev) => ({ ...prev, ttl }));
  };

  switch (writerView) {
    case WRITER_MODES.text:
      return (
        <Textarea
          width="100%"
          minHeight="45vh"
          placeholder="What are you remembering?"
          value={memory.text}
          onChange={onAttributeChange('text')}
        />
      );
    case WRITER_MODES.metadata:
      return (
        <Grid.Container>
          <Grid xs={24}>
            <Input
              label="When it happened"
              size="mini"
              value={memory.date}
              onChange={onAttributeChange('date')}
              placeholder="May 27, 2007"
            />
          </Grid>
          <Spacer x={1} />
          <Grid xs={24}>
            <Input
              label="Left by"
              size="mini"
              value={memory.submitter}
              onChange={onAttributeChange('submitter')}
              placeholder="Anonymous"
            />
          </Grid>
          <Spacer x={1} />
          <Grid xs={24}>
            <Container>
              <Text span size="12px" type="secondary">
                Disappears
              </Text>
              <Spacer x={2} />
              <Radio.Group
                size="mini"
                value={memory.ttl}
                onChange={onTtlChange}
                useRow
              >
                <Radio value={TTL.WEEK}>in a week</Radio>
                <Radio value={TTL.MONTH}>in a month</Radio>
                <Radio value={TTL.NEVER}>never</Radio>
              </Radio.Group>
            </Container>
          </Grid>
        </Grid.Container>
      );
    default:
      return <></>;
  }
};

ContentComponent.propTypes = {
  memory: PropTypes.objectOf(Memory).isRequired,
  updateMemory: PropTypes.func.isRequired,
  writerView: PropTypes.oneOf(Object.values(WRITER_MODES)).isRequired,
};

export default ContentComponent;
