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

  test('POST /pogs should create a new Pog', async () => {
    const postData = { name: "Test Pog", ticker_symbol: "test", price: 100, color: "red" };

    const response = await request(app)
      .post('/pogs')
      .send(postData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(postData.name);
    expect(response.body.ticker_symbol).toBe(postData.ticker_symbol);
    expect(response.body.price).toBe(postData.price);
    expect(response.body.color).toBe(postData.color);
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

    const response = await request(app).get('/pogs').expect(200);

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

    const testPog2 = await prisma.pogs.create({
      data: {
        name: "Test Pog 2",
        ticker_symbol: "test 2",
        price: 200,
        color: "green",
      },
    });
    let testPogId2 = testPog2.id;

    const response = await request(app).get(`/pogs/${testPogId1}`).expect(200);
    const response2 = await request(app).get(`/pogs/:${testPogId2}`).expect(200)

    expect(response.body.id).toBe(testPogId1);
    expect(response.body.name).toBe(testPog.name);
    expect(response.body.ticker_symbol).toBe(testPog.ticker_symbol);
    expect(response.body.price).toBe(testPog.price);
    expect(response.body.color).toBe(testPog.color);

    expect(response2.body.id).toBe(testPogId2);
    expect(response2.body.name).toBe(testPog2.name);
    expect(response2.body.ticker_symbol).toBe(testPog2.ticker_symbol);
    expect(response2.body.price).toBe(testPog2.price);
    expect(response2.body.color).toBe(testPog2.color);
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

    const updateData = { name: "Patrick", ticker_symbol: "Jokker", price: 1000, color: "black"};

    const response = await request(app)
      .put(`pogs/:${testPogId1}`)
      .send(updateData)
      .expect(200)

    expect(response.body.id).toBe(testPogId1);
    expect(response.body.name).toBe(updateData.name);
    expect(response.body.ticker_symbol).toBe(updateData.ticker_symbol);
    expect(response.body.prce).toBe(updateData.price);
    expect(response.body.color).toBe(updateData.color);
  });

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
  });
});