import { GET_PROFILE, PROFILE_UPDATE } from '../constants/user'
import user from '../api/user'


export const updateProfile = (profile) => {
    return {
        type: PROFILE_UPDATE,
        profile: { ...profile, isLogin: true }
    }
}

export const getProfile = () => {
    return dispatch => {
        user.getUserProfile().then(res => {
            if (res.code == 0) {
                return dispatch({
                    type: GET_PROFILE,
                    profile: { ...res.data, isLogin: true }
                });
            }
        });
    }
}