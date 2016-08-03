<template>

    <h5 style="background-color:#282C34;padding:8px;">
        <a href="javascript:;" @click="open=!open" v-show="open"><i class="fa fa-minus-square-o"></i></a>
        <a href="javascript:;" @click="open=!open" v-show="!open"><i class="fa fa-plus-square-o"></i></a>
        Zoom
    </h5>

    <div class="zoom-div" style="margin-bottom: 6px;" v-show="open">
        <img :src="source" style="width:100%;border:1px solid #282C34;" />
    </div>

</template>

<script>
export default {

    data() {
        return {
            open: true,
            source: null
        }
    },

    props: {

        level: null,
        tileset: null

    },

    ready() {

        var stage = this.level.layers[0].draw.stage;
        stage.on('drawend', this.refresh);
    },

    methods: {

        refresh: function () {
            var draw = this.level.layers[0].draw.parent;
            if (draw != null) {
                draw.cache(0, 0, this.level.width, this.level.height);
                this.source = draw.getCacheDataURL();
            }
        }

    }

}
</script>
