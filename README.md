## 在线学习U网站性能优化项目


####Part 1: 优化 index.html

下载gulp配置文件，建立gulpfile.js文件优化，利用gulp.task函数分别

1.压缩html
2.文件合并
3.压缩javascript文件，减小文件大小
4.压缩图片
5.压缩css
6.同步执行任务

通过[PageSpeed](https://developers.google.com/speed/pagespeed/insights/ "悬停显示") 来测试。


####Part 2: 优化 pizza.html 的 FPS（每秒帧数）

main.js 里面有2个问题

1.披萨滑窗的时候后面的背景pizza png 图片很多，在addEventListener函数里面修改了 for loop 次数；


```
document.addEventListener('DOMContentLoaded', function() {
    var cols = 8;
    var s = 300;
    for (var i = 0; i < 20; i++) {
        var elem = document.createElement('img');
        elem.className = 'mover';
        elem.src = "images/pizza.png";
        elem.style.height = "100px";
        elem.style.width = "73.333px";
        elem.basicLeft = (i % cols) * s;
        elem.style.top = (Math.floor(i / cols) * s) + 'px';
        document.querySelector("#movingPizzas1").appendChild(elem);
    }
    updatePositions();
});

```
2.修改了 遍历披萨的元素 changePizzaSizes(size)里面的新的宽度每次都需要重新计算的问题。

```

   function changePizzaSizes(size) {

        var allPizza = document.getElementsByClassName("randomPizzaContainer");
        var dx = determineDx(allPizza[0], size);
        var newwidth = (allPizza[0].offsetWidth + dx) + 'px';

        for (var i = 0; i < allPizza.length; i++) {
            allPizza[i].style.width = newwidth;
        }
    }

```