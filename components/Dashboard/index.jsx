import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import FileTree from '../FileTree';
import Content from '../Content';

export default class Dashboard extends React.Component {
  state = {
    activeFileName: 'sample.json',
  }

  switchFile(activeFileName) {
    this.setState({ activeFileName })
  }

  render() {
    return <>
      <Grid container>
        <FileTree switchFile={ this.switchFile.bind(this) }></FileTree>
        <Content activeFileName={ this.state.activeFileName } ></Content>
      </Grid>
    </>;
  }
}
