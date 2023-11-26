const request = require('supertest');
const app = require('../index');

describe('/posts', () => {
    it('should get a specific post', async () => {
        const res = await request(app).get('/discussion/post/'+ '655fc84f53833545671b62cb')
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.post).toHaveProperty('title', 'Anybody have elevation maps of the Alps?');
        expect('content' in res.body.post);
        expect('likes' in res.body.post);
        expect('dislikes' in res.body.post);
        expect('author' in res.body.post);
        expect('authorId' in res.body.post);
        expect('likeUsers' in res.body.post);
        expect('dislikeUsers' in res.body.post);
        expect('publishedDate' in res.body.post);
        expect('comments' in res.body.post);
        expect(res.body.success).toEqual(true);
    });
    it('should get a user\'s posts', async () => {
        const res = await request(app).get('/discussion/user/'+ '6557d88b65964f721b421b73')
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(Array.isArray(res.body.posts)).toBeTruthy();
        expect(res.body.posts.length).toBeGreaterThan(0);
    });
});

