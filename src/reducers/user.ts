import { GET_PROFILE, PROFILE_UPDATE } from '../constants/user'
import * as images from '../../static/images/index';

const INITIAL_STATE = {
    profile: {
        avatar: images.avatar,
        nickname: null,
        name: null,
        isLogin: false,
        orders: 0,
        applications: 0,
        teams: 0
    }
}

export default function member(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_PROFILE:
            return {
                ...state,
                profile: action.profile
            }
        case PROFILE_UPDATE:
            return {
                ...state,
                profile: action.profile
            }
        default:
            return state
    }
}