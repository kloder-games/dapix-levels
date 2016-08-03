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

        draw() {
            this.clearHelper();
            if (this.p1.x == this.p2.x && this.p1.y == this.p2.y) this.point(this.p1.x, this.p1.y); // Only a point
            else this.brectangle(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
            this.stage.update(); // Not in point for better performance
        }

    }

}

</script>
