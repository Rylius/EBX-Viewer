<template>
    <div>
        {{ assetId }}
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import GameRegistry from '../GameRegistry';
import Partition from '../ebx/Partition';
import Field from '../ebx/Field';

// Not super sure if that's the correct source
import assetHashes from '../../data/assetHashes.json';

export default Vue.extend({
    name: 'AntRefProperty',
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
            type: Object as PropType<Field<{ assetId: Field<number> }>>,
            required: true,
        },
    },
    computed: {
        assetId(): string {
            const assetId = this.field.value.assetId.value;
            const asset = (assetHashes as { [id: string]: string })[`${assetId}`];
            if (assetId < 0 || !asset) {
                return `${assetId}`;
            }

            return `${assetId}: ${asset}`;
        },
    },
});
</script>
