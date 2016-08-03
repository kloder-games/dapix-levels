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
            } else {
                // Only draw if the first point is not setted or is changed
                if (this.p2 == null || tmp.x != this.p2.x || tmp.y != this.p2.y) {
                    this.p1 = tmp;
                    this.p2 = tmp;
                    this.draw();
                }
            }
        },

        onMouseUp(mouseEvent) {
            this.pressed = false; // Release the button
            this.mode = 'real'; // Change to real mode
            this.draw(); // Draw our shape
            this.mode = 'helper'; // Return to helper mode
            this.stage.update(); // Again for redraw (bug???)
        },

        draw(onHelper = true) {
            this.clearHelper();

            var x0 = this.p1.x,
                x1 = this.p2.x;
            if (x1 < x0) {
                x0 = this.p2.x;
                x1 = this.p1.x;
            }
            var y0 = this.p1.y,
                y1 = this.p2.y;
            if (y1 < y0) {
                y0 = this.p2.y;
                y1 = this.p1.y;
            }

            var mx = Math.ceil(x0 + (x1 - x0) / 2);
            var my = Math.ceil(y0 + (y1 - y0) / 2);

            if (mx == x1 && my == y1) { // Capture center case
                this.point(mx, my);
            } else if (mx == x1 || my == y1) { // Capture X or Y Axis case
                this.bline(x0, y0, x1, y1);
            } else { // All other cases
                this.ellipseMidPoint(mx, my, x1 - mx, y1 - my);
            }

            this.stage.update(); // Not in point for better performance
        },

        ellipseMidPoint(cx = 0, cy = 0, Rx = 0, Ry = 0) {
            var Rx2 = Rx * Rx;
            var Ry2 = Ry * Ry;
            var twoRx2 = 2 * Rx2;
            var twoRy2 = 2 * Ry2;
            var p;
            var x = 0;
            var y = Ry;
            var px = 0;
            var py = twoRx2 * y;

            /* Plot the first set of points */
            this.ellipsePlotPoints(cx, cy, x, y);

            /* Region 1 */
            p = Math.round(Ry2 - (Rx2 * Ry) + (0.25 * Rx2));
            while (px < py) {
                x++;
                px += twoRy2;
                if (p < 0)
                    p += Ry2 + px;
                else {
                    y--;
                    py -= twoRx2;
                    p += Ry2 + px - py;
                }
                this.ellipsePlotPoints(cx, cy, x, y);
            }

            /* Region 2 */
            p = Math.round(Ry2 * (x + .5) * (x + .5) + Rx2 * (y - 1) * (y - 1) - Rx2 * Ry2);
            while (y > 0) {
                y--;
                py -= twoRx2;
                if (p > 0)
                    p += Rx2 - py;
                else {
                    x++;
                    px += twoRy2;
                    p += Rx2 - py + px;
                }
                this.ellipsePlotPoints(cx, cy, x, y);
            }

        },

        ellipsePlotPoints(cx = 0, cy = 0, x = 0, y = 0) {
            this.point(cx + x, cy + y);
            this.point(cx - x, cy + y);
            this.point(cx + x, cy - y);
            this.point(cx - x, cy - y);
        }

    }

}

</script>
