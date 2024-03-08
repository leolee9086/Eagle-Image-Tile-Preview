eagle.onPluginCreate(async(plugin) => {
    refreshPreview()
    setInterval(refreshPreview,500)
});
let fileURL
let width
let borderSwitcher
let _adjustBackgroundSize
document.addEventListener('DOMContentLoaded', function() {
    const switchElement = document.getElementById('borderSwitcher');
    if (switchElement) {
        switchElement.addEventListener('change', function() {
            borderSwitcher = this.checked; // 更新borderSwitcher的值为true或false
            _adjustBackgroundSize(width); // 重新调用adjustBackgroundSize以应用新的样式
        });
    }
});
const refreshPreview =async()=>{
    const item = await eagle.item.getSelected();
    console.log(item);
    const first = item[0];
    if(!first){
        return
    }
    if(first.fileURL===fileURL){
        return
    } 
    fileURL = first.fileURL;
    width = window.innerWidth / 3
    const previewer = document.querySelector('#previewer');

    // 创建一个新的Image对象来加载图片并获取其尺寸
    const img = new Image();
    img.onload = function() {
      let imgWidth = this.width;
      let imgHeight = this.height;
      let aspectRatio = imgWidth / imgHeight;
  
      function adjustBackgroundSize(width = window.innerWidth / 3) { // 默认宽度为窗口宽度的1/3
        const height = width / aspectRatio; // 根据图片实际比例计算高度
    
        // 根据borderSwitcher的值决定是否显示边界
        let backgroundImage, backgroundSize, backgroundRepeat;
        if (borderSwitcher) {
            backgroundImage = `linear-gradient(90deg, rgba(0,0,0,0.5) 0px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,0.5) 0px, transparent 1px), url('${fileURL}')`;
            backgroundSize = `${width}px 100%, 100% ${height}px, ${width}px ${height}px`; // 前两个尺寸是虚线的尺寸，最后一个是图片的尺寸
            backgroundRepeat = 'repeat, repeat, repeat'; // 前两个虚线重复，图片不重复
        } else {
            backgroundImage = `url('${fileURL}')`;
            backgroundSize = `${width}px ${height}px`; // 只设置图片的尺寸
            backgroundRepeat = 'repeat'; // 图片不重复
        }
    
        // 应用样式
        previewer.style.backgroundImage = backgroundImage;
        previewer.style.backgroundSize = backgroundSize;
        previewer.style.backgroundRepeat = backgroundRepeat;
        previewer.style.minHeight = '100%';
        previewer.style.minWidth = '100%';
        previewer.style.width = '100vw';
        previewer.style.height = '100vh';
    }
      // 监听窗口大小变化事件
      window.addEventListener('resize', () => adjustBackgroundSize());
  
      // 监听鼠标滚轮事件以缩放图片
      previewer.addEventListener('wheel', (event) => {
        event.preventDefault(); // 阻止默认滚动行为
        const delta = event.deltaY ; // 获取滚轮方向和速度
        console.log(delta,window.innerWidth)
        width-=delta*0.1; // 计算新的宽度，设置最小宽度为100px
        width=Math.max(10,width)
        adjustBackgroundSize(width); // 根据新的宽度调整背景大小
      });
  
      // 首次调用以设置初始背景
      adjustBackgroundSize();
      _adjustBackgroundSize=adjustBackgroundSize
    };
    img.src = fileURL; // 设置图片源，开始加载图片

}