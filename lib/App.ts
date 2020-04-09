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
			this.cluster = new Master({ clusterNum: os.cpus().length });
		} else if(cluster.isWorker) {
			this.cluster = new Worker(routers, { port: 3000 });
		} else {
			this.cluster = new Cluster({});
		}
	}

	start() {
		this.cluster.start();
	}
}
