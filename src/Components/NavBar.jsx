import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Page, Row, Tabs, Text, useMediaQuery } from '@zeit-ui/react';
import { APP_MODES } from '../common/constants';

const NavBar = () => {
  const history = useHistory();
  const match = useRouteMatch('/:mode');
  const isXS = useMediaQuery('xs');

  const onChangeHandler = (path) => {
    history.push(`/${path}`);
  };

  const tabs = Object.keys(APP_MODES).map((mode) => (
    <Tabs.Item
      key={mode}
      label={APP_MODES[mode]}
      value={APP_MODES[mode]}
      disabled={APP_MODES[mode] === APP_MODES.SPEAK && isXS}
    />
  ));

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
