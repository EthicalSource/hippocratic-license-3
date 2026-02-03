/**
 * tua-body-scroll-lock v1.6.3
 * (c) 2026 Evinma, BuptStEve
 * @license MIT
 */

const isServer = () => typeof window === 'undefined';
const detectOS = (ua) => {
    ua = ua || navigator.userAgent;
    const ipad = /(iPad).*OS\s([\d_]+)/.test(ua);
    const iphone = !ipad && /(iPhone\sOS)\s([\d_]+)/.test(ua);
    const android = /(Android);?[\s/]+([\d.]+)?/.test(ua);
    const ios = iphone || ipad;
    return { ios, android };
};
function getEventListenerOptions(options) {
    /* istanbul ignore if */
    if (isServer())
        return false;
    if (!options) {
        throw new Error('options must be provided');
    }
    let isSupportOptions = false;
    const listenerOptions = {
        get passive() {
            isSupportOptions = true;
            return undefined;
        },
    };
    /* istanbul ignore next */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => { };
    const testEvent = '__TUA_BSL_TEST_PASSIVE__';
    window.addEventListener(testEvent, noop, listenerOptions);
    window.removeEventListener(testEvent, noop, listenerOptions);
    const { capture } = options;
    /* istanbul ignore next */
    return isSupportOptions
        ? options
        : typeof capture !== 'undefined'
            ? capture
            : false;
}
function noticeRequiredTargetElement(targetElement) {
    if (targetElement)
        return false;
    if (targetElement === null)
        return false;
    /* istanbul ignore if */
    {
        console.warn('If scrolling is also required in the floating layer, ' +
            'the target element must be provided.');
    }
    return true;
}
/**
 * Get global function that calls preventDefault
 */
function getPreventEventDefault() {
    if ('__BSL_PREVENT_DEFAULT__' in window) {
        return window.__BSL_PREVENT_DEFAULT__;
    }
    window.__BSL_PREVENT_DEFAULT__ = function (event) {
        if (!event.cancelable)
            return;
        event.preventDefault();
    };
    return window.__BSL_PREVENT_DEFAULT__;
}
function toArray(x) {
    if (!x)
        return [];
    return Array.isArray(x) ? x : [x];
}
/**
 * Check if element uses reversed flex direction
 */
function isReversedFlex(element) {
    const computedStyle = window.getComputedStyle(element);
    const flexDirection = computedStyle.flexDirection;
    return {
        column: flexDirection === 'column-reverse',
        row: flexDirection === 'row-reverse',
    };
}
/**
 * Check if element is at scroll boundary
 * Supports both normal and reversed flex directions
 */
function getScrollBoundaryState(element, clientX, clientY) {
    const { scrollTop, scrollLeft, scrollWidth, scrollHeight, clientWidth, clientHeight, } = element;
    // Check if element uses reversed flex direction
    const reversed = isReversedFlex(element);
    // For column-reverse: visual top is at max scrollTop, visual bottom is at 0
    // For normal: visual top is at 0, visual bottom is at max scrollTop
    let isOnTop;
    let isOnBottom;
    if (reversed.column) {
        // In column-reverse, scrolling down (clientY < 0) when at max scrollTop means at visual top
        isOnTop = clientY > 0 && Math.abs(scrollTop) + clientHeight + 1 >= scrollHeight;
        isOnBottom = clientY < 0 && Math.abs(scrollTop) <= 1;
    }
    else {
        // Normal behavior
        isOnTop = clientY > 0 && scrollTop === 0;
        isOnBottom = clientY < 0 && scrollTop + clientHeight + 1 >= scrollHeight;
    }
    // For row-reverse: visual left is at max scrollLeft, visual right is at 0
    // For normal: visual left is at 0, visual right is at max scrollLeft
    let isOnLeft;
    let isOnRight;
    if (reversed.row) {
        // In row-reverse, scrolling right (clientX < 0) when at max scrollLeft means at visual left
        isOnLeft = clientX > 0 && Math.abs(scrollLeft) + clientWidth + 1 >= scrollWidth;
        isOnRight = clientX < 0 && Math.abs(scrollLeft) <= 1;
    }
    else {
        // Normal behavior
        isOnLeft = clientX > 0 && scrollLeft === 0;
        isOnRight = clientX < 0 && scrollLeft + clientWidth + 1 >= scrollWidth;
    }
    return {
        isOnTop,
        isOnBottom,
        isOnLeft,
        isOnRight,
    };
}

const initialLockState = {
    lockedNum: 0,
    lockedElements: [],
    unLockCallback: null,
    documentListenerAdded: false,
    initialClientPos: {
        clientX: 0,
        clientY: 0,
    },
};
/**
 * get current lockState
 * @param options
 * @returns lockState
 */
function getLockState(options) {
    if (isServer())
        return initialLockState;
    /** use local lockState */
    if (!(options === null || options === void 0 ? void 0 : options.useGlobalLockState))
        return getLockState.lockState;
    /** use global lockState */
    const lockState = '__BSL_LOCK_STATE__' in window
        ? Object.assign(Object.assign({}, initialLockState), window.__BSL_LOCK_STATE__) : initialLockState;
    /** assign to global */
    window.__BSL_LOCK_STATE__ = lockState;
    return lockState;
}
getLockState.lockState = initialLockState;

