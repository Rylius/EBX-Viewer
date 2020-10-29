<template>
    <div>
        <div class="columns">
            <div class="column is-2 is-family-code has-text-right">
                <label>
                    {{ trans.name }}
                </label>
            </div>
            <div class="column">
                <vec3-property :registry="registry" :partition="partition" :field="trans"></vec3-property>
            </div>
        </div>

        <div class="columns">
            <div class="column is-2 is-family-code has-text-right">
                <label>
                    {{ forward.name }}
                </label>
            </div>
            <div class="column">
                <vec3-property :registry="registry" :partition="partition" :field="forward"></vec3-property>
            </div>
        </div>

        <div class="columns">
            <div class="column is-2 is-family-code has-text-right">
                <label>
                    {{ right.name }}
                </label>
            </div>
            <div class="column">
                <vec3-property :registry="registry" :partition="partition" :field="right"></vec3-property>
            </div>
        </div>

        <div class="columns">
            <div class="column is-2 is-family-code has-text-right">
                <label>
                    {{ up.name }}
                </label>
            </div>
            <div class="column">
                <vec3-property :registry="registry" :partition="partition" :field="up"></vec3-property>
            </div>
        </div>

        <div class="columns">
            <div class="column is-2"></div>

            <div class="column field-body">
                <label class="field has-addons">
                    <input type="text" class="input control is-family-code is-small" :value="lua" readonly>

                    <button class="button control is-small" @click="copyToClipboard(lua)">
                        Copy
                    </button>
                </label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import {copyToClipboard} from '../mixins/clipboard';

import Field from '../ebx/Field';

import Vec3Property from './Vec3Property.vue';
import GameRegistry from '../GameRegistry';
import Partition from '../ebx/Partition';

export default Vue.extend({
    name: 'LinearTransformProperty',
    mixins: [copyToClipboard],
    props: {
        registry: {
            type: Object as PropType<GameRegistry>,
            required: true,
        },
        partition: {
            type: Object as PropType<Partition>,
            required: true,
        },
        field: {
            type: Object as PropType<Field<any>>,
            required: true,
        },
    },
    computed: {
        trans(): Field<any> {
            return new Field('trans', 'Vec3', this.field.value.trans);
        },
        forward(): Field<any> {
            return new Field('forward', 'Vec3', this.field.value.forward);
        },
        right(): Field<any> {
            return new Field('right', 'Vec3', this.field.value.right);
        },
        up(): Field<any> {
            return new Field('up', 'Vec3', this.field.value.up);
        },
        lua(): string {
            return `LinearTransform(${this.formatVec3(this.field.value.right)}, ${this.formatVec3(this.field.value.up)}, ${this.formatVec3(this.field.value.forward)}, ${this.formatVec3(this.field.value.trans)})`;
        },
    },
    methods: {
        formatVec3(vector: { x: number, y: number, z: number }): string {
            return `Vec3(${vector.x}, ${vector.y}, ${vector.z})`;
        },
    },
    components: {
        Vec3Property,
    },
});
</script>

<style lang="scss">

.table.is-normal td {
  border: none;
}

</style>
