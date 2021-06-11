export const showToast = function (title, icon='none', duration=2000){
    wx.showToast({
        title: title,
        icon: icon,
        duration: duration
    })
}