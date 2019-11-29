<template>
<div id="container">
    <text-picture ref="textPicture" />
    <div id="header">
        <img id="brand" src="../assets/img/brand.png" alt="">
        <div id="center-menu">
            <button :disabled="config.paperVisible" class="opt-btn" title="新建" @click="createFile"><i class="fa fa-file-o"></i></button>
            <button :disabled="!config.paperVisible" class="opt-btn" title="保存" @click="saveFile"><i class="fa fa-save"></i></button>
            <button :disabled="!config.paperVisible" class="opt-btn" title="关闭文档" @click="closeDoc"><i class="fa fa-times"></i></button>
            <span class="splitline">&nbsp;</span>
            <button :disabled="!config.paperVisible" class="opt-btn" title="标题"><i class="fa fa-header"></i>
                <ul class="dropdown-menu">
                    <li @click="setHeader(1)">h1</li>
                    <li @click="setHeader(2)">h2</li>
                    <li @click="setHeader(3)">h3</li>
                    <li @click="setHeader(4)">h4</li>
                    <li @click="setHeader(5)">h5</li>
                </ul>
            </button>
            <button :disabled="!config.paperVisible" :class="{'opt-btn': true, 'opt-btn-active': currentFormat.align == ''}" title="靠左" @click="setLeft"><i class="fa fa-align-left"></i></button>
            <button :disabled="!config.paperVisible" :class="{'opt-btn': true, 'opt-btn-active': currentFormat.align == 'center'}" title="居中" @click="setCenter"><i class="fa fa-align-center"></i></button>
            <button :disabled="!config.paperVisible" :class="{'opt-btn': true, 'opt-btn-active': currentFormat.align == 'right'}" title="靠右" @click="setRight"><i class="fa fa-align-right"></i></button>
            <button :disabled="!config.paperVisible" :class="{'opt-btn': true, 'opt-btn-active': currentFormat.list == 'ordered'}" title="有序列表" @click="setOlList"><i class="fa fa-list-ol"></i></button>
            <button :disabled="!config.paperVisible" :class="{'opt-btn': true, 'opt-btn-active': currentFormat.list == 'bullet'}" title="无序列表" @click="setUlList"><i class="fa fa-list-ul"></i></button>
            <button :disabled="!config.paperVisible" :class="{'opt-btn': true, 'opt-btn-active': currentFormat.bold}" title="粗体" @click="setBold"><i class="fa fa-bold"></i></button>
            <button :disabled="!config.paperVisible" :class="{'opt-btn': true, 'opt-btn-active': currentFormat.italic}" title="斜体" @click="setItalic"><i class="fa fa-italic"></i></button>
            <button :disabled="!config.paperVisible" :class="{'opt-btn': true, 'opt-btn-active': currentFormat.underline}" title="下划线" @click="setUnderline"><i class="fa fa-underline"></i></button>
            <button :disabled="!config.paperVisible" :class="{'opt-btn': true, 'opt-btn-active': currentFormat.strike}" title="删除线" @click="setStrike"><i class="fa fa-strikethrough"></i></button>
            <button :disabled="!config.paperVisible" :class="{'opt-btn': true, 'opt-btn-active': currentFormat.blockquote}" title="引用" @click="setBlockquote"><i class="fa fa-quote-left"></i></button>
            <button :disabled="!config.paperVisible" class="opt-btn" title="待办事项"><i class="fa fa-calendar-check-o"></i></button>
            <span class="splitline">&nbsp;</span>
            <button :disabled="!config.paperVisible" class="opt-btn" title="插入图片" @click="insertPicture"><i class="fa fa-picture-o"></i></button>
            <button :disabled="!config.paperVisible" class="opt-btn" title="插入链接"><i class="fa fa-link"></i></button>
            <span class="splitline">&nbsp;</span>
            <button :disabled="!config.paperVisible" class="opt-btn" title="清除格式" @click="removeFormat"><i class="fa fa-eraser"></i></button>
            <span class="splitline">&nbsp;</span>
            <button class="opt-btn" title="全屏" @click="handleFullScreen"><i class="fa fa-expand"></i></button>
        </div>
        <div id="right-menu">
            <button id="pageset" :disabled="!config.paperVisible" class="opt-btn" title="页面设置" @click.stop="showRightDrawer"><i class="fa fa-sliders"></i></button>
            <button id="typeset" :disabled="!config.paperVisible" class="opt-btn" title="版式" @click.stop="showRightDrawer"><i class="fa fa-pagelines"></i></button>
            <button :disabled="!config.paperVisible" class="opt-btn" title="分享"><i class="fa fa-send"></i></button>
            <button :disabled="!config.paperVisible" class="opt-btn" title="生成图片" @click="showTextPicture"><i class="fa fa-camera" aria-hidden="true"></i></button>
        </div>
    </div>
    <div id="main">
        <div id="word" v-show="!config.paperVisible">
            <p style="">写作是一条认识自己、认识真理的路，你只要喜欢写，应该随时动笔去写。</p>
            <p style="text-align: right">——罗兰</p>
        </div>
        <div id="paper" :style="paperTheme" v-show="config.paperVisible">
            <div class="layout" id="paper-top" :style="paperMarginTop">
                <div class="layout paper-left" :style="paperMarginLeft"></div>
                <div class="layout paper-center"></div>
                <div class="layout paper-right" :style="paperMarginRight"></div>
            </div>
            <div class="layout" id="paper-content">
                <div class="layout paper-left" :style="paperMarginLeft"></div>
                <div class="layout paper-center" id="editor-wraper">
                    <quill-editor ref="quill" class="editor-example bubble" v-model="quillEditorContent" :options="editorOption">
                    </quill-editor>
                </div>
                <div class="layout paper-right" :style="paperMarginRight"></div>
            </div>
            <div class="layout" id="paper-bottom" :style="paperMarginBottom">
                <div class="layout paper-left" :style="paperMarginLeft"></div>
                <div class="layout paper-center"></div>
                <div class="layout paper-right" :style="paperMarginRight"></div>
            </div>
            <div class="layout" id="paper-copyright">
                <div class="layout paper-left" :style="paperMarginLeft"></div>
                <div class="layout paper-center" id="copyright-text">由便签应用 翰墨 发送</div>
                <div class="layout paper-right" :style="paperMarginRight"></div>
            </div>
        </div>
    </div>
    <div id="right-drawer" class="drawer">
        <div id="page-setting" class="setting-panel" v-show="config.panelShow === 'pageset'">
            <h3>页面设置</h3>
            <div class="list-item">
                <input type="checkbox" name="showgrid" id="showgrid" v-model="setting.showGrid"><label for="showgrid">显示网格线</label>
            </div>
            <div class="list-item">
                <label for="paper－width">页　宽 </label><input id="paper－width" type="range" min="200" max="1080" v-model="setting.width"><label v-text="setting.width"></label>
            </div>
            <div class="list-item">
                <label for="paper－margintop">上边距 </label><input id="paper－margintop" type="range" min="0" max="400" v-model="setting.margintop"><label v-text="setting.margintop"></label>
            </div>
            <div class="list-item">
                <label for="paper－marginright">右边距 </label><input id="paper－marginright" type="range" min="0" max="200" v-model="setting.marginright"><label v-text="setting.marginright"></label>
            </div>
            <div class="list-item">
                <label for="paper－marginbottom">下边距 </label><input id="paper－marginbottom" type="range" min="0" max="200" v-model="setting.marginbottom"><label v-text="setting.marginbottom"></label>
            </div>
            <div class="list-item">
                <label for="paper－marginleft">左边距 </label><input id="paper－marginleft" type="range" min="0" max="200" v-model="setting.marginleft"><label v-text="setting.marginleft"></label>
            </div>
        </div>
        <div id="type-setting" class="setting-panel" v-show="config.panelShow === 'typeset'">
            <h3>主题设置</h3>
            <div class="list-item">
                <input id="theme-none" type="radio" name="theme" v-model="setting.theme" value="none"><label for="theme-none">无</label>
                <br />
                <input id="theme-keji" type="radio" name="theme" v-model="setting.theme" value="keji"><label for="theme-keji">科技</label>
                <br />
                <input id="theme-mountain" type="radio" name="theme" v-model="setting.theme" value="mountain"><label for="theme-mountain">群山</label>
                <br />
                <input id="theme-meihua" type="radio" name="theme" v-model="setting.theme" value="meihua"><label for="theme-meihua">梅花</label>
                <br />
                <input id="theme-taohua" type="radio" name="theme" v-model="setting.theme" value="taohua"><label for="theme-taohua">桃花</label>
                <br />
            </div>
        </div>
    </div>
    <div id="left-drawer" class="drawer">
        <Folder ref="folders" @display-article="displayDoc" />
    </div>
