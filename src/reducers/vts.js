import { 
    VTS,
    TOGGLE_AUTO_SEND
} from '../actions/vts';

const initialState = {
    instance: null,
    autoSend: true
};

function vts (state = initialState, action) {
    switch (action.type) {
        case VTS:
            return { ...state, instance: action.vtsPlugin };
        case TOGGLE_AUTO_SEND:
            return { ...state, autoSend: !state.autoSend };
        default:
            return state;
    }
};

export default vts;