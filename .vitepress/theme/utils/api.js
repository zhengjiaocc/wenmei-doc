import axios from 'axios';

// 设置基础路径，用于后续所有 API 请求
// const API_BASE_URL = 'http://localhost:10001/api/chapters';
// const API_BASE_URL = 'https://n.zhengjiao.cc/api/chapters';
const API_BASE_URL = 'https://novel.zhengjiao.cc/api/chapters';



/**
 * 根据章节ID获取章节详细信息
 * @param {number} id - 章节的唯一标识符
 * @returns {Promise<Object>} - 返回章节信息的 Promise
 * 
 * 返回示例：
 * {
 *   "id": 1,
 *   "chapterTitle": "第1章 后妈如妹，妹似后妈",
 *   "content": "章节的详细内容"
 * }
 */
export const getChapter = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`); // 根据ID获取章节信息
        return response.data; // 返回章节信息
    } catch (error) {
        console.error(`获取章节 ${id} 失败:`, error); // 打印错误信息
        throw error; // 抛出错误以便调用方处理
    }
};


/**
 * 获取所有章节目录
 * @returns {Promise<Array>} - 返回章节目录数据的 Promise
 * 
 * 返回示例：
 * [
 *   {
 *     "id": 1,
 *     "chapterTitle": "第1章 后妈如妹，妹似后妈"
 *   },
 *   {
 *     "id": 2,
 *     "chapterTitle": "第2章 我的问题妹妹"
 *   }
 * ]
 */
export const getAllChapterDirectory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all-directory`); // 请求所有章节目录
        return response.data; // 返回章节目录数据
    } catch (error) {
        console.error('获取所有章节目录失败:', error); // 打印错误信息
        throw error; // 抛出错误以便调用方处理
    }
};
