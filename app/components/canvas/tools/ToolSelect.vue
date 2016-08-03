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
            }
        },

        onMouseDrag(mouseEvent) {
            var tmp = this.getMousePos(mouseEvent);
            // If is drawing
            if (this.pressed) {
                // Only draw if the destination is changed
                if (tmp.x != this.p2.x || tmp.y != this.p2.y) {
                    this.p2 = tmp;
                    this.draw();
                }
            }
        },

        onMouseUp(mouseEvent) {
            this.pressed = false; // Release the button
            if (!mouseEvent.nativeEvent.shiftKey) this.clearSelection()
            this.updateSelection();
            this.p1 = null;
            this.p2 = null;
            this.draw();
            this.stage.update(); // Again for redraw (bug???)

            var tmp = this.selection;
            this.selection = [];
            this.selection = tmp;
        },

        updateSelection() {
            var p1 = { x: (this.p1.x > this.p2.x ? this.p2.x : this.p1.x), y: (this.p1.y > this.p2.y ? this.p2.y : this.p1.y) };
            var p2 = { x: (this.p1.x > this.p2.x ? this.p1.x : this.p2.x), y: (this.p1.y > this.p2.y ? this.p1.y : this.p2.y) };

            for (var i=p1.x;i<=p2.x;i++) {
                for (var j=p1.y;j<=p2.y;j++) {
                    this.addToSelection(i, j);
                }
            }
        },

        addToSelection(x, y) {
            if (this.selection.length == 0) {
                this.$dispatch('tileselected', x, y);
            } else {
                this.$dispatch('notileselected');
            }

            if (this.selection[x] == undefined) this.selection[x] = [];
            this.selection[x][y] = { x: x, y: y };
        },

        clearSelection() {
            this.selection = [];
        },

        draw() {
            this.clearHelper();
            if (this.p1 != null && this.p2 != null) {
                if (this.p1.x == this.p2.x && this.p1.y == this.p2.y) this.point(this.p1.x, this.p1.y); // Only a point
                else this.brectanglefilled(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
            }
            this.area();
            this.stage.update(); // Not in point for better performance
        },

        area() {
            for (var i in this.selection) {
                for (var j in this.selection[i]) {
                    var p = this.selection[i][j];
                    this.point(p.x, p.y);
                }
            }
        },

        point(x, y) {
            var shape = new createjs.Shape();
            shape.graphics.beginFill("#9EF2CF").drawRect(-this.level.tile.width/2, -this.level.tile.height/2, this.level.tile.width, this.level.tile.height);
            shape.x = x * this.level.tile.width + 16;
            shape.y = y * this.level.tile.height + 16;
            this.helper.addChild(shape);
        }

    },

    events: {

        'updateSelection': function () {
            this.draw();
        }

    }
}

</script>
