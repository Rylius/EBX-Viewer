<template>
    <div>
        <h2 class="title">
            Directory {{ path || '/' }}
        </h2>

        <div v-if="loading">
            Loading...
        </div>

        <div v-if="directories || files">
            <div class="content">
                <ul>
                    <li v-for="name in sortedDirectories">
                        <router-link :to="`/view/${game}${cleanPath}${name}`">
                            <span class="icon"><i class="fas fa-folder"/></span>
                            {{ name }}
                        </router-link>
                    </li>
                </ul>
            </div>

            <div class="content">
                <ul>
                    <li v-for="file in sortedFiles">
                        <router-link :to="`/view/${game}${cleanPath}${file}`">
                            <span class="icon"><i class="fas fa-file-alt"/></span>
                            {{ file | removeExt }}
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else-if="!loading">
            Empty
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

function resolve(data: any, path: string): { [dir: string]: string } {
    if (!path.length) {
        return data;
    }

    let current = data;
    for (const part of path.split('/')) {
        current = current[part];
    }
    return current;
}

function sortFile(a: string, b: string): number {
    return a.localeCompare(b, 'en', {numeric: true}) || b.length - a.length;
}

export default Vue.extend({
    name: 'Directory',
    props: {
        game: String,
        path: {
            type: String,
            default: '',
        },
    },
    data(): { loading: boolean, directories: { [dir: string]: string } | null, files: Array<string> | null } {
        return {
            loading: true,
            directories: null,
            files: null,
        };
    },
    computed: {
        sortedDirectories(): Array<string> {
            const names: Array<string> = [];

            if (this.directories) {
                names.push(...Object.keys(this.directories).sort(sortFile));
            }

            return names;
        },
        sortedFiles(): Array<string> {
            const names: Array<string> = [];

            if (this.files) {
                names.push(...this.files.sort(sortFile));
            }

            return names;
        },
        cleanPath(): string {
            let path = this.path;
            if (!path.startsWith('/')) {
                path = '/' + path;
            }
            if (!path.endsWith('/')) {
                path += '/';
            }
            return path;
        },
    },
    async mounted() {
        const index = await fetch(`/${this.game}/files.json`).then(res => res.json());
        this.directories = resolve(index.tree, this.path);
        this.files = index.files[this.path];
        this.loading = false;
    },
});
</script>

<style lang="scss" scoped>

ul {
  list-style: none;
  margin-left: 0;
}

</style>
