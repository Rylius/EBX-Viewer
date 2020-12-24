<template>
    <span>
        <template v-if="instance.fields.name">
            {{ instance.fields.name.value }}
        </template>
        <template v-else-if="instance.fields.nameHash">
            {{ resolveEvent(instance.fields.nameHash.value) }}
        </template>
        <template v-else-if="instance.fields.resourceName">
            {{ instance.fields.resourceName.value }}
        </template>
        <template v-else-if="instance.fields.instanceName">
            {{ instance.fields.instanceName.value }}
        </template>
        <template v-else-if="instance.fields.bundleName">
            {{ instance.fields.bundleName.value }}
        </template>

        <template v-if="instance.fields.blueprint && instance.fields.blueprint.value">
            <reference :registry="registry" :reference="instance.fields.blueprint.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.physicsBlueprint && instance.fields.physicsBlueprint.value">
            <reference :registry="registry" :reference="instance.fields.physicsBlueprint.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.mesh && instance.fields.mesh.value">
            <reference :registry="registry" :reference="instance.fields.mesh.value" :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.effect && instance.fields.effect.value">
            <reference :registry="registry" :reference="instance.fields.effect.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.camera && instance.fields.camera.value">
            <reference :registry="registry" :reference="instance.fields.camera.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.emitter && instance.fields.emitter.value">
            <reference :registry="registry" :reference="instance.fields.emitter.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.sound && instance.fields.sound.value">
            <reference :registry="registry" :reference="instance.fields.sound.value" :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.wave && instance.fields.wave.value">
            <reference :registry="registry" :reference="instance.fields.wave.value" :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.unlockAsset && instance.fields.unlockAsset.value">
            <reference :registry="registry" :reference="instance.fields.unlockAsset.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.visualEnvironment && instance.fields.visualEnvironment.value">
            <reference :registry="registry" :reference="instance.fields.visualEnvironment.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.enlightenData && instance.fields.enlightenData.value">
            <reference :registry="registry" :reference="instance.fields.enlightenData.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.asset && instance.fields.asset.value">
            <reference :registry="registry" :reference="instance.fields.asset.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.shaderInstance && instance.fields.shaderInstance.value">
            <reference :registry="registry" :reference="instance.fields.shaderInstance.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.shader && instance.fields.shader.value">
            <template v-if="instance.fields.shader.value.partitionGuid && instance.fields.shader.value.instanceGuid">
                <reference :registry="registry" :reference="instance.fields.shader.value"
                           :link="referenceLinks"></reference>
            </template>
            <template v-else-if="instance.fields.shader.value.shader.value">
                <!-- SurfaceShaderInstanceDataStruct is nested -->
                <reference :registry="registry" :reference="instance.fields.shader.value.shader.value"
                           :link="referenceLinks"></reference>
            </template>
        </template>
        <template v-else-if="instance.fields.graphAsset && instance.fields.graphAsset.value">
            <reference :registry="registry" :reference="instance.fields.graphAsset.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.voEvent && instance.fields.voEvent.value">
            <reference :registry="registry" :reference="instance.fields.voEvent.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.customizeSoldierData && instance.fields.customizeSoldierData.value">
            <reference :registry="registry" :reference="instance.fields.customizeSoldierData.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.event && instance.fields.event.value">
            <reference :registry="registry" :reference="instance.fields.event.value" :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.skeletonAsset && instance.fields.skeletonAsset.value">
            <reference :registry="registry" :reference="instance.fields.skeletonAsset.value"
                       :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.mixer && instance.fields.mixer.value">
            <reference :registry="registry" :reference="instance.fields.mixer.value" :link="referenceLinks"></reference>
        </template>
        <template v-else-if="instance.fields.impulseResponse && instance.fields.impulseResponse.value">
            <reference :registry="registry" :reference="instance.fields.impulseResponse.value"
                       :link="referenceLinks"></reference>
        </template>

        <template v-if="instance.fields.team && typeof instance.fields.team.value !== 'object'">
            ({{ instance.fields.team.enumValue || instance.fields.team.value }})
        </template>
        <template v-else-if="instance.fields.teamId">
            ({{ instance.fields.teamId.enumValue || instance.fields.teamId.value }})
        </template>
        <template v-else-if="instance.fields.id">
            ({{ instance.fields.id.enumValue || resolveEvent(instance.fields.id.value) }})
        </template>
        <template v-else-if="instance.fields.rigidBodyType">
            ({{ instance.fields.rigidBodyType.enumValue || instance.fields.rigidBodyType.value }})
        </template>
        <template v-else-if="instance.fields.poseType">
            ({{ instance.fields.poseType.enumValue || instance.fields.poseType.value }})
        </template>
        <template v-else-if="instance.fields.text">
            {{ instance.fields.text.value }}
        </template>
        <template v-else-if="instance.fields.sid">
            {{ instance.fields.sid.value }}
        </template>
        <template v-else-if="instance.fields.damageGiverName">
            {{ instance.fields.damageGiverName.value }}
        </template>
        <template v-else-if="instance.fields.messageSid">
            {{ instance.fields.messageSid.value }}
        </template>
        <template v-else-if="instance.fields.boneName">
            {{ instance.fields.boneName.value }}
        </template>
        <template v-else-if="instance.fields.emote">
            ({{ instance.fields.emote.enumValue || instance.fields.emote.value }})
        </template>
    </span>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import events from '../../data/eventHashes.json';

import GameRegistry from '../GameRegistry';
import Instance from '../ebx/Instance';

export default Vue.extend({
    name: 'InstanceIdentifier',
    props: {
        registry: {
            type: Object as PropType<GameRegistry>,
            required: true,
        },
        instance: {
            type: Object as PropType<Instance>,
            required: true,
        },
        referenceLinks: {
            type: Boolean,
            default: () => true,
        },
    },
    methods: {
        resolveEvent(hash: string): string {
            return (events as { [hash: string]: string })[hash] || hash;
        },
    },
});
</script>
