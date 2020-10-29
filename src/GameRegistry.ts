import Partition from './ebx/Partition';

export interface PartitionLoader {
    load: (guid: Frostbite.Guid) => Promise<Partition>;
    loadFile: (path: string) => Promise<Partition>;
}

export class FetchPartitionLoader implements PartitionLoader {

    private readonly fileIndex: Promise<{ [guid: string]: string }>;

    constructor(
        private readonly baseUrl: string,
        fileIndex: () => Promise<{ [guid: string]: string }>,
    ) {
        this.fileIndex = fileIndex();
    }

    async load(guid: Frostbite.Guid): Promise<Partition> {
        const index = await this.fileIndex;
        const file = index[guid];
        if (!file) {
            throw new Error(`Partition index does not contain partition ${guid}`);
        }

        return this.loadFile(file);
    }

    async loadFile(path: string): Promise<Partition> {
        const fileUrl = `${this.baseUrl}/${path}.json`;

        return fetch(fileUrl)
            .then(res => res.json())
            .then(json => Partition.fromJSON(path, json));
    }

}

export default class GameRegistry {

    private readonly partitions: { [guid: string]: Promise<Partition>; } = {};
    private readonly files: { [path: string]: Promise<Partition>; } = {};

    constructor(
        public readonly game: string,
        private readonly loader: PartitionLoader,
    ) {
    }

    async resolve(guid: Frostbite.Guid): Promise<Partition> {
        if (this.partitions[guid]) {
            return this.partitions[guid];
        }

        this.partitions[guid] = this.loader.load(guid);
        return this.partitions[guid];
    }

    async resolveFile(path: string): Promise<Partition> {
        if (this.files[path]) {
            return this.files[path];
        }

        const promise = this.loader.loadFile(path);
        this.files[path] = promise;
        promise.then(partition => this.partitions[partition.guid] = promise);
        return promise;
    }

};
