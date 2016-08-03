<template>

    <h5 style="background-color:#282C34;padding:8px;margin-top:8px;">
        <a href="javascript:;" @click="open=!open" v-show="open"><i class="fa fa-minus-square-o"></i></a>
        <a href="javascript:;" @click="open=!open" v-show="!open"><i class="fa fa-plus-square-o"></i></a>
        Properties
        <span v-show="type!=''">({{ type }})</span>

        <span class="pull-right" v-show="source!=null">
            <a href="javascript:;" @click="add" title="Add Property"><i class="fa fa-plus"></i></a>
        </span>
    </h5>

    <div v-show="open">

        <div class="pull-right" v-show="type=='Model'" >
            <a href="javascript:;" v-show="lock" @click="lock=false"><i class="fa fa-lock"></i> Unlock</a>
            <a href="javascript:;" v-show="!lock" @click="lock=true"><i class="fa fa-unlock"></i> Lock</a>
        </div>

        <div style="clear:both"></div>

        <property-item key="ID" :val="ID" v-show="source!=null && type!='Level'" :type="type" :lock="lock"></property-item>
        <property-item v-for="prop in properties" :key="$key" :val="prop" :type="type" :lock="lock"></property-item>
    </div>

</template>

<script>
import button from './../bootstrap/Button.vue'
import propertyItem from './PropertyItem.vue'

export default {

    data() {
        return {
            lock: false,
            properties: {},
            ID: '',
            type: '',
            open: true
        }
    },

    props: {

        level: null,
        tileset: null,
        source : null

    },

    methods: {

        add() {
            var key = 'Key';
            var val = 'Value';
            if (this.properties == undefined) this.properties = {};

            var iter = 0;
            while (this.properties[key] != undefined) {
                key = 'Key ' + (iter+1);
                iter++;
                if (iter > 256) break;
            }

            this.properties[key] = val;
            this.updateProperties();
            this.$emit('changeProperty', null, null, key, val);
        },

        reset() {
            this.properties =  {};
            this.ID = '';
            this.type = '';
            this.source = null
        },

        updateProperties() {
            var tmp = this.properties;
            this.properties = {};
            this.properties = tmp;
        },

        removeProperty(key) {
            if (this.properties != undefined && this.properties[key] != undefined) {
                delete this.properties[key];
                this.source.properties = this.properties;
            }
        }

    },

    events: {

        'changeProperty': function (oldKey, oldVal, key, val) {
            // console.error(oldKey, oldVal, key, val);
            if (key == 'ID') {
                // TODO: Update all level in all layers IDs
                this.source.ID = val;
            } else {
                if (oldKey != key) this.removeProperty(oldKey);
                if (this.source.properties == undefined) this.source.properties = {};
                this.source.properties[key] = val;
            }
        },

        'removeProperty': function (key) {
            this.removeProperty(key);
            this.updateProperties();
        },

        'changetile': function (indexes) {
            if (this.tileset.indexes.length == 1) {
                this.type = 'Model';
                this.source = this.tileset.tiles[this.tileset.indexes[0]];
                this.ID = this.source.ID;
                this.properties = this.source.properties;
                this.lock = true;
            } else {
                this.type = '';
                this.source = null;
                this.ID = '';
                this.properties = {};
            }
        },

        'tileselected': function (x, y) {
            var layer = this.level.layers[this.level.index];

            this.reset();
            if (layer.data[x] != undefined && layer.data[x][y] != undefined) {
                var point = layer.data[x][y];
                this.type = 'Instance';
                this.source = point;
                this.ID = this.source.ID;
                this.properties = this.source.properties;
                this.lock = false;
            }

        },

        'notileselected': function () {
            this.reset();
        },

        'rootselected': function () {
            this.reset();
            this.type = 'Level';
            this.source = this.level;
            this.ID = 'Root';
            this.properties = this.source.properties;
            this.lock = false;
        }

    },

    components: { button, propertyItem }

}
</script>
