"use strict";(self.webpackChunkessential_mend=self.webpackChunkessential_mend||[]).push([[610],{7535:(e,a,o)=>{function l(e,a,o={}){"failure"===a&&(a="danger");const l=document.createElement("div");l.classList.add("position-fixed","ultra-z-index","top-0","start-50","translate-middle-x","alert",`alert-${a}`,"fade-in"),l.textContent=e,document.body.appendChild(l),setTimeout((()=>{setTimeout((()=>{document.body.removeChild(l),o.reloadOnTimeout&&window.location.reload()}),500)}),3e3),o.forceReload&&window.location.reload()}function n(e,a){e&&setTimeout((()=>{window.location.href=e}),a||0)}o.d(a,{T:()=>l,V:()=>n})},1610:(e,a,o)=>{o.r(a),o.d(a,{default:()=>B});var l=o(822),n=o(4526),s=o(4390),i=o(7416),t=o(5695),c=o(7535);const d={class:"flex-grow-1 h-100 p-2 bg-white rounded-start overflow-scroll"},u={class:"d-flex flex-column align-items-center gap-4"},r={class:"d-flex flex-column align-items-center"},p={class:"m-0"},f={class:"m-0"},m={class:"m-0"},b={class:"m-0"},k={class:"m-0"},v={class:"m-0"},L={class:"m-0"},g={class:"m-0"},w={class:"m-0"},A={class:"m-0"},I={class:"m-0"},x={class:"m-0"},y={class:"m-0"},h={class:"d-flex gap-2"},R={key:0,class:"btn btn-dark","data-bs-toggle":"modal","data-bs-target":"#account-info-edit-modal"},_={class:"modal fade",id:"account-info-edit-modal","data-bs-backdrop":"static","data-bs-keyboard":"false",tabindex:"-1","aria-labelledby":"staticBackdropLabel","aria-hidden":"true"},C={class:"modal-dialog modal-dialog-centered modal-dialog-scrollable"},K={class:"modal-content"},P={class:"modal-header"},T={type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close",id:"account-info-edit-modal-close-btn",ref:"accountInfoModalCloseBtn"},E={class:"modal-body",id:"account-info-edit-modal-body"},V={class:"mb-3"},F={class:"mb-3"},U={class:"mb-3"},J={class:"mb-3"},N={class:"mb-3"},D={class:"mb-3"},j={class:"mb-3"},O={class:"modal-footer",id:"account-info-edit-modal-footer"},S=["disabled"],B={__name:"Account",setup(e){const a=(0,s.KR)(!1),o=(0,s.KR)(t.A.config.userInfo.name),B=(0,s.KR)(t.A.config.userInfo.location),X=(0,s.KR)(t.A.config.userInfo.pincode),Q=(0,s.KR)(t.A.config.professionalInfo?.description),M=(0,s.KR)(t.A.config.professionalInfo?.experience),z=(0,s.KR)(t.A.config.professionalInfo?.duration),$=(0,s.KR)(t.A.config.professionalInfo?.price),q=(0,l.rk)("accountInfoModalCloseBtn");function G(){fetch("/logout",{method:"POST",headers:{"Content-Type":"application/json"}}).then((e=>e.json())).then((e=>{(0,c.T)(e.data.message,e.result),setTimeout((0,c.V)("/"),3e3)}))}function H(){let e=o.value!==t.A.config.userInfo.name||B.value!==t.A.config.userInfo.location||X.value!==t.A.config.userInfo.pincode;t.A.isProfessional&&(e=e||Q.value!==t.A.config.professionalInfo.description||M.value!==t.A.config.professionalInfo.experience||z.value!==t.A.config.professionalInfo.duration||$.value!==t.A.config.professionalInfo.price),a.value=e}function W(){const e=new FormData;e.append("name",o.value),e.append("location",B.value),e.append("pincode",X.value),t.A.isProfessional&&(e.append("description",Q.value),e.append("experience",M.value),e.append("duration",z.value),e.append("price",$.value)),fetch("/api/updateaccountinfo",{method:"POST",body:e}).then((e=>e.json())).then((e=>{(0,c.T)(e.data.message,e.result),"success"===e.result&&(Object.assign(t.A.config.userInfo,{name:o.value,location:B.value,pincode:X.value}),t.A.isProfessional&&Object.assign(t.A.config.professionalInfo,{description:Q.value,experience:M.value,duration:z.value,price:$.value}),a.value=!1,q.value.click())}))}return(e,c)=>((0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.Lk)("section",d,[(0,l.Lk)("section",u,[c[20]||(c[20]=(0,l.Lk)("div",{class:"account-icon"},[(0,l.Lk)("i",{class:"bi bi-person-fill"})],-1)),(0,l.Lk)("div",r,[(0,l.Lk)("p",p,[c[7]||(c[7]=(0,l.Lk)("span",{class:"fw-bold"},"Name: ",-1)),(0,l.Lk)("span",null,(0,n.v_)(o.value),1)]),(0,l.Lk)("p",f,[c[8]||(c[8]=(0,l.Lk)("span",{class:"fw-bold"},"Email: ",-1)),(0,l.Lk)("span",null,(0,n.v_)((0,s.R1)(t.A).config.userInfo.email),1)]),(0,l.Lk)("p",m,[c[9]||(c[9]=(0,l.Lk)("span",{class:"fw-bold"},"Role: ",-1)),(0,l.Lk)("span",null,(0,n.v_)((0,s.R1)(t.A).config.userInfo.role),1)]),(0,l.Lk)("p",b,[c[10]||(c[10]=(0,l.Lk)("span",{class:"fw-bold"},"Status: ",-1)),(0,l.Lk)("span",null,(0,n.v_)((0,s.R1)(t.A).config.userInfo.status),1)]),(0,l.Lk)("p",k,[c[11]||(c[11]=(0,l.Lk)("span",{class:"fw-bold"},"Location: ",-1)),(0,l.Lk)("span",null,(0,n.v_)(B.value),1)]),(0,l.Lk)("p",v,[c[12]||(c[12]=(0,l.Lk)("span",{class:"fw-bold"},"Pincode: ",-1)),(0,l.Lk)("span",null,(0,n.v_)(X.value),1)]),(0,s.R1)(t.A).isProfessional?((0,l.uX)(),(0,l.CE)(l.FK,{key:0},[(0,l.Lk)("p",L,[c[13]||(c[13]=(0,l.Lk)("span",{class:"fw-bold"},"Description: ",-1)),(0,l.Lk)("span",null,(0,n.v_)(Q.value),1)]),(0,l.Lk)("p",g,[c[14]||(c[14]=(0,l.Lk)("span",{class:"fw-bold"},"Service: ",-1)),(0,l.Lk)("span",null,(0,n.v_)((0,s.R1)(t.A).config.service.name),1)]),(0,l.Lk)("p",w,[c[15]||(c[15]=(0,l.Lk)("span",{class:"fw-bold"},"Experience: ",-1)),(0,l.Lk)("span",null,(0,n.v_)(Number(M.value).toFixed(2))+" yrs",1)]),(0,l.Lk)("p",A,[c[16]||(c[16]=(0,l.Lk)("span",{class:"fw-bold"},"Price: ",-1)),(0,l.Lk)("span",null,(0,n.v_)(Number($.value).toFixed(2))+" Rs",1)]),(0,l.Lk)("p",I,[c[17]||(c[17]=(0,l.Lk)("span",{class:"fw-bold"},"Duration: ",-1)),(0,l.Lk)("span",null,(0,n.v_)(Number(z.value).toFixed(2))+" hrs",1)]),(0,l.Lk)("p",x,[c[18]||(c[18]=(0,l.Lk)("span",{class:"fw-bold"},"Rating: ",-1)),(0,l.Lk)("span",null,(0,n.v_)(Number((0,s.R1)(t.A).config.professionalInfo.rating).toFixed(2)),1)])],64)):(0,l.Q3)("v-if",!0),(0,l.Lk)("p",y,[c[19]||(c[19]=(0,l.Lk)("span",{class:"fw-bold"},"Created At: ",-1)),(0,l.Lk)("span",null,(0,n.v_)(new Date(Number((0,s.R1)(t.A).config.userInfo.createdAt)).toLocaleString()),1)])]),(0,l.Lk)("div",h,[(0,s.R1)(t.A).isAdmin?(0,l.Q3)("v-if",!0):((0,l.uX)(),(0,l.CE)("button",R,"Edit Info")),(0,l.Lk)("button",{class:"btn btn-danger",onClick:G},"Logout")])])]),(0,l.Lk)("div",_,[(0,l.Lk)("div",C,[(0,l.Lk)("div",K,[(0,l.Lk)("div",P,[c[21]||(c[21]=(0,l.Lk)("h1",{class:"modal-title fs-5",id:"staticBackdropLabel"},"Edit Account Info",-1)),(0,l.Lk)("button",T,null,512)]),(0,l.Lk)("div",E,[(0,l.Lk)("div",V,[c[22]||(c[22]=(0,l.Lk)("label",{for:"name",class:"form-label fw-bold"},"Name",-1)),(0,l.bo)((0,l.Lk)("input",{type:"text",class:"form-control",id:"name",name:"name","onUpdate:modelValue":c[0]||(c[0]=e=>o.value=e),onInput:H},null,544),[[i.Jo,o.value]])]),(0,l.Lk)("div",F,[c[23]||(c[23]=(0,l.Lk)("label",{for:"location",class:"form-label fw-bold"},"Location",-1)),(0,l.bo)((0,l.Lk)("input",{type:"text",class:"form-control",id:"location",name:"location","onUpdate:modelValue":c[1]||(c[1]=e=>B.value=e),onInput:H},null,544),[[i.Jo,B.value]])]),(0,l.Lk)("div",U,[c[24]||(c[24]=(0,l.Lk)("label",{for:"pincode",class:"form-label fw-bold"},"Pincode",-1)),(0,l.bo)((0,l.Lk)("input",{type:"number",maxlength:"6",class:"form-control",id:"pincode",name:"pincode","onUpdate:modelValue":c[2]||(c[2]=e=>X.value=e),onInput:H},null,544),[[i.Jo,X.value]])]),(0,s.R1)(t.A).isProfessional?((0,l.uX)(),(0,l.CE)(l.FK,{key:0},[(0,l.Lk)("div",J,[c[25]||(c[25]=(0,l.Lk)("label",{for:"description",class:"form-label fw-bold"},"Description",-1)),(0,l.bo)((0,l.Lk)("input",{type:"text",class:"form-control",id:"description","data-type":"professional",name:"description","onUpdate:modelValue":c[3]||(c[3]=e=>Q.value=e),onInput:H},null,544),[[i.Jo,Q.value]])]),(0,l.Lk)("div",N,[c[26]||(c[26]=(0,l.Lk)("label",{for:"experience",class:"form-label fw-bold"},"Experience",-1)),(0,l.bo)((0,l.Lk)("input",{type:"number",class:"form-control",id:"experience","data-type":"professional",name:"experience","onUpdate:modelValue":c[4]||(c[4]=e=>M.value=e),onInput:H},null,544),[[i.Jo,M.value]])]),(0,l.Lk)("div",D,[c[27]||(c[27]=(0,l.Lk)("label",{for:"duration",class:"form-label fw-bold"},"Duration",-1)),(0,l.bo)((0,l.Lk)("input",{type:"number",class:"form-control",id:"duration","data-type":"professional",name:"duration","onUpdate:modelValue":c[5]||(c[5]=e=>z.value=e),onInput:H},null,544),[[i.Jo,z.value]])]),(0,l.Lk)("div",j,[c[28]||(c[28]=(0,l.Lk)("label",{for:"price",class:"form-label fw-bold"},"Price",-1)),(0,l.bo)((0,l.Lk)("input",{type:"number",class:"form-control",id:"price","data-type":"professional",name:"price","onUpdate:modelValue":c[6]||(c[6]=e=>$.value=e),onInput:H},null,544),[[i.Jo,$.value]])])],64)):(0,l.Q3)("v-if",!0)]),(0,l.Lk)("div",O,[(0,l.Lk)("button",{type:"button",class:"btn btn-dark",disabled:!a.value,id:"account-info-edit-btn",onClick:W},"Update",8,S)])])])])],64))}}}}]);