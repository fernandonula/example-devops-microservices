import { Express, Request, Response } from "express";
import shiftsS from "../services/shiftsS";

function configure(app: Express) {
  app.get("/", async (req: Request, res: Response) => {
    allshifts(req, res);
  });

  async function allshifts(req: Request, res: Response) {
    try {
      const ret = await shiftsS.all();
      res.send(ret);
    } catch (e) {
      console.log(e);
      res.status(400);
      res.send(e);
    }
  }
}

export default configure;