</div>
</template>

<script>
import {
    MessageBox,
    Message,
} from 'element-ui'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import {
    quillEditor
} from 'vue-quill-editor'
import {
    theme
} from '../assets/js/paperTheme'
import Folder from './Folder.vue'
import TextPicture from './TextPicture.vue'
export default {
    name: 'Editor',
    components: {
        quillEditor,
        Folder,
        TextPicture,
    },
    props: {},
    data() {
        return {
            fullscreen: false,
            rightDrawerShow: false,
            quillEditorEdit: true,
            quillEditorContent: '',
            editorOption: {
                theme: 'bubble',
                placeholder: '在此输入内容...',
                modules: {
                    history: {
                        delay: 1000,
                        maxStack: 50,
                        userOnly: false
                    },
                }
            },
            docUUID: '',
            docJson: '',
            setting: { //paper setting
                showGrid: true,

                width: 900,
                margintop: 50,
                marginright: 50,
                marginbottom: 50,
                marginleft: 50,

                theme: 'none',
            },
            config: { //app config
                panelShow: '',
                paperVisible: false,
            },
            currentFormat: {},
        }
    },
    computed: {
        editor() {
            return this.$refs.quill.quill;
        },
        paperMarginTop() {
            return {
                height: this.setting.margintop + 'px'
            }
        },
        paperMarginBottom() {
            return {
                height: this.setting.marginbottom + 'px'
            }
        },
        paperMarginLeft() {
            return {
                width: this.setting.marginleft + 'px'
            }
        },
        paperMarginRight() {
            return {
                width: this.setting.marginright + 'px'
            }
        },
        paperTheme() {
            let t = theme[this.setting.theme]
            let w = {
                width: this.setting.width + 'px'
            }
            return Object.assign({}, t, w)
        }
    },
    watch: {
        'setting.showGrid': (newVal) => {
            let editor = document.querySelector('#editor-wraper')
            if (newVal === true) {
                editor.style.backgroundImage = ''
            } else {
                editor.style.backgroundImage = 'unset'
            }
        },
        rightDrawerShow: (newVal) => {
            let rightDrawer = document.querySelector('#right-drawer')
            if (newVal === true) {
                rightDrawer.style.right = '0px'
            } else {
                rightDrawer.style.right = '-310px'
            }
        },
    },
    mounted() {
        // eslint-disable-next-line
        console.log(`%c HanMo v1.0 %c Designed by zhkf.hunter %c`, "background:#35495e; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff", "background:#41b883; padding: 1px; border-radius: 0 3px 3px 0; color: #fff", "background:transparent")

        document.addEventListener('click', e => {
            if (e.target.id !== 'left-drawer' && e.x > 320) {
                this.hideLeftDrawer()
            }
            if (e.target.id === 'main') {
                this.rightDrawerShow = false
            }
        })
        document.addEventListener('mousemove', e => {
            if (e.x < 50 && e.y > 60) {
                this.showLeftDrawer()
            }
        })

        this.editor.focus()
        // get current format
        this.editor.on('selection-change', (range) => {
            try {
                this.currentFormat = this.editor.getFormat(range.index, range.length)
                // eslint-disable-next-line
                // console.log(this.currentFormat);
                // eslint-disable-next-line
            } catch (e) {}
        })
    },
    methods: {
        showTextPicture() {
            this.$refs.textPicture.show()
        },
        createFile() {
            if (!this.config.paperVisible) {
                this.config.paperVisible = true
                this.docUUID = ''
                this.docJson = ''
            }
        },
        deleteDoc() {
            MessageBox.confirm('您确定要删除此文档吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.quillEditorContent = ''
                    this.config.paperVisible = false
                    this.docUUID = ''
                })
        },
        displayDoc(e) {
            this.setting = e.setting
            this.docUUID = e.uuid
            this.docJson = JSON.stringify(e)
            this.editor.setContents(e.content)
            this.config.paperVisible = true
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        showRightDrawer(e) {
            // console.log(e);
            this.rightDrawerShow = true
            if (!e.target.id) {
                this.config.panelShow = e.path[1].id
            } else {
                this.config.panelShow = e.target.id
            }
        },
        showLeftDrawer() {
            document.querySelector('#left-drawer').style.left = '0px';
        },
        hideLeftDrawer() {
            document.querySelector('#left-drawer').style.left = '-320px';
        },
        insertPicture() {
            this.editor.insertEmbed(0, 'image', '');
        },
        setCenter() {
            // let range = this.editor.getSelection()
            // this.editor.formatLine(range.index, range.length, 'align', 'center')
            this.editor.format('align', 'center')
            this.currentFormat.align = 'center'
        },
        setRight() {
            this.editor.format('align', 'right')
            this.currentFormat.align = 'right'
        },
        setLeft() {
            this.editor.format('align', '')
            this.currentFormat.align = ''
        },
        setBold() {
            if (!this.currentFormat.bold) {
                this.editor.format('bold', true)
                this.currentFormat.bold = true
            } else {
                this.editor.format('bold', false)
                this.currentFormat.bold = false
            }
        },
        setItalic() {
            if (!this.currentFormat.italic) {
                this.editor.format('italic', true)
                this.currentFormat.italic = true
            } else {
                this.editor.format('italic', false)
                this.currentFormat.italic = false
            }
        },
        setUnderline() {
            if (!this.currentFormat.underline) {
                this.editor.format('underline', true)
                this.currentFormat.underline = true
            } else {
                this.editor.format('underline', false)
                this.currentFormat.underline = false
            }
        },
        setStrike() {
            if (!this.currentFormat.strike) {
                this.editor.format('strike', true)
                this.currentFormat.strike = true
            } else {
                this.editor.format('strike', false)
                this.currentFormat.strike = false
            }
        },
        setUlList() {
            if (this.currentFormat.list != 'bullet') {
                this.editor.format('list', 'bullet')
                this.currentFormat.list = 'bullet'
            } else {
                this.editor.format('list', false)
                delete this.currentFormat.list
            }
        },
        setOlList() {
            if (this.currentFormat.list != 'ordered') {
                this.editor.format('list', 'ordered')
                this.currentFormat.list = 'ordered'
            } else {
                this.editor.format('list', false)
                delete this.currentFormat.list
            }
        },
        setBlockquote() {
            if (!this.currentFormat.blockquote) {
                this.editor.format('blockquote', true)
                this.currentFormat.blockquote = true
            } else {
                this.editor.format('blockquote', false)
                this.currentFormat.blockquote = false
            }
        },
        setHeader(level) {
            this.editor.format('header', level)
        },
        removeFormat() {
            let range = this.editor.getSelection()
            this.editor.removeFormat(range.index, range.length)
        },
        editorClear() {
            this.quillEditorContent = ''
            this.editor.focus()
        },
        saveFile() {
            if (this.docUUID) { // file is already exist.
                let folder = this.$refs.folders.folders.find(i => i.name === '默认文件夹')
                let doc = folder.files.find(i => i.uuid === this.docUUID)
                doc.content = this.editor.getContents().ops
                doc.setting = this.setting
                this.docJson = JSON.stringify(doc)
                this.$refs.folders.saveFolder('默认文件夹')
            } else { // file is new.
                let content = this.editor.getContents().ops
                let uuid = this.generateUUID()
                this.docUUID = uuid
                let doc = {
                    uuid,
                    setting: this.setting,
                    content
                }
                this.docJson = JSON.stringify(doc)
                this.$refs.folders.saveFileToFolder('默认文件夹', doc)
            }
        },
        closeDoc() {
            let doc = {
                uuid: this.docUUID,
                setting: this.setting,
                content: this.editor.getContents().ops,
            }
            if (this.docJson === JSON.stringify(doc)) {
                this.setPaperDefault()
                this.config.paperVisible = false
            } else {
                MessageBox.confirm('文档内容已发生改变, 是否保存?', '提示', {
                    confirmButtonText: '保存并关闭',
                    cancelButtonText: '不保存',
                    type: 'warning'
                }).then(() => {
                    this.saveFile()
                    Message({
                        type: 'success',
                        message: '已保存!'
                    });
                    this.setPaperDefault()
                    this.config.paperVisible = false
                }).catch(() => {
                    this.setPaperDefault()
                    this.config.paperVisible = false
                });
            }
        },
        setPaperDefault() {
            this.docUUID = ''
            this.docJson = ''
            this.setting = {
                showGrid: true,
                width: 900,
                margintop: 50,
                marginright: 50,
                marginbottom: 50,
                marginleft: 50,
                theme: 'none',
            }
            this.editor.setContents('')
        },
        generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        }
    },
}
</script>
<style lang="stylus">
.ql-container {
    font-size: 16px;
    color: #666;
}

