<template>
    <div>
        <h4 :id="instance.guid">
            <a :href="`https://docs.veniceunleashed.net/vext/ref/fb/${instance.type.toLowerCase()}/`">
                {{ instance.type }}
            </a>
            {{ instance.guid }}
            <button class="button is-small" v-if="visible" @click="visible = false">Hide</button>
            <button class="button is-small" v-else @click="visible = true">Show</button>
        </h4>

        <div class="field is-horizontal" v-if="instance.fields.name && instance.fields.name.value">
            <div class="field-label">
                <label class="is-family-code" :for="`lua-SearchForDataContainer-${instance.guid}`">
                    SearchForDataContainer
                </label>
            </div>

            <div class="field-body field has-addons">
                <input type="text" class="input control is-small is-family-code" readonly
                       :value="luaSearchForDataContainer(instance)"
                       :id="`lua-SearchForDataContainer-${instance.guid}`">
                <button class="button control is-small"
                        @click="copyToClipboard(luaSearchForDataContainer(instance))">
                    Copy
                </button>
            </div>
        </div>

        <div class="field is-horizontal">
            <div class="field-label">
                <label class="is-family-code" :for="`lua-FindInstanceByGuid-${instance.guid}`">
                    FindInstanceByGuid
                </label>
            </div>

            <div class="field-body field has-addons">
                <input type="text" class="input control is-small is-family-code" readonly
                       :value="luaFindInstanceByGuid(partition, instance)"
                       :id="`lua-FindInstanceByGuid-${instance.guid}`">
                <button class="button control is-small"
                        @click="copyToClipboard(luaFindInstanceByGuid(partition, instance))">
                    Copy
                </button>
            </div>
        </div>

        <div class="field is-horizontal">
            <div class="field-label">
                <label class="is-family-code" :for="`lua-FindInstance-${instance.guid}`">
                    FindInstance
                </label>
            </div>

            <div class="field-body field has-addons">
                <input type="text" class="input control is-small is-family-code" readonly
                       :value="luaFindInstance(instance)" :id="`lua-FindInstance-${instance.guid}`">
                <button class="button control is-small" @click="copyToClipboard(luaFindInstance(instance))">
                    Copy
                </button>
            </div>
        </div>

        <div class="table-container" v-if="visible">
            <table class="table is-bordered">
                <thead>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                    <th>Type</th>
                </tr>
                </thead>
                <tbody>
                <property v-for="field in instance.fields" :registry="registry" :partition="partition"
                          :field="field"></property>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import {copyToClipboard} from '../mixins/clipboard';

import Partition from '../ebx/Partition';
import Instance from '../ebx/Instance';
import GameRegistry from '../GameRegistry';

export default Vue.extend({
    name: 'Instance',
    mixins: [
        copyToClipboard,
    ],
    props: {
        registry: {
            type: Object as PropType<GameRegistry>,
            required: true,
        },
        partition: {
            type: Object as PropType<Partition>,
            required: true,
        },
        instance: {
            type: Object as PropType<Instance>,
            required: true,
        },
        active: String,
    },
    data() {
        return {
            visible: false,
        };
    },
    mounted() {
        if (location.hash && location.hash.substring(1) === this.instance.guid) {
            this.visible = true;
        }
    },
    watch: {
        active(guid) {
            if (guid === this.instance.guid) {
                this.visible = true;
            }
        },
    },
    methods: {
        luaFindInstanceByGuid(partition: Partition, instance: Instance) {
            return `${instance.type}(ResourceManager:FindInstanceByGuid(Guid('${partition.guid}'), Guid('${instance.guid}')))`;
        },
        luaSearchForDataContainer(instance: Instance) {
            return `${instance.type}(ResourceManager:SearchForDataContainer('${instance.fields.name.value}'))`;
        },
        luaFindInstance(instance: Instance) {
            return `${instance.type}(partition:FindInstance(Guid('${instance.guid}')))`;
        },
    },
});
</script>

<style lang="scss" scoped>

input[type=text].input {
  max-width: 20%;
}

</style>
