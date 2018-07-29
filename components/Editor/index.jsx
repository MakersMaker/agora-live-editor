import * as React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import * as monaco from 'monaco-editor';

const EditorWrapper = styled.div`
  height: 100vh;
  background-color: #000;
`;

export default class Editor extends React.Component {
  state = {
    code: '// type your code... \n',
    language: 'javascript'
  }

  constructor(props) {
    super(props);
    this.editor = React.createRef();
  }

  async switchFile(fileName) {
    const rawResponse = await fetch('http://localhost:8082/files/sample.json');
    const fileContent = await rawResponse.json();
    console.log(fileContent);
  }

  componentDidMount() {
    monaco.editor.create(this.editor.current, {
      value: this.state.code,
      language: this.state.language
    });
    this.switchFile();
  }

  render() {
    return <Paper elevation={1}>
      <div style={{ height: 'calc(100vh - 30px)' }} ref={this.editor}></div>
    </Paper>;
  }
}
