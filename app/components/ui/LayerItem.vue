<style>
.layer-item {
    border: 1px solid #282C34;
    border-top: 0px solid #282C34;
    padding: 4px 8px;
    cursor: pointer;
    outline: none;
}
.layer-item:first-child {
    border-top: 1px solid #282C34;
}
.layer-item.selected {
    border-color: #A3A6AC;
    border-top: 1px solid #A3A6AC;
}
</style>

<template>

    <div class="layer-item" v-bind:class="{ 'selected': selected }">
        <i class="fa fa-reorder"></i> {{ layer.name }}

        <div class="pull-right">
            <a href="javascript:;" @click="moveUp" v-if="index > 0"><i class="fa fa-arrow-up"></i></a>
            <a href="javascript:;" @click="moveDown" v-if="index < total-1"><i class="fa fa-arrow-down"></i></a>
            <a href="javascript:;" @click="toggleVisibility">
                <i v-if="visibility" class="fa fa-eye"></i>
                <i v-else class="fa fa-eye-slash"></i>
            </a>
            <a href="javascript:;" @click="removeLayer"><i class="fa fa-trash"></i></a>
        </div>
    </div>

</template>

<script>
export default {

    props: {

        layer: null,
        index: 0,
        total:0,
        selected: { type: Boolean, default: true }

    },

    methods: {

        toggleVisibility: function () { this.visibility = !this.visibility; },
        moveUp: function () { this.$dispatch('moveup', this.index); },
        moveDown: function () { this.$dispatch('movedown', this.index); },
        removeLayer: function () { this.$dispatch('removeLayer', this.index); }

    },

    computed: {

        visibility: {
            get: function () {
                if (this.layer != undefined && this.layer.draw != undefined) return this.layer.draw.visible;
                else return false;
            },

            set: function(newValue) {
                this.layer.draw.visible = newValue;
                this.layer.draw.stage.update();
            }
        }

    }

}
</script>
