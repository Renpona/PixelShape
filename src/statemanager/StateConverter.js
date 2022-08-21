import { StateSelector, SerializationSchema } from './StateSerialization';
import { uuid, setInitialCounter, uniqueId } from '../utils/uuid';

import { getApplication } from '../selectors/application';
import { getFrames } from '../selectors/frames';

import ImageDataCompressor from './ImageDataCompressor';
import { ScreenInterface } from '../vtubestudio/screenInterface';

export class StateConverter {
  static vtsInstance;

  static hydrateOnImport (fromObj, toObj, schemaType) {
    Object.keys(schemaType)
      .forEach(path => {
        let hashes = path.split('.'),
            subObj = toObj;

        // go deep through all path to the last hash
        hashes.forEach((hash, i) => {
          subObj[hash] = subObj[hash] || {};
          if (i !== hashes.length - 1)
            subObj = subObj[hash];
        });

        // assign value to a key, equal to the last hash
        subObj[hashes[hashes.length - 1]] = fromObj[schemaType[path]];
      });
  }

  static convertToExport (stateData, compress = true) {
    const stateClone = JSON.parse(JSON.stringify(stateData)),
          converted = { meta: {}, app: {} };

    let frames, size;

    // attach metadata
    Object.keys(SerializationSchema.meta)
      .forEach(key => {
        converted.meta[key] = SerializationSchema.meta[key];
      });

    // attach app data
    Object.keys(SerializationSchema._export)
      .forEach(key => {
        converted.app[key] = StateSelector[SerializationSchema._export[key]](stateClone);
      });

    frames = converted.app.frames;
    size = converted.app.size;

    if (compress) {
      Object.keys(frames)
      .forEach(frameId => {
        frames[frameId].naturalImageData.data = ImageDataCompressor.compress(
          frames[frameId].naturalImageData,
          size.width,
          size.height
        );
      });
    }

    return converted;
  }

  static convertFrameDataToPixelData (frameData, sendPixels = false) {
    var pixelData = [];
    var pixel = [];
    const dataSize = Object.keys(frameData);

    // the raw image data stores a single pixel as four array items (R, G, B, and A), so combine them into a single object for each pixel
    for (let index = 0; index < dataSize.length; index++) {
      const item = frameData[index];
      pixel.push(item);
      if (pixel.length >= 4) {
        let processedPixel = this.convertPixelToData(pixel);
        
        // calculate the coordinates (and therefore Artmesh ID) of a pixel based on its position in the array, and save it to the pixel object
        // once the Artmesh ID has been calculated, we no longer need to conserve the original position of the pixel in the array
        processedPixel.artMesh = ScreenInterface.findArtMesh(pixelData.length);

        pixelData.push(processedPixel);
        pixel = [];
      }
    }

    // debug logic, allow the prototype behavior of sending every pixel one at a time
    if (sendPixels) {
      for (let index = 0; index < pixelData.length; index++) {
        const item = pixelData[index];
        this.vtsInstance.instance.processPixelData(item, index);
      }
    }

    return pixelData;
  }

  static sendPixelDataByColor(pixelData) {
    let colorOrganizer = {};
    // iterate through our new pixel array to prep the data for sending to VTS
    for (let index = 0; index < pixelData.length; index++) {
      const item = pixelData[index];

      // calculate the coordinates (and therefore Artmesh ID) of a pixel based on its position in the array, and save it to the pixel object
      //item.artMesh = ScreenInterface.findArtMesh(index);

      // separate the pixels by color, since all pixels of the same color can be sent in a single request
      let colorValue = this.encodeRgb(item);
      if (colorOrganizer[colorValue]) {
        colorOrganizer[colorValue].pixels.push(item.artMesh);
      } else {
        colorOrganizer[colorValue] = {
          "pixels": [ item.artMesh ],
          "color": item
        }
        //colorOrganizer[colorValue].pixels = [ item.artMesh ];
        //colorOrganizer[colorValue].color = item;
      }
    }

    let colorList = Object.keys(colorOrganizer);
    colorList.forEach(color => this.vtsInstance.instance.processColorData(colorOrganizer[color]));
  }

  static convertPixelToData (pixel) {
    return {
      'colorR': pixel[0],
      'colorG': pixel[1],
      'colorB': pixel[2],
      'colorA': pixel[3]
    };
  }

  static encodeRgb (pixel) {
    return `R${pixel.colorR}G${pixel.colorG}B${pixel.colorB}A${pixel.colorA}`;
  }

  static convertToImport (stateObj) {
    let converted = {}, width, height, frames, nums;

    StateConverter.hydrateOnImport(stateObj.app, converted, SerializationSchema._import);

    width = getApplication(converted).size.width;
    height = getApplication(converted).size.height;
    frames = getFrames(converted).collection;
    // create modifiedArray from all frames
    getFrames(converted).order.modifiedFramesArray = getFrames(converted).order.framesOrderArray.map(
        (el, key) => ({ [el]: key })
      );

    Object.keys(frames)
      .forEach(frameId => {
        frames[frameId].naturalImageData = ImageDataCompressor.decompress(
          frames[frameId].naturalImageData,
          width,
          height
        );
      });

    // to make sure if user loads this same project second time, it will have initial changes
    getApplication(converted).projectGuid = uuid();

    nums = getFrames(converted).order.framesOrderArray
      .map(el => +el.match(/\d+$/)[0]);

    // this is to make new ids start with a distinct proper value
    setInitialCounter(Math.max(...nums) + 1);

    return converted;
  }

  static createStateFromFramesData (frames, fps, width, height) {
    let converted = {}, id;

    const surrogate = {
      guid: uuid(),
      fps,
      size: {
        width,
        height
      },
      active: null,
      order: [],
      collection: {}
    };

    setInitialCounter(0);

    frames.forEach((frame, i) => {
      id = uniqueId();

      surrogate.order.push(id);
      surrogate.collection[id] = {
        name: 'default_' + i,
        naturalImageData: frame.data
      };
    });

    surrogate.active = id;

    StateConverter.hydrateOnImport(surrogate, converted, SerializationSchema._framesImport);

    getFrames(converted).order.modifiedFramesArray = getFrames(converted).order.framesOrderArray.map(
        (el, key) => ({ [el]: key })
      );

    return converted;
  }

  static mergeImportedState (state, imported) {
    const application = Object.assign({}, getApplication(state), getApplication(imported)),
          frames = Object.assign({}, getFrames(state), getFrames(imported));

    return Object.assign({}, state, {
      undoables: {
        present: {
          frames,
          application
        },
        past: [],
        future: []
      }
    });
  }
}
