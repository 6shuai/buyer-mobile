import { useStore } from 'vuex'
export default function () {
    const store = useStore()

    //抢购时间 和 当前时间比较   id 抢购id
    const findGoodsState = (date, id) => {
        let status = 0;      
        if(!date) return status
        let time = formatTime(date)
        let currentDate = currentTime()
        let gDay = new Date(time.split(' ')[0]).getTime() / 1000;
        let day = new Date(currentDate.split(' ')[0]).getTime() / 1000;
        let gTime = new Date(time).getTime() / 1000;
        let cTime = new Date(currentDate).getTime() / 1000;

        //0 已结束   1未开始   2即将开始  3进行中 
        // today state: 1 已结束   2 进行中   3 未开始 
        
        //抢购日期是否是今天
        if(gDay == day){
            status = 2

            store.state.goodsDataState.today.forEach(item => {
                if(item.auctionId == id){
                    switch (item.state) {
                        case 1:
                            status = 0
                            break;
                        case 2:
                            status = 3
                            break;
                        case 3:
                            status = 2
                            break;
                        default:
                            break;
                    }
                }
            })
        }else if(gDay < day){
            //已结束
            status = 0
        }else {
            //未开始
            status = 1
        }
        return status
    }

    function test(){
        return 'test'
    }

    function formatTime(timestamp, type) {
        if(!timestamp) return
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = addPreZero(date.getMonth() + 1) + '-';
        var D = addPreZero(date.getDate()) + ' ';
        var h = addPreZero(date.getHours()) + ':';
        var m = addPreZero(date.getMinutes()) + ':';
        var s = addPreZero(date.getSeconds());
        if (type == 'time') {
            return h + m + s;
        } else {
            return Y + M + D + h + m + s
        }
    }

    //小于10 前面补个0
    function addPreZero(number) {
        return number < 10 ? '0' + number : number;
    }

    //获取当前时间
    function currentTime(){ 
        var now = new Date();
        
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        
        var clock = year + "-";
        
        if(month < 10)
            clock += "0";
        
        clock += month + "-";
        
        if(day < 10)
            clock += "0";
            
        clock += day + " ";
        
        if(hh < 10)
            clock += "0";
            
        clock += hh + ":";
        if (mm < 10) clock += '0'; 
        clock += mm; 
        return(clock); 
    }


    //价格格式   
    //整数部分大于4位 使用千位分割
    const priceFormat = (x) => {
        //强制保留两位小数
        var f = parseFloat(x);
        if (isNaN(f)) return x;
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length < (rs + 1) + 2) {
            s += '0';
        }
        //每三位用一个逗号隔开
        var leftNum = s.split(".")[0];
        var rightNum = "."+s.split(".")[1];
        var result;
        //定义数组记录截取后的价格
        var resultArray = new Array();
        if(leftNum.length > 3){
            var i = true;
            while (i){
                resultArray.push(leftNum.slice(-3));
                leftNum = leftNum.slice(0, leftNum.length - 3);
                if(leftNum.length < 4){
                    i = false;
                }
            }
            //由于从后向前截取，所以从最后一个开始遍历并存到一个新的数组，顺序调换
            var sortArray = new Array();
            for(var i = resultArray.length-1; i >= 0; i--){
                sortArray.push(resultArray[i]);
            }
            result = leftNum + "," + sortArray.join(",") + rightNum;
        }else {
            result = s;
        }
        return {
            int: result.split('.')[0],
            decimals: '.' + result.split('.')[1],
            full: Number(result.replace(',', ''))
        };
    }

    //传入时间  和 时长  返回一个新的时间
   function findNewTime(time, duration) {
        let t = time.split(":");
        //小时
        let h = Number(t[0]);
        //分钟
        let m = Number(t[1]);
        //秒
        let s = Number(t[2]);

        //秒转换成分钟  余出来的秒数
        let remainderS = duration % 60;

        if (d > 60) {
            h = h + (d - d % 60) / 60;
            d = d % 60;
        } else if (d < -60) {
            h = h - (Math.abs(d) - d % 60) / 60;
            d = d % 60;
        } 

        //秒数转为 分钟
        let d = (duration - remainderS) / 60;
        if (s + remainderS >= 60) {
            s = s + remainderS - 60;
            m = m + 1;
        } else if (s + remainderS < 0) {
            s = 60 - Math.abs(s + remainderS);
            m = m - 1;
        } else {
            s = s + remainderS;
        }
        if (m + d >= 60) {
            m = m + d - 60;
            h = h + 1;
        } else if (m + d < 0) {
            m = 60 - Math.abs(m + d);
            h = h - 1;
        } else {
            m = m + d;
        }
        return (
            addPreZero(h) +
            ":" +
            addPreZero(m) +
            ":" +
            addPreZero(s)
        );
    }


    return {
        findGoodsState,
        formatTime,
        priceFormat,
        findNewTime,
        test
    }
}
