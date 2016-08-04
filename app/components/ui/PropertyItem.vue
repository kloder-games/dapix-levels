<style>
.propertyItem {
    border: 1px solid #333;
    border-bottom: 0px;
    /*display: inline-block;*/
    width: 100%;
    /*padding: 6px 8px 4px;*/
}
.propertyItem:last-child {
    border-bottom: 1px solid #333;
}
.propertyItem .form-control {
    border-radius: 0px;
}
.propertyItem .property-not-editable {
    padding: 6px 8px 4px;
}
</style>

<template>
<div class="propertyItem">
    <div v-show="lock" class="property-not-editable">
        <b>{{ key }}:</b>  {{ val }}
    </div>
    <div v-else>
        <table>
            <tr>
                <td>
                    <input type="text" class="form-control" name="name" placeholder="Name..."
                        onclick="this.select();"
                        @change="update"
                        @blur="blur"
                        @keyup.13="update"
                        v-show="key!='ID' && type!='Instance'"
                        v-model="key"
                    />
                    <div v-else class="property-not-editable">{{ key }}:</div>
                </td>
                <td>
                    <input type="text" class="form-control" name="value" placeholder="Value..."
                        onclick="this.select();"
                        @change="update"
                        @blur="blur"
                        @keyup.13="update"
                        v-show="(key=='ID' && type!='Instance') || (key!='ID')"
                        v-model="val"
                    />
                    <div v-else class="property-not-editable">{{ val }}</div>
                </td>
                <td>
                    <a href="javascript:;" @click="remove" v-show="key!='ID' && type!='Instance'" class="pull-right">
                        <i class="fa fa-trash-o"></i>
                    </a>
                </td>
            </tr>
        </table>
    </div>
</div>
</template>

<script>
export default {

    data() {
        return {
            oldKey: null,
            oldValue: null
        }
    },

    props: {

        key: null,
        val: null,
        lock: null,
        type: null

    },

    ready() {

        this.oldKey = this.key;
        this.oldVal = this.val;
    },

    methods: {

        blur() {
            //console.error($(document.activeElement));
            this.update();

        },

        update() {
            if (this.oldKey != null) this.$dispatch('changeProperty', this.oldKey, this.oldVal, this.key, this.val);
            this.oldKey = this.key;
            this.oldVal = this.val;
            //this.editing = false;
        },

        remove() {
            this.$dispatch('removeProperty', this.key);
        }

    }

}
</script>