.ql-editor {
    line-height: 50px;
    padding: 0;
}

.ql-tooltip
    display: none

</style>

<style scoped lang="stylus">

$primaryFontColor = #686868

#container
    width: 100vw
    height: 100vh
    overflow: hidden
    background: url('../assets/img/note_bg.jpg')
    position: relative
    #header
        background-color: #faf7ed
        border: none
        box-shadow: 0px 1px 5px #00000030
        text-align: center
        height: 60px
        width: 100%
        position: absolute
        top: 0
        left: 0
        z-index: 100
        user-select: none
        #brand
            height: 30px
            margin: 15px
            border: none
            float: left
        #right-menu
            height: 60px
            padding: 18px 0
            border: none
            font-size: 14px
            color: #666
            box-sizing: border-box
            position: absolute
            right: 15px
            top: 0
            user-select: none
        #center-menu
            width: 900px
            margin: 0 auto
            height: 60px
            padding: 18px 0
            border: none
            font-size: 14px
            color: #686868
            box-sizing: border-box
            text-align: left
    #main
        margin-top: 60px
        height: calc(100vh - 60px)
        overflow: auto
    #right-drawer
        position: absolute
        width: 300px
        height: 100%
        right: -310px
        top: 0
        background-color: #faf7ee
        z-index: 99
        transition: right 0.2s ease
        box-shadow: -1px 1px 5px #00000030
        padding: 80px 10px 10px 10px
        box-sizing: border-box
        .setting-panel
            user-select: none
            h3
                color: #666
                font-weight: 400
                margin-bottom: 30px
            .list-item
                margin: 10px 0
                padding: 0 20px
                label
                    cursor: pointer
                    margin-left: 10px
                    font-size: 14px
                    color: #666
    #left-drawer
        position: absolute
        width: 300px
        height: 100%
        left: -320px
        top: 0
        background-color: #faf7ee
        z-index: 99
        transition: left 0.2s ease
        box-shadow: 1px 1px 5px #00000030




