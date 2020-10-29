import Vue from 'vue';
import GameRegistry from './GameRegistry';

declare module 'vue/types/vue' {
    interface Vue {
        $registries: { [game: string]: GameRegistry };
    }
}
