 <template>
   <div ref="parent" class="gamemap">
     <canvas ref="canvas" tabindex="0">

     </canvas> <!-- 这是一个画布，调取其中的api来绘制我们的地图 -->
   </div>
 </template>
 <script>
 import {GameMap} from "@/assets/scripts/GameMap";//导入Js地图类
 import {ref,onMounted} from "vue";
 export default{
    setup(){
      let parent=ref(null);
      let canvas=ref(null);//ref为响应式函数,用于自动更新数据
      onMounted(()=>{
        new GameMap(canvas.value.getContext('2d'),parent.value)
      })//生命周期钩子函数，在组件的mounted生命周期之前调用
      return{
        parent,
        canvas
      }
    }//setup函数是一个组件实例创建之前立即执行的函数
 }
 </script>
 <style scoped>
div.gamemap{
  width:100%;
  height:100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
 </style>