<template lang="html">
    <div id="mask" v-show="maskShow" class="animated fadeIn faster">
        <div id="canvasWraper" class="">
            <div id="canvasToolPanel">
                <div :class="['draw-control', {'color-active': drawing.penColor === 'red'}]" style="background: red;"
                @click="drawing.penColor = 'red'"></div>
                <div :class="['draw-control', {'color-active': drawing.penColor === 'green'}]" style="background: green;"
                @click="drawing.penColor = 'green'"></div>
                <div :class="['draw-control', {'color-active': drawing.penColor === 'blue'}]" style="background: blue;"
                @click="drawing.penColor = 'blue'"></div>
                <div :class="['draw-control', 'tool', 'fa', 'fa-pencil', {'tool-active': drawing.tool === 'pen'}]"
                @click="drawing.tool = 'pen'"></div>
                <div :class="['draw-control', 'tool', 'fa', 'fa-square-o', {'tool-active': drawing.tool === 'rect'}]"
                @click="drawing.tool = 'rect'"></div>
                <div :class="['draw-control', 'tool', 'fa', 'fa-circle-thin', {'tool-active': drawing.tool === 'circle'}]"
                @click="drawing.tool = 'circle'"></div>
            </div>
            <div id="canvasEditPanel">
                <div class="edit-control">复制</div>
                <div class="edit-control">清空</div>
            </div>
        </div>
        <div id="maskCloseBtn" @click="close()">+</div>
    </div>
</template>

<script>
import html2canvas from 'html2canvas'
export default {
    data(){
        return {
            maskShow: false,
            drawing: {
                isDrawing: false,
                penColor: 'red',
                tool: 'pen',
            },
        }
    },
    methods: {
        show(){
            this.createPic()
            this.maskShow = true
        },
        createPic() {

            let paper = document.querySelector('#paper')

            html2canvas(paper).then(canvas => {
                let canvasWraper = document.querySelector('#canvasWraper')

                let canvasEl = canvasWraper.querySelector('canvas')
                canvasEl && canvasEl.remove()

                let canvasWraperStyle = {
                    width: window.getComputedStyle(paper).width,
                    marginTop: '50px',
                    marginLeft: 'calc(50% - ' + Math.round(parseInt(window.getComputedStyle(paper).width) / 2) + 'px)'
                }
                Object.assign(canvasWraper.style, canvasWraperStyle)
                canvasWraper.appendChild(canvas)
                this.maskShow = true
                this.initCanvasDraw()
            });
        },
        initCanvasDraw() {
            let canvas = document.querySelector('#canvasWraper').querySelector('canvas')
            let offset = document.querySelector('#canvasWraper')
            let context = canvas.getContext('2d')

            let startDrawing = (e) => {
                if (!this.drawing.tool) {
                    return
                }
                this.drawing.isDrawing = true
                context.strokeStyle = this.drawing.penColor ? this.drawing.penColor : 'red'
                context.lineWidth = 1
                context.beginPath();
                // 把画笔移动到鼠标位置
                context.moveTo(e.pageX - offset.offsetLeft, e.pageY - offset.offsetTop);
            }

            let stopDrawing = () => {
                this.drawing.isDrawing = false
            }

            let draw = (e) => {
                if (this.drawing.isDrawing === true) {
                    // 找到鼠标最新位置
                    let x = e.pageX - offset.offsetLeft;
                    let y = e.pageY - offset.offsetTop;
                    // 画一条直线到鼠标最新位置
                    context.lineTo(x, y);
                    context.stroke();
                }
            }

            canvas.onmousedown = startDrawing
            canvas.onmouseup = stopDrawing
            canvas.onmouseout = stopDrawing
            canvas.onmousemove = draw

        },
        close(){
            let mask = document.querySelector('#mask')
            mask.classList.remove('fadeIn')
            mask.classList.add('fadeOut')
            setTimeout(() => {
                this.maskShow = false
                mask.classList.remove('fadeOut')
                mask.classList.add('fadeIn')
            }, 500)
        }
    }
}
</script>

<style scoped lang="stylus">
#mask
    height: 100vh
    width: 100vw
    position: absolute
    top: 0
    left: 0
    background-color: #000000aa
    z-index: 101
    overflow: hidden auto
    user-select: none
    #maskCloseBtn
        color: #eee
        font-size: 80px
        position: absolute
        top: 0
        right: 0
        width: 80px
        height: 80px
        transform: rotateZ(45deg)
        cursor: pointer
    #canvasWraper
        position: absolute
        #canvasEditPanel
            position: absolute
            width: 50px
            height: 400px
            top: 0
            right: -60px
            // background: red
            .edit-control
                width: 40px
                height: 40px
                margin: 0 5px 10px 5px
                box-sizing: border-box
                border: 2px solid #eee
                cursor: pointer
                text-align: center
                color: #eee
                font-size: 14px
                line-height: 36px
                &:hover
                    border: 2px solid #999
        #canvasToolPanel
            position: absolute
            width: 50px
            height: 400px
            top: 0
            left: -60px
            .draw-control
                width: 40px
                height: 40px
                margin: 0 5px 10px 5px
                box-sizing: border-box
                border: 2px solid #eee
                cursor: pointer
                &:hover
                    border: 2px solid #999
            .color-active
                border: 2px solid #999
            .tool
                font-size: 32px
                line-height: 40px
                text-align: center
                color: #999
                border: none
                &:hover
                    color: #fff
                    border: none
            .tool-active
                color: #fff
</style>
