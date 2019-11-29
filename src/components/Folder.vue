<template>
<div id="folder-wrapper">
    <div class="opt-btns">
        <span class="opt-btn fa-stack" @click="createFolder">
                <i  class="fa fa-folder-o fa-stack-1x"></i>
                <i  class="fa fa-plus fa-stack-1x"></i>
            </span>
        <span class="opt-btn" @click="">
                <i  class="fa fa-download"></i>
            </span>
    </div>
    <!-- <div id="folder-list">
        <div :class="{'folder-list-item':true, 'active-folder': i.name === activeFolder}" v-for="i in folders" :key="i.name" @click="activeFolder = i.name">
            <div class="">
                <i class="fa fa-folder-o"></i>
                <span v-text="i.name"></span>
                <span class="file-count" v-text="i.files.length"></span>
                <i class="fa fa-trash-o" @click="deleteFolder(i.name)"></i>
            </div>
            <div class="file-list" v-show="i.name === activeFolder">
                <div class="file-list-item" v-for="f in i.files" @click="$emit('display-article', f)">
                    <i class="fa fa-file-o"></i>
                    <span v-text="getFileTitle(f.content)"></span>
                </div>
            </div>
        </div>
    </div> -->
    <tree :data="folders" :props="defaultProps">
        <span class="folder-list-item" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
        </span>
    </tree>
</div>
</template>

<script>
import {
    MessageBox,
    Message,
    Tree,
} from 'element-ui'

export default {
    name: 'Folder',
    components: {
        Tree,
    },
    data: function() {
        return {
            folders: [],
            activeFolder: '默认文件夹',
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    mounted: function() {
        this.initFolder()
        // this.refreshFolders()
    },
    methods: {
        initFolder() {
            this.$vlf.keys()
            .then(keys => {
                if (!keys.length) {
                    this.$vlf.setItem('默认文件夹', {
                        createTime: (new Date()).getTime(),
                        files: []
                    }).then(() => {
                        this.refreshFolders()
                    })
                } else {
                    this.refreshFolders()
                }
            })
        },
        createFolder() {
            MessageBox.prompt('请输入文件夹名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: this.validaterFolderName
            }).then(({
                value
            }) => {
                this.$vlf.setItem(value, {
                    createTime: (new Date()).getTime(),
                    files: []
                })
                    .then(() => {
                        this.refreshFolders()
                    })
            })
        },
        deleteFolder(i) {
            if (i === '默认文件夹') {
                Message({
                    message: `不能删除【默认文件夹】`,
                    type: 'warning'
                })
                return
            }
            MessageBox.confirm('此操作将永久删除该文件夹及其下文档, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.$vlf.removeItem(i)
                    .then(() => {
                        Message({
                            message: `文件夹【${i}】已被删除`,
                            type: 'success'
                        });
                        this.refreshFolders()
                    })
                })
        },
        refreshFolders() {
            let treeData = []
            this.$vlf.keys()
            .then(keys => {
                keys.forEach(i => {
                    let t = {
                        label: i,
                        children: []
                    }
                    this.$vlf.getItem(i)
                    .then(v => {
                        if (v.files) {
                            v.files.forEach(i => {
                                let f = {
                                    label: i.content[0].insert,
                                    uuid: i.uuid,
                                }
                                t.children.push(f)
                            })
                        }
                    })
                    treeData.push(t)
                })
                this.folders = treeData
            })
        },
        validaterFolderName(i) {
            let name
            if (!i || !i.trim()) {
                return '不能为空'
            }
            name = i.trim()

            if (name.length > 20) {
                return '长度不能大于20'
            } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(name)) {
                return '只能包括字母、数字、汉字'
            } else if (this.folders.some(i => i.name == name)) {
                return '已有同名文件夹'
            }
        },
        saveFileToFolder(folderName, obj) {
            let folder = this.folders.find(i => i.name == folderName)
            if (folder) {
                folder.files.push(obj)
                this.$vlf.setItem(folderName, folder)
                .then(() => {
                    Message({
                        message: `已保存`,
                        type: 'success'
                    });
                    this.refreshFolders()
                })
            } else {
                Message({
                    message: `未找到文件夹【${folderName}】`,
                    type: 'error'
                });
            }
        },
        getFileTitle(content) {
            if (Array.isArray(content)) {
                let notNullLine = content.find(i => {
                    return !!i.insert.trim()
                })
                if (notNullLine) {
                    return notNullLine.insert.trim().slice(0, 30)
                } else {
                    return '未命名文档'
                }
            } else {
                console.warn('The file content is not an array!');
            }
        },
        saveFolder(folderName) {
            let folder = this.folders.find(i => i.name == folderName)
            if (folder) {
                this.$vlf.setItem(folderName, folder)
                .then(() => {
                    Message({
                        message: `已保存`,
                        type: 'success'
                    });
                })
            } else {
                Message({
                    message: `未找到文件夹【${folderName}】`,
                    type: 'error'
                });
            }
        },
    }
}
</script>

<style scoped lang="stylus">
#folder-wrapper
    height: 100%
.el-tree
    background: transparent
.el-tree-node
    height: 50px !important
.folder-list-item
    background-color: #faf7ee
    height: 50px
    font-size: 16px
    line-height: 50px
    padding: 0 10px
    cursor: pointer
    color: #666

.opt-btns
    box-sizing: border-box
    width: 100%
    height: 50px
    border: none
    font-size: 16px
    line-height: 24px
    color: #d3c9b9
    padding: 8px
    .opt-btn
        border: 1px solid transparent
        border-radius: 3px
        display: inline-block
        cursor: pointer
        font-size: 24px
        line-height: 36px
        height: 36px
        width: 36px
        text-align: center
        &:hover
            border-color: #00000060

</style>
