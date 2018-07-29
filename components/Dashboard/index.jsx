import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { extname } from 'path';
import 'agora-signaling-sdk'; // exposed as window.Signal()
import FileTree from '../FileTree';
import Content from '../Content';
import { Agora } from '../config';

export default class Dashboard extends React.Component {
  state = {
    activeFileName: 'sample.json',
  }

  agora = {
    signal: null
  }

  componentDidMount() {
    this.registerAgoraClient();
  }

  render() {
    return <>
      <Grid container>
        <FileTree switchFile={ this.switchFile.bind(this) } expanded={ true }></FileTree>
        <Content activeFileName={ this.state.activeFileName } ></Content>
      </Grid>
    </>;
  }

  switchFile(activeFileName) {
    const ext = extname(activeFileName);
    if (!ext) return;
    this.setState({ activeFileName })
  }

  registerAgoraClient() {
    const agoraCred = Agora.generateToken(`${Math.round(Math.random() * 100)}@randomname.com`);
    this.agora.signal = Signal(agoraCred.appId);
    this.agora.session = this.agora.signal.login(agoraCred.account, agoraCred.token)
    this.agora.session.onLoginSuccess = (uid) => {
      console.log(uid);
      // TODO save this to server as master if no record, or slave

      this.agora.session.onMessageInstantReceive = function(account, uid, msg) {
        console.log(msg);
      }

      // TODO try get master uid from server -> send to master uid
      this.agora.session.messageInstantSend(uid, 'asds');
    };
  }
}
