import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
function routes(app: Express) {

  //CREATE
  app.post('/pogs', async (req: Request, res: Response) => {

  });
  //READ
  app.get('/pogs', async (req: Request, res: Response) => {
    const pogs = await prisma.pogs.findMany();
  
    res.json(pogs);
  });

  app.get('/pogs/:id', async (req: Request, res: Response) => {

  });

  //UPDATE
  app.put('/pogs/:id', async (req: Request, res: Response) => {

  });

  //DELETE
  app.delete('/pogs/:id', async (req: Request, res: Response) => {

  });
}

export default routes;