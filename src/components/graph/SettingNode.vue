<template>
    <div class="setting-node">
        <slot name="partition"></slot>

        <div class="setting columns">
            <span class="is-family-code">{{ setting }}</span>
        </div>

        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {Node} from 'rete';

import Instance from '../../ebx/Instance';

export default Vue.extend({
    name: 'SettingNode',
    props: {
        node: {
            type: Object as PropType<Node>,
            required: true,
        },
        instance: {
            type: Object as PropType<Instance>,
            required: true,
        },
    },
    computed: {
        setting(): string {
            return this.instance.fields.boolSettingName.value || this.instance.fields.intSettingName.value || this.instance.fields.floatSettingName.value;
        },
    },
});
</script>

<style lang="scss" scoped>

$setting-node-width: 800px;

.setting-node {
  position: relative;
  min-width: $setting-node-width;

  .setting {
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    left: 0;
    top: 0;

    margin: 0;

    width: 100%;
    height: 100%;

    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }
}

</style>
