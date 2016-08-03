<script>

import mixinTool from './../mixins/Tool.js'

export default {

    mixins: [mixinTool],
    template: '',
    props: {

        frame: null,
        points: null

    },

    methods: {

        onMouseDrag(mouseEvent) {
            var tmp = this.getMousePos(mouseEvent);

            if (this.p1 == null || tmp.x != this.p1.x || tmp.y != this.p1.y) {
                this.p1 = tmp;
                this.clearHelper();
                this.point(this.p1.x, this.p1.y);
                this.stage.update(); // Not in point for better performance
            }
        },

        onMouseUp(e) {
            this.mode = 'real'; // Change to real mode
            this.p1 = this.getMousePos(e);
            this.draw(this.p1.x, this.p1.y);
            this.stage.update(); // Again for redraw (bug???)
            this.mode = 'helper'; // Return to helper mode
        },

        draw(x = 0, y = 0) {
            this.points = {};
            this.floodfill_chk(x, y);
            for (var point in this.points) {
                this.point(this.points[point].x, this.points[point].y);
            }
            this.stage.update(); // Not in point for better performance
        },

        floodfill_chk(x = 0, y = 0) {
            if (
                x >= 0 && x < (this.level.width/this.level.tile.width) &&
                y >= 0 && y < (this.level.height/this.level.tile.height) && // In the area
                (x + '-' + y) in this.points == false && // Not checked yet
                this.floodfill_cmp(x, y) // Same color as the searched
            ) {
                this.points[x + '-' + y] = { x: x, y: y};
                this.floodfill_chk(x - 1, y);
                this.floodfill_chk(x + 1, y);
                this.floodfill_chk(x, y - 1);
                this.floodfill_chk(x, y + 1);
            }
        },

        floodfill_cmp(x, y) {
            if (this.currentData[x] == undefined) return true;
            var tmp = this.currentData[x][y];
            if (tmp == undefined || tmp == null) return true;
            return false;
        }

    }

}

</script>
