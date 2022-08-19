import { VTS } from '../actions/vts';

const initialState = {
    vtsState: null
};

function vts (state = initialState, action) {
    switch (action.type) {
        case VTS:
            return { ...state, vtsState: action.vtsPlugin };
        default:
            return state;
    }
};

export default vts;