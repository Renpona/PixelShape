import { VTS } from '../actions/vts';

const initialState = {
    instance: null
};

function vts (state = initialState, action) {
    switch (action.type) {
        case VTS:
            return { ...state, instance: action.vtsPlugin };
        default:
            return state;
    }
};

export default vts;