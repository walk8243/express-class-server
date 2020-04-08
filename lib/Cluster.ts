export default class Cluster {
	protected clusterType: ClusterType | null = null;

	constructor() {}

	start() {}

	isMaster() {
		return this.clusterType == 'Master';
	}
	isWorker() {
		return this.clusterType == 'Worker';
	}
}

export type ClusterType = 'Master' | 'Worker';
