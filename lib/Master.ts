import cluster from 'cluster';
import Cluster from './Cluster';

export default class Master extends Cluster {
	workers: cluster.Worker[];

	constructor(clusterNum: number) {
		super();
		this.clusterType = 'Master';
		console.debug('ProcessID:', process.pid);

		this.workers = [...Array(clusterNum)].map((_) => {
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
