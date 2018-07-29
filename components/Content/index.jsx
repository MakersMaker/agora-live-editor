import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Editor from '../Editor';

export default class Content extends React.Component {
  state = {
    file: { name: 'sample.json', activeTab: 0 },
  }
  render() {
    const fileName = this.parseFileName(this.props.activeFileName);

    return <Grid item xs={9}>
      <AppBar position="static">
        <Tabs value={ this.state.file.activeTab } >
          <Tab disableRipple label={ fileName } />
        </Tabs>
      </AppBar>
      <Editor fileName={ fileName } updateFile={ this.props.updateFile } ></Editor>
    </Grid>
  }

  parseFileName(fileName) {
    return fileName.replace(/public\/files\//, '');
  }
}
