export const exampleLogic = (store) => (next) => (action) => {
    console.log('middleware.js', action.type);
    next(action);
};
