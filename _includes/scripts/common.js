(function () {
  var $root = document.getElementsByClassName('root')[0];
  if (window.hasEvent('touchstart')) {
    $root.dataset.isTouch = true;
    document.addEventListener('touchstart', function(){}, false);
  }
})();

// 鼠标光标梯度跟踪
var btn = document.querySelector('.mouse-cursor-gradient-tracking')
btn.onmousemove = function(e) {
  var x = e.pageX - btn.offsetLeft
  var y = e.pageY - btn.offsetTop
  btn.style.setProperty('--x', x + 'px')
  btn.style.setProperty('--y', y + 'px')
}

// Back to the top
var gotop = document.getElementsByClassName("gotop")[0];//获取那个点击盒子
window.onscroll = function () { //window的滚动事件
var scroll_Height = document.documentElement.clientHeight ||       document.body.clientHeight;//可视区高度
var scroll_Top = document.documentElement.scrollTop || document.body.scrollTop;//滚动条距离父级顶部距离
    if (scroll_Top > scroll_Height) {//判断如果滚动条距离父级顶部距离大于可视区高度
        gotop.classList.add("active")//显示active样式

    }else{
        gotop.classList.remove("active")//否则不显示 隐藏
    }
}
gotop.onclick=function(){//返回顶部盒子的点击事件
    document.documentElement.scrollTop=0;//滚动条距离父级顶部距离为0，就是返回顶部
    document.body.scrollTop=0;//兼容
}