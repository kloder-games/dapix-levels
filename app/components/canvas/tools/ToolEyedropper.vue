<script>
import mixinTool from './../mixins/Tool.js'

export default {

    mixins: [mixinTool],
    template: '',

    methods: {

        onMouseUp(mouseEvent) {
            this.p1 = this.getMousePos(mouseEvent);
            this.pick(this.p1.x, this.p1.y);
        },

        pick(x = 0, y = 0) {
            if (this.currentData[x] == undefined) return;
            var tmp = this.currentData[x][y];
            if (tmp == undefined || tmp == null) return;
            this.tileset.indexes = [tmp.id];
        }

    }

}
</script>
