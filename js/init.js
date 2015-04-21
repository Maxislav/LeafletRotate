var degreeMap = 90;
function offset(degree){
    var _with = 600;
    var _height = 400;
    var _rotate = degree;
    var _gep = Math.sqrt( Math.pow(_with, 2) + Math.pow(_height, 2))/2;
    var _deg = _rotate;
    var alfa1 = toDegree(Math.atan(_height/_with));
    var alfaSum = alfa1 + _deg;
    var dx = (_with/2) - (_gep*Math.cos(toRad(alfaSum)));
    var dy =  (_gep*Math.sin(toRad(alfaSum))) - (_height/2);

    return {
        dx: dx,
        dy: dy
    }

}
function svgLimit(x,y, degree){

    return  {
        dx: x*Math.cos(toRad(degree)),
        dy: y*Math.cos(toRad(degree))
    }
}
function toDegree(ar){
    return ar*180/Math.PI;
}
function toRad(ad){
    return  ((ad * Math.PI) / 180);
}

L.DomUtil.getTranslateString = function (point, el) {
    // on WebKit browsers (Chrome/Safari/iOS Safari/Android) using translate3d instead of translate
    // makes animation smoother as it ensures HW accel is used. Firefox 13 doesn't care
    // (same speed either way), Opera 12 doesn't support translate3d


    var _rotate = degreeMap
    var d = offset(_rotate);

    var is3d = L.Browser.webkit3d,
        open = 'translate' + (is3d ? '3d' : '') + '(',
        close = (is3d ? ',0' : '') + ')';
    var svg = true;
    try{
        svg = /SVGSVGElement/.test(el.toString());
    }catch (err){
       // console.log(el)
    }


    switch (true){
        case svg:
            console.log(svgLimit(point.x,point.y, _rotate).dy)  ;
           // return open + point.x + 'px, ' + point.y + 'px' + close;

           return open + (point.y - d.dy) + 'px, ' + ((-point.x)- d.dy/2) + 'px' + close;


            //return open + point.x + 'px, ' + (point.y - svgLimit(point.x,point.y, _rotate).dx ) + 'px' + close;


            break;
        default :
          //  console.log(el)
            return open + (point.x+ d.dx) + 'px,' + (point.y - d.dy) + 'px' + close + " rotate("+_rotate+"deg)";

    }

}


L.DomUtil.setPosition = function (el, point, disable3D) { // (HTMLElement, Point[, Boolean])
    el._leaflet_pos = point;
    if (!disable3D && L.Browser.any3d) {
        el.style[L.DomUtil.TRANSFORM] =  L.DomUtil.getTranslateString(point, el);
    } else {
        el.style.left = point.x + 'px';
        el.style.top = point.y + 'px';
    }
}

L.Map.include({
    _updateSvgViewport: function () {

        var d = offset(degreeMap);
        if (this._pathZooming) {
            // Do not update SVGs while a zoom animation is going on otherwise the animation will break.
            // When the zoom animation ends we will be updated again anyway
            // This fixes the case where you do a momentum move and zoom while the move is still ongoing.
            return;
        }

        this._updatePathViewport();

        var vp = this._pathViewport,
            min = vp.min,
            max = vp.max,
            width = max.x - min.x,
            height = max.y - min.y,
            root = this._pathRoot,
            pane = this._panes.overlayPane;

        // Hack to make flicker on drag end on mobile webkit less irritating
        if (L.Browser.mobileWebkit) {
            pane.removeChild(root);
        }

        L.DomUtil.setPosition(root, min);
        root.setAttribute('width', width);
        root.setAttribute('height', height);
        //root.setAttribute('viewBox', [min.y- d.dy,  ((-min.x)-d.dx) , width, height].join(' '));
        root.setAttribute('viewBox', [min.y - d.dy,  ((-min.x)- d.dy/2) , width, height].join(' '));

        if (L.Browser.mobileWebkit) {
            pane.appendChild(root);
        }
    }
})
