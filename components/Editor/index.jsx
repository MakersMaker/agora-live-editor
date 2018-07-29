import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import * as monaco from 'monaco-editor';

export default class Editor extends React.Component {
  state = {
    code: '// type your code... \n',
    language: 'javascript'
  }

  constructor(props) {
    super(props);
    this.editor = React.createRef();
  }

  componentDidMount() {
    monaco.editor.create(this.editor.current, {
      value: this.state.code,
      language: this.state.language
    });
  }

  render() {
    return <Paper elevation={1}>
      <div style={{ height: '100%' }} ref={this.editor}></div>
    </Paper>;
  }
}
