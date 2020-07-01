import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Page, Row, Tabs, Text } from '@zeit-ui/react';
import { APP_MODES } from '../common/constants';

const NavBar = () => {
  const history = useHistory();
  const location = useLocation();
  const onChangeHandler = (path) => {
    history.push(path);
  };

  return (
    <Page.Header>
      <Row justify="space-between">
        <Tabs
          initialValue={location.pathname}
          onChange={onChangeHandler}
          hideDivider
        >
          <Tabs.Item
            label={APP_MODES.listen.name}
            value={APP_MODES.listen.pathname}
          />
          <Tabs.Item
            label={APP_MODES.speak.name}
            value={APP_MODES.speak.pathname}
          />
        </Tabs>
        <Text h4>Shared Space</Text>
      </Row>
    </Page.Header>
  );
};

export default NavBar;
