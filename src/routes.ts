import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

function routes(app: Express) {

  //CREATE
  app.post('/create-pogs', async (req: Request, res: Response) => {
    try {
      const { name, ticker_symbol, price, color } = req.body || {};
      const pogCreated = await prisma.pogs.create({
        data: {
          name,
          ticker_symbol,
          price,
          color,
        },
      });

      if (!pogCreated) {
        res.status(404).json({ error: "Pog not found" })
      }

      res.status(200).json(pogCreated);
    } catch (error) {
      res.status(422).json({ error: 'Failed to create Pog' });
    }
  });

  //READ
  app.get('/pogs', async (req: Request, res: Response) => {
    try {
      const pogs = await prisma.pogs.findMany();

      res.status(200).json(pogs);
    } catch (error) {
      res.status(404).json({ error: 'Failed to retrieve pogs' });
    }
  });

  app.get('/pogs/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);

    try {
      const pog = await prisma.pogs.findUnique({
        where: {
          id,
        }
      });

      if (!pog) {
        res.status(404).json({ error: "Pog not found" });
        return;
      }
      res.status(200).json(pog);
    } catch (error) {
      res.status(404).json({ error: "Failed to retrieve pog" })
    }
  });

  //UPDATE
  app.put('/pogs/:id', async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const { name, ticker_symbol, price, color } = req.body || {};
      const updatePog = await prisma.pogs.update({
        where: {
          id,
        },
        data: {
          name,
          ticker_symbol,
          price,
          color,
        },
      });
      res.json(updatePog).status(200);
    } catch (error) {
      res.status(422).json({ error: "Update failed" });
    }
  });

  //DELETE
  app.delete('/pogs/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);

    try {
      const deletePog = await prisma.pogs.delete({
        where: {
          id,
        },
      });

      if (!deletePog) {
        res.status(404).json({ error: "Pog does not exist" });
        return;
      }
      res.status(204).end();
    } catch (error) {
      res.status(404).json({ error: "Failed to delete pog"})
    }
  });
}

export default routes;