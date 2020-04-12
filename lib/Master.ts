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
				console.log(worker);
			})
			.on('exit', (worker, code, signal) => {
				console.log(worker, code, signal);
			});
	}

	close() {
		this.workers
			.filter((worker) => worker.isConnected)
			.forEach((worker) => worker.disconnect());
	}

	getWorkers() {
		return this.workers;
	}
}

export type MasterConfig = {
	clusterNum: number,
} & ClusterConfig;
