import { NextFunction, Request as _Request, Response } from "express";

export type Request = _Request & { userId?: string };
