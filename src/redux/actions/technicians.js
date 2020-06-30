import { GET_TECHNICIAN, ADD_TECHNICIAN, UPDATE_TECHNICIAN } from "./types";

export const fetchTechnicians = () => dispatch => {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(res => res.json())
        .then(technicians => {
            console.log(technicians)
            return dispatch({
                type: GET_TECHNICIAN,
                payload: technicians
            })
        }
        );
};

export function addTechnician(technician) {
    return dispatch => {
        dispatch({
            type: ADD_TECHNICIAN,
            payload: technician
        })
    }
}

export function updateTechnician(technician) {
    return dispatch => {
        dispatch({
            type: UPDATE_TECHNICIAN,
            payload: technician
        })
    }
}