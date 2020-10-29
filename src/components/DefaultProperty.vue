<template>
    <div>
        <div class="is-family-code">
            <template v-if="eventId">
                {{ field.value }}: {{ eventId }}
            </template>
            <template v-else-if="interfaceId">
                {{ field.value }}: {{ interfaceId }}
            </template>
            <template v-else-if="field.isEnum()">
                <span class="has-text-grey">{{ field.type }}.</span>{{ field.enumValue }}
            </template>
            <template v-else>
                {{ field.value }}
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import interfaceIds from '../../data/interfaceIDs.json';
import events from '../../data/eventHashes.json';

import Partition from '../ebx/Partition';
import Field from '../ebx/Field';
import GameRegistry from '../GameRegistry';

export default Vue.extend({
    name: 'DefaultProperty',
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
        eventId(): string | null {
            if (!this.field.value) {
                return null;
            }

            return (events as { [hash: string]: string })[this.field.value];
        },
        interfaceId(): string | null {
            if (!this.field.value) {
                return null;
            }

            return (interfaceIds as { [hash: string]: string })[this.field.value];
        },
    },
});
</script>
