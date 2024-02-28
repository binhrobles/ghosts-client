import React from 'react';
import { useHistory } from 'react-router-dom';
import { Page, Row, Tabs, Text } from '@zeit-ui/react';
import { APP_MODES } from '../common/constants';

const NavBar = () => {
  const history = useHistory();

  const onChangeHandler = (path) => {
    history.push(path);
  };

  const tabs = (
    <Tabs onChange={onChangeHandler} hideDivider>
      <Tabs.Item label={APP_MODES.listen.name} value={APP_MODES.listen.pathname} />
      <Tabs.Item label={APP_MODES.speak.name} value={APP_MODES.speak.pathname} />
      <Tabs.Item
        label={APP_MODES.about.name}
        value={APP_MODES.about.pathname}
      />
    </Tabs>
  );

  return (
    <Page.Header>
      <Row justify="space-between">
        {tabs}
        <Text h4>Ghosts</Text>
      </Row>
    </Page.Header>
  );
};

export default NavBar;
