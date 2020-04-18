import cluster from 'cluster';
import Cluster, { ClusterConfig } from './Cluster';

export default class Master extends Cluster<MasterConfig> {
	workers: cluster.Worker[];

	constructor(config: MasterConfig) {
		super(config);
		this.clusterType = 'Master';

		this.workers = [...Array(this.config.clusterNum)].map((_) => {
			return cluster.fork();
		});

		cluster
			.on('disconnect', (worker) => {
				console.debug(worker);
				const number = this.workers.indexOf(worker);
				console.debug('Worker number:', number);
				this.workers.splice(number, 1);
			})
			.on('exit', (worker, code, signal) => {
				console.debug(worker, code, signal);
				this.workers.push(cluster.fork());
			});
	}

	close() {
		cluster.removeAllListeners('disconnect');
		cluster.removeAllListeners('exit');
		setImmediate(() => {
			this.workers
				.filter((worker) => worker.isConnected)
				.forEach((worker) => worker.disconnect());
		});
	}

	getWorkers() {
		return this.workers;
	}
}

export type MasterConfig = {
	clusterNum: number,
} & ClusterConfig;