function handleScroll(event, targetElement, initialClientPos) {
    if (targetElement) {
        const clientX = event.targetTouches[0].clientX - initialClientPos.clientX;
        const clientY = event.targetTouches[0].clientY - initialClientPos.clientY;
        const isVertical = Math.abs(clientY) > Math.abs(clientX);
        // Get scroll boundary state
        const { isOnTop, isOnBottom, isOnLeft, isOnRight } = getScrollBoundaryState(targetElement, clientX, clientY);
        if ((isVertical && (isOnTop || isOnBottom)) ||
            (!isVertical && (isOnLeft || isOnRight))) {
            return getPreventEventDefault()(event);
        }
    }
    event.stopPropagation();
    return true;
}

function setOverflowForPc(options) {
    var _a;
    const $html = document.documentElement;
    const htmlStyle = Object.assign({}, $html.style);
    const withPaddingRight = (_a = options === null || options === void 0 ? void 0 : options.withPaddingRight) !== null && _a !== void 0 ? _a : true;
    const scrollBarWidth = window.innerWidth - $html.clientWidth;
    const previousPaddingRight = parseInt(window.getComputedStyle($html).paddingRight, 10);
    $html.style.overflow = 'hidden';
    $html.style.boxSizing = 'border-box';
    if (withPaddingRight) {
        $html.style.paddingRight = `${scrollBarWidth + previousPaddingRight}px`;
    }
    return () => {
        ['overflow', 'boxSizing', 'paddingRight'].forEach((x) => {
            $html.style[x] = htmlStyle[x] || '';
        });
    };
}
function setOverflowForMobile(options) {
    const $html = document.documentElement;
    const $body = document.body;
    const scrollTop = $html.scrollTop || $body.scrollTop;
    const htmlStyle = Object.assign({}, $html.style);
    const bodyStyle = Object.assign({}, $body.style);
    $html.style.height = '100%';
    $html.style.overflow = 'hidden';
    $body.style.top = `-${scrollTop}px`;
    $body.style.width = '100%';
    $body.style.height = 'auto';
    $body.style.position = 'fixed';
    $body.style.overflow = (options === null || options === void 0 ? void 0 : options.overflowType) || 'hidden';
    return () => {
        $html.style.height = htmlStyle.height || '';
        $html.style.overflow = htmlStyle.overflow || '';
        ['top', 'width', 'height', 'overflow', 'position'].forEach((x) => {
            $body.style[x] = bodyStyle[x] || '';
        });
        const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
        if (supportsNativeSmoothScroll) {
            window.scrollTo({ top: scrollTop, behavior: 'instant' });
        }
        else {
            window.scrollTo(0, scrollTop);
        }
    };
}

/**
 * lock body scroll
 * @param targetElement the element(s) still needs scrolling（iOS only）
 * @param options
 */
function lock(targetElement, options) {
    if (isServer())
        return;
    noticeRequiredTargetElement(targetElement);
    const detectRes = detectOS();
    const lockState = getLockState(options);
    if (detectRes.ios) {
        toArray(targetElement)
            .filter(e => e && lockState.lockedElements.indexOf(e) === -1)
            .forEach((element) => {
            element.ontouchstart = (event) => {
                const { clientX, clientY } = event.targetTouches[0];
                lockState.initialClientPos = { clientX, clientY };
            };
            element.ontouchmove = (event) => {
                handleScroll(event, element, lockState.initialClientPos);
            };
            lockState.lockedElements.push(element);
        });
        addTouchMoveListener(lockState);
        if (options === null || options === void 0 ? void 0 : options.setOverflowForIOS) {
            lockState.unLockCallback = setOverflowForPc(options);
        }
    }
    else if (lockState.lockedNum <= 0) {
        lockState.unLockCallback = detectRes.android
            ? setOverflowForMobile(options)
            : setOverflowForPc(options);
    }
    lockState.lockedNum += 1;
}
/**
 * unlock body scroll
 * @param targetElement the element(s) still needs scrolling（iOS only）
 * @param options
 */
function unlock(targetElement, options) {
    var _a;
    if (isServer())
        return;
    noticeRequiredTargetElement(targetElement);
    const lockState = getLockState(options);
    lockState.lockedNum -= 1;
    if (lockState.lockedNum > 0)
        return;
    (_a = lockState.unLockCallback) === null || _a === void 0 ? void 0 : _a.call(lockState);
    if (!detectOS().ios)
        return;
    toArray(targetElement).forEach((element) => {
        const index = lockState.lockedElements.indexOf(element);
        if (element && index !== -1) {
            element.ontouchmove = null;
            element.ontouchstart = null;
            lockState.lockedElements.splice(index, 1);
        }
    });
    removeTouchMoveListener(lockState);
}
/**
 * clear all body locks
 * @param options
 */
function clearBodyLocks(options) {
    var _a;
    if (isServer())
        return;
    const lockState = getLockState(options);
    lockState.lockedNum = 0;
    (_a = lockState.unLockCallback) === null || _a === void 0 ? void 0 : _a.call(lockState);
    if (!detectOS().ios)
        return;
    if (lockState.lockedElements.length) {
        let element = lockState.lockedElements.pop();
        while (element) {
            element.ontouchmove = null;
            element.ontouchstart = null;
            element = lockState.lockedElements.pop();
        }
    }
    removeTouchMoveListener(lockState);
}
function addTouchMoveListener(lockState) {
    if (!detectOS().ios)
        return;
    if (lockState.documentListenerAdded)
        return;
    document.addEventListener('touchmove', getPreventEventDefault(), getEventListenerOptions({ passive: false }));
    lockState.documentListenerAdded = true;
}
function removeTouchMoveListener(lockState) {
    if (!lockState.documentListenerAdded)
        return;
    document.removeEventListener('touchmove', getPreventEventDefault(), getEventListenerOptions({ passive: false }));
    lockState.documentListenerAdded = false;
}

export { clearBodyLocks, getLockState, lock, unlock };
