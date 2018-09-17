import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Treebeard, theme } from 'react-treebeard';
import { server, style } from '../config';

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
    const rawFileTreeRes = await fetch(`${server.host}/filestree`);
    const tree = await rawFileTreeRes.json();
    if (!this.props.expanded) return tree;
    return this.recursiveToggledTree(tree, true);
  }

  recursiveToggledTree(tree, toggled) {
    tree.toggled = toggled;
    if (!tree.children) return tree;
    tree.children.forEach(child => {
      this.recursiveToggledTree(child, toggled);
    });
    return tree;
  }

  onToggle(node, toggled){
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;
    if(node.children){ node.toggled = toggled; }
    this.setState({ cursor: node });
    this.setState({ activeFile: node.path })
    this.props.switchFile(node.path);
  }

  render() {
    theme.tree.base = { ...theme.tree.base, height: '100vh' };

    return (
      <Grid item xs={12}>
        <Treebeard
          style={ theme }
          data={ this.state.fileTree }
          onToggle={ this.onToggle }
        />
      </Grid>
    );
  }
}
