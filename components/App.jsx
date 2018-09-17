import * as React from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import { extname } from 'path';
import FileTree from './FileTree';
import Content from './Content'

export default class App extends React.Component {
    state = {
        activeFileName : 'sample.json'
    };

  render() {
    return <>
      <BrowserRouter>
          <div>
              <li>
                  <Link to ="/content">Content</Link>
                  <Link to ="/filetree">Directory</Link>
              </li>
              <div>
                  <Route path = "/content" component = { this.editor } />
                  <Route path = "/filetree" component = { this.file} />
              </div>
          </div>
      </BrowserRouter>
    </>;
  }
  file = () =>{
        return(<FileTree switchFile={ this.switchFile.bind(this) } expanded={ true }></FileTree>);
  }

  editor = () =>{
        return(<Content activeFileName={ this.state.activeFileName } ></Content>);
  }

  switchFile(activeFileName) {
        const ext = extname(activeFileName);
        if (!ext) return;
        this.setState({ activeFileName });
  }
}
