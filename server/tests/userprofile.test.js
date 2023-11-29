const request = require('supertest');
const app = require('../index');

describe('/users', () => {
    let userid;

    it('should get an existing user', async () => {
        const res = await request(app).get('/auth/users/kt4cty@gmail.com')
        
        expect(res.statusCode).toEqual(200);
        expect('bio' in res.body.user);
        expect('email' in res.body.user);
        expect('passwordHash' in res.body.user);
        expect('pfp' in res.body.user);
        expect('posts' in res.body.user);
        expect('maps' in res.body.user);
        expect('joinDate' in res.body.user);

        userid = res.body.user._id;
    });

    it('should get an existing user by id', async () => {
        const res = await request(app).get('/auth/users/id/' + userid);
        
        expect(res.statusCode).toEqual(200);
        expect('bio' in res.body.user);
        expect('email' in res.body.user);
        expect('passwordHash' in res.body.user);
        expect('pfp' in res.body.user);
        expect('posts' in res.body.user);
        expect('maps' in res.body.user);
        expect('joinDate' in res.body.user);
    });
});

