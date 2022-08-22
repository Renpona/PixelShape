export const VTS = 'APP:VTS';
export const TOGGLE_AUTO_SEND = 'APP:TOGGLE_AUTO_SEND';

export const vtsAction = vtsPlugin => ({
    type: VTS,
    vtsPlugin
  });

  export const toggleAutoSend = () => ({
    type: TOGGLE_AUTO_SEND
  });

export const getStore = () => (dispatch, getState) => getState();

export const uploadStore = state => ({
  type: UPLOAD_STORE,
  state
});
