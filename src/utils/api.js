const { request } = request('./request.js')

module.exports = {
    // 获取banner 列表
    api_BannerList: (data) => request('/banner', {
        ...data
    })
}