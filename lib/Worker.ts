import Cluster, { ClusterConfig } from './Cluster';
import Server, { routerInfo } from './Server';

export default class Worker extends Cluster<WorkerConfig> {
	private server: Server;

	constructor(routers: routerInfo[], config: WorkerConfig) {
		super(config);
		this.clusterType = 'Worker';

		this.server = new Server(routers);
	}

	start() {
		this.server.listen(this.config.port);
	}

	close() {
		this.server.close();
	}
}

export type WorkerConfig = {
	port: number,
} & ClusterConfig;
