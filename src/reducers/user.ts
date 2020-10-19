import { GET_PROFILE } from '../constants/user'

const INITIAL_STATE = {
    profile: {
        avatar: null,
        name: null,
        number: null
    }
}

export default function member(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_PROFILE:
            return {
                ...state,
                profile: action.profile
            }
        default:
            return state
    }
}