#main::-webkit-scrollbar{
    width: 4px;
    background-color: #00000000;
}
#main::-webkit-scrollbar-thumb{
    width: 4px;
    background-color: #333;
    border-radius: 2px;
}

#mask::-webkit-scrollbar{
    width: 4px;
    background-color: #00000000;
}
#mask::-webkit-scrollbar-thumb{
    width: 4px;
    background-color: #fff;
    border-radius: 2px;
}

#word
    width: 600px
    margin: 50px auto
    color: #00000090
    font-size: 24px
    line-height: 1.8
    text-align: justify
    text-indent: 2em
    user-select: none

#paper {
    // width: 900px;
    min-height: 250px;
    margin: 10px auto;
    box-shadow: 0 0 10px #00000040;
    background-color: #faf7ee;
    // background-image: url('../assets/mountain.png');
    // background-image: url('../assets/meihua.png');
    background-repeat: no-repeat;
    transition: width 0.5s ease
}

#editor-wraper {
    min-height: 150px;
    background: url('../assets/img/grid.png');
    /* position: relative; */
    /* visibility: hidden; */
    /* flex-grow: 1; */
    box-sizing: border-box;
}

.drawer
    box-sizing: border-box
    padding: 70px 0
    user-select: none

.dropdown-menu
    display: none
    position: absolute
    list-style: none
    background-color: #faf7ee
    box-shadow: 1px 1px 1px #00000060
    width: 100px
    top: 44px
    li
        &:hover
            background-color: #99999920
    li+li
        border-top: 1px solid #ddd

