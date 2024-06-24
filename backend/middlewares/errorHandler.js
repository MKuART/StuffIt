export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.log(err);
    res.status(statusCode).json({ message: err });
  };