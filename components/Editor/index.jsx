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
    content: '// type your code... \n',
    language: 'javascript',
    file: {
      name: '',
    },
  }

  editor = null;

  constructor(props) {
    super(props);
    this.editorDOM = React.createRef();
  }

  render() {
    return <Paper elevation={1}>
      { this.state.file.name }
      <div style={{ height: 'calc(100vh - 30px)' }} ref={ this.editorDOM }></div>
    </Paper>;
  }

  componentDidMount() {
    this.editor = monaco.editor.create(this.editorDOM.current, {
      value: this.state.content,
      language: this.state.language
    });
    this.switchFile(this.state.file.name);
  }

  componentDidUpdate() {
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.fileName !== prevState.file.name) {
      return {
        ...prevState,
        file: {
          name: nextProps.fileName
        }
      };
    }

    return null;
  }
}
