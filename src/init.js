
function scrollwow() {
  let scroll = {};

  let viewHeight = 0;     //窗口高
  let pageHeight = 0;     //文档高度
  let offsetMargin = 0;   //触发线位置
  let previousYOffset = 0;   //暂存Y-Offset,用来判断方向

  let stepEle = [];   //step元素容器
  let ob = {};        //IntersectionObserver实例列表
  let direction = 'down';  //滚动方向


  function updateDirection() {
    direction = window.pageYOffset > previousYOffset ? 'down' : 'up';
    previousYOffset = window.pageYOffset;
  }
  function setupStates(offset) {
    viewHeight = window.innerHeight;
    pageHeight = document.documentElement.scrollHeight;
    offsetMargin = offset * viewHeight;
  }

  function intersectStepAbove() {
    updateDirection();
    console.log('enter', direction);
  }
  function intersectStepBelow() {
    updateDirection();
    console.log('outer', direction);
  }

  function stepAboveIO() {
    ob.stepAbove = stepEle.map(ele => {
      let tMargin = viewHeight + ele.offsetHeight;
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
      let bMargin = viewHeight + ele.offsetHeight;
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
  return scroll;
}

// export default scrollwow;
