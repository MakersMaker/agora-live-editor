import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Editor from '../Editor';

export default class Content extends React.Component {
  state = {
    file: { name: 'sample.json' }
  }
  render() {
    return <Grid item xs={9}>
      <button onClick={ () => this.switchFile('another.json') }>Change File</button>
      <Editor fileName={ this.state.file.name }></Editor>
    </Grid>
  }
  switchFile(fileName) {
    this.setState({ file: { name: fileName } });
  }
}
