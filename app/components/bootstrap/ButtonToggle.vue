

<template>

<button type="button" class="btn btn-{{ style }}" @click="toggle=!toggle">
    <slot name="active" v-if="toggle">
        Button Active
    </slot>
    <slot name="inactive" v-if="!toggle">
        Button Inactive
    </slot>
</button>

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
        }

    }

}

</script>
