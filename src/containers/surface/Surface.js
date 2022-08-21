import {connect} from 'react-redux';

import {
  getTool,
  getToolSettings,
  getCurrentFrameUUID,
  getCurrentFrame,
  getPixelSize,
  getSurfaceWidth,
  getSurfaceHeight,
  getImageSize,
  getGridState,
  getProjectGuid,
  getVtsState
} from '../../selectors';
import {setTempColor} from '../../actions/palette';
import {updateFrameImageData} from '../../actions/frames';
import { getStore } from '../../actions/vts';

import Surface from '../../components/surface/Surface';

const mapStateToProps = state => ({
  projectGuid: getProjectGuid(state),
  tool: getTool(state),
  toolSettings: getToolSettings(state),
  imageSize: getImageSize(state),
  currentFrameUUID: getCurrentFrameUUID(state),
  currentFrame: getCurrentFrame(state),
  pixelSize: getPixelSize(state),
  surfaceWidth: getSurfaceWidth(state),
  surfaceHeight: getSurfaceHeight(state),
  gridShown: getGridState(state),
  vts: getVtsState(state)
});

const mapDispatchToProps = dispatch => ({
  setTempColor (color) {
    return dispatch(setTempColor(color));
  },
  updateFrameImageData (frameUUID, naturalImageData) {
    return dispatch(updateFrameImageData(frameUUID, naturalImageData));
  },
  getProjectState () {
    return dispatch(getStore());
  },
});

const SurfaceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Surface);

export default SurfaceContainer;
