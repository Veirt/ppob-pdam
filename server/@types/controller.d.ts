import type { Request, Response, NextFunction } from "express";

type Controller = (req: Request, res: Response, next: NextFunction) => any;
