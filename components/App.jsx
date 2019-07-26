import * as React from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import { extname } from 'path';
import FileTree from './FileTree';
import Content from './Content'
import Button from '@material-ui/core/Button';

export default class App extends React.Component {
    state = {
        activeFileName : 'test.js'
    };

  render() {
    return <>
      <BrowserRouter>
          <div>
              <Button color="primary" >
                  <Link to ="/content">Content</Link>
              </Button>
              <Button color="primary">
                  <Link to ="/filetree">Directory</Link>
              </Button>
              <div>
                  <Route exact path = "/" component = { this.editor } />
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
