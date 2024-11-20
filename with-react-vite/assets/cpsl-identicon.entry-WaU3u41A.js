import{ak as p,al as r,am as f}from"./index-D-c5h5Hy.js";class i{constructor(e){this._value=NaN,typeof e=="string"?this._seed=this.hashCode(e):typeof e=="number"?this._seed=this.getSafeSeed(e):this._seed=this.getSafeSeed(i.MIN+Math.floor((i.MAX-i.MIN)*Math.random())),this.reset()}next(e=0,o=1){return this.recalculate(),this.map(this._value,i.MIN,i.MAX,e,o)}nextInt(e=10,o=100){return this.recalculate(),Math.floor(this.map(this._value,i.MIN,i.MAX,e,o+1))}nextString(e=16,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"){let n="";for(;n.length<e;)n+=this.nextChar(o);return n}nextChar(e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"){return e.substr(this.nextInt(0,e.length-1),1)}nextArrayItem(e){return e[this.nextInt(0,e.length-1)]}nextBoolean(){return this.recalculate(),this._value>.5}skip(e=1){for(;e-- >0;)this.recalculate()}reset(){this._value=this._seed}recalculate(){this._value=this.xorshift(this._value)}xorshift(e){return e^=e<<13,e^=e>>17,e^=e<<5,e}map(e,o,n,a,l){return(e-o)/(n-o)*(l-a)+a}hashCode(e){let o=0;if(e){const n=e.length;for(let a=0;a<n;a++)o=(o<<5)-o+e.charCodeAt(a),o|=0,o=this.xorshift(o)}return this.getSafeSeed(o)}getSafeSeed(e){return e===0?1:e}}i.MIN=-2147483648;i.MAX=2147483647;const v=i,c=["red","orange","yellow","green","blue","purple"],b=":host{--identicon-background-red:linear-gradient(136deg, #ff4270 6.86%, #ff7c7c 93.78%);--identicon-background-orange:linear-gradient(136deg, #f45532 6.86%, #ff9b63 93.78%);--identicon-background-yellow:linear-gradient(136deg, #ffa756 6.86%, #fbff47 93.78%);--identicon-background-green:linear-gradient(136deg, #0cae60 6.86%, #7bffd0 93.78%);--identicon-background-blue:linear-gradient(136deg, #476fff 6.86%, #47c8ff 93.78%);--identicon-background-purple:linear-gradient(136deg, #9747ff 6.86%, #da47ff 93.78%);--identicon-background-empty:linear-gradient(136deg, #aaaaaa 6.86%, #999999 93.78%);display:block;aspect-ratio:1;border-radius:25%;position:relative;border:1px solid var(--cpsl-color-background-8)}:host>svg{fill:rgba(255, 255, 255, 0.6);position:absolute;width:30%}:host>svg.rotate90{transform:rotate(0.25turn)}:host>svg.rotate180{transform:rotate(0.5turn)}:host>svg.rotate270{transform:rotate(0.75turn)}:host>svg:nth-child(1){right:50%;bottom:50%}:host>svg:nth-child(2){left:50%;bottom:50%}:host>svg:nth-child(3){right:50%;top:50%}:host>svg:nth-child(4){left:50%;top:50%}:host(.red){background:var(--identicon-background-red)}:host(.orange){background:var(--identicon-background-orange)}:host(.green){background:var(--identicon-background-green)}:host(.yellow){background:var(--identicon-background-yellow)}:host(.blue){background:var(--identicon-background-blue)}:host(.purple){background:var(--identicon-background-purple)}:host(.empty){background:var(--identicon-background-empty)}:host(.avatar){border-radius:1000px}",C=b,k=t=>r("svg",{class:{rotate90:t===1,rotate180:t===2,rotate270:t===3},viewBox:"0 0 12 12",xmlns:"http://www.w3.org/2000/svg"},r("g",{"clip-path":"url(#clip0_674_66)"},r("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"})),r("defs",null,r("clipPath",{id:"clip0_674_66"},r("rect",{width:"12",height:"12"})))),m=t=>r("svg",{class:{rotate90:t===1,rotate180:t===2,rotate270:t===3},viewBox:"0 0 12 12",xmlns:"http://www.w3.org/2000/svg"},r("g",{"clip-path":"url(#clip0_674_255)"},r("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"}),r("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"})),r("defs",null,r("clipPath",{id:"clip0_674_255"},r("rect",{width:"12",height:"12"})))),h=[[[0,0,0,0],[0,1,3,2]],[[1,1,0,0],[0,1,3,2]],[[0,1,0,1],[0,1,3,2]],[[0,0,1,1],[0,1,3,2]],[[1,0,1,0],[0,1,3,2]],[[1,1,1,1],[0,1,3,2]],[[0,0,0,0],[2,3,1,0]],[[1,1,1,1],[2,3,1,0]],[[1,1,1,1],[0,1,2,3]]],w=class{constructor(t){p(this,t),this.hash=void 0,this.size="40px",this.variant="default"}render(){let t;return!this.hash||(t=y(this.hash)),r(f,{key:"df11955bfd534443af672f89d5133010e2ae775d",class:{red:(t==null?void 0:t.color)==="red",orange:(t==null?void 0:t.color)==="orange",yellow:(t==null?void 0:t.color)==="yellow",green:(t==null?void 0:t.color)==="green",blue:(t==null?void 0:t.color)==="blue",purple:(t==null?void 0:t.color)==="purple",empty:!(t!=null&&t.color)&&!this.hash,avatar:this.variant==="avatar"},style:{width:this.size,height:this.size}},(t==null?void 0:t.shapes)&&(t==null?void 0:t.rotations)&&t.shapes.map((o,n)=>o?m(t.rotations[n]):k(t.rotations[n])))}},x=[c.length,h.length,16];function y(t){const e=new v(t),[o,n,a]=x.map(s=>e.nextInt(0,s-1)),l=Math.floor(a/4),[u,g]=[a%2===1,a%4>=2];return{color:c[o],shapes:h[n][0].map((s,d)=>d===l&&u?s!==1:s===1),rotations:h[n][1].map((s,d)=>d===l&&g?(s+2)%4:s)}}w.style=C;export{w as cpsl_identicon};