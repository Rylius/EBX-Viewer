export default class Reference {

    public partitionGuid: Frostbite.Guid;
    public instanceGuid: Frostbite.Guid;

    constructor(partitionGuid: Frostbite.Guid, instanceGuid: Frostbite.Guid) {
        this.partitionGuid = partitionGuid;
        this.instanceGuid = instanceGuid;
    }

};
