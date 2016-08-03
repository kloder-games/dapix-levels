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
                this.draw();
            }
        },

        onMouseDrag(mouseEvent) {
            var tmp = this.getMousePos(mouseEvent);

            if (this.pressed) {
                if (this.p1 == null || tmp.x != this.p1.x || tmp.y != this.p1.y) {
                    this.p1 = tmp;
                    this.draw();
                }
            }
        },

        onMouseUp(mouseEvent) {
            this.pressed = false;
        },

        draw() {
            this.clearHelper();
            this.erase(this.p1.x, this.p1.y);
            this.stage.update(); // Not in point for better performance
        }

    }

}
</script>
