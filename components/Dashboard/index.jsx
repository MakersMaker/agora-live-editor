import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { extname } from 'path';
import FileTree from '../FileTree';
import Content from '../Content';

export default class Dashboard extends React.Component {
  state = {
    activeFileName: 'sample.json',
  }

  render() {
    return <>
      <Grid container>
        <FileTree switchFile={ this.switchFile.bind(this) } expanded={ true }></FileTree>
        <Content activeFileName={ this.state.activeFileName } ></Content>
      </Grid>
    </>;
  }

  switchFile(activeFileName) {
    const ext = extname(activeFileName);
    if (!ext) return;
    this.setState({ activeFileName })
  }
}
