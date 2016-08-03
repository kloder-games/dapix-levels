export default {

    data() {
        return {
            pressed: false,
            rotation: 0,
            p1: null,
            p2: null,
            mode: 'helper', // Allowed values are: 'helper' and 'real'
            buffer: []
        }
    },

    props: {

        zoom: null,
        level: null,
        stage: null,
        tileset: null,
        helper: null,
        selection: []

    },

    methods: {

        onMouseDown(e) {
            // For overwrite
        },

        onMouseDrag(e) {
            // For overwrite
        },

        onMouseUp(e) {
            // For overwrite
        },

        getMousePos(mouseEvent) {
            return {
                x: Math.floor(mouseEvent.stageX / this.level.tile.width),
                y: Math.floor(mouseEvent.stageY / this.level.tile.height)
            };
        },

        point(x, y) {
            var tiles = this.getCurrentTiles();
            var index = Math.floor((Math.random() * tiles.length))
            var tile = tiles[index];

            if (tile != undefined) {
                var bitmap = new createjs.Bitmap(tile.image);
                bitmap.x = x * this.level.tile.width + 16;
                bitmap.y = y * this.level.tile.height + 16;
                bitmap.regX = bitmap.regY = 16;
                bitmap.rotation = this.rotation;

                if (this.mode == 'helper') {

                    this.helper.addChild(bitmap);

                } else if (this.mode == 'real') {

                    // Create if not exists row
                    if (this.currentData[x] == undefined) this.currentData[x] = [];

                    // Check if exists
                    if (this.currentData[x][y] != undefined) {
                        this.currentLayer.draw.removeChild(this.currentData[x][y].bitmap);
                        this.currentLayer.draw.addChild(bitmap);
                    } else {
                        this.currentLayer.draw.addChild(bitmap);
                    }

                    // Check that properties are setted
                    var props = {};
                    if (tile.properties != undefined) props = JSON.parse(JSON.stringify(tile.properties))

                    // Add data info or replace existing one
                    this.currentData[x][y] = {
                        bitmap: bitmap,
                        x: x,
                        y: y,
                        ID: tile.ID,
                        properties: props,
                        rotation: this.rotation
                    };

                }
            }
        },

        clearHelper() {
            this.helper.removeAllChildren();
        },

        erase(x, y) {
            if (this.currentData[x] == undefined) return;
            if (this.currentData[x][y] == undefined) return;
            this.currentLayer.draw.removeChild(this.currentData[x][y].bitmap);
            this.currentData[x][y] = undefined;
            this.stage.update();
        },

        bline(p1x = 0, p1y = 0, p2x = 0, p2y = 0) {
            var dx = Math.abs(p2x - p1x), sx = p1x < p2x ? 1 : -1;
            var dy = Math.abs(p2y - p1y), sy = p1y < p2y ? 1 : -1;
            var err = (dx>dy ? dx : -dy)/2;

            while (true) {
                this.point(p1x, p1y);
                if (p1x === p2x && p1y === p2y) break;
                var e2 = err;
                if (e2 > -dx) { err -= dy; p1x += sx; }
                if (e2 < dy) { err += dx; p1y += sy; }
            }
        },

        brectangle(x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
            if (x1 > x0) this.bline(x0, y0, x1 - 1, y0);
            else this.bline(x0, y0, x1 + 1, y0);
            if (y1 > y0) this.bline(x1, y0, x1, y1 - 1);
            else this.bline(x1, y0, x1, y1 + 1);
            if (x1 > x0) this.bline(x1, y1, x0 + 1, y1);
            else this.bline(x1, y1, x0 - 1, y1);
            if (y1 > y0) this.bline(x0, y1, x0, y0 + 1);
            else this.bline(x0, y1, x0, y0 - 1);
        },

        brectanglefilled(x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
            var p1 = { x: (x0 > x1 ? x1 : x0), y: (y0 > y1 ? y1 : y0) };
            var p2 = { x: (x0 > x1 ? x0 : x1), y: (y0 > y1 ? y0 : y1) };

            for (var i=p1.x;i<=p2.x;i++) {
                for (var j=p1.y;j<=p2.y;j++) {
                    this.point(i, j);
                }
            }
        },

        getTile(index) {
            var tiles = this.getCurrentTiles();
            return tiles[index];
        },

        getCurrentTiles() {
            var tiles = [];
            for (var i in this.tileset.indexes) {
                var index = this.tileset.indexes[i];
                if (this.tileset.tiles[index] != undefined) {
                    tiles.push(this.tileset.tiles[index]);
                }
            }
            return tiles;
        }

    },

    computed: {

        currentLayer: function () { return this.level.layers[this.level.index]; },
        currentData: function () { return this.currentLayer.data; }

    }

}
