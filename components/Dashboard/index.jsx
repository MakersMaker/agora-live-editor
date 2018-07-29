import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import FileTree from '../FileTree';
import Content from '../Content';

export default class Dashboard extends React.Component {
  render() {
    return <>
      <Grid container>
        <FileTree></FileTree>
        <Content></Content>
      </Grid>
    </>;
  }
}
