

<template>

<small>
        <div class="pull-right">
            x: {{ coords.x }}, y: {{ coords.y }}
        </div>
        <div>
            {{ hints }}
        </div>
    </small>

</template>

<script>

export default {

    props: {

        hints: {
            type: String,
            default: 'Dapix Levels 0.1.0 | Node ' + process.versions.node + ' | Chrome ' + process.versions.chrome + ' | Electron ' + process.versions.electron
        },

        coords: {
            type: Object,
            default: {
                x: 0,
                y: 0
            }
        },

        tileset: {
            type: Object,
            default: null
        }


    }

}

</script>
