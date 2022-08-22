import { connect } from 'react-redux';

import {
    getVtsState
  } from '../../selectors';
  
  import {
    getStore
  } from '../../actions/application';
  
  import {
    vtsAction
  } from '../../actions/vts';
  
  import VtsControllerModal from '../../components/modals/VtsController/VtsController';

  const mapStateToProps = state => ({
    vts: getVtsState(state)
  });
  
  const mapDispatchToProps = dispatch => ({
    getProjectState () {
        return dispatch(getStore());
      },
    vtsDispatch (instance) {
      return dispatch(vtsAction(instance));
    }
  });
  
  const VtsControllerModalContainer = connect(
    mapStateToProps,
    mapDispatchToProps
  )(VtsControllerModal);
  
  export default VtsControllerModalContainer;
  