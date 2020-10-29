<template>
    <reference :registry="registry" :reference="field.value"></reference>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import GameRegistry from '../GameRegistry';
import Partition from '../ebx/Partition';
import Field from '../ebx/Field';

export default Vue.extend({
    name: 'ReferenceProperty',
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
});
</script>
