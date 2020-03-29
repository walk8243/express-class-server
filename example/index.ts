import { App } from '../';

const app = new App([
	{
		handler: (req, res, next) => {
			setTimeout(() => {
				res.send({ result: 'express-class-server' });
			}, 5 * 1000);
		},
	},
]);
app.start();
