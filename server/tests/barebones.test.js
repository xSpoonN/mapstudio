const request = require('supertest');
const app = require('../index');

describe('/users', () => {
    let userid;

    it('should create a new user', async () => {
        const res = await request(app).post('/users')
        .send({
            name: 'John',
            age: 30  
        });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'John');
        expect(res.body).toHaveProperty('age', 30);
        userid = res.body._id;
    });

    it('should get a list of all users', async () => {
        const res = await request(app).get('/users');
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get a user by id', async () => {
      const res = await request(app).get('/users/' + userid);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'John');
      expect(res.body).toHaveProperty('age', 30);
      expect(res.body).toHaveProperty('_id', userid);
    });

    it('should update a user by id', async () => {
        const res = await request(app).put('/users/' + userid)
        .send({
            name: 'John',
            age: 31 
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'John');
        expect(res.body).toHaveProperty('age', 31);
        expect(res.body).toHaveProperty('_id', userid);
    });

    it('should delete a user by id', async () => {
        const res = await request(app).delete('/users/' + userid);
            
        expect(res.statusCode).toEqual(204);
    });
});

