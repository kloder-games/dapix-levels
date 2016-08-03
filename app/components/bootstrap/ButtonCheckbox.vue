

<template>

<label class="btn btn-{{ style }} {{ !toggle ? 'active' : '' }}" @click="toggle=!toggle">
    <input type="checkbox" name="{{ name }}" id="{{ id }}" autocomplete="off" :checked="toggle">
    <slot name="active" v-if="toggle">
        Button Active
    </slot>
    <slot name="inactive" v-if="!toggle">
        Button Inactive
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
            default: true
        },
        'name': {
            type: String,
            default: 'button-checkbox'
        },
        'id': {
            type: String,
            default: 'button-checkbox'
        }

    }

}

</script>
