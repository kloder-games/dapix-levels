<template>
    <table style="width: 100%;">
        <tr>
            <td style="height:51px;" colspan="2">
                <tool-bar
                    :show-grid.sync="showGrid"
                    :tool.sync="tool"
                    :zoom.sync="zoom"
                ></tool-bar>
            </td>
        </tr>
        <tr>
            <td style="overflow:hidden;">
                <level-canvas
                    :show-grid="showGrid"
                    :zoom="zoom"
                    :tool.sync="tool"
                    :coords.sync="coords"
                    :tileset.sync="tileset"
                    :level.sync="level"
                    v-ref:level-canvas
                ></level-canvas>
            </td>
            <td style="width:300px;padding: 0 8px;vertical-align:top;">
                <side-bar
                    :tileset.sync="tileset"
                    :level.sync="level"
                ></side-bar>
            </td>
        </tr>
        <tr>
            <td style="height:51px;" colspan="2">
                <tileset-bar
                    :tileset.sync="tileset"
                    v-ref:tileset-bar
                ></tileset-bar>
            </td>
        </tr>
        <tr>
            <td style="height:24px;padding: 6px;" colspan="2">
                <status-bar :coords="coords" :tile="tile" :hints="hints"></status-bar>
            </td>
        </tr>
    </table>
</template>

<script>
import toolBar from './components/ui/ToolBar.vue'
import levelCanvas from './components/ui/LevelCanvas.vue'
import sideBar from './components/ui/SideBar.vue'
import tilesetBar from './components/ui/TilesetBar.vue'
import statusBar from './components/ui/StatusBar.vue'

const {remote} = require('electron');
var fs = require('fs');
const {dialog} = remote;

