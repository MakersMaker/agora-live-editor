import React,{Component} from 'react';
import Paper from '@material-ui/core/Paper';
import * as monaco from 'monaco-editor';
import debounce from 'debounce';
import { extname } from 'path';
import { server } from '../config';
import { style } from '../config';
import io from 'socket.io-client';
import { Button } from '@material-ui/core';
import './styles.css'
import axios from 'axios';

export default class Editor extends React.Component {
  state = {
    content: '// type your code... \n',
    language: 'javascript',
    theme: 'default',
    file: {
      name: '',
    },
    result: '',
    sourceCode : '',
  }

  socket  = io();

  editor = null;

  constructor(props) {
    super(props);
    this.editorDOM = React.createRef();
  }

  render() {
    return (
    <div>
      <Paper elevation={1}>
        <div style={ style.page } ref={ this.editorDOM }></div>
      </Paper>
      <Paper elevation={1}>
        <div style={style.wrapconsole}>
          <span className ="leftComponent">코드결과값</span>
          <input type="button" value="컴파일" onClick={this.testCompile} className="rightComponent"/><br/>

          <div className="rowLine"></div>
          {this.state.result}
        </div>
      </Paper>
    
    </div>
    )
    ;
  }

  testCompile=()=>{
    let data = this.editor.getModel().getValue();
    console.log(data);
    
  axios({
          url: 'https://15.164.212.226:8081/compile',
          method: 'post',
          data: {
            fileName: this.state.file.name,
            fileContent : data
          },
          validateStatus:false
        }).then((res)=>{
          this.setState({result : res.data.output})
        });
  }

  componentDidMount() {
    this.editor = monaco.editor.create(this.editorDOM.current, {
      value: this.state.content,
      language: this.state.language,
      automaticLayout: true,
      theme: this.state.theme
    });
    this.switchFile(this.state.file.name);
    this.registerContentListener(this.editor);
    this.socketRecive();
  }

  componentDidUpdate() {
    this.switchFile(this.state.file.name);
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

  async switchFile(fileName) {
    const language = this.parseLanguage(fileName);
    const rawResponse = await fetch(`${server.host}/files/${fileName}`);
    const fileContent = await rawResponse.text();
    if (!language) return;
    this.updateContent(fileContent);
    this.updateLanguage(language);
  }

  registerContentListener(editor) {
    const typing = (e) => {
      const content = editor.getModel().getValue();
      this.updateFile(this.state.file.name, content);
      this.broadcastFile(this.state.file.name, content);
      this.setState()
    }

    window.onkeyup = debounce(typing, 100);
  }

  async updateFile(fileName, content) {
    const postBody = JSON.stringify({
      fileName, content
    });
    const doneResponse = await fetch(`${server.host}/files`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: postBody
    });
  }

  broadcastFile(fileName, content) {
    console.log("broadcastFile");
    this.socket.emit('codeSend',(JSON.stringify({fileName,content})));
  }

  socketRecive() {
    console.log('hi');
    console.log("socketRecive");
    this.socket.on('codeRecive',(data)=>{
      console.log("update");
      const messageBody = JSON.parse(data);
      if(this.state.file.name === messageBody.fileName){
        this.updateContent(messageBody.content);
      }
    })
  }

  updateLanguage(language) {
    const model = this.editor.getModel();
    monaco.editor.setModelLanguage(model, language);
  }

  updateContent(newContent) {
    const model = this.editor.getModel();
    model.setValue(newContent);
  }

  parseLanguage(fileName) {
    const ext = extname(fileName).split('.')[1];
    return {
      js: 'javascript',
    }[ext] || ext;
  }
}
