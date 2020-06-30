import { combineReducers } from 'redux';
import technicianReducer from "./technicianReducer"

export default combineReducers({
    technicians: technicianReducer,
})
