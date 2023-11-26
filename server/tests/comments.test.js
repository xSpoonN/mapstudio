const request = require('supertest');
const app = require('../index');

describe('/comments', () => {
    it('should get a comment', async () => {
        const res = await request(app).post('/comment/allcomments').send({
            id: ['655fcf96015e00ad5a534012']
        })
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.comments).toHaveProperty('author', 'preston');
        expect(res.body.comments).toHaveProperty('content', 'nope and the Alps dont exist');
        expect('likes' in res.body.comments);
        expect('dislikes' in res.body.comments);
        expect('authorId' in res.body.comments);
        expect('likeUsers' in res.body.comments);
        expect('dislikeUsers' in res.body.comments);
        expect('publishedDate' in res.body.comments);
    });
});

