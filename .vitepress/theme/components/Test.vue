<template>
    <div class="container">
        <h1>小说阅读器 API 测试</h1>

        <h2>获取章节目录</h2>
        <input type="number" v-model="directoryPage" placeholder="页码" />
        <input type="number" v-model="directorySize" placeholder="每页大小" />
        <button @click="fetchDirectory">获取目录</button>
        <pre class="response">{{ directoryResponse }}</pre>

        <h2>获取所有章节</h2>
        <input type="number" v-model="chaptersPage" placeholder="页码" />
        <input type="number" v-model="chaptersSize" placeholder="每页大小" />
        <button @click="fetchChapters">获取所有章节</button>
        <pre class="response">{{ chaptersResponse }}</pre>

        <h2>根据ID获取章节</h2>
        <input type="number" v-model="chapterId" placeholder="请输入章节ID" />
        <button @click="fetchChapter">获取章节</button>
        <pre class="response">{{ chapterResponse }}</pre>

        <h2>创建章节</h2>
        <input type="text" v-model="newChapterTitle" placeholder="章节标题" />
        <textarea v-model="newChapterContent" placeholder="章节内容" rows="4"></textarea>
        <button @click="createChapter">创建章节</button>
        <pre class="response">{{ createResponse }}</pre>

        <h2>更新章节</h2>
        <input type="number" v-model="updateChapterId" placeholder="章节ID" />
        <input type="text" v-model="updateChapterTitle" placeholder="章节标题" />
        <textarea v-model="updateChapterContent" placeholder="章节内容" rows="4"></textarea>
        <button @click="updateChapter">更新章节</button>
        <pre class="response">{{ updateResponse }}</pre>

        <h2>删除章节</h2>
        <input type="number" v-model="deleteChapterId" placeholder="章节ID" />
        <button @click="deleteChapter">删除章节</button>
        <pre class="response">{{ deleteResponse }}</pre>
    </div>
</template>

<script>
import { 
    getDirectory, 
    getChapters, 
    getChapter, 
    createChapter, 
    updateChapter, 
    deleteChapter 
} from '../utils/api'; // 导入 API 函数

export default {
    data() {
        return {
            directoryPage: 1,
            directorySize: 10,
            directoryResponse: '',
            chaptersPage: 1,
            chaptersSize: 10,
            chaptersResponse: '',
            chapterId: null,
            chapterResponse: '',
            newChapterTitle: '',
            newChapterContent: '',
            createResponse: '',
            updateChapterId: null,
            updateChapterTitle: '',
            updateChapterContent: '',
            updateResponse: '',
            deleteChapterId: null,
            deleteResponse: ''
        };
    },
    methods: {
        async fetchDirectory() {
            try {
                const data = await getDirectory(this.directoryPage, this.directorySize);
                this.directoryResponse = JSON.stringify(data, null, 2);
            } catch (error) {
                this.directoryResponse = 'Error: ' + error.message;
            }
        },
        async fetchChapters() {
            try {
                const data = await getChapters(this.chaptersPage, this.chaptersSize);
                this.chaptersResponse = JSON.stringify(data, null, 2);
            } catch (error) {
                this.chaptersResponse = 'Error: ' + error.message;
            }
        },
        async fetchChapter() {
            try {
                const data = await getChapter(this.chapterId);
                this.chapterResponse = JSON.stringify(data, null, 2);
            } catch (error) {
                this.chapterResponse = 'Error: ' + error.message;
            }
        },
        async createChapter() {
            const chapter = {
                chapterTitle: this.newChapterTitle,
                chapterContent: this.newChapterContent,
                additionalInfo: '' // 根据需要设置额外信息
            };
            try {
                const success = await createChapter(chapter);
                this.createResponse = success ? '创建成功' : '创建失败';
            } catch (error) {
                this.createResponse = 'Error: ' + error.message;
            }
        },
        async updateChapter() {
            const chapter = {
                chapterTitle: this.updateChapterTitle,
                chapterContent: this.updateChapterContent
            };
            try {
                const success = await updateChapter(this.updateChapterId, chapter);
                this.updateResponse = success ? '更新成功' : '更新失败';
            } catch (error) {
                this.updateResponse = 'Error: ' + error.message;
            }
        },
        async deleteChapter() {
            try {
                const success = await deleteChapter(this.deleteChapterId);
                this.deleteResponse = success ? '删除成功' : '删除失败';
            } catch (error) {
                this.deleteResponse = 'Error: ' + error.message;
            }
        }
    }
};
</script>

<style scoped>
.container {
    margin: 0 auto;
    max-width: 800px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}
h1 {
    text-align: center;
    margin-bottom: 30px;
}
h2 {
    margin-top: 20px;
    margin-bottom: 10px;
}
button {
    margin-top: 10px;
    padding: 10px 15px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
}
button:hover {
    background-color: #0056b3;
}
.response {
    margin-top: 10px;
    padding: 15px;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}
input, textarea {
    width: calc(100% - 22px);
    padding: 10px;
    margin-top: 5px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
input[type="number"] {
    max-width: 200px;
}
</style>
