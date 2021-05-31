import { ref, computed } from "vue";

export default function () {
    const count = ref(0);

    //抢购时间 和 当前时间比较
    const findGoodsState = (date) => {
        let time = formatTime(date)
        let currentDate = currentTime()
        let gDay = new Date(time.split(' ')[0]).getTime() / 1000;
        let day = new Date(currentDate.split(' ')[0]).getTime() / 1000;
        let gTime = new Date(time).getTime() / 1000;

        //0 已结束   1未开始   2即将开始  3进行中 
        let state = 0;      
        
        //抢购日期是否是今天
        if(gDay == day){
            state = 2
            if(gTime >= currentDate){
                // 已结束
            }else{
                //即将开始
            }
        }else if(gDay < day){
            //已结束
            state = 0
        }else {
            //未开始
            state = 1
        }

        return state
    }

    function formatTime(timestamp, type) {
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
            decimals: '.' + result.split('.')[1]
        };
    }


    return {
        findGoodsState,
        formatTime,
        priceFormat
    }
}
