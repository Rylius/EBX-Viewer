import Instance from './Instance';

export default class Partition {

    constructor(
        public file: string,
        public guid: Frostbite.Guid,
        public name: string,
        public primaryInstance: Instance | null = null,
        public instances: { [guid: string]: Instance } = {}) {
    }

    static fromJSON(file: string, json: EBX.JSON.Partition): Partition {
        const partition = new Partition(
            file,
            json.$guid.toUpperCase(),
            json.$name,
        );

        for (const data of json.$instances) {
            partition.instances[data.$guid.toUpperCase()] = Instance.fromJSON(partition, data);
        }

        partition.primaryInstance = partition.instances[json.$primaryInstance.toUpperCase()];

        return partition;
    }

}
