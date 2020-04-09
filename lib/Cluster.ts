export default class Cluster<C extends ClusterConfig = ClusterConfig> {
	protected clusterType: ClusterType | null = null;
	protected config: C;

	constructor(config: C) {
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
export type ClusterConfig = {} & object;
