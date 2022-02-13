import type { Response } from "express";

export const handleError = (type: string, res: Response, data?: any): Response<any> => {
    let statusCode = 500;

    switch (type) {
        case "notFound":
            statusCode = 404;
            break;
        case "validation":
            statusCode = 400;
            break;
    }

    return res.status(statusCode).json(data);
};

export const handleValidationError = (validationResult: any[]): any[] | false => {
    if (validationResult.length > 0) {
        return validationResult;
    }

    return false;
};
