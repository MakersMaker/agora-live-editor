import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Editor from '../Editor';

export default class Content extends React.Component {
  render() {
    return <Grid item xs={9}>
      <Editor></Editor>
    </Grid>
  }
}
