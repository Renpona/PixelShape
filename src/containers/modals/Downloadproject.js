import { connect } from 'react-redux';

import {
  getGifFramesData,
  getFramesOrder,
  getAllFrames,
  getSpritesheetDownloadOption,
  getGifDownloadOption,
  getProjectDownloadOption,
  getPaletteDownloadOption,
  getVtsState,
} from '../../selectors';

import {
  getStore,
  toggleIncludeGif,
  toggleIncludeSpritesheet,
  toggleIncludeProject,
  toggleIncludePalette
} from '../../actions/application';

import {
  vtsAction
} from '../../actions/vts';

import DownloadProjectModal from '../../components/modals/Downloadproject/Downloadproject';

const mapStateToProps = state => ({
  gifFramesData: getGifFramesData(state),
  framesOrder: getFramesOrder(state),
  framesCollection: getAllFrames(state),
  includeSpritesheet: getSpritesheetDownloadOption(state),
  includeGif: getGifDownloadOption(state),
  includeProject: getProjectDownloadOption(state),
  includePalette: getPaletteDownloadOption(state),
  vtsState: getVtsState(state)
});

const mapDispatchToProps = dispatch => ({
  getProjectState () {
    return dispatch(getStore());
  },
  toggleIncludeGif () {
    return dispatch(toggleIncludeGif());
  },
  toggleIncludeSpritesheet () {
    return dispatch(toggleIncludeSpritesheet());
  },
  toggleIncludeProject () {
    return dispatch(toggleIncludeProject());
  },
  toggleIncludePalette () {
    return dispatch(toggleIncludePalette());
  },
  vtsDispatch (instance) {
    return dispatch(vtsAction(instance));
  }
});

const DownloadProjectModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadProjectModal);

export default DownloadProjectModalContainer;
