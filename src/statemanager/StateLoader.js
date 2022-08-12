import Downloader from '../fileloaders/Downloader';
import Uploader from '../fileloaders/Uploader';
import { StateConverter } from './StateConverter';
import GifLoader from '../libs/GifLoader';

class StateLoader {
  serializeForDownload (state, compress = true) {
    return StateConverter.convertToExport(state, compress);
  }

  prepareForDownload (state, fileName) {
    const serialized = this.serializeForDownload(state);

    return Downloader.prepareJSONBlobAsync(serialized, fileName);
  }

  prepareAfterUploadAsync (data) {
    const subState = StateConverter.convertToImport(data.json);

    return Promise.resolve({ file: data.file, json: subState });
  }

  prepareForVts (vtsInstance, state) {
    let serializedData = this.serializeForDownload(state, false).app.frames;
    let imageData = serializedData.frame_0.naturalImageData.data;
    StateConverter.vtsInstance = vtsInstance;
    let pixelData = StateConverter.convertFrameDataToPixelData(imageData);
    StateConverter.sendPixelDataByColor(pixelData);
    return imageData;
  }

  // calls calback with { file, json }
  upload (file, callback) {
    Uploader.asJSONAsync(file)
      .then(this.prepareAfterUploadAsync.bind(this))
      .then(callback);
  }

  uploadGif (gif, callback, stepCallback) {
    const loader = new GifLoader({ gif });

    loader.load(stepCallback)
      .then(frames => {
        const frame = frames[0],
              fps = Math.min(Math.round(100 / frame.delay), 24),
              width = frame.data.width,
              height = frame.data.height;

        const subState = StateConverter.createStateFromFramesData(frames, fps, width, height);

        return Promise.resolve({ file: gif, json: subState });
      })
      .then(callback);
  }
}

export default new StateLoader();
