"use strict";(self.webpackChunkessential_mend=self.webpackChunkessential_mend||[]).push([[882],{7535:(a,e,s)=>{function t(a,e,s={}){"failure"===e&&(e="danger");const t=document.createElement("div");t.classList.add("position-fixed","ultra-z-index","top-0","start-50","translate-middle-x","alert",`alert-${e}`,"fade-in"),t.textContent=a,document.body.appendChild(t),setTimeout((()=>{setTimeout((()=>{document.body.removeChild(t),s.reloadOnTimeout&&window.location.reload()}),500)}),3e3),s.forceReload&&window.location.reload()}function r(a,e){a&&setTimeout((()=>{window.location.href=a}),e||0)}s.d(e,{T:()=>t,V:()=>r})},5882:(a,e,s)=>{s.r(e),s.d(e,{default:()=>F});var t=s(822),r=s(4390),l=s(4526),o=s(5695),d=s(3826),n=s(7535);const c={class:"dashboard-main-wrapper bg-white rounded-start d-flex flex-column p-3 w-100 h-100 gap-4 overflow-scroll text-white"},i={class:"d-flex w-100 flex-grow-1 gap-4"},u={class:"h-100 flex-grow-1 bg-black rounded overflow-auto"},b={class:"h-100 flex-grow-1 bg-black rounded"},f={class:"d-flex w-100 flex-grow-1 gap-4"},p={key:0,class:"h-100 flex-grow-1 bg-black rounded p-2"},h={key:0},v={key:0},k={class:"m-0"},R={class:"m-0"},w={key:1},m={class:"m-0"},L={class:"m-0"},D={class:"m-0"},S={class:"m-0"},g={class:"m-0"},q={class:"m-0"},y={class:"m-0"},C={key:1},_={key:1,class:"h-100 flex-grow-1 bg-black rounded"},A={key:2,class:"h-100 flex-grow-1 bg-black rounded p-2"},W={key:0},x={key:0},E={class:"m-0"},I={class:"m-0"},P={key:1},X={class:"m-0"},U={class:"m-0"},T={class:"m-0"},K={class:"m-0"},Q={class:"m-0"},Z={class:"m-0"},N={class:"m-0"},V={class:"m-0"},j={key:1},z={key:3,class:"h-100 flex-grow-1 bg-black rounded"},F={__name:"Dashboard",setup(a){const e=(0,d.C)(),s=(0,r.KR)(null),F=(0,r.KR)(null),O=(0,r.KR)(null),$=(0,r.KR)(null);return(0,t.sV)((()=>{fetch("/api/dashboarddata").then((a=>a.json())).then((a=>{e.dashboardData=a.data.dashboardData,(()=>{const a={chart1:{labels:e.dashboardData.serviceRequests.map((a=>a[0])),data:e.dashboardData.serviceRequests.map((a=>a[1]))},...o.A.isAdmin?{chart2:{labels:e.dashboardData.professionals.map((a=>a[0])),data:e.dashboardData.professionals.map((a=>a[1]))},chart3:{labels:e.dashboardData.professionalRatings.map((a=>a[0])),data:e.dashboardData.professionalRatings.map((a=>a[1]))},chart4:{labels:e.dashboardData.professionalReviews.map((a=>a[0])),data:e.dashboardData.professionalReviews.map((a=>a[1]))}}:{chart2:{labels:e.dashboardData.reviews.map((a=>a[0])),data:e.dashboardData.reviews.map((a=>a[1]))}}};new Chart(s.value,{type:"bar",data:{labels:a.chart1.labels,datasets:[{label:"Service Request Status",data:a.chart1.data,borderWidth:1}]},options:{scales:{y:{beginAtZero:!0}}}}),new Chart(F.value,{type:"bar",data:{labels:a.chart2.labels,datasets:[{label:o.A.isAdmin?"Professional Status":"Reviews Rating",data:a.chart2.data,borderWidth:1}]},options:{scales:{y:{beginAtZero:!0}}}}),o.A.isAdmin&&(new Chart(O.value,{type:"bar",data:{labels:a.chart3.labels,datasets:[{label:"Professionals Rating",data:a.chart3.data,borderWidth:1}]},options:{scales:{y:{beginAtZero:!0}}}}),new Chart($.value,{type:"bar",data:{labels:a.chart4.labels,datasets:[{label:"Professionals Reviews",data:a.chart4.data,borderWidth:1}]},options:{scales:{y:{beginAtZero:!0}}}}))})()})).catch((a=>{(0,n.T)("Failed to fetch dashboard data:","danger")}))})),(a,d)=>((0,t.uX)(),(0,t.CE)("section",c,[(0,t.Lk)("div",i,[(0,t.Lk)("div",u,[(0,t.Lk)("canvas",{id:"chart1",ref_key:"chart1",ref:s,class:"w-100 h-100 p-2"},null,512)]),(0,t.Lk)("div",b,[(0,t.Lk)("canvas",{id:"chart2",ref_key:"chart2",ref:F,class:"w-100 h-100 p-2"},null,512)])]),(0,t.Lk)("div",f,[(0,r.R1)(o.A).isUser||(0,r.R1)(o.A).isProfessional?((0,t.uX)(),(0,t.CE)("div",p,[d[10]||(d[10]=(0,t.Lk)("p",{class:"fw-bold text-decoration-underline"},"Current Service Request",-1)),(0,r.R1)(e).dashboardData.currentServiceRequest?((0,t.uX)(),(0,t.CE)("div",h,[(0,r.R1)(o.A).isUser?((0,t.uX)(),(0,t.CE)("div",v,[(0,t.Lk)("p",k,[d[0]||(d[0]=(0,t.Lk)("span",{class:"fw-bold"},"Professional: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.currentServiceRequest.professionalInfo?.name||"-"),1)]),(0,t.Lk)("p",R,[d[1]||(d[1]=(0,t.Lk)("span",{class:"fw-bold"},"Professional Email: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.currentServiceRequest.professionalInfo?.email||"-"),1)])])):(0,t.Q3)("v-if",!0),(0,r.R1)(o.A).isProfessional?((0,t.uX)(),(0,t.CE)("div",w,[(0,t.Lk)("p",m,[d[2]||(d[2]=(0,t.Lk)("span",{class:"fw-bold"},"User: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.currentServiceRequest.userInfo?.name||"-"),1)]),(0,t.Lk)("p",L,[d[3]||(d[3]=(0,t.Lk)("span",{class:"fw-bold"},"User Email: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.currentServiceRequest.userInfo?.email||"-"),1)])])):(0,t.Q3)("v-if",!0),(0,t.Lk)("p",D,[d[4]||(d[4]=(0,t.Lk)("span",{class:"fw-bold"},"Service: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.currentServiceRequest.serviceInfo?.name||"-"),1)]),(0,t.Lk)("p",S,[d[5]||(d[5]=(0,t.Lk)("span",{class:"fw-bold"},"Status: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.currentServiceRequest.status),1)]),(0,t.Lk)("p",g,[d[6]||(d[6]=(0,t.Lk)("span",{class:"fw-bold"},"Status Info: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.currentServiceRequest.statusInfo),1)]),(0,t.Lk)("p",q,[d[7]||(d[7]=(0,t.Lk)("span",{class:"fw-bold"},"Price: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.currentServiceRequest.professionalInfo?.price||"-")+" Rs",1)]),(0,t.Lk)("p",y,[d[8]||(d[8]=(0,t.Lk)("span",{class:"fw-bold"},"Created At: ",-1)),(0,t.eW)((0,l.v_)(new Date((0,r.R1)(e).dashboardData.currentServiceRequest.createdAt).toLocaleString()),1)])])):((0,t.uX)(),(0,t.CE)("div",C,d[9]||(d[9]=[(0,t.Lk)("p",null,"No current Service Request on going!!",-1)])))])):((0,t.uX)(),(0,t.CE)("div",_,[(0,t.Lk)("canvas",{id:"chart3",ref_key:"chart3",ref:O,class:"w-100 h-100 p-2"},null,512)])),(0,r.R1)(o.A).isUser||(0,r.R1)(o.A).isProfessional?((0,t.uX)(),(0,t.CE)("div",A,[d[22]||(d[22]=(0,t.Lk)("p",{class:"fw-bold text-decoration-underline"},"Last Service Request",-1)),(0,r.R1)(e).dashboardData.lastServiceRequest?((0,t.uX)(),(0,t.CE)("div",W,[(0,r.R1)(o.A).isUser?((0,t.uX)(),(0,t.CE)("div",x,[(0,t.Lk)("p",E,[d[11]||(d[11]=(0,t.Lk)("span",{class:"fw-bold"},"Professional: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.lastServiceRequest.professionalInfo?.name||"-"),1)]),(0,t.Lk)("p",I,[d[12]||(d[12]=(0,t.Lk)("span",{class:"fw-bold"},"Professional Email: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.lastServiceRequest.professionalInfo?.email||"-"),1)])])):(0,t.Q3)("v-if",!0),(0,r.R1)(o.A).isProfessional?((0,t.uX)(),(0,t.CE)("div",P,[(0,t.Lk)("p",X,[d[13]||(d[13]=(0,t.Lk)("span",{class:"fw-bold"},"User: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.lastServiceRequest.userInfo?.name||"-"),1)]),(0,t.Lk)("p",U,[d[14]||(d[14]=(0,t.Lk)("span",{class:"fw-bold"},"User Email: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.lastServiceRequest.userInfo?.email||"-"),1)])])):(0,t.Q3)("v-if",!0),(0,t.Lk)("p",T,[d[15]||(d[15]=(0,t.Lk)("span",{class:"fw-bold"},"Service: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.lastServiceRequest.serviceInfo?.name||"-"),1)]),(0,t.Lk)("p",K,[d[16]||(d[16]=(0,t.Lk)("span",{class:"fw-bold"},"Status: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.lastServiceRequest.status),1)]),(0,t.Lk)("p",Q,[d[17]||(d[17]=(0,t.Lk)("span",{class:"fw-bold"},"Status Info: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.lastServiceRequest.statusInfo),1)]),(0,t.Lk)("p",Z,[d[18]||(d[18]=(0,t.Lk)("span",{class:"fw-bold"},"Price: ",-1)),(0,t.eW)((0,l.v_)((0,r.R1)(e).dashboardData.lastServiceRequest.professionalInfo?.price||"-")+" Rs",1)]),(0,t.Lk)("p",N,[d[19]||(d[19]=(0,t.Lk)("span",{class:"fw-bold"},"Created At: ",-1)),(0,t.eW)((0,l.v_)(new Date((0,r.R1)(e).dashboardData.lastServiceRequest.createdAt).toLocaleString()),1)]),(0,t.Lk)("p",V,[d[20]||(d[20]=(0,t.Lk)("span",{class:"fw-bold"},"Closed At: ",-1)),(0,t.eW)((0,l.v_)(new Date((0,r.R1)(e).dashboardData.lastServiceRequest.closedAt).toLocaleString()),1)])])):((0,t.uX)(),(0,t.CE)("div",j,d[21]||(d[21]=[(0,t.Lk)("p",null,"No Last Service Request yet!!",-1)])))])):((0,t.uX)(),(0,t.CE)("div",z,[(0,t.Lk)("canvas",{id:"chart4",ref_key:"chart4",ref:$,class:"w-100 h-100 p-2"},null,512)]))])]))}}}}]);