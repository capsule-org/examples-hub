import{r as s,c as t,h as e,H as n,g as o}from"./CapsuleModal-DdUkouQK.js";import"./index-D-c5h5Hy.js";const a=":host{display:none;position:absolute;top:0;left:0;width:100vw;height:100vh;justify-content:center;align-items:center;z-index:10005}:host .card{z-index:10005;opacity:0;position:relative;transition:all}:host(.no-overlay){position:relative;top:unset;left:unset;width:100%;height:auto}:host(.open) .card{opacity:1}:host(.elevated) .card{--card-border-width:0px}:host(.elevated) .card::part(card-container){box-shadow:0px 8px 16px 0px rgba(0, 0, 0, 0.12)}",r=a,d=class{constructor(i){s(this,i),this.cpslModalEntering=t(this,"cpslModalEntering",7),this.cpslModalEntered=t(this,"cpslModalEntered",7),this.cpslModalExiting=t(this,"cpslModalExiting",7),this.cpslModalExited=t(this,"cpslModalExited",7),this.enterTransitionDuration=.15,this.exitTransitionDuration=.15,this.elevated=void 0,this.noOverlay=void 0,this.open=void 0,this.zIndexOverride=void 0}toggleHeight(){this.open?(this.cpslModalEntering.emit(),this.el.style.display="flex",setTimeout(()=>{this.cpslModalEntered.emit()},this.enterTransitionDuration*1e3)):(this.cpslModalExiting.emit(),setTimeout(()=>{this.el.style.display="none",this.cpslModalExited.emit()},this.exitTransitionDuration*1e3))}componentDidLoad(){this.toggleHeight()}render(){return e(n,{key:"2dca618fb17113f9c346e6e54684b50c5ac3f493",class:{open:this.open,elevated:this.elevated,"no-overlay":this.noOverlay}},!this.noOverlay&&e("cpsl-overlay",{key:"f43f994363f20b0f4b43cfc61753f41ad41ecb63",zIndexOverride:this.zIndexOverride?this.zIndexOverride:void 0,id:"overlay",open:this.open,enterTransitionDuration:this.enterTransitionDuration,exitTransitionDuration:this.exitTransitionDuration}),e("cpsl-card",{key:"02a53d032d3b95bd78843cf2d1d06a3cc11c4894",class:"card",style:{transitionDuration:this.open?`${this.exitTransitionDuration}s`:`${this.enterTransitionDuration}s`}},e("slot",{key:"3c246e9fb544c6ddcd2cec53c2b5e4362dab0a6a"})))}get el(){return o(this)}static get watchers(){return{open:["toggleHeight"]}}};d.style=r;export{d as cpsl_modal_v2};