.opt-btn
    display: inline-block
    width: 26px
    color: #686868
    text-align: center
    line-height: 24px
    outline: none
    box-sizing: border-box
    cursor: pointer
    padding: 0
    margin-right: 15px
    border-radius: 3px
    border: 1px solid #aaaaaa00
    background-color: transparent
    &:hover
        border: 1px solid #aaa
        .dropdown-menu
            display: block

.opt-btn-active
    border: 1px solid #aaa

.splitline
    background: #e7ded0
    margin-right: 15px
    width: 1px
    display: inline-block
    height: 22px

.opt-text-btn
    display: inline-block
    line-height: 40px
    box-sizing: border-box
    cursor: pointer
    padding: 0 13px
    border-radius: 3px
    border: 1px solid #aaaaaa00
    &:hover
        border: 1px solid #aaa


.layout {
    border: none;
}
.paper-left {
    flex-shrink: 0;
}
.paper-right {
    flex-shrink: 0;
}
.paper-center {
    flex-grow: 1;
}

#paper-top {
    // height: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;
}
#paper-content {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;
}
#paper-bottom {
    // height: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;
}
#paper-copyright {
    height: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;
}
#copyright-text {
    font-size: 14px;
    line-height: 50px;
    color: #999;
    user-select: none;
}
</style>
