import * as http from 'http';
import * as net from 'net';
import cluster from 'cluster';
import * as os from 'os';
import express from 'express';
import * as expressCore from 'express-serve-static-core';
import bodyParser from 'body-parser';

export default class App {
	// Master
	private worker?: cluster.Worker[];

	// Worker
	private app: expressCore.Express | null = null;
	private server?: http.Server;

	constructor(routers: routerInfo[]) {
		if(cluster.isMaster) {
			this.worker = [...Array(os.cpus().length)].map((_) => {
				return cluster.fork();
			});
			this.initGracefulShutdown();
		} else if(cluster.isWorker) {
			this.app = express();
			this.init(routers);
		}
	}

	start() {
		if(cluster.isMaster) {
			cluster
				.on('disconnect', (worker) => {
					console.log(worker);
				})
				.on('exit', (worker, code, signal) => {
					console.log(worker, code, signal);
				});
		} else if(cluster.isWorker) {
			this.listen();
		}
	}

	protected init(routers: routerInfo[]) {
		this.before();
		this.setRouters(routers);
		this.after();
	}

	protected setRouters(routers: routerInfo[]) {
		if(this.app == null) return;
		routers.forEach((router) => {
			this.app![router.method || 'all'](router.path || '/', router.handler);
		});
	}

	private before() {
		if(this.app == null) return;
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}
	private after() {
		if(this.app == null) return;
		this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
			res.sendStatus(400);
		});
		this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
			res.sendStatus(500);
		});
	}

	private listen() {
		if(this.app == null) return;
		this.server = this.app.listen(3000);
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
				console.log('error', 'object');
				console.error(error);
			});
	}

	private initGracefulShutdown() {
		process
			.on('SIGTERM', () => {
				console.debug('SIGTERM');
				this.execGracefulShutdown();
			})
			.on('SIGINT', () => {
				console.debug('SIGINT');
				this.execGracefulShutdown();
			});
	}
	private execGracefulShutdown() {
		if(cluster.isMaster) {
			this.worker
				?.filter((worker) => worker.isConnected)
				.forEach((worker) => worker.disconnect());
		}
	}
}

export type routerInfo = {
	method?: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head',
	path?: string,
	handler: express.RequestHandler,
};
