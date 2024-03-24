//这是游戏对象类
const AC_GAME_OBJECTS=[];

export class AcGameObject{
    constructor() {
        AC_GAME_OBJECTS.push(this);//每次创建新实例时，将当前对象添加到数组内
        this.timedelta=0; //时间间隔
        this.has_called_start=false;//查询是否已初始化
    }
    start(){

    }//只执行一次
    update(){
    }//每一帧执行一次，除了第一帧之外

    on_destroy(){

    }//删除之前执行
    destroy(){
        this.on_destroy();
        for(let i in AC_GAME_OBJECTS){
            const obj = AC_GAME_OBJECTS[i];
            if(obj===this){
                AC_GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}
let last_timestamp;//上一次执行的时刻
const step=(timestamp)=>{//每一次requestAnimationFrame函数都会传回timestamp参数
    for(let obj of AC_GAME_OBJECTS){
        if(!obj.has_called_start){
            obj.has_called_start=true;
            obj.start();
        }
        else{
            obj.timedelta=timestamp-last_timestamp;
            obj.update();
        }
    }//第一帧执行start函数，后面每一帧都执行update函数
    last_timestamp=timestamp;
    requestAnimationFrame(step)//递归调用，保证每次浏览器刷新都调用step函数
}

requestAnimationFrame(step)//每次浏览器刷新时先调用step函数，浏览器默认60fps