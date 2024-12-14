import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/ym';
const CACHE_KEY = 'signInData';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1天缓存时间 (24小时 * 60分钟 * 60秒 * 1000毫秒)

/**
 * 批量查询用户签到数据
 * @param {number} pageSize - 每页显示的条数
 * @param {number} currentPage - 当前页码
 * @returns {Promise<Object>} - 返回用户签到数据的 Promise
 */
export const getSignInData = async (pageSize, currentPage) => {
    try {
        // 检查缓存
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            const now = new Date().getTime();
            
            // 如果缓存未过期，直接返回缓存数据
            if (now - timestamp < CACHE_DURATION) {
                return {
                    code: 200,
                    message: "操作成功",
                    data: data
                };
            }
        }

        const response = await axios.get(`${API_BASE_URL}/signIn`, {
            params: {
                pageSize: pageSize,
                currentPage: currentPage
            }
        });

        // 缓存新数据
        if (response.data.code === 200) {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: response.data.data,
                timestamp: new Date().getTime()
            }));
        }

        return response.data;
    } catch (error) {
        console.error('获取���户签到数据失败:', error);
        // 如果请求失败但有缓存数据，返回缓存数据
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { data } = JSON.parse(cachedData);
            return {
                code: 200,
                message: "使用缓存数据",
                data: data
            };
        }
        throw error;
    }
};
