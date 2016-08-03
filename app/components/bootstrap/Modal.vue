

<template>

<button type="button" class="btn btn-{{ btnstyle }}" data-toggle="modal" data-target="#{{ id }}">
    <slot name="button">
        Button
    </slot>
</button>
<div class="modal fade" id="{{ id }}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title" id="myModalLabel">{{ title }}</h4>
            </div>
            <div class="modal-body">
                <slot name="content">
                    ...
                </slot>
            </div>
            <div class="modal-footer">
                <slot name="footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </slot>
            </div>
        </div>
    </div>
</div>

</template>

<script>

export default {

    props: {

        title: {
            type: String,
            default: 'Title'
        },
        btnstyle: {
            type: String,
            default: 'secondary'
        },
        id: {
            type: String,
            default: 'modal-1'
        }

    }

}

</script>
