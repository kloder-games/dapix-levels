<style>
.tileset-bar {
    overflow: hidden;
}
</style>

<template>
<div class="btn-toolbar" class="tileset-bar">

    <table cellspace="8">
        <tr>
            <td>
                <div class="btn-group">
                    <button @click="open" title="Add Tile"> <i class="fa fa-plus"></i> </button>
                    <button @click="reimage" title="Change image"> <i class="fa fa-picture-o"></i> </button>
                    <button @click="remove" title="Remove Tile"> <i class="fa fa-trash-o"></i> </button>
                </div>

                <div style="width:8px;display:inline-block;float:left;">&nbsp;</div>
                <input type="text" name="name" v-model="filter" placeholder="Search..." style="display:inline-block;width:35%;" class="form-control">

                <span class="pull-right">
                    Indexes: {{ tileset.indexes }}
                    <button @click="openTileset" title="Open Tileset"> <i class="fa fa-folder-open"></i> </button>
                    <button @click="saveTileset" title="Save Tileset"> <i class="fa fa-save"></i> </button>
                </span>
            </td>
        </tr>
        <tr>
            <td style="width:100%;vertical-align:top;padding: 6px;">
                <div id="tiles">
                    <tileset-item v-for="tile in tileset.tiles | filterBy filter in 'ID'" :tile="tile" :index="$index" :selected="tileset.indexes.indexOf($index) != -1" @click.stop="goto($event, $index)"></tileset-item>
                </div>
            </td>
        </tr>
    </table>

</div>
</template>

<script>
import button from './../bootstrap/Button.vue'
import tilesetItem from './TilesetItem.vue'

const {remote} = require('electron');
var fs = require('fs');
const {dialog} = remote;

export default {

    data() {
        return {
            filter: ''
        }
    },

    props: {

        tileset: null

    },

    ready() {

        $(document).keydown(this.onKey);

    },

    methods: {

        onKey(e) {
            /*switch (e.keyCode) {
                case KEY_SPACE:
                    this.playing = !this.playing;
                    break;
                case KEY_START:
                    this.first();
                    break;
                case KEY_END:
                    this.last();
                    break;
                case KEY_AVPAG:
                    this.next();
                    break;
                case KEY_REPAG:
                    this.previous();
                    break;
                case KEY_SUPR:
                    this.remove();
                    break;
                case KEY_N:
                    this.add();
                    break;
                case KEY_D:
                    if (e.ctrlKey) this.copy();
                    break;
                case KEY_C:
                    if (e.ctrlKey) this.onion = !this.onion;
                    break;
            }
            e.preventDefault();*/
        },

        // Data

        importData(raw) {
            this.tileset = JSON.parse(raw);
        },

        exportData() {
            var data = JSON.stringify(this.tileset);
            return data;
        },

        // Tileset

        newTileset() {
            this.tileset = {
                tiles: [],
                indexes: [],
                savepath: ''
            };
        },

        openTileset() {
            var files = dialog.showOpenDialog({
                title: 'Open tileset...',
                buttonLabel: 'Open',
                filters: [
                    {name: 'Tileset (.tileset)', extensions: ['tileset']},
                    {name: 'All Files (.*)', extensions: ['*']}
                ],
                properties: ['openFile']
            });
            var fs = require('fs');
            var data = fs.readFileSync(files[0]);
            this.importData(data)
            this.tileset.savepath = files[0];
        },

        saveTileset() {
            if (this.tileset.savepath == '') {
                this.saveTilesetAs();
            } else {
                fs.writeFile(this.tileset.savepath, this.exportData(), function (err) {
                    if (err) throw err;
                });
            }
        },

        saveTilesetAs() {
            var self = this;
            dialog.showSaveDialog({
                filters: [
                    {name: 'Tileset (.tileset)', extensions: ['tileset']},
                    {name: 'All Files (.*)', extensions: ['*']}
                ]
            }, function (fileName) {
                if (fileName === undefined) return;
                self.tileset.savepath = fileName;
                fs.writeFile(fileName, self.exportData(), function (err) {
                    if (err) throw err;
                });
            });
        },

        // Tile

        open() {
            var files = dialog.showOpenDialog({
                title: 'Import...',
                buttonLabel: 'Import',
                filters: [
                    {name: 'PNG', extensions: ['png']},
                    {name: 'All Files', extensions: ['*']}
                ],
                properties: ['openFile']
            });

            if (files != undefined) {
                var image = fs.readFileSync(files[0]);
                var base64image = new Buffer(image).toString('base64');
                this.add('data:image/png;base64,' + base64image);
            }
        },

        reimage() {
            if (this.tileset.indexes.length == 1) {
                var files = dialog.showOpenDialog({
                    title: 'Change image...',
                    buttonLabel: 'Change',
                    filters: [
                        {name: 'PNG', extensions: ['png']},
                        {name: 'All Files', extensions: ['*']}
                    ],
                    properties: ['openFile']
                });

                if (files != undefined) {
                    var image = fs.readFileSync(files[0]);
                    var base64image = new Buffer(image).toString('base64');
                    var tile = this.tileset.tiles[this.tileset.indexes[0]];
                    tile.image = 'data:image/png;base64,' + base64image;
                    this.$dispatch('remapTileImage', tile);
                }
            } else {
                if (this.tileset.indexes.length == 0) {
                    dialog.showMessageBox({
                        title: 'Warning...',
                        type: 'warning',
                        message: 'You must to select one tile from the models for change its image.',
                        buttons: ['OK']
                    });
                } else {
                    dialog.showMessageBox({
                        title: 'Warning...',
                        type: 'warning',
                        message: 'You must to select only one tile from the models for change its image.',
                        buttons: ['OK']
                    });
                }
            }
        },

        add(base64image) {
            this.tileset.tiles.push({
                image: base64image,
                ID: "Tile " + this.tileset.tileIndex++,
                properties: {}
            });

            // Get the new index for the new tile
            var index = this.tileset.tiles.length - 1;

            // Change selection index
            this.tileset.indexes = [index];
            this.$dispatch('changetile', this.tileset.indexes);
        },

        remove() {
            this.tileset.indexes.sort().reverse();
            for (var i in this.tileset.indexes) this.tileset.tiles.splice(this.tileset.indexes[i], 1);

            // Reset selection to first item
            this.tileset.indexes = [0];
        },

        goto(event, index) {
            if (event.shiftKey) {
                if (this.tileset.indexes.indexOf(index) != -1) {
                    this.tileset.indexes.slice(this.tileset.indexes.indexOf(index), 1);
                } else {
                    this.tileset.indexes.push(index);
                }
            } else {
                this.tileset.indexes = [index];
            }
            this.$dispatch('changetile', this.tileset.indexes);
        }

    },

    events: {

        'opentileset': function(data) {
            this.tileset = JSON.parse(data);
        }

    },

    components: {
        button, tilesetItem
    }

}

const KEY_SPACE = 32
const KEY_START = 36
const KEY_END = 35
const KEY_AVPAG = 34
const KEY_REPAG = 33
const KEY_N = 78
const KEY_D = 68
const KEY_C = 67
const KEY_SUPR = 46

</script>
