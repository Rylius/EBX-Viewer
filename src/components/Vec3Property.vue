<template>
    <div class="field-body">
        <label class="field has-addons x">
            <span class="control button is-small is-static">X</span>
            <input type="text" readonly :value="field.value.x" class="input is-small">
        </label>
        <label class="field has-addons y">
            <span class="control button is-small is-static">Y</span>
            <input type="text" readonly :value="field.value.y" class="input is-small y">
        </label>
        <label class="field has-addons z">
            <span class="control button is-small is-static">Z</span>
            <input type="text" readonly :value="field.value.z" class="input is-small z">
        </label>

        <span class="field is-narrow">
            <button class="button is-small"
                    @click="copyToClipboard(`Vec3(${field.value.x}, ${field.value.y}, ${field.value.z})`)">
                Copy
            </button>
        </span>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {copyToClipboard} from '../mixins/clipboard';
import GameRegistry from '../GameRegistry';
import Partition from '../ebx/Partition';
import Field from '../ebx/Field';

export default Vue.extend({
    name: 'Vec3Property',
    mixins: [
        copyToClipboard,
    ],
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

<style lang="scss" scoped>

.field-body {
  flex-grow: 9;
}

.x {
  input, .button {
    background-color: #3e0000;
  }
}

.y {
  input, .button {
    background-color: #193c00;
  }
}

.z {
  input, .button {
    background-color: #00274f;
  }
}

</style>
