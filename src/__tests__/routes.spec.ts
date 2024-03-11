import request from 'supertest';
import express, { Express } from 'express';
import routes, { prisma } from '../routes';

const app: Express = express();
routes(app);

describe('Pog API', () => {
  beforeEach(async () => {
    await prisma.pogs.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /create-pogs should create a new Pog', async () => {
    const createdPog = { 
      name: "Test Pog", 
      ticker_symbol: "test", 
      price: 100, 
      color: "red" 
    };
  
    const response = await request(app)
      .post('/create-pogs') 
      .send(createdPog)
      .expect(200);
  
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(createdPog.name);
    expect(response.body.ticker_symbol).toBe(createdPog.ticker_symbol);
    expect(response.body.price).toBe(createdPog.price);
    expect(response.body.color).toBe(createdPog.color);
  });
  

  test('GET /pogs should return all Pogs', async () => {
    await prisma.pogs.createMany({
      data: [
        {
          name: "Test Pog 1",
          ticker_symbol: "test 1",
          price: 100,
          color: "red"
        },

        {
          name: "Test Pog 2",
          ticker_symbol: "test 2",
          price: 200,
          color: "green"
        },
      ],
    });

    const response = await request(app).get('/pogs');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  test('GET /pogs/:id should return a single pog', async () => {
    const testPog = await prisma.pogs.create({
      data: {
        name: "Test Pog 1",
        ticker_symbol: "test 1",
        price: 100,
        color: "red"
      },
    });
    let testPogId1 = testPog.id;

    const response = await request(app).get(`/pogs/${testPogId1}`).expect(200);

    expect(response.body.id).toBe(testPogId1);
    expect(response.body.name).toBe(testPog.name);
    expect(response.body.ticker_symbol).toBe(testPog.ticker_symbol);
    expect(response.body.price).toBe(testPog.price);
    expect(response.body.color).toBe(testPog.color);
  });

  test('PUT /pogs/:id should update an existing pog', async () => {
    const testPog = await prisma.pogs.create({
      data: {
        name: "Test Pog 1",
        ticker_symbol: "test 1",
        price: 100,
        color: "red"
      },
    });
    let testPogId1 = testPog.id;

    const updateData = { 
      name: "Patrick", 
      ticker_symbol: "Jokker", 
      price: 1000, 
      color: "black"
    };

    const response = await request(app).put(`/pogs/${testPogId1}`).send(updateData).expect(200)

    expect(response.body.id).toBe(testPogId1);
    expect(response.body.name).toBe(updateData.name);
    expect(response.body.ticker_symbol).toBe(updateData.ticker_symbol);
    expect(response.body.price).toBe(updateData.price);
    expect(response.body.color).toBe(updateData.color);
  }, 10000);

  test('DELETE /pogs/:id should delete an existing Pog', async () => {
    const testPog = await prisma.pogs.create({
      data: {
        name: "Test Pog 1",
        ticker_symbol: "test 1",
        price: 100,
        color: "red"
      },
    });
    let testPogId1 = testPog.id;

    await request(app).delete(`/pogs/${testPogId1}`).expect(204);

    const deletedPog = await prisma.pogs.findUnique({ where: { id: testPogId1 } });
    
    expect(deletedPog).toBeNull();
    await prisma.$disconnect();
  });
});