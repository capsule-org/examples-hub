const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BTuv06mt.js","assets/index-D-c5h5Hy.js","assets/index-BZcti3oU.css"])))=>i.map(i=>d[i]);
import{b8 as T,aX as i,b9 as I,ba as z,bb as g,bc as U,bd as B,be as N,aY as v,bf as Y}from"./index-D-c5h5Hy.js";var x=function(t,u,s,n){function e(o){return o instanceof s?o:new s(function(l){l(o)})}return new(s||(s=Promise))(function(o,l){function b(r){try{c(n.next(r))}catch(w){l(w)}}function f(r){try{c(n.throw(r))}catch(w){l(w)}}function c(r){r.done?o(r.value):e(r.value).then(b,f)}c((n=n.apply(t,u||[])).next())})};const j="pk_live_EQva4LydtNDE0Rwd9X7SG9w58wqOzbux",k="pk_test_HYobzemmTBXxcSStVA4dSED6jT",E={[T.EVM]:"eth",[T.SOLANA]:"sol"},H=({capsule:t,isDark:u,isEmbedded:s,onRampConfig:n,onRampPurchase:e,setOnRampPurchase:o})=>{const[l,b]=i.useState(null),[f,c]=i.useState(null),[r,w]=i.useState(null);i.useEffect(()=>{const d=i.lazy(()=>I(()=>import("./index-BTuv06mt.js"),__vite__mapDeps([0,1,2])).then(a=>({default:a.MoonPayBuyWidget}))),y=i.lazy(()=>I(()=>import("./index-BTuv06mt.js"),__vite__mapDeps([0,1,2])).then(a=>({default:a.MoonPaySellWidget}))),M=i.lazy(()=>I(()=>import("./index-BTuv06mt.js"),__vite__mapDeps([0,1,2])).then(a=>({default:a.MoonPayProvider})));b(d),c(y),w(M)},[]);const L=e.testMode?k:j,A=i.useCallback(d=>x(void 0,void 0,void 0,function*(){if(!t.getUserId()||!e.walletType)throw new Error("missing required fields");return(yield t.ctx.capsuleClient.signMoonPayUrl(t.getUserId(),{url:d,type:e.walletType,cosmosPrefix:t.cosmosPrefix,testMode:e.testMode,walletId:e.walletId||void 0,externalWalletAddress:e.externalWalletAddress||void 0})).data.signature}),[e.walletId,e.walletType,t.cosmosPrefix,e.testMode,t]),{currencyCodes:_,defaultCurrencyCode:O}=i.useMemo(()=>z(n,{provider:g.MOONPAY,walletType:e.walletType,purchaseType:e.type}),[e.walletType,e.type,n.assetInfo,n==null?void 0:n.allowedAssets]),C=i.useCallback(d=>x(void 0,void 0,void 0,function*(){try{const[y,M]=U(n.assetInfo,g.MOONPAY,d.quoteCurrency.code),a=yield t.ctx.capsuleClient.updateOnRampPurchase({userId:t.getUserId(),walletId:e.walletId,purchaseId:e.id,externalWalletAddress:e.externalWalletAddress,updates:{fiatQuantity:d.baseCurrencyAmount.toString(),fiat:d.baseCurrency.code,network:y,asset:M,assetQuantity:d.quoteCurrencyAmount.toString(),status:B.FINISHED}});o(a),s||setTimeout(()=>{window.close()},5e3)}catch(y){console.error(y)}}),[e.walletId,e.id,e.externalWalletAddress,s]),S=i.useCallback(d=>x(void 0,void 0,void 0,function*(){return{depositId:yield N(t,e,o,{assetQuantity:d.cryptoCurrencyAmount,fiatQuantity:d.fiatCurrencyAmount||void 0,fiat:d.fiatCurrency.code.toUpperCase(),testMode:e.testMode,walletType:e.walletType,destinationAddress:d.depositWalletAddress,contractAddress:d.cryptoCurrency.contractAddress,chainId:d.cryptoCurrency.chainId})}}),[t,e.id,e.testMode,e.walletId,e.walletType,o]),W=i.useMemo(()=>!l||!f?null:e.type==="BUY"?v.jsx(l,{variant:"embedded",baseCurrencyCode:e.fiat,baseCurrencyAmount:e.fiatQuantity,showOnlyCurrencies:_.join(","),defaultCurrencyCode:O,walletAddresses:JSON.stringify({[E[e.walletType]]:e.address}),visible:!0,theme:u?"dark":"light",style:{height:"100%",width:"100%",border:"none",borderRadius:0,margin:0},onTransactionCompleted:C,onUrlSignatureRequested:A}):v.jsx(f,{variant:"embedded",refundWalletAddresses:JSON.stringify({[E[e.walletType]]:e.address}),visible:!0,theme:u?"dark":"light",style:{height:"100%",width:"100%",border:"none",borderRadius:0,margin:0},showOnlyCurrencies:_.join(","),defaultCurrencyCode:_[0],onInitiateDeposit:S,onTransactionCompleted:C,onUrlSignatureRequested:A}),[e.type,e.address,e.walletId,e.walletType,_,S,C,A,u,l,f]);return r?v.jsx(q,{isEmbedded:s,children:v.jsx(r,{apiKey:L,debug:e.testMode,children:W})}):null},q=Y.div`
  width: ${({isEmbedded:t})=>t?"100%":"100vw"};
  height: ${({isEmbedded:t})=>t?"640px":"100vh"};

  iframe {
    border: 0 !important;
  }
`;export{H as default};