export const invalid = (req, res, next) => {
    const error = new Error('Path does not exist');
    error.statusCode = error.statusCode || 404;
    next(error);
};