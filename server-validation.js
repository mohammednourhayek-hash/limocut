<!-- ==============================================
      نافذة التحقق من الاستخدام المسؤول
      ============================================== -->
 <div id="securityModal" class="security-modal hidden">
   <div class="security-modal-content">
     <div class="security-icon" id="securityIcon">🛡️</div>
     <h3 id="securityTitle">التحقق من الاستخدام المسؤول</h3>
     <p id="securityMessage"></p>
     
     <div id="consentSection" class="hidden">
       <label class="consent-checkbox">
         <input type="checkbox" id="userConsent">
         أقر بأنني أمتلك موافقة صريحة من الشخص أو الأشخاص المستخدمين في هذا المحتوى، ولن أستخدم التعديلات لإيذائهم أو الإساءة إليهم.
       </label>
     </div>
     <div class="security-buttons">
       <button id="securityCancel" class="btn btn-secondary">إلغاء</button>
       <button id="securityConfirm" class="btn btn-primary">متابعة</button>
     </div>
   </div>
 </div>
 <style>
 .security-modal {
   position: fixed;
   inset: 0;
   background: rgba(0, 0, 0, 0.8);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 10000;
   padding: 20px;
 }
 .security-modal.hidden { display: none; }
 .security-modal-content {
   background: #151b28;
   border: 1px solid rgba(0, 212, 255, 0.2);
   border-radius: 12px;
   padding: 24px;
   max-width: 420px;
   width: 100%;
   text-align: center;
 }
 .security-icon {
   font-size: 40px;
   margin-bottom: 16px;
 }
 .security-modal-content h3 {
   color: #ffffff;
   margin-bottom: 12px;
   font-size: 18px;
 }
 .security-modal-content p {
   color: #a0aec0;
   font-size: 14px;
   margin-bottom: 16px;
   line-height: 1.6;
 }
 .consent-checkbox {
   display: flex;
   gap: 10px;
   align-items: flex-start;
   text-align: right;
   font-size: 12px;
   color: #a0aec0;
   margin-bottom: 20px;
   padding: 12px;
   background: rgba(0, 212, 255, 0.03);
   border-radius: 6px;
 }
 .consent-checkbox input[type="checkbox"] {
   margin-top: 2px;
 }
 .security-buttons {
   display: flex;
   gap: 10px;
   justify-content: center;
   flex-wrap: wrap;
 }
 .hidden { display: none !important; }
 </style>
 <script type="module">
   import { checkOperationPermission, SECURITY_CONFIG } from './security-config.js';
   // عرض نافذة التحقق
   const securityModal = document.getElementById('securityModal');
   const securityTitle = document.getElementById('securityTitle');
   const securityMessage = document.getElementById('securityMessage');
   const securityIcon = document.getElementById('securityIcon');
   const consentSection = document.getElementById('consentSection');
   const userConsent = document.getElementById('userConsent');
   const securityConfirm = document.getElementById('securityConfirm');
   const securityCancel = document.getElementById('securityCancel');
   let currentOperation = null;
   let resolveCallback = null;
   window.requestOperationPermission = async function(operationType) {
     return new Promise((resolve) => {
       currentOperation = operationType;
       resolveCallback = resolve;
       const result = checkOperationPermission(operationType, false);
       if (result.action === 'allow') {
         resolve({ granted: true });
         return;
       }
       if (result.action === 'block') {
         showModal('🚫', 'عملية غير مسموحة', result.message, false, false);
         securityConfirm.onclick = () => {
           hideModal();
           resolve({ granted: false, blocked: true });
         };
         return;
       }
       if (result.action === 'request_consent') {
         showModal('📝', 'يُرجى التأكيد', result.message, true, false);
         securityConfirm.onclick = () => {
           if (userConsent.checked) {
             hideModal();
             sendToServerForReview(operationType).then(serverResult => {
               resolve({ 
                 granted: serverResult.approved, 
                 reviewPending: serverResult.pending 
               });
             });
           }
         };
         return;
       }
       showModal('⚠️', 'تحقق مطلوب', result.message, false, true);
       securityConfirm.onclick = () => {
         hideModal();
         sendToServerForReview(operationType).then(serverResult => {
           resolve({ 
             granted: serverResult.approved, 
             reviewPending: serverResult.pending 
           });
         });
       };
     });
   };
   function showModal(icon, title, message, showConsent, isReview) {
     securityIcon.textContent = icon;
     securityTitle.textContent = title;
     securityMessage.textContent = message;
     consentSection.classList.toggle('hidden', !showConsent);
     securityModal.classList.remove('hidden');
     
     if (isReview) {
       securityConfirm.textContent = 'إرسال للمراجعة';
     } else if (showConsent) {
       securityConfirm.textContent = 'إرسال';
     } else {
       securityConfirm.textContent = 'تمام';
     }
   }
   function hideModal() {
     securityModal.classList.add('hidden');
     userConsent.checked = false;
   }
   // محاكاة الإرسال للخادم — في الواقع هذا يذهب لخادمك الحقيقي
   async function sendToServerForReview(operationType) {
     console.log('📤 إرسال الطلب للخادم للمراجعة:', operationType);
     
     // هنا يُرسل الطلب لخادمك ليقرر: مسموح أم ممنوع
     const serverResponse = await simulateServerValidation(operationType);
     
     if (serverResponse.pendingReview) {
       showModal('⏳', 'تم الإرسال للمراجعة', 
         'طلبك قيد المراجعة، سنعلمك عند الموافقة. يمكنك متابعة عملك في هذه الأثناء.', 
         false, false);
       return { approved: true, pending: true };
     }
     
     return { approved: serverResponse.approved, pending: false };
   }
   async function simulateServerValidation(operationType) {
     // ⚠️ هذا مجرد محاكاة — في الإنتاج يأتي هذا الرد من خادمك الحقيقي
     return new Promise(resolve => {
       setTimeout(() => {
         resolve({ approved: true, pendingReview: true });
       }, 500);
     });
   }
   securityCancel.onclick = () => {
     hideModal();
     if (resolveCallback) resolveCallback({ granted: false });
   };
   console.log('✅ واجهة الحماية جاهزة للعمل');
 </script>