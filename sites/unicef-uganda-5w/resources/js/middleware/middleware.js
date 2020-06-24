export const exampleLogic = (store) => (next) => (action) => {
    console.log(action.type);
    next(action);
};
