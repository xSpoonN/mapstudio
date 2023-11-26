const request = require('supertest');
const app = require('../index');

describe('/maps', () => {
    it('should get a specific map', async () => {
        const res = await request(app).get('/map/maps/'+ '656258501ff509764ff362a8')
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.map).toHaveProperty('title', 'Map of Brazil');
        expect('description' in res.body.map);
        expect('likes' in res.body.map);
        expect('dislikes' in res.body.map);
        expect('author' in res.body.map);
        expect('likeUsers' in res.body.map);
        expect('dislikeUsers' in res.body.map);
        expect('creationDate' in res.body.map);
        expect('updateDate' in res.body.map);
        expect('comments' in res.body.map);
        expect(res.body.success).toEqual(true);
    });
    it('should get a user\'s maps', async () => {
        const res = await request(app).get('/map/user/'+ '6557d88b65964f721b421b73')
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(Array.isArray(res.body.maps)).toBeTruthy();
        expect(res.body.maps.length).toBeGreaterThan(0);
    });
});

