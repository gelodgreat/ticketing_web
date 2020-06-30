import { GET_TECHNICIAN, ADD_TECHNICIAN, UPDATE_TECHNICIAN } from '../actions/types';


export default function reducer(state = {
    technicians: [],
    technician: {}
}, action) {
    switch (action.type) {
        case GET_TECHNICIAN: {
            return { ...state, technicians: [...state.technicians, action.payload] }
        }
        case ADD_TECHNICIAN: {
            return { ...state, technician: action.payload }
        }
        default:
            return state
    }
};