import { App } from '../';

const app = new App([
	{
		handler: (req, res, next) => {
			res.send({ result: 'express-class-server' });
		},
	},
]);
app.start();
