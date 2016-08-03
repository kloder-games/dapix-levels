<style>
.levelCanvas,
.levelCanvas:active,
.levelCanvas:focus {
    background-color: #282C34;
    cursor: crosshair;
    -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -o-user-select: none; user-select: none;
    outline: none;
    border: 2px solid #666;
    margin: 8px;
}

.levelPane {
    color: inherit;
    background-color: #282C34;
    overflow: auto;
    margin: 0;

    width: 100%;
    height: 100%;
    overflow: auto;
    position: absolute;
}

.levelContainer {
    overflow: hidden;
	position: relative;
    width: 100%;
    height: 100%;
}
</style>

<template>
    <div class="levelContainer">
        <div class="levelPane">
            <canvas class="levelCanvas"
                v-bind:style="{ width: level.width + 'px', height: level.height + 'px' }"
                width="{{ level.width }}"
                height="{{ level.height }}"
            ></canvas>
        </div>
    </div>
    <tool-select :zoom="zoom" :selection.sync="selection" :level="level" :stage="stage" :helper="selectionLayer" :tileset="tileset" v-ref:tool-select></tool-select>
    <tool-move :zoom="zoom" :selection.sync="selection" :level="level" :stage="stage" :helper="selectionLayer" :tileset="tileset" v-ref:tool-move></tool-move>
    <tool-brush :zoom="zoom" :level="level" :stage="stage" :helper="helper" :tileset="tileset" v-ref:tool-brush></tool-brush>
    <tool-eraser :zoom="zoom" :level="level" :stage="stage" :helper="helper" :tileset="tileset" v-ref:tool-eraser></tool-eraser>
    <tool-eyedropper :zoom="zoom" :level="level" :stage="stage" :tileset="tileset" v-ref:tool-eyedropper></tool-eyedropper>
    <tool-line :zoom="zoom" :level="level" :stage="stage" :helper="helper" :tileset="tileset" v-ref:tool-line></tool-line>
    <tool-rectangle :zoom="zoom" :level="level" :stage="stage" :helper="helper" :tileset="tileset" v-ref:tool-rectangle></tool-rectangle>
    <tool-ellipse :zoom="zoom" :level="level" :stage="stage" :helper="helper" :tileset="tileset" v-ref:tool-ellipse></tool-ellipse>
    <tool-fill :zoom="zoom" :level="level" :stage="stage" :helper="helper" :tileset="tileset" v-ref:tool-fill></tool-fill>
</template>

<script>
import mixinTool from './../canvas/mixins/Tool.js'
import mixinHistory from './../canvas/mixins/History.js'

import toolSelect from './../canvas/tools/ToolSelect.vue'
import toolMove from './../canvas/tools/ToolMove.vue'
import toolBrush from './../canvas/tools/ToolBrush.vue'
import toolEraser from './../canvas/tools/ToolEraser.vue'
import toolEyedropper from './../canvas/tools/ToolEyedropper.vue'
import toolLine from './../canvas/tools/ToolLine.vue'
import toolRectangle from './../canvas/tools/ToolRectangle.vue'
import toolEllipse from './../canvas/tools/ToolEllipse.vue'
import toolFill from './../canvas/tools/ToolFill.vue'

