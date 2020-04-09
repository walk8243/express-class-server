export default class Cluster {
	protected clusterType: ClusterType | null = null;
	protected config: ClusterConfig;

	constructor(config: ClusterConfig) {
		this.config = config;
	}

	start() {}

	isMaster() {
		return this.clusterType == 'Master';
	}
	isWorker() {
		return this.clusterType == 'Worker';
	}
}

export type ClusterType = 'Master' | 'Worker';
export type ClusterConfig = {};