export default {

    data () {
        return {

            showGrid: true,
            tool: 'select',
            zoom: 1,
            coords: { x: 0, y: 0 },
            hints: 'Dapix Levels 0.1.0 | Node ' + process.versions.node + ' | Chrome ' + process.versions.chrome + ' | Electron ' + process.versions.electron,

            // Main data
            tileset: {
                tiles: [],
                indexes: [],
                savepath: '',
                tileIndex: 1
            },
            level: {
                tile: { width: 32, height: 32 },
                width: 1280,
                height: 640,
                properties: { },
                layers: [
                    { name: 'Layer 0', data: [], draw: new createjs.Container() }
                ],
                index: 0 // For layers
            },
            savepath: '',
            exportSavepath: ''


        }
    },

    ready() {

    },

    methods: {

        // Data

        importData(raw) {
            var data = JSON.parse(raw);
            this.$refs.tilesetBar.importData(data.tileset);
            this.$refs.levelCanvas.tileset = this.$refs.tilesetBar.tileset;
            this.level.tile = data.level.tile;
            this.level.width = data.level.width;
            this.level.height = data.level.height;
            this.level.properties = data.level.properties;
            this.level.layers = [];
            this.level.index = 0;

            for (var i = 0; i < data.level.layers.length; i++) {
                this.level.layers[i] = {
                    name: data.level.layers[i].name,
                    data: [],
                    draw: new createjs.Container()
                };

                for (var j in data.level.layers[i].data) {
                    if (this.level.layers[i].data[data.level.layers[i].data[j].x] == undefined) this.level.layers[i].data[data.level.layers[i].data[j].x] = [];
                    this.level.layers[i].data[data.level.layers[i].data[j].x][data.level.layers[i].data[j].y] = {
                        properties: data.level.layers[i].data[j].properties,
                        rotation: data.level.layers[i].data[j].rotation,
                        ID: data.level.layers[i].data[j].id,
                        x: data.level.layers[i].data[j].x,
                        y: data.level.layers[i].data[j].y
                    };
                }
            }

            this.$refs.levelCanvas.refreshDrawLayers();
        },

        exportData() {
            var data = {
                level: {
                    tile: this.level.tile,
                    width: this.level.width,
                    height: this.level.height,
                    properties: this.level.properties,
                    layers: []
                },

            };

            for (var i = 0; i < this.level.layers.length; i++) {
                data.level.layers[i] = {
                    name: this.level.layers[i].name,
                    data: []
                };

                for (var j in this.level.layers[i].data) {
                    for (var k in this.level.layers[i].data[j]) {
                        if (this.level.layers[i].data[j][k] != undefined) {
                            data.level.layers[i].data.push({
                                properties: this.level.layers[i].data[j][k].properties,
                                rotation: this.level.layers[i].data[j][k].rotation,
                                id: this.level.layers[i].data[j][k].ID,
                                x: this.level.layers[i].data[j][k].x,
                                y: this.level.layers[i].data[j][k].y
                            });
                        }
                    }
                }
            }

            return data;
        },

        exportDataJson() {
            var data = this.exportData();
            return JSON.stringify(data);
        },

        exportDataLevel() {
            var data = this.exportData();
            data.tileset = this.$refs.tilesetBar.exportData();
            return JSON.stringify(data);
        },

        // Level

        setEditorTitle(path) {
            var name = "Noname";
            if (path != undefined) {
                // name = path.replace(/^.*[\\\/]/, '');
                name = path;
            }
            document.title = "Dapix Levels - " + name;
        },

        newLevel() {
            this.$refs.tilesetBar.newTileset();
            this.$refs.levelCanvas.tileset = this.$refs.tilesetBar.tileset;
            this.level = {
                tile: { width: 32, height: 32 },
                width: 1280,
                height: 640,
                layers: [
                    { name: 'Layer 0', data: [], draw: new createjs.Container() }
                ],
                index: 0
            };
            this.$refs.levelCanvas.level = this.level;
            this.$refs.levelCanvas.refreshDrawLayers();
            this.setEditorTitle();
        },

        openLevel() {
            var files = dialog.showOpenDialog({
                title: 'Open level...',
                buttonLabel: 'Open',
                filters: [
                    {name: 'Level (.level)', extensions: ['level']},
                    {name: 'All Files (.*)', extensions: ['*']}
                ],
                properties: ['openFile']
            });
            if (files != undefined) {
                var fs = require('fs');
                var data = fs.readFileSync(files[0]);
                this.importData(data)
                this.savepath = files[0];
                this.setEditorTitle(files[0]);
            }
        },



        saveLevel() {
            var self = this;
            if (this.savepath == '') {
                this.saveLevelAs();
            } else {
                fs.writeFile(this.savepath, self.exportDataLevel(), function (err) {
                    if (err) throw err;
                });
            }
        },

        saveLevelAs() {
            var self = this;
            dialog.showSaveDialog({
                filters: [
                    {name: 'Level (.level)', extensions: ['level']},
                    {name: 'All Files (.*)', extensions: ['*']}
                ]
            }, function (fileName) {
                if (fileName === undefined) return;
                self.savepath = fileName;
                fs.writeFile(fileName, self.exportDataLevel(), function (err) {
                    if (err) throw err;
                });
                self.setEditorTitle(fileName);
            });
        },

        exportJSON() {
            var self = this;
            if (this.exportSavepath == '') {
                this.exportJSONAs();
            } else {
                fs.writeFile(this.exportSavepath, self.exportDataJson(), function (err) {
                    if (err) throw err;
                });
            }
        },

        exportJSONAs() {
            var self = this;
            dialog.showSaveDialog({
                title: 'Export JSON...',
                buttonLabel: 'Export',
                filters: [
                    {name: 'JSON', extensions: ['json']},
                    {name: 'All Files', extensions: ['*']}
                ]
            }, function (fileName) {
                if (fileName === undefined) return;
                this.exportSavepath = fileName;
                fs.writeFile(fileName, self.exportDataJson(), function (err) {
                    if (err) throw err;
                });
            });
        },

        exportPNG() {
            var self = this;
            dialog.showSaveDialog({
                title: 'Export PNG...',
                buttonLabel: 'Export',
                filters: [
                    {name: 'PNG', extensions: ['png']},
                    {name: 'All Files', extensions: ['*']}
                ]
            }, function (fileName) {
                if (fileName === undefined) return;
                var draw = self.level.layers[0].draw.parent;
                draw.cache(0, 0, self.level.width, self.level.height);
                var base64Data = draw.getCacheDataURL().replace(/^data:image\/png;base64,/, "");
                fs.writeFile(fileName, base64Data, 'base64', function (err) {
                    if (err) throw err;
                });
            });
        }

    },

    events: {

        'changetile': function (indexes) { this.$broadcast('changetile', indexes); },
        'tileselected': function (x, y) { this.$broadcast('tileselected', x, y); },
        'notileselected': function () { this.$broadcast('notileselected'); },
        'rootselected': function () { this.$broadcast('rootselected'); },

        'openLevel': function () { this.openLevel(); },
        'saveLevel': function () { this.saveLevel(); },
        'exportLevel': function () { this.exportJSON(); },

        'remapTileImage': function (tile) {
            this.$refs.levelCanvas.remapTileImage(tile);
        },

        'updateSelection': function () {
            this.$broadcast('updateSelection');
        }

    },

    components: { toolBar, levelCanvas, sideBar, tilesetBar, statusBar }
}
</script>

<style>
html, body { height: 100%; overflow: hidden; background-color: #21252B; color: #A3A6AC; }
body { font-family: Helvetica, sans-serif; }
table { width: 100%; height: 100%; }
</style>
