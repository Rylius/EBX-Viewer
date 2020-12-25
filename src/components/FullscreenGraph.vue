<template>
    <div>
        <div v-if="partition" class="fullscreen-graph" :id="`fullscreen-graph-${partition.guid}`">
            <graph :partition="partition" :registry="registry"></graph>
        </div>
        <div v-else>
            Loading...
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Partition from '../ebx/Partition';

import Graph from './graph/Graph.vue';
import GameRegistry from '../GameRegistry';

export default Vue.extend({
    name: 'FullscreenGraph',
    props: [
        'game',
        'path',
    ],
    data(): {
        registry: GameRegistry;
        partition: Partition | null;
    } {
        return {
            registry: this.$registries[this.game],
            partition: null,
        };
    },
    mounted() {
        this.registry.resolveFile(this.path)
            .then(partition => this.partition = partition);
    },
    components: {
        Graph,
    },
});
</script>

<style lang="scss" scoped>

@import "/src/variables";

.fullscreen-graph {
  position: fixed;

  top: ($section-padding * 2) + 1.5rem;
  left: 0;
  width: 100%;
  height: 100%;
}

</style>
