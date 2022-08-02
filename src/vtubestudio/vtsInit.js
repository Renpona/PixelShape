import { WebSocketBus } from 'vtubestudio';
import { ApiClient } from 'vtubestudio';

import { Plugin } from 'vtubestudio';
import { ScreenInterface } from './screenInterface';
import { test, test2 } from './test';

export class VtsPlugin {
    webSocket;
    plugin;

    constructor () {
        let webSocket = new WebSocket('ws://localhost:8001');

        /*this.webSocket.addEventListener('open', (event) => {
            console.log("Connected to VTubeStudio on port " + 8001);
        });*/

        const bus = new WebSocketBus(webSocket);
        const apiClient = new ApiClient(bus);
        const plugin = new Plugin(apiClient, 'Plugin Name', 'Renpona');
        this.webSocket = webSocket;
        this.plugin = plugin;
    }

    processPixelData (pixel, index) {
        let targetArtMesh = ScreenInterface.findArtMesh(index);
        let artMeshName = { 'nameExact': [ targetArtMesh ] };

        let requestData = {
            'colorTint': pixel,
            'artMeshMatcher': artMeshName
        };

        this.plugin.apiClient.colorTint(requestData);
    }

    static init () {
        let instance = new VtsPlugin();
        return instance.plugin;
    }
}


