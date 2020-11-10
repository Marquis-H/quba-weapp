import { UPDATE_SEARCH_IDLES, UPDATE_SEARCH_TEAM } from '../constants/search'

const INITIAL_STATE = {
    defaultKeyword: {
        keyword: ''
    },
    idles: [],
    teams: []
}

export default function member(state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_SEARCH_IDLES:
            return {
                ...state,
                idles: action.idles
            }
        case UPDATE_SEARCH_TEAM:
            return {
                ...state,
                teams: action.teams
            }
        default:
            return state
    }
}