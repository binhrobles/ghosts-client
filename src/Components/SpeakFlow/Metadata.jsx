import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Input, Radio, Text, Spacer } from '@zeit-ui/react';
import Entry, { TTL } from '../../common/Entry';
import config from '../../config';

const Metadata = ({ entry, updateEntry }) => {
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
  const onTtlChange = (ttl) => {
    updateEntry((prev) => ({ ...prev, ttl }));
  };

  return (
    <Grid.Container>
      <Grid xs={24}>
        <Input
          label="When it happened"
          size="mini"
          value={entry.date}
          onChange={onAttributeChange('date')}
          placeholder="May 27, 2007"
        />
      </Grid>
      <Spacer x={1} />
      <Grid xs={24}>
        <Input
          label="Left by"
          size="mini"
          value={entry.submitter}
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
            value={entry.ttl}
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
};

Metadata.propTypes = {
  entry: PropTypes.instanceOf(Entry).isRequired,
  updateEntry: PropTypes.func.isRequired,
};

export default Metadata;
