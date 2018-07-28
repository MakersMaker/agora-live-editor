import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../Sidebar';
import Content from '../Content';

export default class Dashboard extends React.Component {
  render() {
    return <>
      <Grid container>
        <Sidebar></Sidebar>
        <Content></Content>
      </Grid>
    </>;
  }
}
