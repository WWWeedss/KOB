import {AcGameObject} from "@/assets/scripts/AcGameObject";
//如果引用类是export出来的，就需要大括号扩类名
//如果引用类是default，就不需要大括号
import {Wall}from "@/assets/scripts/Wall"
import {Snake} from "@/assets/scripts/Snake";
export class GameMap extends AcGameObject{
    constructor(ctx,parent) {
        super();
        this.ctx=ctx;
        this.parent=parent;
        this.L=0;

        this.rows=13;
        this.cols=14;
        this.inner_walls_count=15;
        this.walls=[];

        this.snakes=[
            new Snake({id:0,color:"#4775ED",r:this.rows-2,c:1},this),
            new Snake({id:1,color:"#F94848",r:1,c:this.cols-2},this)
        ];

    }
    //检查两条蛇初始位置的连通性，使用floodFill算法检查
    check_connectivity(g,sx,sy,tx,ty){
        if(sx===tx&&sy===ty){
            return true;
        }
        g[sx][sy]=true;//防止无限递归
        let dx=[-1,0,1,0];let dy=[0,1,0,-1];
        for(let i=0;i<4;i++){
            let x = sx+dx[i],y=sy+dy[i];
            if(!g[x][y]&&this.check_connectivity(g,x,y,tx,ty))return true;
        }
        return false;
    }    create_walls(){
        const g=[];
        for(let r=0;r<this.rows;r++){
            g[r]=[];
            for(let c=0;c<this.cols;c++){
                g[r][c]=false;
            }
        }
        //给四周加上障碍物
        for(let r=0;r<this.rows;r++){
            g[r][0]=g[r][this.cols-1]=true;
        }
        for(let c=0;c<this.cols;c++){
            g[0][c]=g[this.rows-1][c]=true;
        }
        //创建随机障碍物
        for(let i = 0;i<this.inner_walls_count;i++){
            for(let j=0;j<1000;j++){
                let r = parseInt(Math.random()*this.rows);
                let c = parseInt(Math.random()*this.cols);
                if(g[r][c]||g[this.rows-1-r][this.cols-1-c])continue;
                if((r===this.rows-2 && c===1) ||(r===1&&c===this.cols-2))continue;
                g[r][c]=g[this.rows-1-r][this.cols-1-c]=true;//保证中心对称，同时绘制两个
                break;
            }
        }
        const copy_g=JSON.parse(JSON.stringify(g));//复制地图的boolean，因为check函数内会对数组进行改写
        //如果两条蛇起始点不连通，那么在外部重新调用函数
        if(!this.check_connectivity(copy_g,this.rows-2,1,1,this.cols-2))return false;
        //绘制障碍物
        for(let r=0;r<this.rows;r++){
            for(let c=0;c<this.cols;c++){
                if(g[r][c]){
                    this.walls.push(new Wall(r,c,this))
                }
            }
        }
        return true;
    }
    add_listening_events(){
        this.ctx.canvas.focus();
        const [snake0,snake1]=this.snakes;
        this.ctx.canvas.addEventListener("keydown",e=>{
            if(e.key==='w')snake0.set_direction(0); //,#F94848,#4775ED
            else if(e.key==='d')snake0.set_direction(1);
            else if(e.key==='s')snake0.set_direction(2);
            else if(e.key==='a')snake0.set_direction(3);
            else if(e.key==='ArrowUp')snake1.set_direction(0);
            else if(e.key==='ArrowRight')snake1.set_direction(1);
            else if(e.key==='ArrowDown')snake1.set_direction(2);
            else if(e.key==='ArrowLeft')snake1.set_direction(3);
        });
}
    start(){
        this.L=parseInt(Math.min(this.parent.clientWidth/this.cols,this.parent.clientHeight/this.rows));
        for(let i=0;i<1000;i++) if(this.create_walls())break;
        this.add_listening_events();
    }
    update_size(){
        this.L=parseInt(Math.min(this.parent.clientWidth/this.cols,this.parent.clientHeight/this.rows));
        this.ctx.canvas.width=this.L*this.cols;
        this.ctx.canvas.height=this.L*this.rows;
    }
    check_ready(){//判断两条蛇是否都准备好下一回合了
        for(const snake of this.snakes){
            if(snake.status !=="idle")return false;
            if(snake.direction === -1)return false;
        }
        return true;
    }
    next_step(){//让两条蛇进入下一回合
        for(const snake of this.snakes){
            snake.next_step();
        }
    }
    check_valid(cell){//检测目标位置是否合法:墙、身体
        for(const wall of this.walls){
            if(wall.r===cell.r&&wall.c===cell.c){
                return false;
            }
        }
        for(const snake of this.snakes){//撞到蛇身
            let k=snake.cells.length;
            if(!snake.check_tail_increasing()){
                k--;
            }//当蛇尾会前进的时候，蛇尾不需要判断
            for(let i=0;i<k;i++){
                if(snake.cells[i].r===cell.r&&snake.cells[i].c===cell.c){
                    return false;
                }
            }
        }
        return true;
    }
    update(){
        this.update_size();
        if(this.check_ready()){
            this.next_step();
        }
        this.render();
    }
    render(){
       const color_even="#AAD751",color_odd="#A2D149";
       for(let r=0;r<this.rows;r++){
           for(let c=0;c<this.cols;c++){
                if((r+c)%2===0){
                    this.ctx.fillStyle=color_even;
                }
                else{this.ctx.fillStyle=color_odd;}
                 this.ctx.fillRect(c*this.L,r*this.L,this.L,this.L);
           }
       }
    }//绘画函数
}