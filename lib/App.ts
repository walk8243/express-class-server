import cluster from 'cluster';
import * as os from 'os';
import Cluster from './Cluster';
import Master from './Master';
import Worker, { routerInfo } from './Worker';
export { routerInfo } from './Worker';

export default class App {
	private cluster: Cluster;

	constructor(routers: routerInfo[]) {
		if(cluster.isMaster) {
			console.debug('ProcessID:', process.pid);
			if(process.env['CLUSTER_MODE']?.toLowerCase() == 'false') {
				this.cluster = new Worker(routers, {
					port: this.getNumberFromProcessEnv('PORT', 3000),
				});
			} else {
				this.cluster = new Master({
					clusterNum: this.getNumberFromProcessEnv('CLUSTER_NUM', os.cpus().length),
				});
			}
			this.initGracefulShutdown();
		} else if(cluster.isWorker) {
			this.cluster = new Worker(routers, {
				port: this.getNumberFromProcessEnv('PORT', 3000),
			});
		} else {
			this.cluster = new Cluster({});
		}
	}

	start() {
		this.cluster.start();
	}

	private initGracefulShutdown() {
		process
			.on('SIGTERM', () => {
				console.debug('SIGTERM');
				this.cluster.close();
			})
			.on('SIGINT', () => {
				console.debug('SIGINT');
				this.cluster.close();
			});
	}

	private getNumberFromProcessEnv(key: keyof processEnvType, defaultValue: number): number {
		const value = Number(process.env[key]);
		if(Number.isNaN(value)
			|| value < 1) {
			return defaultValue;
		} else {
			return Math.floor(value);
		}
	}
}

export type processEnvType = {
	CLUSTER_MODE?: string,
	CLUSTER_NUM?: string,
	PORT?: string,
};
