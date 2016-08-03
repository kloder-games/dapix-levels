<style>

.form-control,
.input-group-addon {
    border-radius: 0px;
}

</style>

<template>

<div class="input-group {{ id }}">
    <span class="input-group-addon" v-if="addonLeft">
            <slot name="left">
            </slot>
        </span>
    <input class="form-control" type="{{ type }}" v-model="value" number min="{{ min }}" max="{{ max }}" title="{{ title }}" />
    <span class="input-group-addon" v-if="addonRight">
            <slot name="right">
            </slot>
        </span>
</div>

</template>

<script>

export default {

    props: {

        type: {
            type: String,
            default: 'text'
        },
        width: {
            type: Number,
            default: 250
        },
        group: {
            type: Boolean,
            default: true
        },
        addonLeft: {
            type: Boolean,
            default: false
        },
        addonRight: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        min: {
            type: Number,
            default: 1
        },
        max: {
            type: Number,
            default: 50
        },
        value: null,
        id: {
            type: String,
            default: _.uniqueId('input_')
        }

    },

    ready() {

        $('.' + this.id).width(this.width);

    }

}

</script>
