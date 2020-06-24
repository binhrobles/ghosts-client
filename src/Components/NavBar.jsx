import React from 'react';
import PropTypes from 'prop-types';
import { Page, Row, Tabs, Text } from '@zeit-ui/react';
import { APP_MODES } from '../constants';

const NavBar = ({ onTabChangeHandler }) => {
  return (
    <Page.Header>
      <Row justify="space-between">
        <Tabs
          initialValue={APP_MODES.view}
          onChange={onTabChangeHandler}
          hideDivider
        >
          <Tabs.Item label="listen" value={APP_MODES.view} />
          <Tabs.Item label="speak" value={APP_MODES.create} />
        </Tabs>
        <Text h4>Shared Space</Text>
      </Row>
    </Page.Header>
  );
};

NavBar.propTypes = {
  onTabChangeHandler: PropTypes.func.isRequired,
};

export default NavBar;
