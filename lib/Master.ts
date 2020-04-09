import cluster from 'cluster';
import Cluster, { ClusterConfig } from './Cluster';

export default class Master extends Cluster<MasterConfig> {
	workers: cluster.Worker[];

	constructor(config: MasterConfig) {
		super(config);
		this.clusterType = 'Master';
		console.debug('ProcessID:', process.pid);

		this.workers = [...Array(this.config.clusterNum)].map((_) => {
			return cluster.fork();
		});

		this.initGracefulShutdown();

		cluster
			.on('disconnect', (worker) => {
				console.log(worker);
			})
			.on('exit', (worker, code, signal) => {
				console.log(worker, code, signal);
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
