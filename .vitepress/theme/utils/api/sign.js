import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/ym';

// 批量查询用户签到数据
/**
 * 批量查询用户签到数据
 * @param {number} pageSize - 每页显示的条数
 * @param {number} currentPage - 当前页码
 * @returns {Promise<Object>} - 返回用户签到数据的 Promise
 * 
 * 返回示例：
 * {
 *   "code": 200,
 *   "message": "操作成功",
 *   "data": [
 *     {
 *       "uid": "u_mlj6OOrAcWjrB_JRPvhfmQ",
 *       "uin": "2431136865",
 *       "nick": "昔素霜",
 *       "avatar": "https://q1.qlogo.cn/headimg_dl?dst_uin=2431136865&spec=140",
 *       "description": "夜暗方显万颗星，灯明始见一缕尘。",
 *       "signCount": 92
 *     },
 *     ...
 *   ]
 * }
 */
export const getSignInData = async (pageSize, currentPage) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/signIn`, {
            params: {
                pageSize: pageSize,        // 每页显示的条数
                currentPage: currentPage   // 当前页码
            }
        });
        return response.data; // 返回接口数据
    } catch (error) {
        console.error('获取用户签到数据失败:', error); // 打印错误信息
        throw error; // 抛出错误以便调用方处理
    }
};
