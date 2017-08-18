export default (state = {}, action) => {
    switch(action.type) {
        case "SET_REGION":
            return action.region
        default:
        return state
    }
}