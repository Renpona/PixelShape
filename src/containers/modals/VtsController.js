import { connect } from 'react-redux';

import {
    getAutoSendState,
    getVtsState
  } from '../../selectors';
  
  import {
    getStore
  } from '../../actions/application';
  
  import {
    vtsAction,
    toggleAutoSend
  } from '../../actions/vts';
  
  import VtsControllerModal from '../../components/modals/VtsController/VtsController';

  const mapStateToProps = state => ({
    vts: getVtsState(state),
    autoSend: getAutoSendState(state)
  });
  
  const mapDispatchToProps = dispatch => ({
    getProjectState () {
        return dispatch(getStore());
      },
    vtsDispatch (instance) {
      return dispatch(vtsAction(instance));
    },
    toggleAutoSend () {
      return dispatch(toggleAutoSend());
    }
  });
  
  const VtsControllerModalContainer = connect(
    mapStateToProps,
    mapDispatchToProps
  )(VtsControllerModal);
  
  export default VtsControllerModalContainer;
  