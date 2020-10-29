<template>
    <table class="table">
        <tbody>
        <property v-for="value in field.value" :registry="registry" :partition="partition" :field="value"></property>
        </tbody>
    </table>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import GameRegistry from '../GameRegistry';
import Partition from '../ebx/Partition';
import Field from '../ebx/Field';

export default Vue.extend({
    name: 'ObjectProperty',
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
