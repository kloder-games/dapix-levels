<script>
import mixinTool from './../mixins/Tool.js'

export default {

    mixins: [mixinTool],
    template: '',
    methods: {

        onMouseDown(mouseEvent) {
            this.p1 = this.getMousePos(mouseEvent);
            if (mouseEvent.nativeEvent.button == 0) {
                this.pressed = true;
                this.mode = 'real';
                this.draw();
                this.stage.update(); // Again for redraw (bug???)
            } else if (mouseEvent.nativeEvent.button == 1) {
                this.erase(this.p1.x, this.p1.y);
                this.stage.update(); // Not in point for better performance
            } else if (mouseEvent.nativeEvent.button == 2) {
                this.rotation += 90;
                this.draw();
            }
        },

        onMouseDrag(mouseEvent) {
            var tmp = this.getMousePos(mouseEvent);

            if (this.p1 == null || tmp.x != this.p1.x || tmp.y != this.p1.y) {
                this.p1 = tmp;
                this.draw();
                this.stage.update(); // Again for redraw (bug???)
            }
        },

        onMouseUp(mouseEvent) {
            this.pressed = false;
            this.mode = 'helper';
        },

        draw() {
            this.clearHelper();
            this.point(this.p1.x, this.p1.y);
            this.stage.update(); // Not in point for better performance
        }

    }

}
</script>
