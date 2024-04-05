import { Request, Response } from "express";

export default function (error: any, req: Request, res: Response) {
  // handle error
  console.log("error====================", error);
  res.status(500).end();
}
