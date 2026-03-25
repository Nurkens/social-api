import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest'; 
import { AppModule } from './../src/app.module'; 
import { access } from 'fs';

describe('Social API (e2e)', () => {
  let app: INestApplication;

  let testUserEmail:string;
  const testUserPassword = 'password123';
  let testUserName:string;
  let accessToken:string;
  let testPostTitle:string;
  let testPostContent:string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

   
    app.useGlobalPipes(new ValidationPipe());

   
    await app.init();
  });

  it('/users (POST) - needs to register user', () => {
    testUserEmail = `test${Date.now()}@gmail.com`;
    testUserName = `user_${Date.now()}`;


    return request(app.getHttpServer())
      .post('/users') 
      .send({
        email: testUserEmail, 
        username: testUserName,
        password: testUserPassword,
      })
      .expect(201); 
  });

  it('/users (POST) - it should return 400 if email is not correct', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'invalid-email', 
        username: 'fail',
        password: 'fakePassword1431',
      })
      .expect(400); 
  });
  it('/auth (POST) - need to login user ',() => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email:testUserEmail,
        password:testUserPassword
      })
      .expect(201)
      .then((response)=>{
        accessToken = response.body.access_token;
        expect(accessToken).toBeDefined();
      }) 
  });
  it('/auth (POST) - it should return 400 if password or email incorrect ',() =>{
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email:'invalid-email@gmail.com',
        password:'invalidPassword'
      })
      .expect(401);
  });
  it('/posts (POST) - it should create post', () =>{
    testPostTitle = `TestPostTitle${Date.now()}`;
    testPostContent =`TestPostContent${Date.now()}`

    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization','Bearer ' + accessToken)
      .send({
          title: testPostTitle,
          content:testPostContent
      })
      .expect(201);
  })
  it('/posts (POST) - it should return 400 if accessToken is not correct',() =>{
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization','Bearer ')
      .send({
        title:testPostTitle,
        content:testPostContent
      })
      .expect(401);
  })

  it('/posts/feed (GET) - it should return 200 if feed is returned', () => {
    return request(app.getHttpServer())
      .get('/posts/feed')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200) 
      .then((response) => {
        const data = response.body.data; 
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true); 
      });
  });

 
  afterAll(async () => {
    await app.close(); 
  });
});