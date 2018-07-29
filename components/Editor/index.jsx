import * as React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import * as monaco from 'monaco-editor';
import { server } from '../config';
import { extname } from 'path';

const EditorWrapper = styled.div`
  height: 100vh;
  background-color: #000;
`;

export default class Editor extends React.Component {
  state = {
    code: '// type your code... \n',
    language: 'javascript',
    file: {
      name: this.props.fileName,
    },
  }

  editor = null;

  constructor(props) {
    super(props);
    this.editor = React.createRef();
  }

  async componentDidMount() {
    this.editor = monaco.editor.create(this.editor.current, {
      value: this.state.code,
      language: this.state.language
    });
    this.switchFile(this.state.file.name);
  }

  updateLanguage(language) {
    const model = this.editor.getModel();
    monaco.editor.setModelLanguage(model, language);
  }

  updateContent(newContent) {
    const model = this.editor.getModel();
    model.setValue(newContent);
  }

  async switchFile(fileName) {
    const language = extname(fileName).split('.')[1];
    const rawResponse = await fetch(`${server.host}/files/${fileName}`);
    const fileContent = await rawResponse.text();
    this.updateContent(fileContent);
    this.updateLanguage(language);
  }

  render() {
    return <Paper elevation={1}>
      <div style={{ height: 'calc(100vh - 30px)' }} ref={this.editor}></div>
    </Paper>;
  }
}
