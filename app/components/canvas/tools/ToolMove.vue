<script>
import mixinTool from './../mixins/Tool.js'

export default {

    mixins: [mixinTool],
    template: '',
    methods: {

        onMouseDown(mouseEvent) {
            var tmp = this.getMousePos(mouseEvent);
            if (mouseEvent.nativeEvent.button == 0) {
                this.p1 = tmp;
                this.p2 = tmp;
                this.pressed = true;
                this.copyToSelection()
            }
        },

        onMouseDrag(mouseEvent) {
            var tmp = this.getMousePos(mouseEvent);
            // If is drawing
            if (this.pressed) {
                // Only draw if the destination is changed
                if (tmp.x != this.p2.x || tmp.y != this.p2.y) {
                    this.p2 = tmp;
                    this.moveSelection();
                }
            }
        },

        onMouseUp(mouseEvent) {
            this.pressed = false; // Release the button
            this.dropSelection();
            this.p1 = null;
            this.p2 = null;
            this.stage.update(); // Again for redraw (bug???)
        },

        draw() {
            this.stage.update(); // Not in point for better performance
        },

        copyToSelection() {
            this.buffer = [];
            for (var i in this.selection) {
                for (var j in this.selection[i]) {
                    var p = this.selection[i][j];
                    if (this.level.layers[this.level.index].data[i] != undefined) {
                        var tile = this.level.layers[this.level.index].data[i][j];
                        if (tile != undefined) {
                            var bitmap = tile.bitmap.clone();
                            this.helper.addChild(bitmap);
                            this.buffer.push(tile);
                        }
                    }
                }
            }
            this.stage.update();
        },

        moveSelection() {
            this.helper.x = (this.p2.x - this.p1.x) *  this.level.tile.width;
            this.helper.y = (this.p2.y - this.p1.y) *  this.level.tile.height;
            this.stage.update();
        },

        dropSelection() {
            this.moveTilesTo(this.p2.x - this.p1.x, this.p2.y - this.p1.y)
            this.clearSelection();
            this.helper.x = 0;
            this.helper.y = 0;
            this.stage.update();
            this.$dispatch('updateSelection');
        },

        clearSelection() {
            this.helper.removeAllChildren();
            this.stage.update();
        },

        moveTilesTo(x, y) {
            for (var i = 0; i < this.buffer.length; i++) {
                var tile = this.buffer[i];
                this.moveTileTo(tile, x, y)
            }
        },

        moveTileTo(tile, x, y) {
            var oldX = tile.x
            var oldY = tile.y
            tile.x += x;
            tile.y += y;
            tile.bitmap.x = tile.x * this.level.tile.width + 16;
            tile.bitmap.y = tile.y * this.level.tile.height + 16;

            if (this.level.layers[this.level.index].data[tile.x] == undefined) this.level.layers[this.level.index].data[tile.x] = [];
            this.level.layers[this.level.index].data[tile.x][tile.y] = tile;
            if (this.level.layers[this.level.index].data[oldX] != undefined) this.level.layers[this.level.index].data[oldX][oldY] = null;
        }

    }
}

</script>
