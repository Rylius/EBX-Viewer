<template>
    <div>
        <div v-if="partition">
            <h2 class="title">
                Partition {{ partition.guid }}
            </h2>

            <a :href="directoryUrl">
                View Directory
            </a>
            or
            <a :href="fileUrl">
                View Raw File
            </a>

            <div v-if="partition.primaryInstance">
                <h3 class="subtitle">
                    Hierarchy
                </h3>
                <div class="content">
                    <ul>
                        <li>
                            <hierarchy-entry :registry="registry" :instance="partition.primaryInstance"></hierarchy-entry>
                        </li>
                    </ul>
                </div>
            </div>

            <div v-show="graphVisible">
                <h3 class="subtitle">
                    Graph
                </h3>
                <div class="content graph">
                    <graph :partition="partition" :registry="registry" @nodes-changed="graphNodesChanged"></graph>
                </div>
            </div>

            <h3 class="subtitle">
                Instances
            </h3>

            <ul class="content">
                <li v-for="instance in partition.instances">
                    <instance :key="instance.guid" :registry="registry"
                              :partition="partition" :instance="instance"
                              :active="activeInstance"></instance>
                </li>
            </ul>
        </div>
        <div v-else>
            Loading...
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Partition from '../ebx/Partition';
import Instance from '../ebx/Instance';

import HierarchyEntry from './HierarchyEntry.vue';
import Graph from './graph/Graph.vue';
import GameRegistry from '../GameRegistry';

export default Vue.extend({
    name: 'Partition',
    props: [
        'game',
        'path',
        'guid',
    ],
    data(): {
        registry: GameRegistry;
        partition: Partition | null;
        activeInstance: string;
        types: { [type: string]: any };
        graphVisible: boolean;
    } {
        return {
            registry: this.$registries[this.game],
            partition: null,
            activeInstance: '',
            types: {},
            graphVisible: true,
        };
    },
    computed: {
        fileUrl(): string {
            return `/${this.game}/ebx/${this.path}.json`;
        },
        directoryUrl(): string {
            const parts = this.path.split('/');
            parts.pop();
            return `https://github.com/EmulatorNexus/Venice-EBX/tree/master/${parts.join('/')}`;
        },
    },
    mounted() {
        this.registry.resolveFile(this.path)
            .then(partition => this.partition = partition)
            .then(() => {
                if (this.partition && Object.keys(this.partition.instances).length == 1 && this.activeInstance === '') {
                    this.activeInstance = this.partition.instances[Object.keys(this.partition.instances)[0]].guid;
                }

                if (!location.hash) {
                    return;
                }

                const el = document.getElementById(location.hash.substring(1));
                if (!el) {
                    return;
                }

                const rect = el.getBoundingClientRect();
                scrollTo(0, rect.top);
            });
    },
    watch: {
        $route(to) {
            if (to.hash) {
                this.activeInstance = to.hash.substring(1);
            } else {
                this.activeInstance = '';
            }
        },
    },
    methods: {
        copyToClipboard(text: string) {
            navigator.clipboard.writeText(text);
        },
        luaFindInstanceByGuid(partition: Partition, instance: Instance): string {
            return `${instance.type}(ResourceManager:FindInstanceByGuid(Guid('${partition.guid}'), Guid('${instance.guid}')))`;
        },
        luaSearchForInstanceByGuid(instance: Instance): string {
            return `${instance.type}(ResourceManager:SearchForInstanceByGuid(Guid('${instance.guid}')))`;
        },
        graphNodesChanged(nodes: Array<any>): void {
            this.graphVisible = nodes.length > 0;
        },
    },
    components: {
        HierarchyEntry,
        Graph,
    },
});
</script>

<style lang="scss" scoped>

.graph {
  width: 100%;
  min-height: 85vh;
}

</style>
