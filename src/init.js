
function scrollwow() {
  let scroll = {};
  let OBSERVER_NAMES = [
    'stepAbove',
    'stepBelow'
  ]

  let triggerOnce = false;  //触发一次
  let viewHeight = 0;       //窗口高
  let pageHeight = 0;       //文档高度
  let offsetMargin = 0;     //触发线位置
  let previousYOffset = 0;  //暂存Y-Offset,用来判断方向
  let direction = 'down';   //滚动方向(显示页面下部隐藏内容为向下滚动，反之为上)
  let isEnabled = false;    //是否已OB

  let stepEle = [];         //step元素容器
  let ob = {};              //IntersectionObserver实例列表
  let exclude = [];         //禁止某些step触发钩子
  let stepStates = [];      //记录各step当前的状态

  let cb = {                //钩子函数
    stepEnter: () => {},
    stepExit: () => {},
  };

  function updateDirection() {
    direction = window.pageYOffset > previousYOffset ? 'down' : 'up';
    previousYOffset = window.pageYOffset;
  }

  function setupIndex() {
    stepEle.forEach((ele, i) => ele.setAttribute('data-scroll-index', i));
  }

  function getIndex(element) {
    return +element.getAttribute('data-scroll-index');
  }

  function disconnectObserver(name) {
    if (ob[name]) ob[name].forEach(o => o.disconnect());
  }

  function setupStates(offset) {
    offset = Math.min(Math.max(0, offset), 1);
    viewHeight = window.innerHeight;
    pageHeight = document.documentElement.scrollHeight;
    offsetMargin = offset * viewHeight;

    stepStates = stepEle.map(() => ({
      direction: null,
      state: null
    }));
  }

  //元素进入
  function notifyStepEnter(element) {
    let index = getIndex(element);
    stepStates[index].state = 'enter';
    stepStates[index].direction = direction;

    if (cb.stepEnter && !exclude[index]) {
      cb.stepEnter({ element, index, direction });
      if (triggerOnce) exclude[index] = true;
    }
  }

  //元素移出
  function notifyStepExit(element) {
    let index = getIndex(element);
    stepStates[index].state = 'exit';
    stepStates[index].direction = direction;

    if (cb.stepExit) {
      cb.stepExit({ element, index, direction });
    }
  }

  //处理向下滚动时进入、向上滚动时移出的情况
  function intersectStepAbove([entry]) {
    updateDirection();
    //isIntersection 正在进入为true, 正在出去为false
    let { isIntersecting, boundingClientRect: { top, bottom }, target } = entry;

    //用来判断元素是否处于"可视区域"内
    let topAdjusted = top - offsetMargin;
    let bottomAdjusted = bottom - offsetMargin;

    let index = getIndex(target);
    let ss = stepStates[index];

    //元素从下往上进入"可视区域", topAdjusted必须小于0，bottomAdjusted大于0
    if (
      topAdjusted <= 0 &&
      bottomAdjusted >= 0 &&
      isIntersecting &&
      direction === 'down' &&
      ss.state !== 'enter'
    ) {
      notifyStepEnter(target);
    }

    //元素从上往下移出"可视区域", topAdjusted必须大于0
    if (
      topAdjusted >= 0 &&
      !isIntersecting &&
      direction === 'up' &&
      ss.state === 'enter'
    ) {
      notifyStepExit(target);
    }
  }

  //处理向下滚动时移除、向上滚动时进入的情况
  function intersectStepBelow([entry]) {
    updateDirection();
    let { isIntersecting, boundingClientRect: { top, bottom }, target } = entry;

    let topAdjusted = top - offsetMargin;
    let bottomAdjusted = bottom - offsetMargin;
    let index = getIndex(target);
    let ss = stepStates[index];

    if (
      topAdjusted < 0 &&
      bottomAdjusted >= 0 &&
      isIntersecting &&
      direction === 'up' &&
      ss.state !== 'enter'
    ) {
      notifyStepEnter(target);
    }
    if (
      bottomAdjusted <= 0 &&
      !isIntersecting &&
      direction === 'down' &&
      ss.state === 'enter'
    ) {
      notifyStepExit(target);
    }
  }

  function stepAboveIO() {
    ob.stepAbove = stepEle.map(ele => {
      let tMargin = pageHeight - viewHeight;  //这个高度足够保证元素不会出上边界
      let bMargin = offsetMargin - viewHeight;
      let options = {
        rootMargin: `${tMargin}px 0px ${bMargin}px`
      }
      let obs = new IntersectionObserver(intersectStepAbove, options);
      obs.observe(ele);
      return obs;
    })
  }
  function stepBelowIO() {
    ob.stepBelow = stepEle.map(ele => {
      let tMargin = -offsetMargin;
      let bMargin = pageHeight - viewHeight;  //这个距离足够保证元素不会出下边界
      let options = {
        rootMargin: `${tMargin}px 0px ${bMargin}px`
      }
      let obs = new IntersectionObserver(intersectStepBelow, options);
      obs.observe(ele);
      return obs;
    })
  }

  function handleEnable(enable) {
    if (enable && !isEnabled) {
      OBSERVER_NAMES.forEach(disconnectObserver);
      stepAboveIO();
      stepBelowIO();
      isEnabled = true;
      return true;
    }
    OBSERVER_NAMES.forEach(disconnectObserver);
    isEnabled = false;
  }

  scroll.setup = ({ step, offset = 0.5, once = false }) => {
    stepEle = Array.from(document.querySelectorAll(step));

    triggerOnce = once;

    setupIndex();
    setupStates(offset);
    scroll.enable();

    return scroll;
  }

  scroll.enable = () => {
    handleEnable(true);
    return scroll;
  }

  scroll.disable = () => {
    handleEnable(false);
    return scroll;
  }

  scroll.onStepEnter = (callback) => {
    if (typeof callback !== 'function') {
      console.error('onStepEnter需要接收一个函数！');
    } else {
      cb.stepEnter = callback;
    }
    return scroll;
  }

  scroll.onStepExit = (callback) => {
    if (typeof callback !== 'function') {
      console.error('onStepExit需要接收一个函数！');
    } else {
      cb.stepExit = callback;
    }
    return scroll;
  }

  return scroll;
}

// export default scrollwow;
