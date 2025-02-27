import './framescontainer.styl';

import React, { Component } from 'react';
import classNames from 'classnames';
import Frame from '../frame/Frame';

import WorkerPool from '../../workers/workerPool';
import Worker from "../../workers/generateGif.worker.js";

class FramesContainer extends Component {
  constructor (...args) {
    super(...args);

    this.initializeGifWorker();
    this.state = {
      frameAdded: false,
      loading: false
    };
  }

  initializeGifWorker () {
    this.workerPool = new WorkerPool({
      amount: 5,
      worker: Worker
    });

    this.workerPool.spawnWorkers();

    this.workerPool.addEventListener('message', event => {
      let gif = '';

      this.props.updateFrameGIFData(event.data.frameUUID, event.data.frameData);

      // update the actual gif image when all parts processed
      if (event.data.currentPart === event.data.partsTotal - 1) {
        this.endLoading();
        gif = this.getOrderedGif();
        this._gifImg.src = `data:image/gif;base64,${window.btoa(gif)}`;
      }
    });
  }

  getOrderedGif () {
    return this.props.framesOrder.map(el => this.props.gifFramesData[el]).join('');
  }

  getFrames () {
    const collection = this.props.framesCollection;
    return this.props.framesOrder
      .map((uuid, index) => (
        <Frame
          key={uuid}
          uuid={uuid}
          height={this.props.imageSize.height}
          width={this.props.imageSize.width}
          stylesToCenter={this.stylesToCenter.bind(this)}
          isActive={uuid === this.props.currentUUID}
          index={index + 1}
          setActive={this.props.setCurrentFrame.bind(this, uuid)}
          imageData={collection[uuid].naturalImageData} />
      ));
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.modifiedFrames !== nextProps.modifiedFrames) {
      if (nextProps.modifiedFrames.length > 3) this.startLoading();

      this.generateGif(
        nextProps.modifiedFrames,
        nextProps.framesCollection,
        nextProps.framesOrder,
        nextProps.imageSize.width,
        nextProps.imageSize.height,
        nextProps.fps
      );
    }
  }

  componentDidUpdate () {
    if (this.state.frameAdded) {
      this._addButton.scrollIntoView();
      this.setState({ frameAdded: false });
    }
  }

  startLoading () {
    this.setState({ loading: true });
  }

  endLoading () {
    this.setState({ loading: false });
  }

  getGifImage () {
    if (this.state.loading) {
      return (
        <div className="framescontainer__gif-loading"></div>
      );
    }

    return [
      <div
        key="image"
        className="framescontainer__gif-image"
        style={this.stylesToCenter()} >
        <img src="" ref={img => this._gifImg = img} />
      </div>,
      <span key="fps" className="framescontainer__gif-fps">{this.props.fps}fps</span>
    ];
  }

  generateGif (
    modified = this.props.modifiedFrames,
    collection = this.props.framesCollection,
    order = this.props.framesOrder,
    width = this.props.imageSize.width,
    height = this.props.imageSize.height,
    fps = this.props.fps
  ) {
    const gifLength = order.length;

    this.workerPool.startOver(modified.length);

    modified
      .forEach(frameObj => {
        const id = Object.keys(frameObj)[0];

        this.workerPool.postMessage({
          frameUUID: id,
          frameNum: frameObj[id],
          framesLength: gifLength,
          imageData: collection[id].naturalImageData.data,
          height,
          width,
          fps
        });
      });
  }

  addFrame () {
    this.props.addFrame(this.props.imageSize.width, this.props.imageSize.height);
    this.setState({ frameAdded: true });
  }

  stylesToCenter () {
    const root = this,
          getRatio = (val1, val2) => val1 > val2 ? 1 : val1 / val2;

    const getWidth = () => 100 * getRatio(root.props.imageSize.width, root.props.imageSize.height) + '%';

    const getPadding = () => {
      const vertical = 50 * (1 - getRatio(root.props.imageSize.height, root.props.imageSize.width)) + '%';
      return `${vertical} 0`;
    };

    return {
      height: '100%',
      width: getWidth(),
      padding: getPadding()
    };
  }

  render () {
    const classes = classNames(
      'framescontainer',
      {
        'hidden': this.props.hidden
      }
    );

    return (
      <div className={classes}>
        <div className="framescontainer__gif-container">
          <div className="framescontainer__gif">
            { this.getGifImage() }
          </div>
        </div>
        <div className="framescontainer__frames">
          {this.getFrames()}
          <div
            className="framescontainer__frames-addframe"
            ref={b => this._addButton = b}
            onClick={this.addFrame.bind(this)}>
            <svg className="framescontainer__frames-addframe__icon" viewBox="0 0 24 24" width="40" height="40">
              <use xlinkHref="#plus"></use>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default FramesContainer;
