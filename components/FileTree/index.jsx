import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Treebeard } from 'react-treebeard';
import { server } from '../config';

const data = {
  name: 'root',
  toggled: true,
  children: [
      {
          name: 'parent',
          children: [
              { name: 'child1' },
              { name: 'child2' }
          ]
      },
      {
          name: 'loading parent',
          loading: true,
          children: []
      },
      {
          name: 'parent',
          children: [
              {
                  name: 'nested parent',
                  children: [
                      { name: 'nested child 1' },
                      { name: 'nested child 2' }
                  ]
              }
          ]
      }
  ]
};

export default class FileTree extends React.Component {
  state = {
    fileTree: {},
    activeFile: ''
  }

  constructor(props){
    super(props);
    this.onToggle = this.onToggle.bind(this);
  }

  async componentDidMount() {
    const fileTree = await this.getFiles();
    this.setState({ fileTree });
  }

  async getFiles() {
    const rawFileTreeRes = await fetch(`${server.host}/files`);
    return rawFileTreeRes.json();
  }

  onToggle(node, toggled){
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;
    if(node.children){ node.toggled = toggled; }
    this.setState({ cursor: node });
    this.setState({ activeFile: node.path })
    this.props.switchFile(node.path);
  }

  render(){
      return (
        <Grid item xs={3}>
          { this.state.activeFile }
          <Treebeard
            data={ this.state.fileTree }
            onToggle={ this.onToggle }
          />
        </Grid>
      );
  }
}
