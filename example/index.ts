import { App } from '../';

const app = new App([
	{
		path: '/',
		handler: (req, res, next) => {
			res.send({ result: 'express-class-server' });
		},
	},
	{
		path: '/delay',
		handler: (req, res, next) => {
			setTimeout(() => {
				res.send({ result: 'express-class-server', type: 'delay' });
			}, 5 * 1000);
		}
	}
]);
app.start();
