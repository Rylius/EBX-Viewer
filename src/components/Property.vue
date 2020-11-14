<template>
    <tr>
        <td class="is-family-code is-narrow">
            {{ field.name }}
        </td>

        <template v-if="field.value === null">
            <td class="is-family-code">
                nil
            </td>
        </template>
        <td v-else>
            <component :is="propertyComponent" :registry="registry" :partition="partition" :field="field"></component>
        </td>

        <td class="is-narrow">
            <type-documentation-link :field="field"></type-documentation-link>
        </td>
    </tr>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import GameRegistry from '../GameRegistry';
import Partition from '../ebx/Partition';
import Field from '../ebx/Field';

import DefaultProperty from './DefaultProperty.vue';
import Vec3Property from './Vec3Property.vue';
import Vec4Property from './Vec4Property.vue';
import LinearTransformProperty from './LinearTransformProperty.vue';
import ArrayProperty from './ArrayProperty.vue';
import ReferenceProperty from './ReferenceProperty.vue';
import ObjectProperty from './ObjectProperty.vue';
import AntRefProperty from './AntRefProperty.vue';

export default Vue.extend({
    name: 'Property',
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
        propertyComponent() {
            if (Array.isArray(this.field.value)) {
                return ArrayProperty;
            } else if (this.field.isReference()) {
                return ReferenceProperty;
            }

            switch (this.field.type) {
                case 'Vec3':
                    return Vec3Property;
                case 'Vec4':
                    return Vec4Property;
                case 'LinearTransform':
                    return LinearTransformProperty;
                case 'AntRef':
                    return AntRefProperty;
                default:
                    break;
            }

            if (typeof this.field.value === 'object') {
                return ObjectProperty;
            }

            return DefaultProperty;
        },
    },
    components: {
        DefaultProperty,
        ObjectProperty,
        ReferenceProperty,
        ArrayProperty,
        Vec3Property,
        Vec4Property,
        LinearTransformProperty,
    },
});
</script>
