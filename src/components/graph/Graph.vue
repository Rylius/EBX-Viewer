<template>
    <div class="graph-container">
        <div class="m-1">
            <button class="button is-small" @click="layout">Arrange</button>
        </div>

        <div class="graph" :id="elementId"></div>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import Rete, {Input, Node, NodeEditor, Output, Socket} from 'rete';
import {ConnectionView} from 'rete/types/view/connection';
// Let's just say Rete's packaging is a mess and we're saving us a whole lot of trouble by doing this
// @ts-ignore
import ConnectionPlugin from '../../../lib/rete/connection-plugin.common';
// @ts-ignore
import VueRenderPlugin from '../../../lib/rete/vue-render-plugin.common';

import cytoscape from 'cytoscape';
// @ts-ignore
import dagre from 'cytoscape-dagre';
// @ts-ignore
import klay from 'cytoscape-klay';

import Partition from '../../ebx/Partition';

import InstanceComponent from './InstanceComponent';

import events from '../../../data/eventHashes.json';
import interfaceIds from '../../../data/interfaceIDs.json';
import Field from '../../ebx/Field';
import Instance from '../../ebx/Instance';
import GameRegistry from '../../GameRegistry';
import Reference from '../../ebx/Reference';

export default Vue.extend({
    name: 'Graph',
    props: {
        partition: {
            type: Object as PropType<Partition>,
            required: true,
        },
        registry: {
            type: Object as PropType<GameRegistry>,
            required: true,
        },
    },
    data(): {
        visible: boolean;
        cy: cytoscape.Core | null;
        editor: NodeEditor | null;
        sockets: { [name: string]: Socket },
        instanceNodes: { [guid: string]: Node; },
        instanceInputs: { [guid: string]: { [key: string]: Input }; },
        instanceOutputs: { [guid: string]: { [key: string]: Output }; },
        queuedConnections: Array<{ output: Output, input: Input }>,
        selectedNodes: Array<Node>,
    } {
        return {
            visible: true,
            cy: null,
            editor: null,
            sockets: {
                event: new Socket('event'),
                link: new Socket('link'),
                property: new Socket('property'),
            },
            instanceNodes: {},
            instanceInputs: {},
            instanceOutputs: {},
            queuedConnections: [],
            selectedNodes: [],
        };
    },
    computed: {
        elementId() {
            return `graph-${this.partition.guid}`;
        },
    },
    async mounted() {
        const editorElement = document.getElementById(this.elementId);
        if (!editorElement) {
            throw new Error(`Failed to find editor element with ID '${this.elementId}'`);
        }

        cytoscape.use(dagre);
        cytoscape.use(klay);

        const cy = cytoscape({
            headless: true,
        });
        this.cy = cy;

        const editor = new Rete.NodeEditor(`ebx-graph-viewer@1.0.0`, editorElement);
        this.editor = editor;

        editor.use(ConnectionPlugin);
        editor.use(VueRenderPlugin);

        // Do not allow modification of connections
        // @ts-ignore
        editor.on('connectionpick', () => false);

        editor.register(new InstanceComponent({partition: this.partition}));

        for (const instance of Object.values(this.partition.instances)) {
            if (instance.fields.descriptor && instance.fields.descriptor.value) {
                try {
                    await this.createInterfaceDescriptor(instance.fields.descriptor.value);
                } catch (err) {
                    console.warn(`Failed to create interface descriptor`, err);
                }
            }

            if (instance.fields.eventConnections) {
                for (const eventConnection of instance.fields.eventConnections.value) {
                    try {
                        if (!eventConnection.value.source.value || !eventConnection.value.target.value) {
                            console.warn('Event connection without target or source', eventConnection);
                            continue;
                        }
                        await this.createEventConnection(eventConnection);
                    } catch (err) {
                        console.warn(`Failed to create event connection`, err);
                    }
                }
            }
            if (instance.fields.propertyConnections) {
                for (const propertyConnection of instance.fields.propertyConnections.value) {
                    try {
                        if (!propertyConnection.value.source.value || !propertyConnection.value.target.value) {
                            console.warn('Property connection without target or source', propertyConnection);
                            continue;
                        }
                        await this.createPropertyConnection(propertyConnection);
                    } catch (err) {
                        console.warn(`Failed to create property connection`, err);
                    }
                }
            }
            if (instance.fields.linkConnections) {
                for (const linkConnection of instance.fields.linkConnections.value) {
                    try {
                        if (!linkConnection.value.source.value || !linkConnection.value.target.value) {
                            console.warn('Link connection without target or source', linkConnection);
                            continue;
                        }
                        await this.createLinkConnection(linkConnection);
                    } catch (err) {
                        console.warn(`Failed to create link connection`, err);
                    }
                }
            }
        }

        // We need to wait for the socket elements to be created
        setTimeout(() => {
            this.queuedConnections.forEach(({output, input}) => {
                editor.connect(output, input);
                cy.add({
                    group: 'edges',
                    data: {
                        id: `${output.key}-to-${input.key}`,
                        source: output.node?.data.id as string,
                        target: input.node?.data.id as string,
                    },
                });
            });

            setTimeout(() => this.layout(), 0);
        }, 0);

        if (this.partition.primaryInstance) {
            const node = this.instanceNodes[this.partition.primaryInstance.guid];
            if (node) {
                editor.selectNode(node);
            } else if (editor.nodes.length) {
                editor.selectNode(editor.nodes[0]);
            }
        }

        const findNodeConnections = (node: Node) => ((node.getConnections()
            .map(connection => editor.view.connections.get(connection))
            .filter(view => view) as Array<ConnectionView>)
            .map(view => view.el.querySelector('.connection'))
            .filter(el => el) as Array<SVGElement>);

        editor.on('selectnode', ({node, accumulate}) => {
            if (!accumulate) {
                this.selectedNodes.forEach(selectedNode => findNodeConnections(selectedNode).forEach(svg => svg.classList.remove('selected')));
                this.selectedNodes.length = 0;
            }

            if (this.selectedNodes.includes(node)) {
                return;
            }

            findNodeConnections(node).forEach(svg => svg.classList.add('selected'));

            this.selectedNodes.push(node);
        });

        this.$emit('nodes-changed', editor.nodes);
    },
    methods: {
        layout() {
            if (!this.editor || !this.cy) {
                throw new Error('Cannot update layout without editor or cytoscape core');
            }

            const self = this;
            const cy = this.cy;
            const editor = this.editor;

            console.log('Calculating node layout...');
            cy.layout({
                // name: 'dagre',
                name: 'klay',
                animate: false,
                fit: false,
                // @ts-ignore added by cytoscape-klay
                transform(node: cytoscape.NodeSingular, pos: cytoscape.Position) {
                    return {x: pos.x / 2, y: pos.y / 5};
                },

                // dagre
                rankDir: 'LR',
                ranker: 'longest-path',
                padding: 50,
                spacingFactor: 1.5,

                klay: {
                    compactComponents: true,
                    // cycleBreaking: 'INTERACTIVE',
                    direction: 'RIGHT',
                    edgeRouting: 'ORTHOGONAL',
                    edgeSpacingFactor: 0.25,
                    feedbackEdges: true,
                    fixedAlignment: 'BALANCED',
                    inLayerSpacingFactor: 2,
                    layoutHierarchy: true,
                    linearSegmentsDeflectionDampening: 0.9,
                    nodePlacement: 'LINEAR_SEGMENTS',
                    routeSelfLoopInside: true,
                    spacing: 600 + 100, // width of nodes plus padding
                    // thoroughness: 50,
                },

                stop() {
                    console.log('Applying node layout...');
                    cy.nodes().forEach((element: cytoscape.NodeSingular) => {
                        const node = self.instanceNodes[element.id()];
                        const pos = element.position();

                        editor.view.nodes.get(node)?.translate(pos.x, pos.y);
                        editor.view.updateConnections({node});
                    });
                    console.log('Layout updated');
                },
            }).run();
        },

        createNode(instance: Instance, id: string, usage: string | null): Node {
            if (!this.editor || !this.cy) {
                throw new Error('Cannot create nodes without editor or cytoscape core');
            }

            const node = new Node('instance');
            node.data.id = id;
            node.data.usage = usage;
            node.data.instance = instance;
            node.data.sourcePartition = this.partition;
            node.data.registry = this.registry;
            this.instanceNodes[id] = node;
            this.instanceInputs[id] = {};
            this.instanceOutputs[id] = {};
            this.editor.addNode(node);

            this.cy.add({group: 'nodes', data: {id, label: instance.type}});

            return node;
        },

        async resolveInstance(reference: Reference): Promise<Instance> {
            const partition = await this.registry.resolve(reference.partitionGuid);
            const instance = partition.instances[reference.instanceGuid];
            if (!instance) {
                throw new Error(`Failed to find instance ${reference.instanceGuid} in partition ${reference.partitionGuid}`);
            }

            return instance;
        },

        prepareNode(instance: Instance, usage: 'source' | 'target'): Node {
            let id = instance.guid;
            let nodeUsage: string | null = null;
            if (instance.type === 'InterfaceDescriptorData') {
                // Split interface descriptors into two separate nodes

                if (usage === 'source') {
                    id += '-inputs';
                } else if (usage === 'target') {
                    id += '-outputs';
                }

                nodeUsage = usage;
            }

            const node = this.instanceNodes[id];
            if (node) {
                return node;
            }

            return this.createNode(instance, id, nodeUsage);
        },

        prepareOutput(node: Node, key: string, title: string, socket: Socket): Output {
            const nodeId = node.data.id as string;
            let output = this.instanceOutputs[nodeId][key];
            if (!output) {
                output = new Rete.Output(key, title, socket, true);
                this.instanceOutputs[nodeId][key] = output;
                node.addOutput(output);
            }

            return output;
        },

        prepareInput(node: Node, key: string, title: string, socket: Socket): Input {
            const nodeId = node.data.id as string;
            let input = this.instanceInputs[nodeId][key];
            if (!input) {
                input = new Rete.Input(key, title, socket, true);
                this.instanceInputs[nodeId][key] = input;
                node.addInput(input);
            }

            return input;
        },

        connect(output: Output, input: Input): void {
            this.queuedConnections.push({output, input});
        },

        async createInterfaceDescriptor(reference: Reference): Promise<void> {
            const instance = await this.resolveInstance(reference);
            if (instance.type !== 'InterfaceDescriptorData') {
                throw new Error(`Invalid interface descriptor type '${instance.type}'`);
            }

            const inputsNode = this.prepareNode(instance, 'source');
            const outputsNode = this.prepareNode(instance, 'target');

            for (const inputEvent of instance.fields.inputEvents.value) {
                const eventId = inputEvent.value.id.value;
                const key = `event-output-${instance.guid}-${eventId}`;
                this.prepareOutput(inputsNode, key, `${this.resolveHash(eventId)}`, this.sockets.event);
            }

            for (const outputEvent of instance.fields.outputEvents.value) {
                const eventId = outputEvent.value.id.value;
                const key = `event-input-${instance.guid}-${eventId}`;
                this.prepareInput(outputsNode, key, `${this.resolveHash(eventId)}`, this.sockets.event);
            }

            for (const inputLink of instance.fields.inputLinks.value) {
                const fieldId = inputLink.value.id.value;
                const key = `link-input-${instance.guid}-${fieldId}`;
                this.prepareInput(outputsNode, key, `${this.resolveHash(fieldId)}`, this.sockets.link);
            }

            for (const outputLink of instance.fields.outputLinks.value) {
                const fieldId = outputLink.value.id.value;
                const key = `link-output-${instance.guid}-${fieldId}`;
                this.prepareOutput(inputsNode, key, `${this.resolveHash(fieldId)}`, this.sockets.link);
            }

            for (const field of instance.fields.fields.value) {
                const fieldId = field.value.id.value;
                const sourceAndTarget = field.value.accessType.enumValue === 'FieldAccessType_SourceAndTarget';
                const source = field.value.accessType.enumValue === 'FieldAccessType_Source' || sourceAndTarget;
                const target = field.value.accessType.enumValue === 'FieldAccessType_Target' || sourceAndTarget;
                const resolvedFieldHash = this.resolveHash(fieldId);
                if (target) {
                    const value = (interfaceIds as { [hash: string]: string; })[fieldId];
                    const title = value ? `${value} - ${resolvedFieldHash}` : `${resolvedFieldHash}`;
                    this.prepareOutput(inputsNode, `property-output-${instance.guid}-${fieldId}`, title, this.sockets.property);
                }
                if (source) {
                    this.prepareInput(outputsNode, `property-input-${instance.guid}-${fieldId}`, `${resolvedFieldHash}`, this.sockets.property);
                }
                if (!source && !target) {
                    console.warn('Unhandled interface descriptor field', field.value);
                }
            }
        },

        async createEventConnection(eventConnection: Field<any>): Promise<void> {
            const sourceInstance = await this.resolveInstance(eventConnection.value.source.value);
            const sourceNode = this.prepareNode(sourceInstance, 'source');
            const sourceEvent = eventConnection.value.sourceEvent.value.id.value;
            const sourceKey = `event-output-${sourceInstance.guid}-${sourceEvent}`;
            const output = this.prepareOutput(sourceNode, sourceKey, `${this.resolveHash(sourceEvent)}`, this.sockets.event);

            const targetInstance = await this.resolveInstance(eventConnection.value.target.value);
            const targetNode = this.prepareNode(targetInstance, 'target');
            const targetEvent = eventConnection.value.targetEvent.value.id.value;
            const targetKey = `event-input-${targetInstance.guid}-${targetEvent}`;
            const input = this.prepareInput(targetNode, targetKey, `${this.resolveHash(targetEvent)}`, this.sockets.event);

            this.connect(output, input);
        },

        async createPropertyConnection(propertyConnection: Field<any>): Promise<void> {
            const sourceInstance = await this.resolveInstance(propertyConnection.value.source.value);
            const sourceNode = this.prepareNode(sourceInstance, 'source');
            const sourceField = propertyConnection.value.sourceFieldId.value;
            const sourceKey = `property-output-${sourceInstance.guid}-${sourceField}`;
            const output = this.prepareOutput(sourceNode, sourceKey, `${this.resolveHash(sourceField)}`, this.sockets.property);

            const targetInstance = await this.resolveInstance(propertyConnection.value.target.value);
            const targetNode = this.prepareNode(targetInstance, 'target');
            const targetField = propertyConnection.value.targetFieldId.value;
            const targetKey = `property-input-${targetInstance.guid}-${targetField}`;
            const input = this.prepareInput(targetNode, targetKey, `${this.resolveHash(targetField)}`, this.sockets.property);

            this.connect(output, input);
        },

        async createLinkConnection(linkConnection: Field<any>): Promise<void> {
            // We're reversing the direction of link connections, so mapping source to target is correct here

            const sourceInstance = await this.resolveInstance(linkConnection.value.source.value);
            const sourceNode = this.prepareNode(sourceInstance, 'target');
            const sourceField = linkConnection.value.sourceFieldId.value;
            const sourceKey = `link-input-${sourceInstance.guid}-${sourceField}`;
            const input = this.prepareInput(sourceNode, sourceKey, `${this.resolveHash(sourceField)}`, this.sockets.link);

            const targetInstance = await this.resolveInstance(linkConnection.value.target.value);
            const targetNode = this.prepareNode(targetInstance, 'source');
            const targetField = linkConnection.value.targetFieldId.value;
            const targetKey = `link-output-${targetInstance.guid}-${targetField}`;
            const output = this.prepareOutput(targetNode, targetKey, `${this.resolveHash(targetField)}`, this.sockets.link);

            this.connect(output, input);
        },

        resolveHash(hash: string): string {
            return (events as { [hash: string]: string; })[hash] || hash;
        },

    },
});
</script>

<style lang="scss">

@import "/src/variables";

.graph-container {
  width: 100%;
  height: 100%
}

.graph {
  width: 100%;
  height: 100%;;
  position: absolute;

  background-color: $graph-background-color;

  .connection {
    .main-path {
      stroke: $connection-color;
    }

    &.socket-input-event, &.socket-output-event {
      .main-path {
        stroke: $connection-event-color;
      }
    }

    &.socket-input-property, &.socket-output-property {
      .main-path {
        stroke: $connection-property-color;
      }
    }

    &.socket-input-link, &.socket-output-link {
      .main-path {
        stroke: $connection-link-color;
      }
    }

    &.selected {
      .main-path {
        stroke: lighten($connection-color, 50%);
      }

      &.socket-input-event, &.socket-output-event {
        .main-path {
          stroke: lighten($connection-event-color, 50%);
        }
      }

      &.socket-input-property, &.socket-output-property {
        .main-path {
          stroke: lighten($connection-property-color, 50%);
        }
      }

      &.socket-input-link, &.socket-output-link {
        .main-path {
          stroke: lighten($connection-link-color, 30%);
        }
      }
    }
  }

}

</style>
