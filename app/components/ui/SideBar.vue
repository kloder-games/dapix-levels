<style>
.sidebarPane {
    overflow: auto;
    margin: 0;

    width: 100%;
    height: 100%;
    overflow: auto;
    position: absolute;
}

.sidebarContainer {
    overflow: hidden;
	position: relative;
    width: 100%;
    height: 100%;
}
</style>

<template>

    <div class="sidebarContainer">

        <div class="sidebarPane">

            <zoom-panel
            :level.sync="level"
            ></zoom-panel>

            <layers-panel
            :level.sync="level"
            ></layers-panel>

            <properties-panel
            :tileset.sync="tileset"
            :level.sync="level"
            ></properties-panel>

        </div>

    </div>


</template>

<script>
import zoomPanel from './ZoomPanel.vue'
import layersPanel from './LayersPanel.vue'
import propertiesPanel from './PropertiesPanel.vue'

export default {

    props: {

        level: null,
        tileset: null

    },

    components: { zoomPanel, layersPanel, propertiesPanel }

}
</script>
