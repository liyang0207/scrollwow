该项目是 [**scrollama**](https://github.com/russellgoldenberg/scrollama) 的简化版。

**Scrollama**是一个轻量级的JavaScript库，使用 [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API来实现一些滚动特效。本仓库是scrollwow的简化版本，略去了一些功能，主要是为了来练手，使用 [rollup](https://www.rollupjs.com/guide/zh) 进行压缩打包。

### 使用方法

scrollwow可以用来在页面滚动时触发某些“事件”，比如当不同的“div块儿”滚动到屏幕中心线“line”时改变当前div的背景色。使用方法很简单，HTML和JS大概这个样：

```html
<div class='step'></div>
<div class='step'></div>
<div class='step'></div>
<div class='step'></div>
```

```javascript
//scrollwow()返回一个对象，调用setup方法绑定Observer，支持方法的链式调用
let scroller = scrollwow();
scroller.setup({
  step: '.step',
  offset: 0.3,  // line的位置
  once: false
}).onStepEnter(response => {
  //当前step进入line
  //console.log(response);
}).onStepExit(response => {
  //当前step移出line
  //console.log(response);
})
```

### API

#### scrollwow.setup([options])

options:

- `step`: 字符串、必填。元素选择器，指定“steps”，内部使用`querySelectorAll()`来查找。
- `offset`: 数字，范围[0, 1]，非必填，默认0.5。指示触发线距离视窗顶部的距离(百分比)。
- `once`: 布尔值，非必填。对于每一个“step”，只会触发一次，然后就会移除监听器。

#### scrollwow.onStepEnter(callback)

当step元素块儿的顶部或者底部进入触发线`line`时执行回调函数`callback`，`callback`的参数为一对象。

```javascript
{
  element: <div>,     //当前触发的step元素
  index: 0,           //step的索引，0开始
  direction: 'up',    //滚动方向，up / down
}
```

#### scrollwow.onStepExit(callback)

当step元素块儿的顶部或者底部移出触发线`line`时执行回调函数`callback`，参数与进入时一致。

#### scrollwow.enable()

重新监听steps，只在`disable()`之后调用有效。

#### scrollwow.disable()

停止监听steps。

#### scrollwow.destroy()

移除所有steps监听器。

### 打包调试

##### 开发版本

如果要本地调试，可以编辑`src/scrollwow.js`文件，之后运行`npm run dev`在`dev`文件夹内生成未压缩的`scrollwow.js`，在相应的html文件内引入该文件即可。

##### 生产版本

直接运行`npm run build`即可生成压缩过的生产版本`build/scrollwow.min.js`。

