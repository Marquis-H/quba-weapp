import { UPDATE_SEARCH_IDLES, UPDATE_SEARCH_TEAM } from '../constants/search'

export const getIdleSearch = (data) => {
    return {
        type: UPDATE_SEARCH_IDLES,
        idles: data
    }
}

export const getTeamSearch = (data) => {
    return {
        type: UPDATE_SEARCH_TEAM,
        teams: data
    }
}