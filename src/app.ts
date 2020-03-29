import express from 'express';
import bodyParser from 'body-parser';

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', (req, res, next) => {
	res.send({ result: 'express-class-server' });
});

app.use((req, res, next) => {
	res.sendStatus(400);
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.sendStatus(500);
});
