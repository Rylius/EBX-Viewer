export const typeNameMappings: { [type: string]: string } = {
    'Boolean': 'bool',
    'Single': 'float',
    'Int32': 'int',
    'UInt32': 'int',
    'Int16': 'int',
    'UInt16': 'int',
    'SByte': 'int',
    'GUID': 'Guid',
};

export class LinearTransform {

    public readonly right: Vec3 = new Vec3();
    public readonly up: Vec3 = new Vec3();
    public readonly forward: Vec3 = new Vec3();
    public readonly trans: Vec3 = new Vec3();

    static fromJSON(json: EBX.JSON.LinearTransform): LinearTransform {
        const transform = new LinearTransform();
        if (json.right) {
            transform.right.copy(Vec3.fromJSON(json.right.$value));
        }
        if (json.up) {
            transform.up.copy(Vec3.fromJSON(json.up.$value));
        }
        if (json.forward) {
            transform.forward.copy(Vec3.fromJSON(json.forward.$value));
        }
        if (json.trans) {
            transform.trans.copy(Vec3.fromJSON(json.trans.$value));
        }
        return transform;
    }

}

export class Vec3 {

    public x: number = 0.0;
    public y: number = 0.0;
    public z: number = 0.0;

    set(x: number, y: number, z: number): Vec3 {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    copy(other: Vec3): Vec3 {
        return this.set(other.x, other.y, other.z);
    }

    static fromJSON(json: EBX.JSON.Vec3): Vec3 {
        return new Vec3().set(json.x.$value, json.y.$value, json.z.$value);
    }

}
