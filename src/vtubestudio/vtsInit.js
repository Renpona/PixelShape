import { WebSocketBus } from 'vtubestudio';
import { ApiClient } from 'vtubestudio';

import { Plugin } from 'vtubestudio';

export class VtsPlugin {
    webSocket;
    plugin;
    state;

    constructor (port) {
        let webSocket = new WebSocket(`ws://localhost:${port}`);

        webSocket.addEventListener('open', (event) => {
            console.log("Connected to VTubeStudio on port " + port);
            this.state = true;
        });
        webSocket.addEventListener('error', (event) => {
            this.state = false;
        });
        //TODO: upgrade to current version of VTSJS, which deprecated the Plugin client in favor of an upgraded ApiClient
        const bus = new WebSocketBus(webSocket);
        const apiClient = new ApiClient(bus);
        const authToken = this.loadAuthToken();
        const plugin = new Plugin(
            apiClient,
            "VTS Livedraw",
            "Renpona",
            undefined,
            authToken,
            (newToken) => this.saveAuthToken(newToken)
        );

        this.webSocket = webSocket;
        this.plugin = plugin;
    }

    loadAuthToken() {
        return window.localStorage.getItem("vtsToken");
    }

    saveAuthToken(token) {
        window.localStorage.setItem("vtsToken", token);
    }

    // read data for a single pixel and send it to VTS
    processPixelData (pixel) {
        let targetArtMesh = pixel.artMesh;
        let artMeshName = { 'nameExact': [ targetArtMesh ] };

        let requestData = {
            'colorTint': pixel,
            'artMeshMatcher': artMeshName
        };

        this.plugin.apiClient.colorTint(requestData);
    }

    // read an array of all pixels sharing a color, process it into a single request, and send it to VTS
    processColorData (colorGroup) {
        let artMeshList = [];
        colorGroup.pixels.forEach(pixel => artMeshList.push(pixel));
        let artMeshMatcher = { 'nameExact': artMeshList };

        let requestData = {
            'colorTint': colorGroup.color,
            'artMeshMatcher': artMeshMatcher
        };

        this.plugin.apiClient.colorTint(requestData);
    }

    static init () {
        let instance = new VtsPlugin();
        return instance.plugin;
    }
}


