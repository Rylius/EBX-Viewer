<template>
    <span>
        <template v-if="instance">
            <template v-if="link">
                <router-link :to="`/view/${registry.game}/${instance.partition.file}.json#${instance.guid}`">
                    &rarr;
                    {{ instance.type }}
                    <instance-identifier :registry="registry" :instance="instance"
                                         :reference-links="link"></instance-identifier>
                </router-link>
            </template>
            <template v-else>
                <instance-identifier :registry="registry" :instance="instance"
                                     :reference-links="link"></instance-identifier>
            </template>
        </template>
        <template v-else>
            &rarr; {{ reference.partitionGuid }} / {{ reference.instanceGuid }}
        </template>

        <template v-if="loading">
            (loading)
        </template>
    </span>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import TypeDocumentationLink from './TypeDocumentationLink.vue';
import Reference from '../ebx/Reference';
import GameRegistry from '../GameRegistry';
import Instance from '../ebx/Instance';

export default Vue.extend({
    name: 'Reference',
    props: {
        registry: {
            type: Object as PropType<GameRegistry>,
            required: true,
        },
        reference: {
            type: Object as PropType<Reference>,
            required: true,
        },
        link: {
            type: Boolean,
            default: () => true,
        },
    },
    data(): { loading: boolean, instance: Instance | null } {
        return {
            loading: true,
            instance: null,
        };
    },
    async mounted() {
        let partition;
        try {
            partition = await this.registry.resolve(this.reference.partitionGuid);
        } catch (err) {
            console.warn(`Failed to resolve reference ${(this.reference.partitionGuid)}/${this.reference.instanceGuid}`, err);
            return;
        } finally {
            this.loading = false;
        }

        this.instance = partition.instances[this.reference.instanceGuid];
    },
    components: {
        TypeDocumentationLink,
    },
});
</script>
