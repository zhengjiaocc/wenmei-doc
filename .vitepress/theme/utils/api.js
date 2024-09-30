// api.js

import axios from 'axios';

// 设置基础路径，用于后续所有 API 请求
// const API_BASE_URL = 'https://n.zhengjiao.cc:10004/api/chapters';
const API_BASE_URL = 'http://localhost:8080/api/chapters';


/**
 * 获取章节目录，支持分页
 * @param {number} page - 当前页码，默认为1
 * @param {number} size - 每页返回的章节数量，默认为10
 * @returns {Promise<Object>} - 返回章节目录数据的 Promise
 */

//返回结果格式
// {
//     "records": [
//       {
//         "id": 1,
//         "chapterTitle": "　　第1章 后妈如妹，妹似后妈"
//       },
//       {
//         "id": 2,
//         "chapterTitle": "　　第2章 我的问题妹妹"
//       },
//       {
//         "id": 3,
//         "chapterTitle": "　　第3章 见光死！妹妹的羞人秘密"
//       }
//     ],
//     "total": 1884,
//     "size": 3,
//     "current": 1,
//     "pages": 628
//   }
export const getDirectory = async (page = 1, size = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/directory`, {
            params: { page, size }, // 设置请求参数
        });
        return response.data; // 返回章节目录数据
    } catch (error) {
        console.error('获取章节目录失败:', error); // 打印错误信息
        throw error; // 抛出错误以便调用方处理
    }
};

/**
 * 获取所有章节，支持分页
 * @param {number} page - 当前页码，默认为1
 * @param {number} size - 每页返回的章节数量，默认为10
 * @returns {Promise<Object>} - 返回章节列表数据的 Promise
 */
//返回示例如下
// {
//     "records": [
//       {
//         "id": 1,
//         "chapterTitle": "章节1",
//         "chapterContent": "章节内容1",
//         "additionalInfo": "PS:\r\n　　本书创作灵感源于一本轻小说",
//         "createdAt": "2024-09-30T04:58:16.000+00:00",
//         "updatedAt": "2024-09-30T08:30:02.000+00:00"
//       },
//       {
//         "id": 2,
//         "chapterTitle": "标题2",
//         "chapterContent": "章节内容2",
//         "additionalInfo": "PS:\r\n　　每日两章更新，风雨不间断",
//         "createdAt": "2024-09-30T04:58:16.000+00:00",
//         "updatedAt": "2024-09-30T08:30:20.000+00:00"
//       },
//       {
//         "id": 3,
//         "chapterTitle": "标题3",
//         "chapterContent": "章节内容3",
//         "additionalInfo": "PS:\r\n　　新书上传",
//         "createdAt": "2024-09-30T04:58:16.000+00:00",
//         "updatedAt": "2024-09-30T08:30:31.000+00:00"
//       }
//     ],
//     "total": 1884,
//     "size": 3,
//     "current": 1,
//     "pages": 628
//   }

export const getChapters = async (page = 1, size = 10) => {
    try {
        const response = await axios.get(API_BASE_URL, {
            params: { page, size }, // 设置请求参数
        });
        return response.data; // 返回章节列表数据
    } catch (error) {
        console.error('获取所有章节失败:', error); // 打印错误信息
        throw error; // 抛出错误以便调用方处理
    }
};

/**
 * 根据章节ID获取章节详细信息
 * @param {number} id - 章节的唯一标识符
 * @returns {Promise<Object>} - 返回章节信息的 Promise
 */

//返回示例
// {
//     "id": 1,
//     "chapterTitle": "章节1",
//     "chapterContent": "章节内容1",
//     "additionalInfo": "PS:\r\n　　本书创作灵感源于一本轻小说",
//     "createdAt": "2024-09-30T04:58:16.000+00:00",
//     "updatedAt": "2024-09-30T08:30:02.000+00:00"
//   }
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
 * 创建新的章节
 * @param {Object} chapter - 章节对象，包括标题和内容等信息
 * @returns {Promise<boolean>} - 返回创建成功状态的 Promise
 */
export const createChapter = async (chapter) => {
    try {
        const response = await axios.post(API_BASE_URL, chapter); // 发送创建章节请求
        return response.status === 201; // 返回创建成功状态，201表示创建成功
    } catch (error) {
        console.error('创建章节失败:', error); // 打印错误信息
        throw error; // 抛出错误以便调用方处理
    }
};

/**
 * 更新章节信息
 * @param {number} id - 章节的唯一标识符
 * @param {Object} chapter - 包含更新信息的章节对象
 * @returns {Promise<boolean>} - 返回更新成功状态的 Promise
 */
export const updateChapter = async (id, chapter) => {
    try {
        await axios.put(`${API_BASE_URL}/${id}`, chapter); // 发送更新章节请求
        return true; // 返回更新成功状态
    } catch (error) {
        console.error(`更新章节 ${id} 失败:`, error); // 打印错误信息
        throw error; // 抛出错误以便调用方处理
    }
};

/**
 * 删除章节
 * @param {number} id - 章节的唯一标识符
 * @returns {Promise<boolean>} - 返回删除成功状态的 Promise
 */
export const deleteChapter = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`); // 发送删除章节请求
        return true; // 返回删除成功状态
    } catch (error) {
        console.error(`删除章节 ${id} 失败:`, error); // 打印错误信息
        throw error; // 抛出错误以便调用方处理
    }
};
