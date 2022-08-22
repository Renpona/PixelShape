import './vtsController.styl';

import React, { Component } from 'react';
import ModalWindow from '../../modalwindow/Modalwindow';
import StateLoader from '../../../statemanager/StateLoader';
import ToggleCheckbox from '../../togglecheckbox/Togglecheckbox';

import { VtsPlugin } from '../../../vtubestudio/vtsInit';
import { checkModel } from '../../../vtubestudio/utils';

class VtsControllerModal extends Component {
    constructor (props) {
      super(props);
      this.state = {
        connected: false,
        message: 'Not Connected'
      }
    }

    async vtsConnect () {
      //let vtsInstance = new VtsPlugin();
      //this.props.vts = vtsInstance.plugin;
      let port = document.getElementById("vtsPort").value;
      let vts = new VtsPlugin(port);
      this.vtsConnectionState(false, "Connecting...");

      vts.webSocket.addEventListener("open", () => {
        this.vtsLocalInstance = vts;
        console.log("Connected");
        this.props.vtsDispatch(this.vtsLocalInstance);
        
        this.vtsTest().then((response) => {
          console.log("Successfully verified model:", response.vtsModelName);
          this.vtsConnectionState(true, `Connected to VTubeStudio!`);
        })
        .catch((e) => {
          this.vtsConnectionState(false, e.message);
        });
      });

      vts.webSocket.addEventListener("error", (event) => {
        this.vtsConnectionState(false, `Connection failed. Make sure that VTubeStudio is open and that the port number is correct!`);
      });
    }

    vtsConnectionState(connected, message) {
      console.log(`VTS Connection State: ${connected}, ${message}`);
      this.setState({
        connected: connected,
        message: message
      });
    }
  
    vtsTest () {
      let plugin = this.props.getProjectState().vts.instance.plugin;
      return checkModel(plugin);
    }
  
    sendToVts () {
      this.vtsTest().then((response) => {
        console.log("Successfully verified model:", response.vtsModelName);
        this.vtsConnectionState(true, `Connected to VTubeStudio!`);
      })
      .catch((e) => {
        this.vtsConnectionState(false, e.message);
      });
      const globalState = this.props.getProjectState();
      StateLoader.prepareForVts(globalState.vts, globalState);
      //TODO: prepareForVts now returns the raw image data - save it to use for diffing
    }

    done () {
      this.props.closeModal();
    }

    render () {
      return (
        <ModalWindow title="VTubeStudio Connection"
        ok={{ text: null, action: this.done.bind(this) }}
        cancel={{ text: 'Done', action: this.done.bind(this) }}
        isShown={this.props.isShown}>
          <ToggleCheckbox
          value={this.props.autoSend}
          onChange={this.props.toggleAutoSend.bind(this)}>
          Auto-send to VTubeStudio
        </ToggleCheckbox>
          <label htmlFor='port'>VTubeStudio API Port: </label><input type="number" name="port" id="vtsPort" defaultValue="8001" /><br/>
          <button onClick={this.vtsConnect.bind(this)}>Connect VTubeStudio</button>
          <p className={this.state.connected ? 'success' : 'failure' }>{this.state.message}</p>
          <button onClick={this.sendToVts.bind(this)}>Send Image To VTubeStudio</button>
        </ModalWindow>
      );
    }
}

export default VtsControllerModal;
