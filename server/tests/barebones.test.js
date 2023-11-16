const request = require('supertest');
const app = require('../index');

describe('/people', () => {
    let userid;

    it('should create a new person', async () => {
        const res = await request(app).post('/api/people')
        .send({
            name: 'John',
            age: 30  
        });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'John');
        expect(res.body).toHaveProperty('age', 30);
        userid = res.body._id;
    });

    it('should get a list of all people', async () => {
        const res = await request(app).get('/api/people');
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get a person by id', async () => {
      const res = await request(app).get('/api/people/' + userid);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'John');
      expect(res.body).toHaveProperty('age', 30);
      expect(res.body).toHaveProperty('_id', userid);
    });

    it('should update a person by id', async () => {
        const res = await request(app).put('/api/people/' + userid)
        .send({
            name: 'John',
            age: 31 
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'John');
        expect(res.body).toHaveProperty('age', 31);
        expect(res.body).toHaveProperty('_id', userid);
    });

    it('should delete a person by id', async () => {
        const res = await request(app).delete('/api/people/' + userid);
            
        expect(res.statusCode).toEqual(204);
    });
});

