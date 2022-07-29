import { Response } from 'express';

type TResponse<T = null> = {
    res: Response;
    results?: T;
    httpStatusCode?: number;
};

export const reply = <T = null>({ res, results = null, httpStatusCode = 200 }: TResponse<T>) => {
    return res.status(httpStatusCode).json(results);
};
