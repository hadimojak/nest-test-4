import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
const cookieSession = require('cookie-session');

describe('Authentication System (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('hanldes the signup request', async () => {
    const email = '31asd134sd@con.vom';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'qwer1234',
      })
      .expect(201);

    expect(res.get('Set-Cookie')).toBeDefined();
  });

  it('signup as new user and the user back', async () => {
    const email = '31asd134sd@con.vom';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'qwer1234',
      })
      .expect(201);

    const cookie = res.get('Set-Cookie') as string[];
    console.log(cookie);

    const response = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toEqual(1);
    expect(response.body.email).toEqual(email);
  });
});
