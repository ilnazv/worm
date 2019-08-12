(window.webpackJsonpworm=window.webpackJsonpworm||[]).push([[0],{10:function(t,e,i){t.exports=i(18)},15:function(t,e,i){},16:function(t,e,i){},18:function(t,e,i){"use strict";i.r(e);var n,o=i(0),s=i.n(o),a=i(6),r=i.n(a),c=(i(15),i(16),i(1)),h=i(2),u=i(8),d=i(7),l=i(9),v=i(3),f=i.n(v),p=i(4),k=function(t){return{posX:Math.floor(Math.random()*t.width),posY:Math.floor(Math.random()*t.height)}},w=function(t,e){return t.posX===e.posX&&t.posY===e.posY};!function(t){t[t.LEFT=37]="LEFT",t[t.UP=38]="UP",t[t.RIGHT=39]="RIGHT",t[t.DOWN=40]="DOWN"}(n||(n={}));var b=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{posX:0,posY:0},i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:n.DOWN;Object(c.a)(this,t),this._headPosition=e,this._size=i,this.direction=o,this.body=[],this.dead=!1,this.body.push(this.headPosition)}return Object(h.a)(t,[{key:"increaseSize",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this._size=this.size+t}},{key:"headPosition",get:function(){return this._headPosition},set:function(t){this.body.length>=this.size&&this.body.shift(),this.body.push(t),this._headPosition=t}},{key:"size",get:function(){return this._size}}]),t}(),y=function(){function t(e,i){Object(c.a)(this,t),this.width=e,this.height=i}return Object(h.a)(t,null,[{key:"canvasSizeInBlocks",value:function(t,e){return{width:t.width/e,height:t.height/e}}}]),t}(),S=function(){function t(e,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:50,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:100,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:1;Object(c.a)(this,t),this.ctx=e,this.canvasSizeinPx=i,this.fps=n,this.blockSize=o,this.intervalId=void 0,this.tick=0,this.snacks=[],this.worms=[],this.step=1,this.survivorMode=!1;for(var r=0;r<s;r++){var h=y.canvasSizeInBlocks(this.canvasSizeinPx,this.blockSize);this.worms.push(new b(k(h)))}this.initSnacks(a),this.survivorMode=s>1}return Object(h.a)(t,[{key:"initSnacks",value:function(){var t=Object(p.a)(f.a.mark(function t(e){var i;return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:i=0;case 1:if(!(i<e)){t.next=10;break}return t.t0=this.snacks,t.next=5,this.setSnackPosition();case 5:t.t1=t.sent,t.t0.push.call(t.t0,t.t1);case 7:i++,t.next=1;break;case 10:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}()},{key:"setSnackPosition",value:function(){var t=Object(p.a)(f.a.mark(function t(){var e,i;return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:for(e=y.canvasSizeInBlocks(this.canvasSizeinPx,this.blockSize),i=k(e);this.worms.some(function(t){return t.body.some(function(t){return w(t,i)})});)i=k(e);return t.abrupt("return",i);case 4:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}()},{key:"start",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.intervalId=setInterval(function(){t.run(e)},1e3/this.fps)}},{key:"stop",value:function(){this.intervalId&&clearInterval(this.intervalId)}},{key:"run",value:function(t){var e=this;this.tick++,this.worms.filter(function(t){return!t.dead}).forEach(function(i){var o=e.move(i);if(t){for(var s=0;!o;){var a=n.LEFT+Math.floor(4*Math.random());e.changeDirection(a,i),o=e.move(i),++s>=100&&(i.dead=!0,o=!0)}var r=n.LEFT+Math.floor(4*Math.random());e.changeDirection(r,i)}}),this.draw(),this.survivorMode&&this.worms.filter(function(t){return!t.dead}).length<=1&&this.stop()}},{key:"checkSnack",value:function(){var t=Object(p.a)(f.a.mark(function t(e,i,n){return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!w(this.snacks[i],n)){t.next=6;break}return e.increaseSize(),t.next=5,this.setSnackPosition();case 5:this.snacks[i]=t.sent;case 6:case"end":return t.stop()}},t,this)}));return function(e,i,n){return t.apply(this,arguments)}}()},{key:"checkAnotherWorm",value:function(t,e){var i=this.worms.find(function(i){return!w(i.headPosition,t.headPosition)&&!i.dead&&i.body.some(function(t){return w(t,e)})});i&&(i.dead=!0,t.increaseSize(i.size))}},{key:"move",value:function(t){var e=this.tryToMoveTowards(t.direction,t),i=this.checkNextMove(e,t);if(i){for(var n=0;n<this.snacks.length;n++)this.checkSnack(t,n,e),this.checkAnotherWorm(t,e);return t.headPosition=e,i}return i}},{key:"draw",value:function(){var t=this;this.ctx.clearRect(0,0,this.canvasSizeinPx.width,this.canvasSizeinPx.height),this.worms.filter(function(t){return!t.dead}).forEach(function(e){for(var i=0;i<e.body.length;i++){var n=e.body[i];t.ctx.fillStyle=i===e.body.length-1?"red":e.dead?"burlywood":"black",t.ctx.fillRect(n.posX*t.blockSize,n.posY*t.blockSize,t.blockSize,t.blockSize)}});for(var e=0;e<this.snacks.length;e++){var i=this.snacks[e];this.ctx.fillStyle="green",this.ctx.fillRect(i.posX*this.blockSize,i.posY*this.blockSize,this.blockSize,this.blockSize)}}},{key:"handleKey",value:function(t){Object.values(n).includes(t)&&this.changeDirection(t,this.worms[0])}},{key:"changeDirection",value:function(t,e){e.direction===n.DOWN&&t===n.UP||e.direction===n.UP&&t===n.DOWN||e.direction===n.LEFT&&t===n.RIGHT||e.direction===n.RIGHT&&t===n.LEFT||(e.direction=t)}},{key:"tryToMoveTowards",value:function(t,e){switch(t){case n.UP:return{posX:e.headPosition.posX,posY:e.headPosition.posY-this.step};case n.DOWN:return{posX:e.headPosition.posX,posY:e.headPosition.posY+this.step};case n.LEFT:return{posX:e.headPosition.posX-this.step,posY:e.headPosition.posY};case n.RIGHT:return{posX:e.headPosition.posX+this.step,posY:e.headPosition.posY};default:return console.log("no action handler for key: ",t),e.headPosition}}},{key:"checkNextMove",value:function(t,e){if(y.canvasSizeInBlocks(this.canvasSizeinPx,this.blockSize).height<t.posY+this.step||t.posY<0||y.canvasSizeInBlocks(this.canvasSizeinPx,this.blockSize).width<t.posX+this.step||t.posX<0)return!1;if(e.body.some(function(e){return w(e,t)}))return!1;var i=this.worms.find(function(i){return!w(i.headPosition,e.headPosition)&&!i.dead&&i.body.some(function(e){return w(e,t)})});return!i||i.size<e.size}}]),t}(),m=function(t){function e(t){var i;return Object(c.a)(this,e),(i=Object(u.a)(this,Object(d.a)(e).call(this,t))).canvasRef=void 0,i.canvasRef=s.a.createRef(),i.state={tick:0},i}return Object(l.a)(e,t),Object(h.a)(e,[{key:"componentDidMount",value:function(){var t=this.canvasRef.current.getContext("2d");t.fillStyle="green";var e=new S(t,this.props.canvasSize,50,3,100,100);e.start(!0),window.addEventListener("keydown",function(t){return e.handleKey(t.keyCode)})}},{key:"render",value:function(){return s.a.createElement("canvas",{ref:this.canvasRef,width:this.props.canvasSize.width,height:this.props.canvasSize.height,style:{border:"1px solid"}})}}]),e}(s.a.Component),z=function(){var t=window.innerWidth-10,e=window.innerHeight-10;return s.a.createElement("div",{className:"App"},s.a.createElement(m,{canvasSize:{width:t,height:e}}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(z,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[10,1,2]]]);
//# sourceMappingURL=main.e4bd1026.chunk.js.map