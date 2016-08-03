

<template>

<modal id="configDialog" title="Configure Sprite">
    <i class="fa fa-cog" slot="button"></i>
    <form slot="content">
        <fieldset class="form-group">
            <label for="width" class="control-label">Width</label>
            <input type="number" id="width" class="form-control" v-model="frame.width" lazy />
        </fieldset>
        <fieldset class="form-group">
            <label class="control-label" for="height">Heigth</label>
            <input type="number" id="height" class="form-control" v-model="frame.height" lazy />
        </fieldset>
    </form>
</modal>

</template>

<script>

import modal from '../bootstrap/Modal.vue'

export default {

    props: {

        frame: {
            type: Object
        }

    },

    components: {

        'modal': modal

    }

}

</script>
