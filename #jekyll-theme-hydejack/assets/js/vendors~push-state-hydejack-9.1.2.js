/*!
 *  __  __                __                                     __
 * /\ \/\ \              /\ \             __                    /\ \
 * \ \ \_\ \   __  __    \_\ \      __   /\_\      __       ___ \ \ \/'\
 *  \ \  _  \ /\ \/\ \   /'_` \   /'__`\ \/\ \   /'__`\    /'___\\ \ , <
 *   \ \ \ \ \\ \ \_\ \ /\ \L\ \ /\  __/  \ \ \ /\ \L\.\_ /\ \__/ \ \ \\`\
 *    \ \_\ \_\\/`____ \\ \___,_\\ \____\ _\ \ \\ \__/.\_\\ \____\ \ \_\ \_\
 *     \/_/\/_/ `/___/> \\/__,_ / \/____//\ \_\ \\/__/\/_/ \/____/  \/_/\/_/
 *                 /\___/                \ \____/
 *                 \/__/                  \/___/
 *
 * Powered by Hydejack v9.1.2 <https://hydejack.com/>
 */
(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{212:function(e,t,r){"use strict";r.r(t),r.d(t,"HyPushState",(function(){return Le}));var c=r(1),n=r(183),i=r(173),o=r(166),a=r(189),s=r(92),l=r(90),h=function(e){function t(t,r){var c=e.call(this,t,r)||this;return c.scheduler=t,c.work=r,c}return Object(c.f)(t,e),t.prototype.requestAsyncId=function(t,r,c){return void 0===c&&(c=0),null!==c&&c>0?e.prototype.requestAsyncId.call(this,t,r,c):(t.actions.push(this),t.scheduled||(t.scheduled=l.a.requestAnimationFrame((function(){return t.flush(void 0)}))))},t.prototype.recycleAsyncId=function(t,r,c){if(void 0===c&&(c=0),null!=c&&c>0||null==c&&this.delay>0)return e.prototype.recycleAsyncId.call(this,t,r,c);0===t.actions.length&&(l.a.cancelAnimationFrame(r),t.scheduled=void 0)},t}(s.a),u=new(function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return Object(c.f)(t,e),t.prototype.flush=function(e){this.active=!0,this.scheduled=void 0;var t,r=this.actions,c=-1;e=e||r.shift();var n=r.length;do{if(t=e.execute(e.state,e.delay))break}while(++c<n&&(e=r.shift()));if(this.active=!1,t){for(;++c<n&&(e=r.shift());)e.unsubscribe();throw t}},t}(r(94).a))(h),p=r(216),b=r(218),O=r(25),f=r(95),j=r(99),d=r(184),m=r(190),v=r(187),y=r(5),w=r(3);function g(e,t){return void 0===t&&(t=0),Object(y.b)((function(r,c){r.subscribe(new w.a(c,(function(r){return c.add(e.schedule((function(){return c.next(r)}),t))}),(function(r){return c.add(e.schedule((function(){return c.error(r)}),t))}),(function(){return c.add(e.schedule((function(){return c.complete()}),t))})))}))}var S,P=r(188),E=r(214),A=r(96),k=r(98),L=r(219),R=r(217),q=r(168);function H(e){var{protocol:t,host:r}=e,c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window.location;return t!==c.protocol||r!==c.host}function N(e){return e&&""===e.target}function M(e,t){var{url:r,anchor:c}=e;return!(!N(c)||H(r,t)||function(e){var{hash:t,origin:r,pathname:c}=e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window.location;return""!==t&&r===n.origin&&c===n.pathname}(r,t))}function T(e){var{cause:t,url:{pathname:r,hash:c},oldURL:n}=e;return r===(null==n?void 0:n.pathname)&&(t===S.Pop||t===S.Push&&""!==c)}!function(e){e.Init="init",e.Hint="hint",e.Push="push",e.Pop="pop"}(S||(S={}));var D=r(70),U=r(220),C=r(215);function I(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);t&&(c=c.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,c)}return r}function W(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?I(Object(r),!0).forEach((function(t){x(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):I(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function x(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}class B{constructor(e){this.parent=e}fetchPage(e){return Object(q.g)(e.url.href,{method:"GET",mode:"cors",headers:{Accept:"text/html"}}).pipe(Object(A.a)(e=>e.text()),Object(O.a)(t=>W(W({},e),{},{responseText:t})),Object(L.a)(t=>Object(D.a)(W(W({},e),{},{error:t,responseText:null}))))}selectPrefetch(e,t,r){var{href:c}=e;return c===t.url.href?Object(D.a)(t):r.pipe(Object(C.a)(1))}getResponse(e,t,r){return Object(U.a)(this.selectPrefetch(t.url,r,e),this.parent.animPromise).pipe(Object(O.a)(e=>{var[r]=e;return W(W({},r),t)}))}}var $=r(12),F=r(167),V=r(201);function J(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);t&&(c=c.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,c)}return r}function K(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?J(Object(r),!0).forEach((function(t){X(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):J(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function X(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}class z{constructor(e){this.parent=e}get scriptSelector(){return this.parent.scriptSelector}removeScriptTags(e){var t=[];return e.forEach(e=>{e&&this.scriptSelector&&e.querySelectorAll(this.scriptSelector).forEach(e=>{if(e instanceof HTMLScriptElement){var r=[function(e){var t=document.createElement("script");return Array.from(e.attributes).forEach(e=>t.setAttributeNode(e.cloneNode())),t.innerHTML=e.innerHTML,t}(e),e];t.push(r)}})}),t}reinsertScriptTags(e){if(!this.scriptSelector)return Promise.resolve(e);var{scripts:t}=e,r=document.write;return Object($.a)(t).pipe(Object(F.a)(e=>this.insertScript(e)),Object(L.a)(t=>Object(D.a)(K(K({},e),{},{error:t}))),Object(V.a)(()=>document.write=r),Object(P.a)(e)).toPromise()}insertScript(e){var[t,r]=e;return document.write=function(){for(var e=document.createElement("div"),t=arguments.length,c=new Array(t),n=0;n<t;n++)c[n]=arguments[n];e.innerHTML=c.join(),Array.from(e.childNodes).forEach(e=>{var t;return null===(t=r.parentNode)||void 0===t?void 0:t.insertBefore(e,r)})},new Promise((e,c)=>{var n,i;""!==t.src?(t.addEventListener("load",e),t.addEventListener("error",c),null===(n=r.parentNode)||void 0===n||n.replaceChild(t,r)):(null===(i=r.parentNode)||void 0===i||i.replaceChild(t,r),e({}))})}}function G(e,t){e.forEach(e=>{e&&(e.querySelectorAll("[href]").forEach(Q("href",t)),e.querySelectorAll("[src]").forEach(Q("src",t)),e.querySelectorAll("img[srcset]").forEach(function(e,t){return r=>{try{var c=r.getAttribute(e);if(null==c)return;r.setAttribute(e,c.split(/\s*,\s*/).map(e=>{var r=e.split(/\s+/);return r[0]=new URL(r[0],t).href,r.join(" ")}).join(", "))}catch(e){}}}("srcset",t)),e.querySelectorAll("blockquote[cite]").forEach(Q("cite",t)),e.querySelectorAll("del[cite]").forEach(Q("cite",t)),e.querySelectorAll("ins[cite]").forEach(Q("cite",t)),e.querySelectorAll("q[cite]").forEach(Q("cite",t)),e.querySelectorAll("img[longdesc]").forEach(Q("longdesc",t)),e.querySelectorAll("frame[longdesc]").forEach(Q("longdesc",t)),e.querySelectorAll("iframe[longdesc]").forEach(Q("longdesc",t)),e.querySelectorAll("img[usemap]").forEach(Q("usemap",t)),e.querySelectorAll("input[usemap]").forEach(Q("usemap",t)),e.querySelectorAll("object[usemap]").forEach(Q("usemap",t)),e.querySelectorAll("form[action]").forEach(Q("action",t)),e.querySelectorAll("button[formaction]").forEach(Q("formaction",t)),e.querySelectorAll("input[formaction]").forEach(Q("formaction",t)),e.querySelectorAll("video[poster]").forEach(Q("poster",t)),e.querySelectorAll("object[data]").forEach(Q("data",t)),e.querySelectorAll("object[codebase]").forEach(Q("codebase",t)),e.querySelectorAll("object[archive]").forEach(function(e,t){return r=>{try{var c=r.getAttribute(e);if(null==c)return;r.setAttribute(e,c.split(/[\s,]+/).map(e=>new URL(e,t).href).join(", "))}catch(e){}}}("archive",t)))})}function Q(e,t){return r=>{try{var c=r.getAttribute(e);if(null==c)return;r.setAttribute(e,new URL(c,t).href)}catch(e){}}}function Y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);t&&(c=c.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,c)}return r}function Z(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Y(Object(r),!0).forEach((function(t){_(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Y(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function _(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}class ee{constructor(e){this.parent=e,this.scriptManager=new z(e)}get el(){return this.parent}get replaceSelector(){return this.parent.replaceSelector}get scriptSelector(){return this.parent.scriptSelector}getReplaceElements(e){if(this.replaceSelector)return this.replaceSelector.split(",").map(t=>e.querySelector(t));if(this.el.id)return[e.getElementById(this.el.id)];var t=Array.from(document.getElementsByTagName(this.el.tagName)).indexOf(this.el);return[e.getElementsByTagName(this.el.tagName)[t]]}responseToContent(e){var{responseText:t}=e,r=(new DOMParser).parseFromString(t,"text/html"),{title:c=""}=r,n=this.getReplaceElements(r);if(n.every(e=>null==e))throw new Error("Couldn't find any element in the document at '".concat(location,"'."));var i=this.scriptSelector?this.scriptManager.removeScriptTags(n):[];return Z(Z({},e),{},{document:r,title:c,replaceEls:n,scripts:i})}replaceContentWithSelector(e,t){e.split(",").map(e=>document.querySelector(e)).forEach((e,r)=>{var c,n=t[r];n&&(null===(c=null==e?void 0:e.parentNode)||void 0===c||c.replaceChild(n,e))})}replaceContentWholesale(e){var[t]=e;t&&(this.el.innerHTML=t.innerHTML)}replaceContent(e){this.replaceSelector?this.replaceContentWithSelector(this.replaceSelector,e):this.replaceContentWholesale(e)}replaceHead(e){var{head:t}=this.el.ownerDocument,r=t.querySelector("link[rel=canonical]"),c=e.head.querySelector("link[rel=canonical]");r&&c&&(r.href=c.href);var n=t.querySelector("meta[name=description]"),i=e.head.querySelector("meta[name=description]");n&&i&&(n.content=i.content)}updateDOM(e){try{var{replaceEls:t,document:r}=e;H(this.parent)&&G(t,this.parent.href),this.replaceHead(r),this.replaceContent(t)}catch(t){throw Z(Z({},e),{},{error:t})}}reinsertScriptTags(e){return this.scriptManager.reinsertScriptTags(e)}}var te=r(26),re=r(73),ce=e=>Array.prototype.concat.apply([],e),ne=e=>({addedNodes:new Set(ce(e.map(e=>Array.from(e.addedNodes)))),removedNodes:new Set(ce(e.map(e=>Array.from(e.removedNodes))))});class ie{setupEventListeners(){var e=Object(o.a)(this.el,"click").pipe(Object(O.a)(e=>{var t=Object(q.k)(e.target,this.linkSelector);if(t instanceof HTMLAnchorElement)return[e,t]}),Object(f.a)(e=>!!e)),t=(e,t)=>e.matches(t)&&e instanceof HTMLAnchorElement?Object(D.a)(e):Object($.a)(e.querySelectorAll(t)).pipe(Object(f.a)(e=>e instanceof HTMLAnchorElement));return{hintEvent$:this.$.linkSelector.pipe(Object(A.a)(e=>{var r=new Map,c=e=>{r.has(e)||r.set(e,(e=>Object(a.a)(Object(o.a)(e,"mouseenter",{passive:!0}),Object(o.a)(e,"touchstart",{passive:!0}),Object(o.a)(e,"focus",{passive:!0})).pipe(Object(O.a)(t=>[t,e])))(e))},n=e=>{r.delete(e)};return Object(q.d)(this.el,{childList:!0,subtree:!0}).pipe(Object(d.a)({addedNodes:[this.el],removedNodes:[]}),Object(q.c)(500),Object(O.a)(ne),Object(A.a)(i=>{var{addedNodes:o,removedNodes:a}=i;return Object($.a)(a).pipe(Object(f.a)(e=>e instanceof Element),Object(te.a)(r=>t(r,e)),Object(j.a)(n)).subscribe(),Object($.a)(o).pipe(Object(f.a)(e=>e instanceof Element),Object(te.a)(r=>t(r,e)),Object(j.a)(c)).subscribe(),Object($.a)(r.values()).pipe(Object(re.a)())}),Object(q.l)(this.$.prefetch))})),pushEvent$:e}}}function oe(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);t&&(c=c.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,c)}return r}function ae(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?oe(Object(r),!0).forEach((function(t){se(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):oe(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function se(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var le,he,ue,pe,be,Oe,fe,je,de,me,ve,ye,we=e=>new Promise(t=>setTimeout(t,e));class ge{constructor(e){this.parent=e}onStart(e){this.parent.animPromise=we(this.parent.duration);this.parent.fireEvent("start",{detail:ae(ae({},e),{},{transitionUntil:e=>{this.parent.animPromise=Promise.all([this.parent.animPromise,e])}})})}emitDOMError(e){var t=location.href;window.history.back(),setTimeout(()=>document.location.assign(t),100)}emitNetworkError(e){this.parent.fireEvent("networkerror",{detail:e})}emitError(e){this.parent.fireEvent("error",{detail:e})}emitReady(e){this.parent.fireEvent("ready",{detail:e})}emitAfter(e){this.parent.fadePromise=we(this.parent.duration);this.parent.fireEvent("after",{detail:ae(ae({},e),{},{transitionUntil:e=>{this.parent.fadePromise=Promise.all([this.parent.fadePromise,e])}})})}emitProgress(e){this.parent.fireEvent("progress",{detail:e})}emitLoad(e){this.parent.fireEvent("load",{detail:e})}}function Se(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);t&&(c=c.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,c)}return r}function Pe(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Se(Object(r),!0).forEach((function(t){Ee(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Se(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Ee(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}window.HashChangeEvent=window.HashChangeEvent||function(e){var{oldURL:t="",newURL:r=""}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},c=new CustomEvent(e);return c.oldURL=t,c.newURL=r,c};class Ae{constructor(e){this.updateHistoryScrollPosition=()=>{if(!H(this.parent)){var e=this.assignScrollPosition(history.state||{});history.replaceState(e,document.title)}},this.parent=e}updateHistoryState(e){var{cause:t,replace:r,url:c,oldURL:n}=e;if(!H(this.parent))switch(t){case S.Init:case S.Push:var{histId:i}=this.parent;if(r||c.href===location.href){var o=Pe(Pe({},history.state),{},{[i]:{}});history.replaceState(o,document.title,c.href)}else history.pushState({[i]:{}},document.title,c.href);case S.Pop:this.parent.simulateHashChange&&n&&function(e,t){e.hash!==t.hash&&window.dispatchEvent(new HashChangeEvent("hashchange",{newURL:e.href,oldURL:t.href}))}(c,n)}}updateTitle(e){var{cause:t,title:r}=e;document.title=r,H(this.parent)||t!==S.Push||history.replaceState(history.state,r)}assignScrollPosition(e){var{histId:t}=this.parent;return Pe(Pe({},e),{},{[t]:Pe(Pe({},e[t]),{},{scrollTop:Object(q.j)(),scrollHeight:Object(q.i)()})})}}class ke{constructor(e){this.parent=e,"scrollRestoration"in history&&(history.scrollRestoration="manual")}manageScrollPosition(e){var{cause:t,url:{hash:r}}=e;switch(t){case S.Push:this.scrollHashIntoView(r,{behavior:"smooth",block:"start",inline:"nearest"});break;case S.Pop:this.restoreScrollPosition();break;case S.Init:this.restoreScrollPositionOnReload()}}elementFromHash(e){return document.getElementById(decodeURIComponent(e.substr(1)))}scrollHashIntoView(e,t){if(e){var r=this.elementFromHash(e);r&&r.scrollIntoView(t)}else window.scroll(window.pageXOffset,0)}restoreScrollPosition(){var{histId:e}=this.parent,{scrollTop:t}=history.state&&history.state[e]||{};null!=t&&window.scroll(window.pageXOffset,t)}restoreScrollPositionOnReload(){var{histId:e}=this.parent;history.state&&history.state[e]&&0===Object(q.j)()?this.restoreScrollPosition():location.hash&&requestAnimationFrame(()=>this.scrollHashIntoView(location.hash,!0))}}var Le=class extends(Object(q.b)(q.a,[ie])){constructor(){super(...arguments),this.el=this,this.linkSelector="a[href]:not([data-no-push])",this.prefetch=!1,this.duration=0,this.simulateHashChange=!1,this.baseURL=window.location.href,le.set(this,Object(q.f)()),this.animPromise=Promise.resolve(null),this.fadePromise=Promise.resolve(null),he.set(this,new ke(this)),ue.set(this,new Ae(this)),pe.set(this,new B(this)),be.set(this,new ee(this)),Oe.set(this,new ge(this)),fe.set(this,new URL(this.baseURL)),je.set(this,(e,t)=>{var r=new URL(Object(c.c)(this,fe).href);r[e]=t,this.assign(r.href)}),de.set(this,0),me.set(this,new i.a),ve.set(this,void 0),ye.set(this,()=>{var{pushEvent$:e,hintEvent$:t}=this.setupEventListeners(),r=e.pipe(Object(O.a)(e=>{var[t,r]=e;return{cause:S.Push,url:new URL(r.href,this.href),anchor:r,event:t,cacheNr:Object(c.c)(this,de)}}),Object(f.a)(e=>function(e,t){var{url:r,anchor:c,event:{metaKey:n,ctrlKey:i}}=e;return!(n||i||!N(c)||H(r,t))}(e,this)),Object(j.a)(e=>{var{event:t}=e;t.preventDefault(),Object(c.c)(this,ue).updateHistoryScrollPosition()})),n=Object(o.a)(window,"popstate").pipe(Object(f.a)(()=>window.history.state&&window.history.state[this.histId]),Object(O.a)(e=>({cause:S.Pop,url:new URL(window.location.href),cacheNr:Object(c.c)(this,de),event:e}))),i=Object(c.c)(this,me),s=Object(a.a)(r,n,i).pipe(Object(d.a)({url:new URL(window.location.href)}),Object(m.a)(),Object(O.a)(e=>{var[t,r]=e;return Object.assign(r,{oldURL:t.url})}),Object(v.a)()),l=s.pipe(Object(f.a)(e=>!T(e)),Object(v.a)()),h=s.pipe(Object(f.a)(e=>T(e)),Object(f.a)(()=>history.state&&history.state[this.histId]),g(u),Object(j.a)(e=>{Object(c.c)(this,ue).updateHistoryState(e),Object(c.c)(this,he).manageScrollPosition(e)})),b=Object(p.a)(()=>Object(a.a)(l.pipe(Object(P.a)(!0)),Object(c.c)(this,ve).pipe(Object(P.a)(!1)))).pipe(Object(d.a)(!1)),y=t.pipe(Object(q.h)(b.pipe(Object(O.a)(e=>!e))),Object(O.a)(e=>{var[t,r]=e;return{cause:S.Hint,url:new URL(r.href,this.href),anchor:r,event:t,cacheNr:Object(c.c)(this,de)}}),Object(f.a)(e=>M(e,this))),w=Object(a.a)(y,l).pipe(Object(E.a)((e,t)=>{return c=t,(r=e).url.href===c.url.href&&r.error===c.error&&r.cacheNr===c.cacheNr;
/**
 * Copyright (c) 2020 Florian Klampfer <https://qwtel.com/>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license
 * @nocompile
 */
var r,c}),Object(A.a)(e=>Object(c.c)(this,pe).fetchPage(e)),Object(d.a)({url:{}}),Object(v.a)()),D=Object(c.d)(this,ve,l.pipe(Object(j.a)(e=>{Object(c.c)(this,Oe).onStart(e),Object(c.c)(this,ue).updateHistoryState(e),Object(c.d)(this,fe,e.url)}),Object(k.a)(w),Object(A.a)(e=>Object(c.c)(this,pe).getResponse(w,...e)),Object(v.a)())),U=D.pipe(Object(f.a)(e=>!e.error)),C=D.pipe(Object(f.a)(e=>!!e.error)),I=U.pipe(Object(O.a)(e=>Object(c.c)(this,be).responseToContent(e)),Object(j.a)(e=>Object(c.c)(this,Oe).emitReady(e)),g(u),Object(j.a)(e=>{Object(c.c)(this,be).updateDOM(e),Object(c.c)(this,ue).updateTitle(e),Object(c.c)(this,Oe).emitAfter(e)}),Object(d.a)({cause:S.Init,url:Object(c.c)(this,fe),scripts:[]}),g(u),Object(j.a)(e=>Object(c.c)(this,he).manageScrollPosition(e)),Object(j.a)({error:e=>Object(c.c)(this,Oe).emitDOMError(e)}),Object(L.a)((e,t)=>t),Object(A.a)(e=>this.fadePromise.then(()=>e)),Object(A.a)(e=>Object(c.c)(this,be).reinsertScriptTags(e)),Object(j.a)({error:e=>Object(c.c)(this,Oe).emitError(e)}),Object(L.a)((e,t)=>t),Object(j.a)(e=>Object(c.c)(this,Oe).emitLoad(e))),W=C.pipe(Object(j.a)(e=>Object(c.c)(this,Oe).emitNetworkError(e))),x=l.pipe(Object(A.a)(e=>Object(p.a)(()=>this.animPromise).pipe(Object(R.a)(D),Object(P.a)(e))),Object(j.a)(e=>Object(c.c)(this,Oe).emitProgress(e)));I.subscribe(),h.subscribe(),W.subscribe(),x.subscribe(),Object(c.c)(this,le).resolve(this),this.fireEvent("init")})}createRenderRoot(){return this}get initialized(){return Object(c.c)(this,le)}get hash(){return Object(c.c)(this,fe).hash}get host(){return Object(c.c)(this,fe).host}get hostname(){return Object(c.c)(this,fe).hostname}get href(){return Object(c.c)(this,fe).href}get pathname(){return Object(c.c)(this,fe).pathname}get port(){return Object(c.c)(this,fe).port}get protocol(){return Object(c.c)(this,fe).protocol}get search(){return Object(c.c)(this,fe).search}get origin(){return Object(c.c)(this,fe).origin}get ancestorOrigins(){return window.location.ancestorOrigins}set hash(e){Object(c.c)(this,je).call(this,"hash",e)}set host(e){Object(c.c)(this,je).call(this,"host",e)}set hostname(e){Object(c.c)(this,je).call(this,"hostname",e)}set href(e){Object(c.c)(this,je).call(this,"href",e)}set pathname(e){Object(c.c)(this,je).call(this,"pathname",e)}set port(e){Object(c.c)(this,je).call(this,"port",e)}set protocol(e){Object(c.c)(this,je).call(this,"protocol",e)}set search(e){Object(c.c)(this,je).call(this,"search",e)}get histId(){return this.id||this.tagName}assign(e){Object(c.c)(this,me).next({cause:S.Push,url:new URL(e,this.href),cacheNr:Object(c.d)(this,de,+Object(c.c)(this,de)+1)})}reload(){Object(c.c)(this,me).next({cause:S.Push,url:new URL(this.href),cacheNr:Object(c.d)(this,de,+Object(c.c)(this,de)+1),replace:!0})}replace(e){Object(c.c)(this,me).next({cause:S.Push,url:new URL(e,this.href),cacheNr:Object(c.d)(this,de,+Object(c.c)(this,de)+1),replace:!0})}connectedCallback(){super.connectedCallback(),this.$={linkSelector:new b.a(this.linkSelector),prefetch:new b.a(this.prefetch)},window.addEventListener("beforeunload",Object(c.c)(this,ue).updateHistoryScrollPosition),this.updateComplete.then(Object(c.c)(this,ye))}disconnectedCallback(){window.removeEventListener("beforeunload",Object(c.c)(this,ue).updateHistoryScrollPosition)}};le=new WeakMap,he=new WeakMap,ue=new WeakMap,pe=new WeakMap,be=new WeakMap,Oe=new WeakMap,fe=new WeakMap,je=new WeakMap,de=new WeakMap,me=new WeakMap,ve=new WeakMap,ye=new WeakMap,Object(c.e)([Object(n.e)({type:String,reflect:!0,attribute:"replace-selector"})],Le.prototype,"replaceSelector",void 0),Object(c.e)([Object(n.e)({type:String,reflect:!0,attribute:"link-selector"})],Le.prototype,"linkSelector",void 0),Object(c.e)([Object(n.e)({type:String,reflect:!0,attribute:"script-selector"})],Le.prototype,"scriptSelector",void 0),Object(c.e)([Object(n.e)({type:Boolean,reflect:!0})],Le.prototype,"prefetch",void 0),Object(c.e)([Object(n.e)({type:Number,reflect:!0})],Le.prototype,"duration",void 0),Object(c.e)([Object(n.e)({type:Boolean,reflect:!0,attribute:"hashchange"})],Le.prototype,"simulateHashChange",void 0),Object(c.e)([Object(n.e)({type:String})],Le.prototype,"baseURL",void 0),Object(c.e)([Object(n.e)()],Le.prototype,"assign",null),Object(c.e)([Object(n.e)()],Le.prototype,"reload",null),Object(c.e)([Object(n.e)()],Le.prototype,"replace",null),Le=Object(c.e)([Object(n.c)("hy-push-state")],Le)},219:function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));var c=r(12),n=r(3),i=r(5);function o(e){return Object(i.b)((function(t,r){var i,a=null,s=!1;a=t.subscribe(new n.a(r,void 0,(function(n){i=Object(c.c)(e(n,o(e)(t))),a?(a.unsubscribe(),a=null,i.subscribe(r)):s=!0}))),s&&(a.unsubscribe(),a=null,i.subscribe(r))}))}},220:function(e,t,r){"use strict";r.d(t,"a",(function(){return h}));var c=r(1),n=r(2),i=r(12),o=r(175),a=r(176),s=r(3),l=r(27);function h(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r=Object(l.b)(e),h=Object(o.a)(e);return h.length?new n.a((function(e){var t=h.map((function(){return[]})),n=h.map((function(){return!1}));e.add((function(){t=n=null}));for(var o=function(o){Object(i.c)(h[o]).subscribe(new s.a(e,(function(i){if(t[o].push(i),t.every((function(e){return e.length}))){var a=t.map((function(e){return e.shift()}));e.next(r?r.apply(void 0,Object(c.i)(a)):a),t.some((function(e,t){return!e.length&&n[t]}))&&e.complete()}}),void 0,(function(){n[o]=!0,!t[o].length&&e.complete()})))},a=0;!e.closed&&a<h.length;a++)o(a);return function(){t=n=null}})):a.a}},221:function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var c=r(25),n=r(12),i=r(5),o=r(3);function a(e,t){return t?function(r){return r.pipe(a((function(r,i){return Object(n.c)(e(r,i)).pipe(Object(c.a)((function(e,c){return t(r,e,i,c)})))})))}:Object(i.b)((function(t,r){var c=0,i=null,a=!1;t.subscribe(new o.a(r,(function(t){i||(i=new o.a(r,void 0,void 0,(function(){i=null,a&&r.complete()})),Object(n.c)(e(t,c++)).subscribe(i))}),void 0,(function(){a=!0,!i&&r.complete()})))}))}}}]);