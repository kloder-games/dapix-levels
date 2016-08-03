export default {

    props: {

        frame: null

    },

    methods: {

        setHistory() {

            this.frame.history.push(this.cloneFrame());
            this.frame.index++;

        },

        historyBack() {

            this.frame.index--;
            var target = this.cloneFrame(this.frame.history[this.frame.index]);
            this.frame = target;
            this.paper.view.draw();

        },

        historyForward() {

            // TODO

        },

        cloneFrame(frame = this.frame) {
            return { x: frame.x, y: frame.y, image: frame.image };
        }


    }

}
