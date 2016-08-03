<template>
<button type="button" class="btn btn-{{ style }}">
    <slot>
        Button
    </slot>
</button>
</template>

<script>
export default {

    props: {

        'style': {
            type: String,
            default: 'secondary'
        }

    }

}
</script>
