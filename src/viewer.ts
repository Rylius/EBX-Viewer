import 'regenerator-runtime/runtime';

import Vue from 'vue';
import VueRouter from 'vue-router';

import GameRegistry, {FetchPartitionLoader} from './GameRegistry';

import TypeDocumentationLink from './components/TypeDocumentationLink.vue';
import Property from './components/Property.vue';
import Reference from './components/Reference.vue';
import Partition from './components/Partition.vue';
import Instance from './components/Instance.vue';
import InstanceIdentifier from './components/InstanceIdentifier.vue';
import Directory from './components/Directory.vue';
import Viewer from './components/Viewer.vue';
import Games from './components/Games.vue';

import {capitalize, removeExtension} from './filters';

Vue.config.productionTip = false;

Vue.use(VueRouter);

Vue.component('TypeDocumentationLink', TypeDocumentationLink);
Vue.component('Property', Property);
Vue.component('Reference', Reference);
Vue.component('Partition', Partition);
Vue.component('Instance', Instance);
Vue.component('InstanceIdentifier', InstanceIdentifier);
Vue.component('Directory', Directory);

Vue.filter('capitalize', capitalize);
Vue.filter('removeExt', removeExtension);

const routes = [
    {
        path: '/',
        component: Games,
    },
    {
        path: '/view/:game/:path*.json',
        component: Partition,
        props: true,
    },
    {
        path: '/view/:game',
        component: Directory,
        props: true,
    },
    {
        path: '/view/:game/:path*',
        component: Directory,
        props: true,
    },
];

const router = new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior(to) {
        if (to.hash) {
            return {
                selector: to.hash,
            };
        }

        // FIXME Should return to previous scroll value
        return {x: 0, y: 0};
    },
});

router.afterEach(to => {
    if (!to?.params?.path) {
        document.title = 'EBX Viewer';
        return;
    }

    document.title = `${to.params.path} - EBX Viewer`;
});

const registries = {
    'venice': new GameRegistry('venice', new FetchPartitionLoader('/venice/ebx', () => fetch(`/venice/partitions.json`).then(res => res.json()))),
};

Vue.prototype.$registries = registries;

new Vue({
    el: '#app',
    render: h => h(Viewer),
    router,
});
