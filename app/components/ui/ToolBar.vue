<style>
.btn-toolbar {
    padding: 6px;
}
</style>

<template>
<div class="btn-toolbar" role="toolbar">


    <div class="btn-group" data-toggle="buttons">
        <button @click="openLevel" title="Open Level..."> <i class="fa fa-folder-open"></i> </button>
        <button @click="saveLevel" title="Save Level"> <i class="fa fa-save"></i> </button>
        <button @click="exportLevel" title="Export Level JSON"> <i class="fa fa-file-code-o"></i> </button>
        <div style="width:8px;display:inline-block;float:left;">&nbsp;</div>
        <button-radio :toggle="tool=='select'" @click="tool='select'" title="Select - [F1]"> <i class="fa fa-mouse-pointer"></i> </button-radio>
        <button-radio :toggle="tool=='move'" @click="tool='move'" title="Move - [F2]"> <i class="fa fa-arrows"></i> </button-radio>
        <div style="width:8px;display:inline-block;float:left;">&nbsp;</div>
        <button-radio :toggle="tool=='brush'" @click="tool='brush'" title="Pencil - [F3]"> <i class="fa fa-paint-brush"></i> </button-radio>
        <button-radio :toggle="tool=='eraser'" @click="tool='eraser'" title="Eraser - [F4]"> <i class="fa fa-eraser"></i> </button-radio>
        <button-radio :toggle="tool=='eyedropper'" @click="tool='eyedropper'" title="Eyedropper - [F5]"> <i class="fa fa-eyedropper-tool"></i> </button-radio>
        <button-radio :toggle="tool=='line'" @click="tool='line'" title="Line - [F6]"> <i class="fa fa-line-tool"></i> </button-radio>
        <button-radio :toggle="tool=='rectangle'" @click="tool='rectangle'" title="Square - [F7]"> <i class="fa fa-rectangle-tool"></i> </button-radio>
        <button-radio :toggle="tool=='ellipse'" @click="tool='ellipse'" title="Ellipse - [F8]"> <i class="fa fa-circle-tool"></i> </button-radio>
        <button-radio :toggle="tool=='fill'" @click="tool='fill'" title="Fill - [F9]"> <i class="fa fa-bucket-tool"></i> </button-radio>
    </div>
</div>
</template>

<script>
import button from './../bootstrap/Button.vue'
import buttonRadio from './../bootstrap/ButtonRadio.vue'

export default {

    props: {

        tool: {
            type: String,
            default: 'select'
        },
        zoom: {
            type: Number,
            default: 10
        },
        status: {
            type: Object,
            default () {
                return { x: 0, y: 0 }
            }
        },
        tileset: null,
        showGrid: true

    },

    ready() {

        $(document).keydown(this.onKey);

    },

    events: {

        'toggle-grid': function () {
            this.showGrid = !this.showGrid;
        }

    },

    methods: {

        openLevel() { this.$dispatch('openLevel'); },
        saveLevel() { this.$dispatch('saveLevel'); },
        exportLevel() { this.$dispatch('exportLevel'); },

        onKey(e) {
            switch (e.keyCode) {
                case KEY_F1: this.tool = 'select'; break;
                case KEY_F2: this.tool = 'move'; break;
                case KEY_F3: this.tool = 'brush'; break;
                case KEY_F4: this.tool = 'eraser'; break;
                case KEY_F5: this.tool = 'eyedropper'; break;
                case KEY_F6: this.tool = 'line'; break;
                case KEY_F7: this.tool = 'rectangle'; break;
                case KEY_F8: this.tool = 'ellipse'; break;
                case KEY_F9: this.tool = 'fill'; break;
            }
        }

    },

    components: {
        button, buttonRadio
    }

}

const KEY_F1 = 112
const KEY_F2 = 113
const KEY_F3 = 114
const KEY_F4 = 115
const KEY_F5 = 116
const KEY_F6 = 117
const KEY_F7 = 118
const KEY_F8 = 119
const KEY_F9 = 120

const KEY_Z = 90
const KEY_Y = 89

</script>
