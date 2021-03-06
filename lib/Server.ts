import * as http from 'http';
import * as net from 'net';
import express from 'express';
import bodyParser from 'body-parser';
import { Express } from 'express-serve-static-core';

export default class Server {
	private app: Express;
	private server: http.Server | null = null;

	constructor(routers: routerInfo[]) {
		this.app = express();
		this.init(routers);
	}

	listen(port: number) {
		this.server = this.app.listen(port);
		this.server
			.on('listening', () => {
				const address = this.server!.address() as net.AddressInfo;
				if(address.family == 'IPv4') {
					console.log('access to', `http://localhost:${address.port}`, '.');
				} else if(address.family == 'IPv6') {
					console.log('access to', `http://[::1]:${address.port}`, '.');
				} else {
					console.log('listening');
				}
			})
			.on('close', () => {
				console.log('server closed');
			})
			.on('error', (error) => {
				console.error(error);
			});
	}

	close() {
		this.server?.close();
	}

	private init(routers: routerInfo[]) {
		this.before();
		this.setRouters(routers);
		this.after();
	}

	private setRouters(routers: routerInfo[]) {
		routers.forEach((router) => {
			this.app[router.method || 'all'](router.path || '/', router.handler);
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
}

export type routerInfo = {
	method?: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head',
	path?: string,
	handler: express.RequestHandler,
};
