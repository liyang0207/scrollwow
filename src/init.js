
function scrollwow() {
  let scroll = {};

  let viewHeight = 0;       //窗口高
  let pageHeight = 0;       //文档高度
  let offsetMargin = 0;     //触发线位置
  let previousYOffset = 0;  //暂存Y-Offset,用来判断方向

  let stepEle = [];         //step元素容器
  let ob = {};              //IntersectionObserver实例列表
  let direction = 'down';   //滚动方向

  let cb = {                //回调函数
    stepEnter: () => {},
    stepExit: () => {},
  };

  function updateDirection() {
    direction = window.pageYOffset > previousYOffset ? 'down' : 'up';
    previousYOffset = window.pageYOffset;
  }

  function setupStates(offset) {
    viewHeight = window.innerHeight;
    pageHeight = document.documentElement.scrollHeight;
    offsetMargin = offset * viewHeight;
  }

  function intersectStepAbove([entry]) {
    updateDirection();
    console.log('hello');
    //isIntersection 正在进入为true, 正在出去为false
    let { isIntersecting, boundingClientRect: { top, bottom }, target } = entry;

    //用来判断元素是否处于"可视区域"内
    let topAdjusted = top - offsetMargin;
    let bottomAdjusted = bottom - offsetMargin;

    let response = { element: target, direction };

    if (
      topAdjusted <= 0 &&
      bottomAdjusted >= 0 &&
      isIntersecting &&
      direction === 'down'
    ) {
      cb.stepEnter && cb.stepEnter(response);
    }
    if (!isIntersecting && direction === 'up') {
      cb.stepExit && cb.stepExit(response);
    }
  }

  function intersectStepBelow([entry]) {
    updateDirection();
    let { isIntersecting, boundingClientRect: { top, bottom }, target } = entry;

    let topAdjusted = top - offsetMargin;
    let bottomAdjusted = bottom - offsetMargin;

    let response = { element: target, direction };

    if (
      topAdjusted <= 0 &&
      bottomAdjusted >= 0 &&
      isIntersecting &&
      direction === 'up'
    ) {
      cb.stepEnter && cb.stepEnter(response);
    }
    if (!isIntersecting && direction === 'down') {
      cb.stepExit && cb.stepExit(response);
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

  function handleEnable() {
    stepAboveIO();
    stepBelowIO();
  }

  scroll.setup = ({ step, offset }) => {
    stepEle = Array.from(document.querySelectorAll(step));

    setupStates(offset);
    scroll.enable();

    return scroll;
  }

  scroll.enable = () => {
    console.log('enable');
    handleEnable();
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
  }

  return scroll;
}

// export default scrollwow;
