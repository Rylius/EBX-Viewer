<template>
    <div class="random-delay-node">
        <slot name="partition"></slot>

        <div class="delay columns">
            Delay {{ minDelay }}-{{ maxDelay }}s
        </div>

        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {Node} from 'rete';

import Instance from '../../ebx/Instance';

export default Vue.extend({
    name: 'RandomDelayNode',
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
        minDelay(): string {
            return `${this.instance.fields.minDelay.value}`;
        },
        maxDelay(): string {
            return `${this.instance.fields.maxDelay.value}`;
        },
    },
});
</script>

<style lang="scss" scoped>

$random-delay-node-width: 400px;

.random-delay-node {
  position: relative;
  min-width: $random-delay-node-width;

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
