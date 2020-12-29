<template>
    <div class="node content"
         :class="[selected(), `type-${instance.type}`, foreignPartition ? 'foreign-partition': '']">
        <component :is="nodeComponent" :node="node" :instance="instance">
            <template v-slot:partition>
                <p v-if="foreignPartition">
                    <a :href="`/view/${node.data.registry.game}/${partition.file}.json`" target="_blank">
                        {{ partition.name }}
                    </a>
                </p>
            </template>
            <template v-slot:type>
                <h3>
                    {{ instance.type }}
                    <template v-if="node.data.usage === 'target'">
                        (outputs)
                    </template>
                    <template v-else-if="node.data.usage === 'source'">
                        (inputs)
                    </template>
                    <br>
                    <instance-identifier :registry="node.data.registry" :instance="instance"
                                         :reference-links="false"></instance-identifier>
                </h3>
            </template>

            <div class="columns">
                <ul class="column is-half">
                    <li v-for="input in inputs()">
                        <socket :input="input" :socket="input.socket" :node="node"
                                :bind-socket="bindSocket" :bind-control="bindControl"></socket>
                    </li>
                </ul>

                <ul class="column has-text-right">
                    <li v-for="output in outputs()">
                        <socket :output="output" :socket="output.socket" :node="node"
                                :bind-socket="bindSocket" :bind-control="bindControl"></socket>
                    </li>
                </ul>
            </div>
        </component>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {Node} from 'rete';
// @ts-ignore
import VueRenderPlugin from '../../../lib/rete/vue-render-plugin.common';

import Partition from '../../ebx/Partition';
import Instance from '../../ebx/Instance';

import DefaultNode from './DefaultNode.vue';
import SimpleValueNode from './SimpleValueNode.vue';
import Socket from './Socket.vue';
import CompareNode from './CompareNode.vue';
import LogicNode from './LogicNode.vue';
import MathOpNode from './MathOpNode.vue';
import SettingNode from './SettingNode.vue';

const simpleValueTypes = [
    'BoolEntityData',
    'IntEntityData',
    'FloatEntityData',
];

const logicTypes = [
    'NotEntityData',
    'AndEntityData',
    'OrEntityData',
    'Or4EntityData',
];

export default Vue.extend({
    name: 'InstanceNode',
    mixins: [
        VueRenderPlugin.mixin,
    ],
    props: {
        node: {
            type: Object as PropType<Node>,
            required: true,
        },
    },
    computed: {
        partition(): Partition {
            return this.instance.partition;
        },
        instance(): Instance {
            return this.node.data.instance as Instance;
        },
        nodeComponent() {
            if (simpleValueTypes.indexOf(this.instance.type) >= 0) {
                return SimpleValueNode;
            } else if (this.instance.type === 'CompareEntityData') {
                return CompareNode;
            } else if (this.instance.type === 'MathOpEntityData') {
                return MathOpNode;
            } else if (this.instance.type === 'SettingEntityData') {
                return SettingNode;
            } else if (logicTypes.indexOf(this.instance.type) >= 0) {
                return LogicNode;
            }

            return DefaultNode;
        },
        foreignPartition(): boolean {
            return this.partition !== this.node.data.sourcePartition;
        },
    },
    components: {
        Socket,
    },
});
</script>

<style lang="scss">

.node {
  h3, h3:not(:first-child) {
    margin-top: 0;
    font-weight: bold;
  }
}

</style>

<style lang="scss" scoped>
@import "/src/variables";

.node {
  position: relative;

  border: 3px solid $node-border-color;
  padding: 1em;

  border-radius: 1em;
  background-color: $node-background-color;

  box-shadow: change-color($node-border-color, $alpha: 0.5) 0 0 10px 10px;

  ul {
    list-style: none;
    margin: 0;
  }

  &.type-InterfaceDescriptorData {
    background-color: $node-type-interface-descriptor-data-color;
    border-color: darken($node-type-interface-descriptor-data-color, 10%);

    &.selected {
      background-color: lighten($node-type-interface-descriptor-data-color, 10%);
    }
  }

  &.foreign-partition {
    background-color: $node-foreign-partition-color;
    border-color: darken($node-foreign-partition-color, 10%);

    &.selected {
      background-color: lighten($node-foreign-partition-color, 10%);
    }
  }

  &.selected {
    background-color: lighten(#414141, 5%);
  }

}

</style>
