<style>

.btn {
    border-radius: 0;
    margin-bottom: 0;
}

</style>

<template>

<label class="btn btn-{{ style }} {{ toggle ? 'active' : '' }}">
    <input type="radio" name="{{ name }}" id="{{ id }}" autocomplete="off" v-model="toggle">
    <slot>
        Button
    </slot>
</label>

</template>

<script>

export default {

    props: {

        'style': {
            type: String,
            default: 'secondary'
        },
        'toggle': {
            type: Boolean,
            default: false
        },
        'name': {
            type: String,
            default: 'button-radio'
        },
        'id': {
            type: String,
            default: 'button-radio-1'
        }

    },

    watch: {

        'toggle': function(val, old) {

            this.$dispatch('toggle', val);

        }

    }

}

</script>
