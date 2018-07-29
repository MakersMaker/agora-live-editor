import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Editor from '../Editor';

export default class Content extends React.Component {
  state = {
    file: { name: 'sample.json' }
  }
  render() {
    return <Grid item xs={9}>
      <Editor fileName={ this.parseFileName(this.props.activeFileName) }></Editor>
    </Grid>
  }

  switchFile(fileName) {
    this.setState({ file: { name: fileName } });
  }

  parseFileName(fileName) {
    return fileName.replace(/public\/files\//, '');
  }
}