export default {

    mixins: [mixinHistory],

    data() {
        return {
            draw: null,     // Hold all the drawing layers
            helper: null,   // For helpers elements
            grid: null,     // For the grid
            selection: [], // For the selection
            selectionLayer: null,
            stage: null     // The Stage
        }
    },

    props: {

        showGrid: { type: Boolean, default: true },
        tool: { type: String, default: 'brush' },
        zoom: { type: Number, default: 10 },
        coords: {
            type: Object,
            default: { x: 0, y: 0 }
        },
        level: null,
        tileset: null

    },

    ready() {
        this.initialize();
        this.createDrawLayer();
        this.createGrid();
        this.createHelper();
        this.createSelection();
        this.stage.update();
    },

    methods: {

        initialize() {
            this.stage = new createjs.Stage($('.levelCanvas')[0]);
            this.stage.enableMouseOver(2);
            this.stage.on('stagemousemove', this.onStageMouseMove);
            this.stage.on('stagemousedown', this.onStageMouseDown);
            this.stage.on('stagemouseup', this.onStageMouseUp);
            this.stage.on('mouseenter', this.onMouseEnter);
            this.stage.on('mouseleave', this.onMouseLeave);
            $(window).mouseleave(this.onMouseLeave);
        },

        createDrawLayer() {
            this.draw = new createjs.Container();

            for (var i = 0; i < this.level.layers.length; i++) {
                this.draw.addChild(this.level.layers[i].draw);
            }

            this.stage.addChild(this.draw);
        },

        refreshDrawLayers() {
            for (var l = 0; l<this.draw.children;l++) this.draw.getChildAt(l).removeAllChildren(); // Remove all children in layers
            this.draw.removeAllChildren(); // Remove all layers

            for (var i = 0; i < this.level.layers.length; i++) {
                this.draw.addChild(this.level.layers[i].draw);

                for (var j in this.level.layers[i].data) {
                    for (var k in this.level.layers[i].data[j]) {
                        var tmp = this.level.layers[i].data[j][k];

                        var tileIndex = _.findIndex(this.tileset.tiles, { ID: tmp.ID });
                        if (tileIndex != -1) {
                            var tile = this.tileset.tiles[tileIndex];

                            var bitmap = new createjs.Bitmap(tile.image);
                            bitmap.x = tmp.x * this.level.tile.width + 16;
                            bitmap.y = tmp.y * this.level.tile.height + 16;
                            bitmap.regX = bitmap.regY = 16;
                            bitmap.rotation = tmp.rotation;

                            this.level.layers[i].draw.addChild(bitmap);
                            this.level.layers[i].data[j][k].bitmap = bitmap;
                        }
                    }
                }
            }
            this.stage.update();
        },

        remapTileImage(tile) {
            for (var i = 0; i < this.level.layers.length; i++) {
                var layer = this.level.layers[i];

                for (var j in this.level.layers[i].data) {
                    for (var k in this.level.layers[i].data[j]) {
                        var tmp = this.level.layers[i].data[j][k];
                        if (tmp.ID == tile.ID) {

                            this.level.layers[i].draw.removeChild(tmp.bitmap);

                            var bitmap = new createjs.Bitmap(tile.image);
                            bitmap.x = tmp.x * this.level.tile.width + 16;
                            bitmap.y = tmp.y * this.level.tile.height + 16;
                            bitmap.regX = bitmap.regY = 16;
                            bitmap.rotation = tmp.rotation;

                            this.level.layers[i].draw.addChild(bitmap);
                            this.level.layers[i].data[j][k].bitmap = bitmap;
                        }
                    }
                }
            }
            this.stage.update();
            this.stage.update();
        },

        createGrid() {
            var grid = new createjs.Shape();
            var g = grid.graphics;
            g.setStrokeStyle(1);
            g.beginStroke("#666666");

            // Vertical lines
            for (var i = this.level.tile.width; i < this.level.width; i += this.level.tile.width) {
                g.moveTo(i, 0);
                g.lineTo(i, this.level.height);
            }

            // Horizontal lines
            for (var j = this.level.tile.height; j < this.level.height; j += this.level.tile.height) {
                g.moveTo(0, j);
                g.lineTo(this.level.width, j);
            }

            this.grid = grid;
            this.stage.addChild(this.grid);
        },

        createHelper() {
            this.helper = new createjs.Container();
            this.helper.alpha = .5;
            this.stage.addChild(this.helper);
        },

        createSelection() {
            this.selectionLayer = new createjs.Container();
            this.selectionLayer.alpha = .2;
            this.stage.addChild(this.selectionLayer);
        },

        onMouseEnter(mouseEvent) {
            if (this.checkHelperVisibility()) {
                this.helper.visible = true;
                this.stage.update();
            }
        },

        onMouseLeave(mouseEvent) {
            if (this.checkHelperVisibility()) {
                this.helper.visible = false;
                this.stage.update();
            }
        },

        onStageMouseMove(mouseEvent) {
            switch (this.tool) {
                case 'select': this.$refs.toolSelect.onMouseDrag(mouseEvent); break;
                case 'move': this.$refs.toolMove.onMouseDrag(mouseEvent); break;
                case 'brush': this.$refs.toolBrush.onMouseDrag(mouseEvent); break;
                case 'eraser': this.$refs.toolEraser.onMouseDrag(mouseEvent); break;
                case 'line': this.$refs.toolLine.onMouseDrag(mouseEvent); break;
                case 'rectangle': this.$refs.toolRectangle.onMouseDrag(mouseEvent); break;
                case 'ellipse': this.$refs.toolEllipse.onMouseDrag(mouseEvent); break;
                case 'fill': this.$refs.toolFill.onMouseDrag(mouseEvent); break;
            }

            this.coords.x = Math.floor(mouseEvent.stageX / this.level.tile.width);
            this.coords.y = Math.floor(mouseEvent.stageY / this.level.tile.height);
        },

        onStageMouseDown(mouseEvent) {
            switch (this.tool) {
                case 'select': this.$refs.toolSelect.onMouseDown(mouseEvent); break;
                case 'move': this.$refs.toolMove.onMouseDown(mouseEvent); break;
                case 'brush': this.$refs.toolBrush.onMouseDown(mouseEvent); break;
                case 'eraser': this.$refs.toolEraser.onMouseDown(mouseEvent); break;
                case 'line': this.$refs.toolLine.onMouseDown(mouseEvent); break;
                case 'rectangle': this.$refs.toolRectangle.onMouseDown(mouseEvent); break;
                case 'ellipse': this.$refs.toolEllipse.onMouseDown(mouseEvent); break;
            }
        },

        onStageMouseUp(mouseEvent) {
            switch (this.tool) {
                case 'select': this.$refs.toolSelect.onMouseUp(mouseEvent); break;
                case 'move': this.$refs.toolMove.onMouseUp(mouseEvent); break;
                case 'brush': this.$refs.toolBrush.onMouseUp(mouseEvent); break;
                case 'eraser': this.$refs.toolEraser.onMouseUp(mouseEvent); break;
                case 'eyedropper': this.$refs.toolEyedropper.onMouseUp(mouseEvent); this.tool = 'brush'; break;
                case 'line': this.$refs.toolLine.onMouseUp(mouseEvent); break;
                case 'rectangle': this.$refs.toolRectangle.onMouseUp(mouseEvent); break;
                case 'ellipse': this.$refs.toolEllipse.onMouseUp(mouseEvent); break;
                case 'fill': this.$refs.toolFill.onMouseUp(mouseEvent); break;
            }
        },

        checkHelperVisibility() {
            switch (this.tool) {
                case 'line':
                case 'rectangle':
                case 'ellipse':
                case 'fill':
                case 'brush': return true;
            }
            return false;
        },

        checkSelectionVisibility() {
            switch (this.tool) {
                case 'move':
                case 'select': return true;
            }
            return false;
        },

        updateHelpersLayers() {
            this.helper.visible = false;
            this.selectionLayer.visible = false;
            if (this.checkHelperVisibility()) this.selectionLayer.visible = false;
            else if (this.checkSelectionVisibility()) this.selectionLayer.visible = true;
            this.stage.update();
        }

    },

    watch: {

        showGrid(newValue, oldValue) {
            this.grid.visible = newValue;
            this.stage.update();
        },

        tool(newVal, oldVal) {
            this.updateHelpersLayers();
        }

    },

    computed: {
        currentLayer: function () { return this.level.layers[this.level.index]; },
        currentData: function () { return this.currentLayer.data; }
    },

    components: {
        toolSelect, toolMove, toolBrush, toolEraser, toolEyedropper, toolLine, toolRectangle, toolEllipse, toolFill
    }

}

</script>
