import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Page, Row, Tabs, Text } from '@zeit-ui/react';
import { APP_MODES } from '../common/constants';

const NavBar = () => {
  const history = useHistory();
  const match = useRouteMatch('/:mode');

  const onChangeHandler = (path) => {
    history.push(path);
  };

  const tabs = Object.keys(APP_MODES).map(mode =>
    <Tabs.Item label={APP_MODES[mode]} value={APP_MODES[mode]} />
  );

  return (
    <Page.Header>
      <Row justify="space-between">
        <Tabs
          initialValue={match?.params?.mode || APP_MODES.LISTEN}
          onChange={onChangeHandler}
          hideDivider
        >
          {tabs}
        </Tabs>
        <Text h4>Ghosts</Text>
      </Row>
    </Page.Header>
  );
};

export default NavBar;
