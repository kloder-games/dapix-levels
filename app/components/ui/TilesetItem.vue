<style>

.tile {
    border: 1px solid #21252B;
    display: inline-block;
    margin-left: 4px;
    vertical-align: middle;
    cursor: pointer;
    outline: none;
}

.tile:first-child {
    margin-left: 0;
}

.tile img {
    min-width: 36px;
    min-height: 36px;
    max-width: 36px;
    max-height: 36px;
}

.tile.selected {
    outline: none;
    border-color: #9ecaed;
}

</style>

<template>

<div id="tile-{{ id }}" class="tile" v-bind:class="{ 'selected': selected }">
    <img :src="tile.image" :title="tile.ID" />
</div>

</template>

<script>

export default {

    props: {

        tile: null,
        selected: {
            type: Boolean,
            default: true
        },
        index: {
            type: Number,
            default: 1
        }

    }

}

</script>
