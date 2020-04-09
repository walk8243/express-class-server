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
			this.cluster = new Master({
				clusterNum: this.getNumberFromProcessEnv('clusterNum', os.cpus().length),
			});
		} else if(cluster.isWorker) {
			this.cluster = new Worker(routers, {
				port: this.getNumberFromProcessEnv('port', 3000),
			});
		} else {
			this.cluster = new Cluster({});
		}
	}

	start() {
		this.cluster.start();
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
	clusterNum?: string,
	port?: string,
};
