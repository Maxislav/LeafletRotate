L.DomUtil.getTranslateString = function (point, el) {
    // on WebKit browsers (Chrome/Safari/iOS Safari/Android) using translate3d instead of translate
    // makes animation smoother as it ensures HW accel is used. Firefox 13 doesn't care
    // (same speed either way), Opera 12 doesn't support translate3d

    console.log(el)

    var is3d = L.Browser.webkit3d,
        open = 'translate' + (is3d ? '3d' : '') + '(',
        close = (is3d ? ',0' : '') + ')';

    return open + point.x + 'px,' + point.y + 'px' + close;
}

L.DomUtil.setPosition = function (el, point, disable3D) { // (HTMLElement, Point[, Boolean])

    el._leaflet_pos = point;
    var typeEl;






    if (!disable3D && L.Browser.any3d) {
        el.style[L.DomUtil.TRANSFORM] =  L.DomUtil.getTranslateString(point, el);
    } else {
        el.style.left = point.x + 'px';
        el.style.top = point.y + 'px';
    }
}
