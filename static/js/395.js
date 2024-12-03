"use strict";(self.webpackChunkessential_mend=self.webpackChunkessential_mend||[]).push([[395],{7535:(e,s,a)=>{function l(e,s,a={}){"failure"===s&&(s="danger");const l=document.createElement("div");l.classList.add("position-fixed","ultra-z-index","top-0","start-50","translate-middle-x","alert",`alert-${s}`,"fade-in"),l.textContent=e,document.body.appendChild(l),setTimeout((()=>{setTimeout((()=>{document.body.removeChild(l),a.reloadOnTimeout&&window.location.reload()}),500)}),3e3),a.forceReload&&window.location.reload()}function i(e,s){e&&setTimeout((()=>{window.location.href=e}),s||0)}a.d(s,{T:()=>l,V:()=>i})},1395:(e,s,a)=>{a.r(s),a.d(s,{default:()=>K});var l=a(822),i=a(7416),n=a(4526),o=a(4390),t=a(3826),c=a(5695),d=a(7535);const r={class:"flex-grow-1 d-flex flex-column h-100 p-2 bg-white rounded-start"},p={class:"d-flex justify-content-between align-items-center"},u={class:"input-group mr-sm-2 w-auto",id:"service-search-wrapper"},v={class:"services-main-wrapper flex-grow-1 overflow-scroll"},f={id:"services-wrapper"},m=["data-sid","data-value","data-uid","onClick"],b={class:"service-item-info-wrapper"},k={class:"text-truncate h-6 m-0"},w={class:"text-truncate m-0"},L={class:"text-truncate m-0"},h={class:"text-truncate m-0"},g={class:"text-truncate m-0"},C={class:"text-truncate m-0"},x={class:"text-truncate m-0"},y={key:1},$={class:"modal fade",id:"service-info-modal","data-bs-backdrop":"static","data-bs-keyboard":"false",tabindex:"-1","aria-labelledby":"staticBackdropLabel","aria-hidden":"true"},R={class:"modal-dialog modal-dialog-centered modal-dialog-scrollable"},q={class:"modal-content"},_={class:"modal-body d-flex flex-column gap-4"},P={class:"d-flex gap-4"},E={class:"d-flex flex-column gap-4"},S=["disabled"],D={id:"service-info-modal-body"},T=["innerHTML"],X={id:"service-review-body"},A={key:0},N={class:"d-flex flex-column"},W={class:"m-0 fw-bold"},H={class:"m-0 small"},Q={class:"m-0"},F={class:"m-0"},I={key:1},K={__name:"Services",setup(e){const s=(0,t.C)(),a=(0,o.KR)(""),K=(0,o.KR)(!0),j=(0,o.KR)(null);(0,l.sV)((()=>{fetch("/api/serviceprofessionals").then((e=>e.json())).then((e=>{s.serviceProfessionals=e.data.professionals})).catch((e=>{(0,d.T)("Failed to fetch professionals")})).finally((()=>{K.value=!1}))}));const V=(0,l.EW)((()=>a.value?s.serviceProfessionals.filter((e=>e.name.toLowerCase().includes(a.value.toLowerCase())||e.service.name.toLowerCase().includes(a.value.toLowerCase())||e.location.toLowerCase().includes(a.value.toLowerCase())||e.pincode.toLowerCase().includes(a.value.toLowerCase()))):s.serviceProfessionals)),B=()=>{const e=new FormData;e.append("pid",j.value.uid),e.append("sid",j.value.service.sid),e.append("mode","request"),fetch("/api/servicerequest",{method:"POST",body:e}).then((e=>e.json())).then((e=>{if((0,d.T)(e.data.message,e.result),"success"===e.result){j.value.requestPending=!0;const e=s.serviceProfessionals.find((e=>e.uid===j.value.uid));e&&(e.requestPending=!0)}})).catch((e=>{(0,d.T)("Failed to request service")}))};return(e,t)=>((0,l.uX)(),(0,l.CE)("section",r,[(0,l.Lk)("section",p,[t[2]||(t[2]=(0,l.Lk)("h2",{class:"p-0 m-0"},"Services",-1)),(0,l.Lk)("div",u,[t[1]||(t[1]=(0,l.Lk)("div",{class:"input-group-prepend"},[(0,l.Lk)("div",{class:"input-group-text"},[(0,l.Lk)("i",{class:"bi bi-search"})])],-1)),(0,l.bo)((0,l.Lk)("input",{type:"text",class:"form-control",id:"service-search-input",placeholder:"Search Services","onUpdate:modelValue":t[0]||(t[0]=e=>a.value=e)},null,512),[[i.Jo,a.value]])]),(0,l.Q3)(' <select class="form-select d-block" id="services-sort" aria-label="Sort">\n        <option value="default" selected>Default</option>\n        <option value="dlh">Duration Low - High</option>\n        <option value="dhl">Duration High - Low</option>\n        <option value="plh">Price Low - High</option>\n        <option value="phl">Price High - Low</option>\n        </select> ')]),t[18]||(t[18]=(0,l.Lk)("hr",null,null,-1)),(0,l.Lk)("section",v,[(0,l.Lk)("div",f,[K.value?((0,l.uX)(),(0,l.CE)("p",{key:0,id:"search-not-found-text",class:(0,n.C4)({"d-none":V.value.length>0})},"No matching services found for your search! Try a different one!",2)):(0,l.Q3)("v-if",!0),((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(V.value,(e=>((0,l.uX)(),(0,l.CE)("div",{key:e.uid,class:"service-item","data-sid":e.service.sid,"data-value":`${e.name},${e.email},${e.service.name},${e.location},${e.pincode}`,"data-uid":e.uid,"data-bs-toggle":"modal","data-bs-target":"#service-info-modal",onClick:a=>{return l=e.uid,void(j.value=s.serviceProfessionals.find((e=>e.uid===l)));var l}},[t[10]||(t[10]=(0,l.Lk)("div",{class:"service-item-icon-wrapper"},[(0,l.Lk)("i",{class:"bi bi-tools service-item-icon"})],-1)),t[11]||(t[11]=(0,l.Lk)("hr",{style:{width:"100%",margin:"0","border-color":"black"}},null,-1)),(0,l.Lk)("div",b,[(0,l.Lk)("p",k,[t[3]||(t[3]=(0,l.Lk)("span",{class:"fw-bold"},"Professional: ",-1)),(0,l.eW)((0,n.v_)(e.name),1)]),(0,l.Lk)("p",w,[t[4]||(t[4]=(0,l.Lk)("span",{class:"fw-bold"},"Service: ",-1)),(0,l.eW)((0,n.v_)(e.service.name),1)]),(0,l.Lk)("p",L,[t[5]||(t[5]=(0,l.Lk)("span",{class:"fw-bold"},"Description: ",-1)),(0,l.eW)((0,n.v_)(e.description),1)]),(0,l.Lk)("p",h,[t[6]||(t[6]=(0,l.Lk)("span",{class:"fw-bold"},"Location: ",-1)),(0,l.eW)((0,n.v_)(e.location),1)]),(0,l.Lk)("p",g,[t[7]||(t[7]=(0,l.Lk)("span",{class:"fw-bold"},"Pincode: ",-1)),(0,l.eW)((0,n.v_)(e.pincode),1)]),(0,l.Lk)("p",C,[t[8]||(t[8]=(0,l.Lk)("span",{class:"fw-bold"},"Duration: ",-1)),(0,l.eW)((0,n.v_)(e.duration)+" Hrs",1)]),(0,l.Lk)("p",x,[t[9]||(t[9]=(0,l.Lk)("span",{class:"fw-bold"},"Price: ",-1)),(0,l.eW)((0,n.v_)(e.price)+" Rs",1)])])],8,m)))),128)),0===V.value.length?((0,l.uX)(),(0,l.CE)("p",y,"No professionals available at the moment! Come back after some time.")):(0,l.Q3)("v-if",!0)])]),(0,l.Q3)(" professional info modal "),(0,l.Lk)("div",$,[(0,l.Lk)("div",R,[(0,l.Lk)("div",q,[t[17]||(t[17]=(0,l.Lk)("div",{class:"modal-header"},[(0,l.Lk)("h1",{class:"modal-title fs-5",id:"staticBackdropLabel"},"Service Info"),(0,l.Lk)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close",id:"service-info-modal-close-btn"})],-1)),(0,l.Lk)("div",_,[(0,l.Lk)("div",P,[(0,l.Lk)("div",E,[t[12]||(t[12]=(0,l.Lk)("div",{class:"service-icon align-self-start item-info-icon"},[(0,l.Lk)("i",{class:"bi bi-tools"})],-1)),(0,o.R1)(c.A).isUser?((0,l.uX)(),(0,l.CE)("button",{key:0,class:"btn btn-dark w-100",id:"service-request-btn",disabled:j.value?.requestPending,onClick:B},(0,n.v_)(j.value?.requestPending?"Service Requested":"Request Service"),9,S)):(0,l.Q3)("v-if",!0)]),(0,l.Lk)("div",D,[j.value?((0,l.uX)(),(0,l.CE)("div",{key:0,innerHTML:`<p class='m-0'><span class='fw-bold'>Name: </span>${j.value.name}</p>\n                    <p class='m-0'><span class='fw-bold'>Email: </span>${j.value.email}</p>\n                    <p class='m-0'><span class='fw-bold'>Role: </span>${j.value.role}</p>\n                    <p class='m-0'><span class='fw-bold'>Status: </span>${j.value.status}</p>\n                    <p class='m-0'><span class='fw-bold'>Location: </span>${j.value.location}</p>\n                    <p class='m-0'><span class='fw-bold'>Pincode: </span>${j.value.pincode}</p>\n                    <p class='m-0'><span class='fw-bold'>Service: </span>${j.value.service.name}</p>\n                    <p class='m-0'><span class='fw-bold'>Description: </span>${j.value.description}</p>\n                    <p class='m-0'><span class='fw-bold'>Price: </span>${j.value.price} Rs</p>\n                    <p class='m-0'><span class='fw-bold'>Duration: </span>${j.value.duration} Hrs</p>\n                    <p class='m-0'><span class='fw-bold'>Rating: </span>${j.value.rating}</p>\n                    <p class='m-0'><span class='fw-bold'>Experience: </span>${j.value.experience} Years</p>\n                    <p class='m-0'><span class='fw-bold'>Created At: </span>${new Date(Number(j.value.createdAt))}</p>\n                    <hr class='mt-2 mb-2' />\n                    <p class='m-0'><span class='fw-bold'>Request Status: </span>${j.value.professionalRequest.status}</p>\n                    <p class='m-0'><span class='fw-bold'>Request Status Info: </span>${j.value.professionalRequest.statusInfo}</p>\n                    <p class='m-0'><span class='fw-bold'>Requested At: </span>${new Date(Number(j.value.professionalRequest.createdAt))}</p>\n                    <p class='m-0'><span class='fw-bold'>Request Closed At: </span>${j.value.professionalRequest.closedAt?new Date(Number(j.value.professionalRequest.closedAt)):"-"}</p>`},null,8,T)):(0,l.Q3)("v-if",!0)])]),t[16]||(t[16]=(0,l.Lk)("hr",{class:"m-0"},null,-1)),(0,l.Lk)("div",null,[t[15]||(t[15]=(0,l.Lk)("p",{class:"fw-bold mb-1"},"Reviews:",-1)),(0,l.Lk)("div",X,[j.value&&j.value.reviews?((0,l.uX)(),(0,l.CE)("div",A,[((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(j.value.reviews,(e=>((0,l.uX)(),(0,l.CE)("div",{key:e.id,class:"d-flex gap-4 border rounded p-2"},[t[14]||(t[14]=(0,l.Lk)("div",{class:"fs-1 align-self-center"},[(0,l.Lk)("i",{class:"bi bi-chat-square-text-fill"})],-1)),(0,l.Lk)("div",N,[(0,l.Lk)("p",W,(0,n.v_)(e.reviewerName)+" | "+(0,n.v_)(e.reviewerEmail)+" | "+(0,n.v_)(e.type),1),(0,l.Lk)("p",H,(0,n.v_)(new Date(Number(e.createdAt)).toLocaleString()),1),(0,l.Lk)("p",Q,(0,n.v_)(e.review),1),(0,l.Lk)("p",F,[t[13]||(t[13]=(0,l.Lk)("span",{class:"fw-bold"},"Rating: ",-1)),(0,l.eW)((0,n.v_)(e.rating),1)])])])))),128))])):((0,l.uX)(),(0,l.CE)("div",I,"No reviews for this professional by any users yet!"))])])])])])])]))}}}}]);