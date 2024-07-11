// 统计数据请求模块（baiduStats.js）

// 封装获取网站概况趋势数据的函数
export function getTimeTrendRpt(siteId, startDate, endDate) {
    const requestData = {
        header: {
            userName: "zhengjiaocc", // 替换成你的用户名
            accessToken: "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhY2MiLCJhdWQiOiLnmb7luqbnu5_orqEiLCJ1aWQiOjU2OTQ3MDg3LCJhcHBJZCI6IjEzYmQ1MDQ5YTY3NmQxMDczNzk1OTkzMjEwMmVjNTU3IiwiaXNzIjoi5ZWG5Lia5byA5Y-R6ICF5Lit5b-DIiwicGxhdGZvcm1JZCI6IjQ5NjAzNDU5NjU5NTg1NjE3OTQiLCJleHAiOjE3MjMyMzI0MjYsImp0aSI6Ijg3ODQ2NzkzMzU2MDY2NDA2NzkifQ.bP9Gcv1HwdXdczF7wo2i56B2exrmxTktB4Xpz3Cr3TLd_3wG3k6MB-Eb5zmp90IM", // 替换成你的访问令牌
            account_type: 1
        },
        body: {
            site_id: siteId,
            start_date: startDate,
            end_date: endDate,
            metrics: "pv_count,visitor_count,ip_count", // 替换成你需要的指标，逗号分隔
            method: "overview/getTimeTrendRpt"
        }
    };

    return fetch('https://api.baidu.com/json/tongji/v1/ReportService/getData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json());
}

// 封装其他类型的统计数据请求函数...

