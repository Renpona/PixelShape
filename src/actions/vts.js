export const VTS = 'APP:VTS';

export const vtsAction = vtsPlugin => ({
    type: VTS,
    vtsPlugin
  });

export const getStore = () => (dispatch, getState) => getState();

export const uploadStore = state => ({
  type: UPLOAD_STORE,
  state
});
