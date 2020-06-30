export default function reducer(state = {
    technicians: [],
    technician: {}
}, action) {
    switch (action.type) {
        case "GET_TECHNICIAN": {
            return { ...state, technicians: action.payload }
        }
        case "ADD_TECHNICIAN": {
            return { ...state, technician: action.payload }
        }
        default:
            return state
    }
};