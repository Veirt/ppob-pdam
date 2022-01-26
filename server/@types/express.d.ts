import type { Request, Response, NextFunction } from "express";
import type Petugas from "../src/entities/Petugas";

declare global {
    namespace Express {
        interface User extends Petugas {}
    }
}

type Controller = (req: Request, res: Response, next: NextFunction) => any;
type Middleware = (req: Request, res: Response, next: NextFunction) => void;
