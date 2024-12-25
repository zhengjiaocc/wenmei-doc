import axios from 'axios';

const API_BASE_URL = 'https://s.zhengjiao.cc/ym/';
const CACHE_KEY = 'signInData';
const CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存时间 (10分钟 * 60秒 * 1000毫秒)
const GROUP_CACHE_KEY = 'groupInfoData';
const GROUP_CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存时间

/**
 * 批量查询用户签到数据
 * @param {number} pageSize - 每页显示的条数
 * @param {number} currentPage - 当前页码
 * @returns {Promise<Object>} - 返回用户签到数据的 Promise
 */
export const getSignInData = async (pageSize, currentPage) => {
    try {
        console.log('开始获取签到数据...', { pageSize, currentPage });
        // 检查缓存
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            const now = new Date().getTime();
            const timeLeft = CACHE_DURATION - (now - timestamp);
            console.log('找到签到数据缓存', { 
                cacheTimeLeft: Math.round(timeLeft / 1000) + '秒',
                dataCount: data.length 
            });
            
            // 如果缓存未过期，直接返回缓存数据
            if (now - timestamp < CACHE_DURATION) {
                console.log('使用签到数据缓存');
                return {
                    code: 200,
                    message: "操作成功",
                    data: data
                };
            }
            console.log('签到数据缓存已过期，重新请求');
        } else {
            console.log('未找到签到数据缓存');
        }

        console.log('请求签到数据:', `${API_BASE_URL}/signIn`);
        const response = await axios.get(`${API_BASE_URL}/signIn`, {
            params: {
                pageSize: pageSize,
                currentPage: currentPage
            }
        });

        // 缓存新数据
        if (response.data.code === 200) {
            console.log('签到数据请求成功，更新缓存', { 
                dataCount: response.data.data.length 
            });
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: response.data.data,
                timestamp: new Date().getTime()
            }));
        }

        return response.data;
    } catch (error) {
        console.error('获取签到数据失败:', error.message);
        // 如果请求失败但有缓存数据，返回缓存数据
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { data } = JSON.parse(cachedData);
            console.log('请求失败，使用缓存数据', { 
                dataCount: data.length 
            });
            return {
                code: 200,
                message: "使用缓存数据",
                data: data
            };
        }
        throw error;
    }
};


/**
 * 获取群组信息
 * @returns {Promise<Object>} - 返回群组信息的 Promise
 */
export const getGroupInfo = async () => {
    try {
        console.log('开始获取群组信息...');
        // 检查缓存
        const cachedData = localStorage.getItem(GROUP_CACHE_KEY);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            const now = new Date().getTime();
            const timeLeft = GROUP_CACHE_DURATION - (now - timestamp);
            console.log('找到群组信息缓存', { 
                cacheTimeLeft: Math.round(timeLeft / 1000) + '秒',
                groupCount: data.length 
            });
            
            // 如果缓存未过期，直接返回缓存数据
            if (now - timestamp < GROUP_CACHE_DURATION) {
                console.log('使用群组信息缓存');
                return {
                    code: 200,
                    message: "操作成功",
                    data: data
                };
            }
            console.log('群组信息缓存已过期，重新请求');
        } else {
            console.log('未找到群组信息缓存');
        }

        console.log('请求群组信息:', `${API_BASE_URL}/groupInfo`);
        const response = await axios.get(`${API_BASE_URL}/groupInfo`);

        // 缓存新数据
        if (response.data.code === 200) {
            console.log('群组信息请求成功，更新缓存', { 
                groupCount: response.data.data.length 
            });
            localStorage.setItem(GROUP_CACHE_KEY, JSON.stringify({
                data: response.data.data,
                timestamp: new Date().getTime()
            }));
        }

        return response.data;
    } catch (error) {
        console.error('获取群组信息失败:', {
            message: error.message,
            url: `${API_BASE_URL}/groupInfo`
        });
        throw error;
    }
};

// 获取群组消息，响应示例
// {
//     "code": 200,
//     "message": "群聊信息获取成功",
//     "data": [
//         {
//             "groupId": "458281450",
//             "groupName": "缘盟六群",
//             "memberCount": "1985",
//             "maxMemberCount": "2000",
//             "avatar": "https://p.qlogo.cn/gh/458281450/458281450/640/\n"
//         },
//         {
//             "groupId": "829327576",
//             "groupName": "缘盟七群",
//             "memberCount": "2000",
//             "maxMemberCount": "2000",
//             "avatar": "https://p.qlogo.cn/gh/829327576/829327576/640/\n"
//         },
//         {
//             "groupId": "17403522",
//             "groupName": "缘盟一群",
//             "memberCount": "1942",
//             "maxMemberCount": "2000",
//             "avatar": "https://p.qlogo.cn/gh/17403522/17403522/640/\n"
//         }
//     ]
// }