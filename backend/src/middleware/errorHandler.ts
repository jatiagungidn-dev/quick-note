import type { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);

  res.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;
