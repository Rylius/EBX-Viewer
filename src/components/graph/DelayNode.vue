<template>
    <div class="delay-node">
        <slot name="partition"></slot>

        <div class="delay columns">
            Delay {{ delay }}s
        </div>

        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {Node} from 'rete';

import Instance from '../../ebx/Instance';

export default Vue.extend({
    name: 'DelayNode',
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
        delay(): string {
            return `${this.instance.fields.delay.value}`;
        },
    },
});
</script>

<style lang="scss" scoped>

$delay-node-width: 400px;

.delay-node {
  position: relative;
  min-width: $delay-node-width;

  .delay {
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
