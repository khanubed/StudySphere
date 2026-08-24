import { Router } from 'express';

export const resourceRouter = Router();

resourceRouter.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'res-1',
        title: 'Database Management Systems - Normalized Forms PYQ Notes',
        subject: 'DBMS',
        type: 'Notes',
        author: 'Amit Sharma',
        authorBadge: 'Gold',
        views: 142,
        likes: 38,
      },
    ],
  });
});
