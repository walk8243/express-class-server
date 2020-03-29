import * as http from 'http';
import * as net from 'net';
import express from 'express';
import * as expressCore from 'express-serve-static-core';
import bodyParser from 'body-parser';

export default class App {
	private app: expressCore.Express;
	private server?: http.Server;

	constructor(routers: routerInfo[]) {
		this.app = express();
		this.init(routers);
	}

	start() {
		this.listen();

		process
			.on('SIGTERM', () => {
				console.debug('SIGTERM');
				this.server?.close();
			})
			.on('SIGINT', () => {
				console.debug('SIGINT');
				this.server?.close();
			})
			.on('SIGSTOP', () => {
				console.debug('SIGSTOP');
			})
			.on('SIGKILL', () => {
				console.debug('SIGKILL');
			});
	}

	protected init(routers: routerInfo[]) {
		this.before();
		this.setRouters(routers);
		this.after();
	}

	protected setRouters(routers: routerInfo[]) {
		routers.forEach((router) => {
			this.app[router.method || 'all'](router.method || '/', router.handler);
		});
	}

	private before() {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}
	private after() {
		this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
			res.sendStatus(400);
		});
		this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
			res.sendStatus(500);
		});
	}

	private listen() {
		this.server = this.app.listen(3000);
		this.server
			.on('listening', () => {
				const address = this.server!.address() as net.AddressInfo;
				if(address.family == 'IPv4') {
					console.log('access to', `localhost:${address.port}`, '.');
				} else if(address.family == 'IPv6') {
					console.log('access to', `[::1]:${address.port}`, '.');
				} else {
					console.log('listening');
				}
			})
			.on('error', (error) => {
				console.error(error);
			});
	}
}

export type routerInfo = {
	method?: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head',
	path?: string,
	handler: express.RequestHandler,
};
