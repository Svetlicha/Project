/* ---- mobile script block 1 from v202 ---- */
(function setupRobustMobileBottomNavV165(){
  const sectionTargetIds={
    hotels:'hotelsSection',contracts:'contractsSection',tasks:'tasksSection',roomTypes:'roomTypesSection',prices:'pricesSection',ultra:'ultraSection',discounts:'discountsSection',discountReservations:'discountReservationsSection',form:'workFormSection',email:'emailSection',emailTxt:'emailTxtSection',checklist:'checklistSection',cancellations:'cancellationsSection'
  };
  const editorIds={
    hotels:'hotelsEditor',contracts:'contractsEditor',tasks:'tasksEditor',roomTypes:'roomTypesSectionEditor',prices:'pricesEditor',ultra:'ultraEditor',discounts:'discountsEditor',discountReservations:'discountReservationsEditor',form:'workFormEditor',email:'emailTableEditor',emailTxt:'emailTxtEditor',checklist:'checklistEditor',cancellations:'cancellationsEditor'
  };
  const toggleIds={
    hotels:'toggleHotelsBtn',contracts:'toggleContractsBtn',tasks:'toggleTasksBtn',roomTypes:'toggleRoomTypesSectionBtn',prices:'togglePricesBtn',ultra:'toggleUltraBtn',discounts:'toggleDiscountsBtn',discountReservations:'toggleDiscountReservationsBtn',form:'toggleWorkFormBtn',email:'toggleEmailTableBtn',emailTxt:'toggleEmailTxtBtn',checklist:'toggleChecklistBtn',cancellations:'toggleCancellationsBtn'
  };
  function isMobile(){return !window.matchMedia||window.matchMedia('(max-width:950px)').matches;}
  function setActive(target){
    document.querySelectorAll('#mobileBottomNav button[data-mobile-target]').forEach(btn=>btn.classList.toggle('active',btn.dataset.mobileTarget===target));
  }
  function closeSheets(){document.body.classList.remove('mobile-more-open','mobile-sidebar-open');}
  function directOpen(target){
    Object.keys(editorIds).forEach(key=>{
      const ed=document.getElementById(editorIds[key]);
      if(ed)ed.classList.add('hidden');
      const tb=document.getElementById(toggleIds[key]);
      if(tb)tb.textContent=tb.textContent.replace(/^▼/,'▶');
    });
    function show(key){
      const ed=document.getElementById(editorIds[key]);
      if(ed)ed.classList.remove('hidden');
      const tb=document.getElementById(toggleIds[key]);
      if(tb)tb.textContent=tb.textContent.replace(/^▶/,'▼');
    }
    if(target==='email'){
      show('discounts');
      show('email');
    }else{
      show(target);
    }
    const targetId=sectionTargetIds[target]||sectionTargetIds.discounts;
    const el=document.getElementById(targetId)||document.getElementById(target+'Section');
    if(el)setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),40);
  }
  function openTarget(target){
    if(!target)return;
    if(target==='weeks'){
      document.body.classList.remove('mobile-more-open');
      document.body.classList.toggle('mobile-sidebar-open');
      setActive('weeks');
      return;
    }
    if(target==='more'){
      document.body.classList.remove('mobile-sidebar-open');
      document.body.classList.toggle('mobile-more-open');
      setActive('more');
      return;
    }
    if(target==='nights'){
      closeSheets();
      try{setSectionOpen('hotels',true);hotelNightsOpen=true;renderHotels();}catch(err){directOpen('hotels');}
      setActive('nights');
      const nightsEl=document.getElementById('hotelNightsSection')||document.getElementById('hotelsSection');
      if(nightsEl)setTimeout(()=>nightsEl.scrollIntoView({behavior:'smooth',block:'start'}),70);
      return;
    }
    closeSheets();
    try{
      if(typeof setSectionOpen==='function'&&typeof sectionOpen==='object'){
        Object.keys(sectionOpen).forEach(key=>setSectionOpen(key,false));
        if(target==='email'){
          setSectionOpen('discounts',true);
          setSectionOpen('email',true);
        }else{
          setSectionOpen(target,true);
        }
      }else{
        directOpen(target);
      }
    }catch(err){
      console.warn('Mobile nav fallback used:',err);
      directOpen(target);
    }
    setActive(target);
    const targetId=sectionTargetIds[target]||sectionTargetIds.discounts;
    const el=document.getElementById(targetId)||document.getElementById(target+'Section');
    if(el)setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),70);
  }
  window.hotelMobileOpenSectionV165=openTarget;
  function handle(e){
    const navBtn=e.target&&e.target.closest?e.target.closest('#mobileBottomNav button[data-mobile-target]'):null;
    const moreBtn=e.target&&e.target.closest?e.target.closest('#mobileMoreSheet button[data-mobile-more]'):null;
    const btn=navBtn||moreBtn;
    if(!btn)return;
    if(!isMobile())return;
    e.preventDefault();
    e.stopPropagation();
    openTarget(navBtn?btn.dataset.mobileTarget:btn.dataset.mobileMore);
  }
  document.addEventListener('click',handle,true);
  document.addEventListener('touchend',handle,true);
})();

const ATTENDANCE_FORM_V14_STORAGE_KEY='attendance_month_form_weekly_v7';

function normalizeAttendanceFormV14(input){
  if(!input||typeof input!=='object')return {};
  try{return JSON.parse(JSON.stringify(input));}
  catch(e){return {};}
}
function attendanceFormV14RecordCount(input){
  return input&&input.records&&typeof input.records==='object'?Object.keys(input.records).length:0;
}
function attendanceFormV14KeyCount(input){
  return input&&typeof input==='object'?Object.keys(input).length:0;
}
function attendanceFormV14UpdatedAt(input){
  const value=Number(input&&input.updatedAt||0);
  return Number.isFinite(value)?value:0;
}
function attendanceFormV14ObjectKeyCount(input){
  return input&&typeof input==='object'?Object.keys(input).length:0;
}
function attendanceFormV14UserDataScore(input){
  if(!input||typeof input!=='object')return 0;
  let score=attendanceFormV14RecordCount(input)*1000;
  score+=attendanceFormV14ObjectKeyCount(input.weeklyAssignments)*50;
  score+=attendanceFormV14ObjectKeyCount(input.lockedDates)*25;
  const defaultHotels=['Effect Algara Beach','Effect Grand Victoria','Effect Saint Mina','Villa Azura','Malina Residence'];
  if(Array.isArray(input.employees)){
    input.employees.forEach((emp,index)=>{
      if(!emp||typeof emp!=='object')return;
      const name=String(emp.name||'').trim();
      if(name&&name!==`Служител ${index+1}`)score+=10;
      if(emp.hireDate)score+=10;
      if(emp.showHotel===false)score+=1;
    });
  }
  if(Array.isArray(input.hotels)){
    if(input.hotels.length!==defaultHotels.length)score+=3;
    input.hotels.forEach(hotel=>{if(!defaultHotels.includes(hotel))score+=3;});
  }
  if(input.department&&input.department!=='Резервации')score+=3;
  if(Number(input.formScale||100)!==100)score+=1;
  if(Number(input.cellSize||30)!==30)score+=1;
  return score;
}
function attendanceFormV14HasUserData(input){
  return attendanceFormV14UserDataScore(input)>0;
}
function pickBetterAttendanceFormV14State(left,right){
  const a=normalizeAttendanceFormV14(left);
  const b=normalizeAttendanceFormV14(right);
  if(!attendanceFormV14KeyCount(a))return b;
  if(!attendanceFormV14KeyCount(b))return a;
  const at=Number(a.updatedAt||0);
  const bt=Number(b.updatedAt||0);
  if(bt>at)return b;
  if(at>bt)return a;
  const ar=attendanceFormV14RecordCount(a);
  const br=attendanceFormV14RecordCount(b);
  if(br>ar)return b;
  return a;
}
function pickAttendanceFormV14ForImport(left,right){
  const a=normalizeAttendanceFormV14(left);
  const b=normalizeAttendanceFormV14(right);
  if(!attendanceFormV14KeyCount(a))return b;
  if(!attendanceFormV14KeyCount(b))return a;
  const ar=attendanceFormV14RecordCount(a);
  const br=attendanceFormV14RecordCount(b);
  if(br>ar)return b;
  if(ar>br)return a;
  const at=Number(a.updatedAt||0);
  const bt=Number(b.updatedAt||0);
  if(bt>at)return b;
  return a;
}
function pickAttendanceFormV14ForSync(left,right){
  const a=normalizeAttendanceFormV14(left);
  const b=normalizeAttendanceFormV14(right);
  if(!attendanceFormV14KeyCount(a))return b;
  if(!attendanceFormV14KeyCount(b))return a;
  const at=attendanceFormV14UpdatedAt(a);
  const bt=attendanceFormV14UpdatedAt(b);
  const aScore=attendanceFormV14UserDataScore(a);
  const bScore=attendanceFormV14UserDataScore(b);
  if(bt>at)return (!bScore&&aScore)?a:b;
  if(at>bt)return (!aScore&&bScore)?b:a;
  if(bScore>aScore)return b;
  if(aScore>bScore)return a;
  const ar=attendanceFormV14RecordCount(a);
  const br=attendanceFormV14RecordCount(b);
  if(br>ar)return b;
  return a;
}
function readLocalAttendanceFormV14State(){
  try{
    const raw=localStorage.getItem(ATTENDANCE_FORM_V14_STORAGE_KEY);
    if(!raw)return {};
    return normalizeAttendanceFormV14(JSON.parse(raw));
  }catch(e){return {};}
}
function mergeAttendanceFormV14State(candidate,options={}){
  if(!state)return {};
  const current=normalizeAttendanceFormV14(state.attendanceFormV14);
  let next=current;
  const normalizedCandidate=normalizeAttendanceFormV14(candidate);
  if(attendanceFormV14HasUserData(normalizedCandidate)||attendanceFormV14UpdatedAt(normalizedCandidate)>0){
    next=pickAttendanceFormV14ForSync(next,normalizedCandidate);
  }
  if(JSON.stringify(current)!==JSON.stringify(next)){
    state.attendanceFormV14=next;
    if(options.markDirty&&typeof markGoogleAutosaveDirty==='function')markGoogleAutosaveDirty();
  }
  return normalizeAttendanceFormV14(state.attendanceFormV14);
}
function getEmbeddedWorkFormState(){
  if(!state)return {};
  const current=normalizeAttendanceFormV14(state.attendanceFormV14);
  if(attendanceFormV14KeyCount(current))return current;
  const legacyLocal=readLocalAttendanceFormV14State();
  if(attendanceFormV14HasUserData(legacyLocal)){
    state.attendanceFormV14=legacyLocal;
    return normalizeAttendanceFormV14(state.attendanceFormV14);
  }
  return {};
}
function normalizeGoogleLoadedStatePreservingLocalForm(loadedState){
  const localForm=normalizeAttendanceFormV14(state&&state.attendanceFormV14);
  const next=normalizeState(loadedState);
  const cloudForm=normalizeAttendanceFormV14(next.attendanceFormV14);
  let mergedForm=cloudForm;
  let preservedLocal=false;
  if(!attendanceFormV14HasUserData(cloudForm)&&attendanceFormV14HasUserData(localForm)){
    mergedForm=localForm;
    preservedLocal=true;
  }
  if(attendanceFormV14KeyCount(mergedForm))next.attendanceFormV14=mergedForm;
  return {state:next,preservedLocal};
}
function setEmbeddedWorkFormState(nextState,options={}){
  if(!state)return;
  if(options.force){
    const next=normalizeAttendanceFormV14(nextState);
    state.attendanceFormV14=next;
    try{localStorage.setItem(ATTENDANCE_FORM_V14_STORAGE_KEY,JSON.stringify(next));}catch(e){}
    if(typeof markGoogleAutosaveDirty==='function')markGoogleAutosaveDirty();
    if(options.save)saveState({silent:true,skipWorkFormSync:true});
    return;
  }
  mergeAttendanceFormV14State(nextState,{markDirty:true});
  if(options.save)saveState({silent:true,skipWorkFormSync:true});
}
window.getEmbeddedWorkFormState=getEmbeddedWorkFormState;
window.setEmbeddedWorkFormState=setEmbeddedWorkFormState;
function applyWorkFormStateToFrame(){
  const frame=document.getElementById('workFormFrame');
  if(!frame||!frame.contentWindow)return false;
  try{
    const formState=getEmbeddedWorkFormState();
    if(Object.keys(formState).length&&typeof frame.contentWindow.setAttendanceFormState==='function'){
      frame.contentWindow.setAttendanceFormState(formState,{saveLocal:true,render:true});
      return true;
    }
    if(!Object.keys(formState).length&&typeof frame.contentWindow.getAttendanceFormState==='function'){
      const childState=frame.contentWindow.getAttendanceFormState();
      if(childState&&Object.keys(childState).length&&(attendanceFormV14HasUserData(childState)||attendanceFormV14UpdatedAt(childState)>0))setEmbeddedWorkFormState(childState,{save:false});
      return true;
    }
  }catch(e){}
  return false;
}
function syncWorkFormStateFromFrame(){
  const frame=document.getElementById('workFormFrame');
  if(!frame||!frame.contentWindow){
    return;
  }
  try{
    if(typeof frame.contentWindow.getAttendanceFormState==='function'){
      const childState=frame.contentWindow.getAttendanceFormState();
      if(attendanceFormV14HasUserData(childState)||attendanceFormV14UpdatedAt(childState)>0){
        state.attendanceFormV14=normalizeAttendanceFormV14(childState);
        if(typeof markGoogleAutosaveDirty==='function')markGoogleAutosaveDirty();
      }
    }
  }catch(e){
  }
}
function saveWorkFormState(){
  const frame=document.getElementById('workFormFrame');
  try{
    if(frame&&frame.contentWindow&&typeof frame.contentWindow.saveState==='function')frame.contentWindow.saveState();
  }catch(e){}
  syncWorkFormStateFromFrame();
  saveState({silent:true,skipWorkFormSync:true});
}
function extractAttendanceFormV14FromBackup(input){
  if(!input)return {};
  let parsed=input;
  if(typeof parsed==='string'){
    try{parsed=JSON.parse(parsed);}catch(e){return {};}
  }
  const candidates=[];
  const addCandidate=value=>{
    if(!value)return;
    if(typeof value==='string'){
      try{candidates.push(JSON.parse(value));}catch(e){}
      return;
    }
    if(typeof value==='object')candidates.push(value);
  };
  addCandidate(parsed.bestForm);
  addCandidate(parsed.form);
  addCandidate(parsed.formRaw);
  addCandidate(parsed.attendanceFormV14);
  addCandidate(parsed.mainStateAttendanceFormV14);
  addCandidate(parsed.largeStateAttendanceFormV14);
  if(parsed.state)addCandidate(parsed.state.attendanceFormV14);
  if(parsed.records&&typeof parsed.records==='object')addCandidate(parsed);
  return candidates.reduce((best,item)=>pickAttendanceFormV14ForImport(best,item),{});
}
function importWorkFormBackupPayload(input){
  const next=extractAttendanceFormV14FromBackup(input);
  if(!attendanceFormV14KeyCount(next)){
    alert('Не намирам валидни данни за Формата в този backup файл.');
    return false;
  }
  setEmbeddedWorkFormState(next,{save:true,force:true});
  const frame=document.getElementById('workFormFrame');
  try{
    if(frame&&frame.contentWindow&&typeof frame.contentWindow.setAttendanceFormState==='function'){
      frame.contentWindow.setAttendanceFormState(next,{saveLocal:true,render:true});
    }else{
      applyWorkFormStateToFrame();
    }
  }catch(e){
    applyWorkFormStateToFrame();
  }
  if(typeof markGoogleAutosaveDirty==='function')markGoogleAutosaveDirty();
  saveState({silent:true,skipWorkFormSync:true});
  alert('Backup-ът на Формата е импортнат: '+attendanceFormV14RecordCount(next)+' записа. Натисни "Запази" в раздел Форма, за да го качиш в Google Drive.');
  return true;
}
function importWorkFormBackupFile(event){
  const file=event&&event.target&&event.target.files&&event.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{importWorkFormBackupPayload(JSON.parse(reader.result));}
    catch(error){alert('Неуспешен импорт на backup JSON.');}
  };
  reader.readAsText(file);
  event.target.value='';
}
function decorateInlineWorkFormHtml(html){
  if(!html||html.includes('cell-note-tooltip'))return html;
  let next=html;
  const noteMarkerCss=`
    .cell-btn.has-note {
      position: relative;
      box-shadow: inset 0 -2px 0 rgba(185, 28, 28, 0.42);
    }

    .cell-btn.has-note::after {
      content: "";
      position: absolute;
      right: 3px;
      bottom: 2px;
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: #dc2626;
      box-shadow: 0 0 0 1px #ffffff, 0 1px 3px rgba(15, 23, 42, 0.28);
      pointer-events: none;
    }

    .att-table .cell-btn.has-note::after {
      width: clamp(5px, calc(var(--cell-size) * 0.15), 8px);
      height: clamp(5px, calc(var(--cell-size) * 0.15), 8px);
    }

    .cell-note-tooltip {
      position: fixed;
      z-index: 10000;
      width: max-content;
      min-width: 0;
      max-width: min(320px, calc(100vw - 24px));
      max-height: min(42vh, 260px);
      overflow: auto;
      pointer-events: none;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 100ms ease, transform 100ms ease;
      padding: 7px 9px;
      border: 1px solid #fecaca;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 14px 32px rgba(15, 23, 42, 0.18);
      color: #b91c1c;
      font-family: "Segoe UI", Arial, sans-serif;
      font-size: 12px;
      font-weight: 900;
      line-height: 1.35;
      white-space: pre-wrap;
      text-align: left;
    }

    .cell-note-tooltip.active {
      opacity: 1;
      transform: translateY(0);
    }
`;
  next=next.replace('\n    .cell-btn {\n',`${noteMarkerCss}\n    .cell-btn {\n`);
  next=next.replace('      const locked = isDateLocked(dateString);\n\n      if (record.status === "work") {','      const locked = isDateLocked(dateString);\n      const noteText = record.note ? String(record.note).trim() : "";\n      const hasNote = !!noteText;\n      if (hasNote) cls += " has-note";\n      const noteAttrs = hasNote\n        ? ` data-note-text="${escapeAttr(noteText)}" onmouseenter="showCellNoteTooltip(event, this)" onmousemove="moveCellNoteTooltip(event)" onmouseleave="hideCellNoteTooltip()"`\n        : "";\n\n      if (record.status === "work") {');
  next=next.replace('          class="${cls}" \n          title="','          class="${cls}" \n          ${noteAttrs}\n          title="');
  next=next.replace('          title="${locked ? "Р”Р°С‚Р°С‚Р° Рµ Р·Р°РєР»СЋС‡РµРЅР°" : "РљР»РёРє: СЃРјСЏРЅР° РЅР° СЃС‚Р°С‚СѓСЃ | Р”РµСЃРµРЅ РєР»РёРє: РїРѕРґСЂРѕР±РЅР° СЂРµРґР°РєС†РёСЏ"}"\n          onclick="${clickHandler}"','          title="${hasNote ? escapeAttr(noteText) : (locked ? "Р”Р°С‚Р°С‚Р° Рµ Р·Р°РєР»СЋС‡РµРЅР°" : "РљР»РёРє: СЃРјСЏРЅР° РЅР° СЃС‚Р°С‚СѓСЃ | Р”РµСЃРµРЅ РєР»РёРє: РїРѕРґСЂРѕР±РЅР° СЂРµРґР°РєС†РёСЏ")}"\n          ${noteAttrs}\n          onclick="${clickHandler}"');
  const noteTooltipScript=`
    function ensureCellNoteTooltip() {
      let tooltip = document.getElementById("cellNoteTooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "cellNoteTooltip";
        tooltip.className = "cell-note-tooltip";
        tooltip.setAttribute("aria-hidden", "true");
        document.body.appendChild(tooltip);
      }
      return tooltip;
    }

    function showCellNoteTooltip(event, element) {
      const note = element?.dataset?.noteText || "";
      if (!note.trim()) return;

      const tooltip = ensureCellNoteTooltip();
      tooltip.textContent = note;
      tooltip.classList.add("active");
      tooltip.setAttribute("aria-hidden", "false");
      moveCellNoteTooltip(event);
    }

    function moveCellNoteTooltip(event) {
      const tooltip = document.getElementById("cellNoteTooltip");
      if (!tooltip || !tooltip.classList.contains("active")) return;

      const gap = 12;
      const margin = 10;
      const rect = tooltip.getBoundingClientRect();
      const visibleBounds = getEmbeddedVisibleBounds();
      let left = event.clientX + gap;
      let top = event.clientY + gap;

      if (left + rect.width > visibleBounds.width - margin) {
        left = Math.max(margin, event.clientX - rect.width - gap);
      }

      if (top + rect.height > visibleBounds.height - margin) {
        top = Math.max(margin, event.clientY - rect.height - gap);
      }

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    }

    function hideCellNoteTooltip() {
      const tooltip = document.getElementById("cellNoteTooltip");
      if (!tooltip) return;

      tooltip.classList.remove("active");
      tooltip.setAttribute("aria-hidden", "true");
    }

`;
  next=next.replace('    function showLockedCellSummary(event, employeeIndex, dateString) {',`${noteTooltipScript}    function showLockedCellSummary(event, employeeIndex, dateString) {`);
  return next;
}
function renderWorkForm(){
  const frame=document.getElementById('workFormFrame');
  if(!frame)return;
  if(!frame.dataset.workFormBridgeBound){
    frame.dataset.workFormBridgeBound='1';
    frame.addEventListener('load',()=>applyWorkFormStateToFrame());
  }
  if(!frame.dataset.workFormSourceReady){
    const inline=document.getElementById('inlineWorkFormHtml');
    if(inline&&inline.textContent.trim()){
      try{
        frame.removeAttribute('src');
        frame.srcdoc=decorateInlineWorkFormHtml(JSON.parse(inline.textContent));
        frame.dataset.workFormSourceReady='inline';
      }catch(e){
        console.error('Inline work form load failed:',e);
      }
    }
    if(!frame.dataset.workFormSourceReady){
      frame.setAttribute('src','sections/prisastvena_forma_sedmichno_razpredelenie_v14.html');
      frame.dataset.workFormSourceReady='file';
    }
  }
  applyWorkFormStateToFrame();
}

const MOBILE_AUTH_USERNAME='svetlicha';
const MOBILE_AUTH_PASSWORD_SHA256='ae3bb7d33e4c140746145e88afe7cac2e7c73a3c3a0a3b8f0ec0d773bb2daeec';
const MOBILE_AUTH_PASSWORD_FALLBACK_HASH='1c966550';
const MOBILE_AUTH_SESSION_KEY='hotel_discount_history_mobile_auth_session_v203';
const MOBILE_AUTH_REMEMBER_USER_KEY='hotel_discount_history_mobile_auth_remember_user_v203';

(function setupMobileAuthGate(){
  function normalizeAuthUser(value){return String(value||'').trim().toLowerCase()}
  function fallbackHash(value){
    let hash=0x811c9dc5;
    const text='mobile-v203|'+String(value||'');
    for(let i=0;i<text.length;i++){
      hash^=text.charCodeAt(i);
      hash=Math.imul(hash,0x01000193)>>>0;
    }
    return hash.toString(16).padStart(8,'0');
  }
  async function sha256(value){
    if(!window.crypto||!window.crypto.subtle||!window.TextEncoder)return '';
    const data=new TextEncoder().encode(String(value||''));
    const digest=await window.crypto.subtle.digest('SHA-256',data);
    return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  async function passwordMatches(value){
    const secureHash=await sha256(value);
    if(secureHash)return secureHash===MOBILE_AUTH_PASSWORD_SHA256;
    return fallbackHash(value)===MOBILE_AUTH_PASSWORD_FALLBACK_HASH;
  }
  function unlock(screen){
    sessionStorage.setItem(MOBILE_AUTH_SESSION_KEY,'1');
    document.body.classList.remove('mobile-auth-locked');
    if(screen)screen.setAttribute('aria-hidden','true');
  }
  function init(){
    const screen=document.getElementById('mobileAuthScreen');
    const form=document.getElementById('mobileAuthForm');
    const userInput=document.getElementById('mobileAuthUsername');
    const passInput=document.getElementById('mobileAuthPassword');
    const rememberInput=document.getElementById('mobileAuthRemember');
    const toggleBtn=document.getElementById('mobileAuthPasswordToggle');
    const errorBox=document.getElementById('mobileAuthError');
    if(!screen||!form||!userInput||!passInput||!rememberInput||!toggleBtn)return;
    if(sessionStorage.getItem(MOBILE_AUTH_SESSION_KEY)==='1'){
      unlock(screen);
      return;
    }
    document.body.classList.add('mobile-auth-locked');
    const rememberedUser=localStorage.getItem(MOBILE_AUTH_REMEMBER_USER_KEY)||'';
    if(rememberedUser){
      userInput.value=rememberedUser;
      rememberInput.checked=true;
      window.setTimeout(()=>passInput.focus(),60);
    }else{
      window.setTimeout(()=>userInput.focus(),60);
    }
    toggleBtn.addEventListener('click',()=>{
      const visible=passInput.type==='password';
      passInput.type=visible?'text':'password';
      toggleBtn.classList.toggle('is-visible',visible);
      toggleBtn.setAttribute('aria-pressed',visible?'true':'false');
      toggleBtn.setAttribute('aria-label',visible?'Скрий паролата':'Покажи паролата');
      passInput.focus();
    });
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(errorBox)errorBox.textContent='';
      const validUser=normalizeAuthUser(userInput.value)===MOBILE_AUTH_USERNAME;
      const validPassword=await passwordMatches(passInput.value);
      if(!validUser||!validPassword){
        if(errorBox)errorBox.textContent='Грешен потребител или парола.';
        passInput.value='';
        passInput.focus();
        return;
      }
      if(rememberInput.checked)localStorage.setItem(MOBILE_AUTH_REMEMBER_USER_KEY,userInput.value.trim());
      else localStorage.removeItem(MOBILE_AUTH_REMEMBER_USER_KEY);
      unlock(screen);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* ---- mobile script block 2 from v202 ---- */
const STORAGE_KEY='hotel_discount_history_v202';
const OLD_KEYS=['hotel_discount_history_v201','hotel_discount_history_v200','hotel_discount_history_v199','hotel_discount_history_v198','hotel_discount_history_v197','hotel_discount_history_v196','hotel_discount_history_v195','hotel_discount_history_v194','hotel_discount_history_v193','hotel_discount_history_v192','hotel_discount_history_v191','hotel_discount_history_v190','hotel_discount_history_v189','hotel_discount_history_v188','hotel_discount_history_v187','hotel_discount_history_v186','hotel_discount_history_v185','hotel_discount_history_v184','hotel_discount_history_v183','hotel_discount_history_v182','hotel_discount_history_v181','hotel_discount_history_v180','hotel_discount_history_v179','hotel_discount_history_v178','hotel_discount_history_v177','hotel_discount_history_v176','hotel_discount_history_v175','hotel_discount_history_v174','hotel_discount_history_v173','hotel_discount_history_v172','hotel_discount_history_v171','hotel_discount_history_v170','hotel_discount_history_v169','hotel_discount_history_v168','hotel_discount_history_v167','hotel_discount_history_v166','hotel_discount_history_v165','hotel_discount_history_v164','hotel_discount_history_v163','hotel_discount_history_v162','hotel_discount_history_v161','hotel_discount_history_v160','hotel_discount_history_v159','hotel_discount_history_v158','hotel_discount_history_v157','hotel_discount_history_v156','hotel_discount_history_v155','hotel_discount_history_v154','hotel_discount_history_v153','hotel_discount_history_v152','hotel_discount_history_v151','hotel_discount_history_v150','hotel_discount_history_v149','hotel_discount_history_v148','hotel_discount_history_v147','hotel_discount_history_v146','hotel_discount_history_v145','hotel_discount_history_v144','hotel_discount_history_v143','hotel_discount_history_v142','hotel_discount_history_v141','hotel_discount_history_v140','hotel_discount_history_v139','hotel_discount_history_v138','hotel_discount_history_v137','hotel_discount_history_v136','hotel_discount_history_v135','hotel_discount_history_v134','hotel_discount_history_v133','hotel_discount_history_v132','hotel_discount_history_v131','hotel_discount_history_v130','hotel_discount_history_v129','hotel_discount_history_v128','hotel_discount_history_v127','hotel_discount_history_v126','hotel_discount_history_v125','hotel_discount_history_v124','hotel_discount_history_v123','hotel_discount_history_v122','hotel_discount_history_v121','hotel_discount_history_v120','hotel_discount_history_v119','hotel_discount_history_v118','hotel_discount_history_v117','hotel_discount_history_v116','hotel_discount_history_v115','hotel_discount_history_v114','hotel_discount_history_v113','hotel_discount_history_v112','hotel_discount_history_v111','hotel_discount_history_v110','hotel_discount_history_v109','hotel_discount_history_v108','hotel_discount_history_v107','hotel_discount_history_v106','hotel_discount_history_v105','hotel_discount_history_v104','hotel_discount_history_v103','hotel_discount_history_v102','hotel_discount_history_v101','hotel_discount_history_v100','hotel_discount_history_v99','hotel_discount_history_v98','hotel_discount_history_v97','hotel_discount_history_v96','hotel_discount_history_v95','hotel_discount_history_v94','hotel_discount_history_v93','hotel_discount_history_v92','hotel_discount_history_v91','hotel_discount_history_v90','hotel_discount_history_v89','hotel_discount_history_v88','hotel_discount_history_v87','hotel_discount_history_v86','hotel_discount_history_v85','hotel_discount_history_v84','hotel_discount_history_v83','hotel_discount_history_v82','hotel_discount_history_v81','hotel_discount_history_v80','hotel_discount_history_v79','hotel_discount_history_v78','hotel_discount_history_v77','hotel_discount_history_v76','hotel_discount_history_v75','hotel_discount_history_v74','hotel_discount_history_v73','hotel_discount_history_v72','hotel_discount_history_v71','hotel_discount_history_v70','hotel_discount_history_v69','hotel_discount_history_v68','hotel_discount_history_v67','hotel_discount_history_v66','hotel_discount_history_v65','hotel_discount_history_v57','hotel_discount_history_v56','hotel_discount_history_v55','hotel_discount_history_v54','hotel_discount_history_v53','hotel_discount_history_v52','hotel_discount_history_v51','hotel_discount_history_v50','hotel_discount_history_v49','hotel_discount_history_v48','hotel_discount_history_v47','hotel_discount_history_v46','hotel_discount_history_v45','hotel_discount_history_v44','hotel_discount_history_v43','hotel_discount_history_v42','hotel_discount_history_v41','hotel_discount_history_v40','hotel_discount_history_v39','hotel_discount_history_v38','hotel_discount_history_v37','hotel_discount_history_v36','hotel_discount_history_v35','hotel_discount_history_v34','hotel_discount_history_v33','hotel_discount_history_v32','hotel_discount_history_v31','hotel_discount_history_v29','hotel_discount_history_v28','hotel_discount_history_v27','hotel_discount_history_v26','hotel_discount_history_v25','hotel_discount_history_v24','hotel_discount_history_v23','hotel_discount_history_v22','hotel_discount_history_v21','hotel_discount_history_v20','hotel_discount_history_v19','hotel_discount_history_v17','hotel_discount_history_v16','hotel_discount_history_v6','hotel_discount_history_v5','hotel_discount_history_v4','hotel_discount_history_v3','hotel_discount_history_v2','hotel_discount_history_v1'];
const GOOGLE_SYNC_URL_KEY='hotel_discount_history_google_script_url_v202';
const GOOGLE_SYNC_APP_VERSION='v202';
const SECTION_THEME_KEY='hotel_discount_history_section_theme';
const SECTION_THEME_VALUES=['blue','royal','navy','sky','cyan','aqua','teal','turquoise','mint','green','emerald','forest','olive','lime','yellow','cream','amber','gold','orange','peach','coral','red','salmon','rose','pink','magenta','fuchsia','purple','violet','lavender','lilac','plum','indigo','brown','coffee','sand','slate','gray','graphite'];
const SECTION_THEME_LABELS={
  blue:'Синьо',
  royal:'Кралско синьо',
  navy:'Тъмносиньо',
  sky:'Небесно',
  cyan:'Циан',
  aqua:'Аква',
  teal:'Тюркоаз',
  turquoise:'Морски тюркоаз',
  mint:'Мента',
  green:'Зелено',
  emerald:'Смарагд',
  forest:'Горско зелено',
  olive:'Маслина',
  lime:'Лайм',
  yellow:'Жълто',
  cream:'Крем',
  amber:'Кехлибар',
  gold:'Златно',
  orange:'Оранжево',
  peach:'Праскова',
  coral:'Корал',
  red:'Червено',
  salmon:'Сьомга',
  rose:'Розе',
  pink:'Розово',
  magenta:'Магента',
  fuchsia:'Фуксия',
  purple:'Лилаво',
  violet:'Виолетово',
  lavender:'Лавандула',
  lilac:'Люляк',
  plum:'Слива',
  indigo:'Индиго',
  brown:'Кафяво',
  coffee:'Кафе',
  sand:'Пясъчно',
  slate:'Графит',
  gray:'Сиво',
  graphite:'Тъмен графит'
};
const SECTION_THEME_PALETTES={
  blue:{bg:'#f8fafc',soft:'#eff6ff',mid:'#dbeafe',border:'#bfdbfe',text:'#1e3a8a',accent:'#2563eb'},
  royal:{bg:'#f5f7ff',soft:'#e8edff',mid:'#cfd9ff',border:'#9fb2ff',text:'#1e2f97',accent:'#3155d4'},
  navy:{bg:'#f3f6fb',soft:'#e6edf7',mid:'#c9d8ee',border:'#8ea8cc',text:'#17324d',accent:'#1f4e79'},
  sky:{bg:'#f0f9ff',soft:'#e0f2fe',mid:'#bae6fd',border:'#7dd3fc',text:'#075985',accent:'#0284c7'},
  cyan:{bg:'#ecfeff',soft:'#cffafe',mid:'#a5f3fc',border:'#67e8f9',text:'#155e75',accent:'#0891b2'},
  aqua:{bg:'#effefd',soft:'#d6fbf8',mid:'#aaf3ef',border:'#67e8df',text:'#0f5f65',accent:'#06a6a6'},
  teal:{bg:'#f0fdfa',soft:'#ccfbf1',mid:'#99f6e4',border:'#5eead4',text:'#115e59',accent:'#0d9488'},
  turquoise:{bg:'#f0fffc',soft:'#d9fff7',mid:'#b3f5ea',border:'#6ee7d8',text:'#0f766e',accent:'#14b8a6'},
  mint:{bg:'#f2fff8',soft:'#dcfce7',mid:'#bbf7d0',border:'#86efac',text:'#166534',accent:'#22c55e'},
  green:{bg:'#f0fdf4',soft:'#dcfce7',mid:'#bbf7d0',border:'#86efac',text:'#166534',accent:'#16a34a'},
  emerald:{bg:'#ecfdf5',soft:'#d1fae5',mid:'#a7f3d0',border:'#6ee7b7',text:'#065f46',accent:'#059669'},
  forest:{bg:'#f4fbf5',soft:'#e4f6e7',mid:'#c8eecf',border:'#8fd49a',text:'#14532d',accent:'#15803d'},
  olive:{bg:'#fbfcf2',soft:'#f1f5d6',mid:'#dde8a8',border:'#c4d46a',text:'#4d5d12',accent:'#7c8f1d'},
  lime:{bg:'#f7fee7',soft:'#ecfccb',mid:'#d9f99d',border:'#bef264',text:'#3f6212',accent:'#65a30d'},
  yellow:{bg:'#fefce8',soft:'#fef9c3',mid:'#fef08a',border:'#fde047',text:'#854d0e',accent:'#ca8a04'},
  cream:{bg:'#fffdf2',soft:'#fff7d6',mid:'#ffec99',border:'#f6d365',text:'#7c4a03',accent:'#b7791f'},
  amber:{bg:'#fffbeb',soft:'#fef3c7',mid:'#fde68a',border:'#fcd34d',text:'#92400e',accent:'#d97706'},
  gold:{bg:'#fffaf0',soft:'#fff0bd',mid:'#fbd36b',border:'#eab308',text:'#713f12',accent:'#ca8a04'},
  orange:{bg:'#fff7ed',soft:'#ffedd5',mid:'#fed7aa',border:'#fdba74',text:'#9a3412',accent:'#f97316'},
  peach:{bg:'#fff7f0',soft:'#ffeadb',mid:'#ffd0b5',border:'#fda67a',text:'#9a3412',accent:'#fb923c'},
  coral:{bg:'#fff5f2',soft:'#ffe4dc',mid:'#ffc2b3',border:'#ff8f7a',text:'#9f2d20',accent:'#f9735b'},
  red:{bg:'#fef2f2',soft:'#fee2e2',mid:'#fecaca',border:'#fca5a5',text:'#991b1b',accent:'#dc2626'},
  salmon:{bg:'#fff5f5',soft:'#ffe2e2',mid:'#ffcaca',border:'#fda4a4',text:'#9f1239',accent:'#ef4444'},
  rose:{bg:'#fff1f2',soft:'#ffe4e6',mid:'#fecdd3',border:'#fda4af',text:'#9f1239',accent:'#e11d48'},
  pink:{bg:'#fdf2f8',soft:'#fce7f3',mid:'#fbcfe8',border:'#f9a8d4',text:'#9d174d',accent:'#db2777'},
  magenta:{bg:'#fdf4ff',soft:'#fae8ff',mid:'#f5d0fe',border:'#f0abfc',text:'#86198f',accent:'#c026d3'},
  fuchsia:{bg:'#fdf4ff',soft:'#fae8ff',mid:'#f5d0fe',border:'#e879f9',text:'#701a75',accent:'#d946ef'},
  purple:{bg:'#faf5ff',soft:'#f3e8ff',mid:'#e9d5ff',border:'#c084fc',text:'#6b21a8',accent:'#9333ea'},
  violet:{bg:'#f5f3ff',soft:'#ede9fe',mid:'#ddd6fe',border:'#a78bfa',text:'#5b21b6',accent:'#7c3aed'},
  lavender:{bg:'#fbf7ff',soft:'#f3e8ff',mid:'#e9d5ff',border:'#d8b4fe',text:'#6d28d9',accent:'#8b5cf6'},
  lilac:{bg:'#fdf8ff',soft:'#f5e8ff',mid:'#ecd5ff',border:'#d6a5ff',text:'#713fbc',accent:'#a855f7'},
  plum:{bg:'#fbf5fb',soft:'#f3e1f3',mid:'#e6c2e6',border:'#c084c0',text:'#581c87',accent:'#9333ea'},
  indigo:{bg:'#eef2ff',soft:'#e0e7ff',mid:'#c7d2fe',border:'#a5b4fc',text:'#3730a3',accent:'#4f46e5'},
  brown:{bg:'#faf7f2',soft:'#f1e7d8',mid:'#dec7a5',border:'#bf9368',text:'#5c3a21',accent:'#8b5e34'},
  coffee:{bg:'#faf6f1',soft:'#efe4d6',mid:'#d6bd9d',border:'#a67c52',text:'#4b2e1f',accent:'#795548'},
  sand:{bg:'#fffaf0',soft:'#f7ead1',mid:'#ead2a2',border:'#d2aa6d',text:'#6b4e16',accent:'#b9893b'},
  slate:{bg:'#f8fafc',soft:'#f1f5f9',mid:'#e2e8f0',border:'#94a3b8',text:'#1e293b',accent:'#334155'},
  gray:{bg:'#f9fafb',soft:'#f3f4f6',mid:'#e5e7eb',border:'#d1d5db',text:'#374151',accent:'#4b5563'},
  graphite:{bg:'#f7f7f8',soft:'#eceef1',mid:'#d4d7dd',border:'#9ca3af',text:'#111827',accent:'#374151'}
};
const SECTION_THEMES_KEY='hotel_discount_history_section_themes_v202';
const SECTION_THEME_SECTIONS=[
  {key:'tasks',label:'Задачи',buttonId:'toggleTasksBtn',quick:'tasks'},
  {key:'hotels',label:'Хотели',buttonId:'toggleHotelsBtn'},
  {key:'nights',label:'Нощувки',selector:'#hotelNightsSection',quick:'nights'},
  {key:'roomTypes',label:'Типове стаи',buttonId:'toggleRoomTypesSectionBtn',quick:'roomTypes'},
  {key:'mapping',label:'Мапинг',selector:'#toMappingsPanel',quick:'mapping'},
  {key:'contracts',label:'Договори',buttonId:'toggleContractsBtn',quick:'contracts'},
  {key:'prices',label:'Цени',buttonId:'togglePricesBtn',quick:'prices'},
  {key:'ultra',label:'Ултра Ол Инклузив',buttonId:'toggleUltraBtn',quick:'ultra'},
  {key:'discounts',label:'Отстъпки по хотели',buttonId:'toggleDiscountsBtn',quick:'discounts'},
  {key:'discountReservations',label:'Резервации с отстъпки',buttonId:'toggleDiscountReservationsBtn',quick:'discountReservations'},
  {key:'form',label:'Форма',buttonId:'toggleWorkFormBtn',quick:'form'},
  {key:'email',label:'Таблица с имейли',selector:'#emailSection',quick:'email'},
  {key:'emailTxt',label:'Email TXT',buttonId:'toggleEmailTxtBtn',quick:'emailTxt'},
  {key:'checklist',label:'Чек лист',buttonId:'toggleChecklistBtn',quick:'checklist'},
  {key:'cancellations',label:'Анулации и Депозити',buttonId:'toggleCancellationsBtn',quick:'cancellations'}
];
const QUICK_ACCESS_DEFAULT_ORDER=['roomTypes','nights','mapping','prices','ultra','discounts','discountReservations','form','email','contracts','tasks','cancellations'];
const QUICK_ACCESS_ORDER_KEY='hotel_discount_history_quick_access_order_v202';

const DISCOUNT_RESERVATION_LAYOUT_VERSION=8;
const DISCOUNT_RESERVATION_LAYOUT_LEGACY_DEFAULT=[
  {key:'number',label:'Номер',span:5,row:1},
  {key:'reservationDate',label:'Дата създаване',span:5,row:1},
  {key:'clockNumber',label:'Номер Clock',span:10,row:1},
  {key:'hotel',label:'Хотел',span:10,row:1},
  {key:'guestName',label:'Имена на госта',span:15,row:2},
  {key:'stay',label:'ChIN / ChOUT',span:10,row:2},
  {key:'roomType',label:'Тип стая',span:5,row:2},
  {key:'price',label:'Цена',span:5,row:2},
  {key:'discount',label:'Отстъпка',span:5,row:2},
  {key:'comment',label:'Коментар',span:20,row:1}
];
const DISCOUNT_RESERVATION_LAYOUT_V193_DEFAULT=[
  {key:'number',label:'Номер',span:2,row:1},
  {key:'reservationDate',label:'Дата създаване',span:4,row:1},
  {key:'guestName',label:'Имена на госта',span:15,row:1},
  {key:'stay',label:'Нощувки / ChIN / ChOUT',span:5,row:1},
  {key:'roomType',label:'Тип стая',span:5,row:1},
  {key:'price',label:'Цена',span:6,row:1},
  {key:'discount',label:'Отстъпка',span:3,row:1},
  {key:'comment',label:'Коментар',span:20,row:1},
  {key:'clockNumber',label:'Номер Clock',span:4,row:2},
  {key:'hotel',label:'Хотел',span:11,row:2}
];
const DISCOUNT_RESERVATION_LAYOUT_V194_DEFAULT=[
  {key:'number',label:'Номер',span:2,row:1},
  {key:'reservationDate',label:'Дата създаване',span:4,row:1},
  {key:'guestName',label:'Имена на госта',span:14,row:1},
  {key:'stay',label:'ChIN / ChOUT / Нощ.',span:8,row:1},
  {key:'roomType',label:'Тип стая',span:5,row:1},
  {key:'price',label:'Реална цена',span:6,row:1},
  {key:'discount',label:'%',span:3,row:1},
  {key:'comment',label:'Коментар',span:18,row:1},
  {key:'clockNumber',label:'Номер Clock',span:4,row:2},
  {key:'hotel',label:'Хотел',span:8,row:2}
];
const DISCOUNT_RESERVATION_LAYOUT_V5_DEFAULT=[
  {key:'number',label:'№',span:2,row:1},
  {key:'reservationDate',label:'Дата',span:4,row:1},
  {key:'clockNumber',label:'Clock',span:14,row:2},
  {key:'hotel',label:'Хотел',span:8,row:1},
  {key:'guestName',label:'Имена на госта',span:12,row:1},
  {key:'stay',label:'ChIN / ChOUT / Нощ.',span:9,row:1},
  {key:'roomType',label:'Тип стая',span:5,row:1},
  {key:'price',label:'Цена',span:5,row:1},
  {key:'discount',label:'Отстъпка',span:2,row:1},
  {key:'comment',label:'Коментар',span:6,row:1}
];
const DISCOUNT_RESERVATION_LAYOUT_V6_DEFAULT=[
  {key:'number',label:'№',span:2,row:1},
  {key:'reservationDate',label:'Дата',span:4,row:1},
  {key:'hotel',label:'Хотел',span:8,row:1},
  {key:'guestName',label:'Имена на госта',span:14,row:1},
  {key:'stay',label:'ChIN / ChOUT / Нощ.',span:10,row:1},
  {key:'roomType',label:'Тип стая',span:5,row:1},
  {key:'price',label:'Цена',span:5,row:1},
  {key:'discount',label:'Отстъпка',span:3,row:1},
  {key:'clockNumber',label:'Clock',span:58,row:2},
  {key:'comment',label:'Коментар',span:36,row:3}
];
const DISCOUNT_RESERVATION_LAYOUT_DEFAULT=[
  {key:'number',label:'№',span:2,row:1},
  {key:'reservationDate',label:'Дата',span:4,row:1},
  {key:'hotel',label:'Хотел',span:8,row:1},
  {key:'guestName',label:'Имена на госта',span:14,row:1},
  {key:'stay',label:'ChIN / ChOUT / Нощ.',span:10,row:1},
  {key:'roomType',label:'Тип стая',span:5,row:1},
  {key:'price',label:'Цена',span:5,row:1},
  {key:'discount',label:'Отстъпка',span:3,row:1},
  {key:'clockNumber',label:'Clock',span:30,row:2},
  {key:'quendooNumber',label:'Quendoo',span:30,row:2},
  {key:'comment',label:'Коментар',span:36,row:3}
];
let discountReservationLayoutOpen=false;
let draggedDiscountReservationLayoutKey=null;
let weekMonthsInitialized=false;
const ALGARA_S26_PRICE_DATA={periods:[],rooms:[],records:[]};
const ALGARA_BOOKING_S26_PRICE_DATA={periods:[],rooms:[],records:[]};
const DEFAULT_GOOGLE_SCRIPT_URL='https://script.google.com/macros/s/AKfycbwUYAUF193Kwm-2z0qwQMG0UPc2FJDLHltG5jvLbSpDGA382luHHyHyxwRQuxScVuFhdw/exec';
const DISCOUNT_RESERVATION_HOTELS=['Алгара Бийч','Гранд Виктория','Свети Мина','Вила Азура','Малина Резидънс'];

const ULTRA_ALL_INCLUSIVE_HOTELS=[
  {id:'algara_beach',name:'Алгара Бийч'},
  {id:'grand_victoria',name:'Гранд Виктория'}
];

const GRAND_VICTORIA_S26_PRICE_DATA={"hotel":"Гранд Виктория","season":"S26","sourceFile":"GRVV.xlsx","periods":[{"id":"P1","label":"01.05–15.05\n26.09–05.10","intervals":[{"start":"2026-05-01","end":"2026-05-15","label":"01.05–15.05"},{"start":"2026-09-26","end":"2026-10-05","label":"26.09–05.10"}]},{"id":"P2","label":"16.05–09.06\n15.09–25.09","intervals":[{"start":"2026-05-16","end":"2026-06-09","label":"16.05–09.06"},{"start":"2026-09-15","end":"2026-09-25","label":"15.09–25.09"}]},{"id":"P3","label":"10.06–21.06\n06.09–14.09","intervals":[{"start":"2026-06-10","end":"2026-06-21","label":"10.06–21.06"},{"start":"2026-09-06","end":"2026-09-14","label":"06.09–14.09"}]},{"id":"P4","label":"22.06–03.07\n22.08–05.09","intervals":[{"start":"2026-06-22","end":"2026-07-03","label":"22.06–03.07"},{"start":"2026-08-22","end":"2026-09-05","label":"22.08–05.09"}]},{"id":"P5","label":"04.07–19.07\n12.08–21.08","intervals":[{"start":"2026-07-04","end":"2026-07-19","label":"04.07–19.07"},{"start":"2026-08-12","end":"2026-08-21","label":"12.08–21.08"}]},{"id":"P6","label":"20.07–11.08","intervals":[{"start":"2026-07-20","end":"2026-08-11","label":"20.07–11.08"}]}],"rooms":[{"original":"STP park","display":"STP","configs":["2+0/1+1","2+1","3+0","1+0/1+1"],"formulaRoom":true},{"original":"AM 1debroom","display":"APP SMALL","configs":["2+0/2+1","2+2","3+0","3+1","1+0/1+1"]},{"original":"ACD 2bedroom","display":"ACD DBL, ST","configs":["4+0","4+1/2+3","4+2","5+0","1+0/1+1"]},{"original":"AP lux","display":"APP LUX","configs":["4+0","4+1/2+3","4+2","5+0"]},{"original":"AF family","display":"APP FAM","configs":["4+0","4+1/2+3","4+2","5+0","1+0/1+1"]},{"original":"DBL sea","display":"DBL","configs":["2+0","1+0/1+1"],"formulaRoom":true},{"original":"STS side sse","display":"STS","configs":["2+0","2+1","2+2","3+0","1+0/1+1"],"formulaRoom":true}],"records":[{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"STP park","room_display":"STP","config":"2+0/1+1","price":114.4},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"STP park","room_display":"STP","config":"2+1","price":128.7},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"STP park","room_display":"STP","config":"3+0","price":160.16},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"STP park","room_display":"STP","config":"1+0/1+1","price":85.8},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"STP park","room_display":"STP","config":"2+0/1+1","price":145.2},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"STP park","room_display":"STP","config":"2+1","price":163.35},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"STP park","room_display":"STP","config":"3+0","price":203.28},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"STP park","room_display":"STP","config":"1+0/1+1","price":116.16},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"STP park","room_display":"STP","config":"2+0/1+1","price":185.8},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"STP park","room_display":"STP","config":"2+1","price":209.03},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"STP park","room_display":"STP","config":"3+0","price":260.12},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"STP park","room_display":"STP","config":"1+0/1+1","price":157.93},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"STP park","room_display":"STP","config":"2+0/1+1","price":214.4},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"STP park","room_display":"STP","config":"2+1","price":241.2},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"STP park","room_display":"STP","config":"3+0","price":300.16},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"STP park","room_display":"STP","config":"1+0/1+1","price":192.96},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"STP park","room_display":"STP","config":"2+0/1+1","price":240.6},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"STP park","room_display":"STP","config":"2+1","price":270.68},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"STP park","room_display":"STP","config":"3+0","price":336.84},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"STP park","room_display":"STP","config":"1+0/1+1","price":228.57},{"period_id":"P6","period_label":"20.07–11.08","room_original":"STP park","room_display":"STP","config":"2+0/1+1","price":264.4},{"period_id":"P6","period_label":"20.07–11.08","room_original":"STP park","room_display":"STP","config":"2+1","price":297.45},{"period_id":"P6","period_label":"20.07–11.08","room_original":"STP park","room_display":"STP","config":"3+0","price":370.16},{"period_id":"P6","period_label":"20.07–11.08","room_original":"STP park","room_display":"STP","config":"1+0/1+1","price":251.18},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+0/2+1","price":160.75},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+2","price":160.75},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+0","price":180.04},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+1","price":196.12},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AM 1debroom","room_display":"APP SMALL","config":"1+0/1+1","price":96.45},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+0/2+1","price":202.5},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+2","price":202.5},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+0","price":226.8},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+1","price":247.05},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"1+0/1+1","price":129.6},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+0/2+1","price":259.0},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+2","price":259.0},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+0","price":290.08},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+1","price":315.98},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"1+0/1+1","price":176.12},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+0/2+1","price":300.75},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+2","price":300.75},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+0","price":336.84},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+1","price":366.92},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AM 1debroom","room_display":"APP SMALL","config":"1+0/1+1","price":216.54},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+0/2+1","price":336.25},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+2","price":336.25},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+0","price":376.6},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+1","price":410.23},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AM 1debroom","room_display":"APP SMALL","config":"1+0/1+1","price":255.55},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+0/2+1","price":369.0},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AM 1debroom","room_display":"APP SMALL","config":"2+2","price":369.0},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+0","price":413.28},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AM 1debroom","room_display":"APP SMALL","config":"3+1","price":450.18},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AM 1debroom","room_display":"APP SMALL","config":"1+0/1+1","price":280.44},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+0","price":242.8},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+1/2+3","price":257.98},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+2","price":273.15},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"5+0","price":291.36},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"1+0/1+1","price":91.05},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+0","price":309.6},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+1/2+3","price":328.95},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+2","price":348.3},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"5+0","price":371.52},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"1+0/1+1","price":123.84},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+0","price":395.2},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+1/2+3","price":419.9},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+2","price":444.6},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"5+0","price":474.24},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"1+0/1+1","price":167.96},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+0","price":457.2},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+1/2+3","price":485.78},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+2","price":514.35},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"5+0","price":548.64},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"1+0/1+1","price":205.74},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+0","price":514.4},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+1/2+3","price":546.55},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+2","price":578.7},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"5+0","price":617.28},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"1+0/1+1","price":244.34},{"period_id":"P6","period_label":"20.07–11.08","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+0","price":566.8},{"period_id":"P6","period_label":"20.07–11.08","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+1/2+3","price":602.23},{"period_id":"P6","period_label":"20.07–11.08","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"4+2","price":637.65},{"period_id":"P6","period_label":"20.07–11.08","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"5+0","price":680.16},{"period_id":"P6","period_label":"20.07–11.08","room_original":"ACD 2bedroom","room_display":"ACD DBL, ST","config":"1+0/1+1","price":269.23},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AP lux","room_display":"APP LUX","config":"4+0","price":238.0},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AP lux","room_display":"APP LUX","config":"4+1/2+3","price":252.88},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AP lux","room_display":"APP LUX","config":"4+2","price":166.6},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AP lux","room_display":"APP LUX","config":"5+0","price":285.6},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AP lux","room_display":"APP LUX","config":"4+0","price":300.0},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AP lux","room_display":"APP LUX","config":"4+1/2+3","price":318.75},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AP lux","room_display":"APP LUX","config":"4+2","price":210.0},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AP lux","room_display":"APP LUX","config":"5+0","price":360.0},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AP lux","room_display":"APP LUX","config":"4+0","price":385.6},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AP lux","room_display":"APP LUX","config":"4+1/2+3","price":409.7},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AP lux","room_display":"APP LUX","config":"4+2","price":269.92},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AP lux","room_display":"APP LUX","config":"5+0","price":462.72},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AP lux","room_display":"APP LUX","config":"4+0","price":447.6},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AP lux","room_display":"APP LUX","config":"4+1/2+3","price":475.58},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AP lux","room_display":"APP LUX","config":"4+2","price":313.32},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AP lux","room_display":"APP LUX","config":"5+0","price":537.12},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AP lux","room_display":"APP LUX","config":"4+0","price":500.0},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AP lux","room_display":"APP LUX","config":"4+1/2+3","price":531.25},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AP lux","room_display":"APP LUX","config":"4+2","price":350.0},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AP lux","room_display":"APP LUX","config":"5+0","price":600.0},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AP lux","room_display":"APP LUX","config":"4+0","price":547.6},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AP lux","room_display":"APP LUX","config":"4+1/2+3","price":581.83},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AP lux","room_display":"APP LUX","config":"4+2","price":383.32},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AP lux","room_display":"APP LUX","config":"5+0","price":657.12},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AF family","room_display":"APP FAM","config":"4+0","price":224.0},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AF family","room_display":"APP FAM","config":"4+1/2+3","price":238.0},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AF family","room_display":"APP FAM","config":"4+2","price":252.0},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AF family","room_display":"APP FAM","config":"5+0","price":268.8},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"AF family","room_display":"APP FAM","config":"1+0/1+1","price":84.0},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AF family","room_display":"APP FAM","config":"4+0","price":285.6},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AF family","room_display":"APP FAM","config":"4+1/2+3","price":303.45},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AF family","room_display":"APP FAM","config":"4+2","price":321.3},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AF family","room_display":"APP FAM","config":"5+0","price":342.72},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"AF family","room_display":"APP FAM","config":"1+0/1+1","price":114.24},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AF family","room_display":"APP FAM","config":"4+0","price":362.0},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AF family","room_display":"APP FAM","config":"4+1/2+3","price":384.63},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AF family","room_display":"APP FAM","config":"4+2","price":407.25},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AF family","room_display":"APP FAM","config":"5+0","price":434.4},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"AF family","room_display":"APP FAM","config":"1+0/1+1","price":153.85},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AF family","room_display":"APP FAM","config":"4+0","price":419.2},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AF family","room_display":"APP FAM","config":"4+1/2+3","price":445.4},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AF family","room_display":"APP FAM","config":"4+2","price":471.6},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AF family","room_display":"APP FAM","config":"5+0","price":503.04},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"AF family","room_display":"APP FAM","config":"1+0/1+1","price":188.64},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AF family","room_display":"APP FAM","config":"4+0","price":471.6},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AF family","room_display":"APP FAM","config":"4+1/2+3","price":501.08},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AF family","room_display":"APP FAM","config":"4+2","price":530.55},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AF family","room_display":"APP FAM","config":"5+0","price":565.92},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"AF family","room_display":"APP FAM","config":"1+0/1+1","price":224.01},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AF family","room_display":"APP FAM","config":"4+0","price":519.2},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AF family","room_display":"APP FAM","config":"4+1/2+3","price":551.65},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AF family","room_display":"APP FAM","config":"4+2","price":584.1},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AF family","room_display":"APP FAM","config":"5+0","price":623.04},{"period_id":"P6","period_label":"20.07–11.08","room_original":"AF family","room_display":"APP FAM","config":"1+0/1+1","price":246.62},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"DBL sea","room_display":"DBL","config":"2+0","price":123.8},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"DBL sea","room_display":"DBL","config":"1+0/1+1","price":92.85},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"DBL sea","room_display":"DBL","config":"2+0","price":157.2},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"DBL sea","room_display":"DBL","config":"1+0/1+1","price":125.76},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"DBL sea","room_display":"DBL","config":"2+0","price":202.4},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"DBL sea","room_display":"DBL","config":"1+0/1+1","price":172.04},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"DBL sea","room_display":"DBL","config":"2+0","price":233.4},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"DBL sea","room_display":"DBL","config":"1+0/1+1","price":210.06},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"DBL sea","room_display":"DBL","config":"2+0","price":262.0},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"DBL sea","room_display":"DBL","config":"1+0/1+1","price":248.9},{"period_id":"P6","period_label":"20.07–11.08","room_original":"DBL sea","room_display":"DBL","config":"2+0","price":288.2},{"period_id":"P6","period_label":"20.07–11.08","room_original":"DBL sea","room_display":"DBL","config":"1+0/1+1","price":273.79},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"STS side sse","room_display":"STS","config":"2+0","price":126.2},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"STS side sse","room_display":"STS","config":"2+1","price":141.98},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"STS side sse","room_display":"STS","config":"2+2","price":157.75},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"STS side sse","room_display":"STS","config":"3+0","price":176.68},{"period_id":"P1","period_label":"01.05–15.05\n26.09–05.10","room_original":"STS side sse","room_display":"STS","config":"1+0/1+1","price":94.65},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"STS side sse","room_display":"STS","config":"2+0","price":162.0},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"STS side sse","room_display":"STS","config":"2+1","price":182.25},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"STS side sse","room_display":"STS","config":"2+2","price":202.5},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"STS side sse","room_display":"STS","config":"3+0","price":226.8},{"period_id":"P2","period_label":"16.05–09.06\n15.09–25.09","room_original":"STS side sse","room_display":"STS","config":"1+0/1+1","price":129.6},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"STS side sse","room_display":"STS","config":"2+0","price":207.2},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"STS side sse","room_display":"STS","config":"2+1","price":233.1},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"STS side sse","room_display":"STS","config":"2+2","price":259.0},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"STS side sse","room_display":"STS","config":"3+0","price":290.08},{"period_id":"P3","period_label":"10.06–21.06\n06.09–14.09","room_original":"STS side sse","room_display":"STS","config":"1+0/1+1","price":176.12},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"STS side sse","room_display":"STS","config":"2+0","price":238.2},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"STS side sse","room_display":"STS","config":"2+1","price":267.98},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"STS side sse","room_display":"STS","config":"2+2","price":297.75},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"STS side sse","room_display":"STS","config":"3+0","price":333.48},{"period_id":"P4","period_label":"22.06–03.07\n22.08–05.09","room_original":"STS side sse","room_display":"STS","config":"1+0/1+1","price":214.38},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"STS side sse","room_display":"STS","config":"2+0","price":266.8},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"STS side sse","room_display":"STS","config":"2+1","price":300.15},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"STS side sse","room_display":"STS","config":"2+2","price":333.5},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"STS side sse","room_display":"STS","config":"3+0","price":373.52},{"period_id":"P5","period_label":"04.07–19.07\n12.08–21.08","room_original":"STS side sse","room_display":"STS","config":"1+0/1+1","price":253.46},{"period_id":"P6","period_label":"20.07–11.08","room_original":"STS side sse","room_display":"STS","config":"2+0","price":293.0},{"period_id":"P6","period_label":"20.07–11.08","room_original":"STS side sse","room_display":"STS","config":"2+1","price":329.63},{"period_id":"P6","period_label":"20.07–11.08","room_original":"STS side sse","room_display":"STS","config":"2+2","price":366.25},{"period_id":"P6","period_label":"20.07–11.08","room_original":"STS side sse","room_display":"STS","config":"3+0","price":410.2},{"period_id":"P6","period_label":"20.07–11.08","room_original":"STS side sse","room_display":"STS","config":"1+0/1+1","price":278.35}]};
const DEFAULT_ALGARA_ULTRA_HTML=`<h4>Основен ресторант „Алгара“</h4>
<ul>
  <li><strong>Закуска:</strong> на блок маса от 07:30 до 10:00; включени вода, сок и топли напитки.</li>
  <li><strong>Обяд:</strong> на блок маса от 12:30 до 14:30; включени вино, бира, вода, сок, безалкохолни и топли напитки.</li>
  <li><strong>Вечеря:</strong> на блок маса от 18:30 до 21:00; включени вино, бира, вода, сок, безалкохолни и топли напитки.</li>
  <li>2 тематични вечери.</li>
  <li>Бебешки корнер.</li>
  <li>Здравословен бюфет.</li>
  <li>BBQ вечер с фолклорна програма веднъж седмично.</li>
  <li>Български алкохол, бира, вино и разпознаваем вносен алкохол от ултра ол инклузив менюто.</li>
  <li>Бутилираните напитки се заплащат допълнително.</li>
</ul>
<h4>А-ла-карт ресторанти</h4>
<ul>
  <li><strong>Италиански а-ла-карт ресторант „Casa mia“:</strong> съвременен италиански ресторант, работи 6 пъти седмично; вечеря от 18:30 до 22:30.</li>
  <li><strong>Рибен а-ла-карт ресторант „Косара“:</strong> съвременен рибен ресторант, работи 6 пъти седмично; вечеря от 18:30 до 22:30.</li>
  <li>1 вечеря в а-ла-карт ресторант е включена в Ултра Ол Инклузив цената при минимален престой от 4 нощувки.</li>
  <li>Изисква се предварително записване. Допълнителна вечеря е възможна при налични места и срещу заплащане.</li>
  <li>При престой под 4 нощувки е възможна резервация при наличност и срещу доплащане 30 лв./15 € на човек.</li>
  <li>За деца до 11.99 г. а-ла-карт вечерята не се заплаща, но трябва да бъдат включени в резервацията.</li>
  <li>Включени са български алкохол, бира, вино, разпознаваем вносен алкохол, топли напитки и коктейли от ултра ол инклузив менюто.</li>
  <li>Бутилираните напитки се заплащат допълнително.</li>
</ul>
<h4>Снек бар „Косара“</h4>
<ul>
  <li><strong>Работно време на бара:</strong> 10:00 – 23:00.</li>
  <li><strong>Обяд:</strong> 11:00 – 15:00.</li>
  <li><strong>Light snack:</strong> 15:00 – 17:00.</li>
</ul>
<h4>Барове</h4>
<ul>
  <li><strong>Бийч бар „Алгара“:</strong> работно време 09:00 – 18:00.</li>
  <li>На бийч бара са включени български алкохол, бира, вино, разпознаваем вносен алкохол, коктейли, топли напитки, сокове и безалкохолни напитки от ултра ол инклузив менюто.</li>
  <li><strong>Лоби бар:</strong> работно време 24/7.</li>
  <li>Лоби барът предлага сладкарски кът с торти, пасти и сладки.</li>
  <li>Late Snack: студени пакетирани сандвичи, плодове и дребни сладки.</li>
  <li>На лоби бара са включени български алкохол, бира, вино, разпознаваем вносен алкохол, коктейли, топли напитки, сокове и безалкохолни напитки от ултра ол инклузив менюто.</li>
  <li>Бутилираните напитки се заплащат допълнително.</li>
</ul>
<h4>Басейн</h4>
<ul>
  <li>Външен басейн за възрастни с безплатни чадъри и шезлонги до изчерпване на количествата.</li>
  <li>Външен басейн за деца.</li>
  <li>Детска сплаш зона.</li>
  <li>Хотелът не позволява запазване на чадъри и шезлонги чрез оставяне на лични вещи без надзор.</li>
</ul>
<h4>Плаж</h4>
<ul>
  <li>Безплатни чадъри и шезлонги до изчерпване на количествата.</li>
  <li>Плажни хавлии срещу депозит.</li>
  <li>Хотелът не позволява запазване на чадъри и шезлонги чрез оставяне на лични вещи без надзор.</li>
</ul>
<h4>Спорт и забавления</h4>
<ul>
  <li>Мултифункционално игрище с изкуствена тревна настилка: тенис, футбол и баскетбол.</li>
  <li>Анимация 6 пъти седмично: детска, спортна, мини диско и вечерни шоу програми.</li>
  <li>Фитнес.</li>
  <li>Тенис на маса.</li>
  <li>Велосипеди под наем.</li>
  <li>Водни спортове на плажа срещу допълнително заплащане от външна фирма.</li>
  <li>Детски съоръжения за деца над 4 г.</li>
</ul>
<h4>Други услуги и условия</h4>
<ul>
  <li>Безплатно ежедневно зареждане на минибар в стаите: бира, безалкохолни напитки и вода.</li>
  <li>Безплатен паркинг: 1 кола на помещение.</li>
  <li>Wi-Fi.</li>
  <li>Настаняване след 15:00 и напускане преди 11:00.</li>
  <li>Ранно пристигане и късно освобождаване на стаята: при възможност на хотела и срещу допълнително заплащане.</li>
  <li>Ултра Ол Инклузивът започва с обяд в деня на пристигане и завършва със закуска на последния ден.</li>
  <li>Мини клуб за деца над 4 г.</li>
  <li>Кошара при предварителна заявка и според наличността.</li>
</ul>
<h4>Роял Клуб</h4>
<ul>
  <li>Настаняване в роял стаи, апартаменти или вили.</li>
  <li>По-богата селекция от вносни алкохолни напитки от специално меню.</li>
  <li>Безплатен минибар с ежедневно зареждане: вода, бира, безалкохолно и сок.</li>
  <li>Кафемашина с капсули в стаята с ежедневно зареждане.</li>
  <li>Отстъпка от услугата „Пране“.</li>
  <li>Роял зона на плажа: плажен бар с обслужване.</li>
  <li>Бебешки пакет: по запитване, безплатно; за гости извън Роял – срещу заплащане.</li>
</ul>
<h4>Роял зона на плажа</h4>
<ul>
  <li>Роял Клуб концепцията дава достъп до допълнителна плажна зона за повече комфорт и пълноценна почивка.</li>
  <li>Royal плажният бар предлага първокласно меню от напитки и дигитални иновации в обслужването.</li>
  <li>Концепцията Royal Beach Area е насочена към високо качество на обслужване и незабравим престой.</li>
</ul>`;
const ROOM_NAME_COLUMN_DEFAULT=145;
const ROOM_NAME_COLUMN_MIN=90;
const ROOM_NAME_COLUMN_MAX=280;
const ROOM_NAME_OFFSET_DEFAULT=0;
const ROOM_NAME_OFFSET_MIN=-18;
const ROOM_NAME_OFFSET_MAX=90;
const ROOM_NAME_FONT_DEFAULT=11;
const ROOM_NAME_FONT_MIN=10;
const ROOM_NAME_FONT_MAX=18;
const ROOM_KIND_COLUMN_DEFAULT=130;
const ROOM_KIND_COLUMN_MIN=90;
const ROOM_KIND_COLUMN_MAX=260;
const ROOM_KIND_FONT_DEFAULT=11;
const ROOM_KIND_FONT_MIN=10;
const ROOM_KIND_FONT_MAX=18;
const ROOM_SQUARE_FONT_DEFAULT=11;
const ROOM_SQUARE_FONT_MIN=9;
const ROOM_SQUARE_FONT_MAX=22;
const ROOM_EXTRA_FONT_DEFAULT=11;
const ROOM_EXTRA_FONT_MIN=10;
const ROOM_EXTRA_FONT_MAX=18;
const PRICE_TABLE_ROOM_COL_DEFAULT=135;
const PRICE_TABLE_ROOM_COL_MIN=90;
const PRICE_TABLE_ROOM_COL_MAX=260;
const PRICE_TABLE_PERIOD_COL_DEFAULT=92;
const PRICE_TABLE_PERIOD_COL_MIN=58;
const PRICE_TABLE_PERIOD_COL_MAX=160;
const PRICE_TABLE_ROW_HEIGHT_DEFAULT=38;
const PRICE_TABLE_ROW_HEIGHT_MIN=24;
const PRICE_TABLE_ROW_HEIGHT_MAX=82;
const PRICE_TABLE_ROOM_FONT_DEFAULT=11;
const PRICE_TABLE_ROOM_FONT_MIN=8;
const PRICE_TABLE_ROOM_FONT_MAX=22;
const PRICE_TABLE_PERIOD_FONT_DEFAULT=10;
const PRICE_TABLE_PERIOD_FONT_MIN=7;
const PRICE_TABLE_PERIOD_FONT_MAX=18;
const PRICE_TABLE_PRICE_FONT_DEFAULT=11;
const PRICE_TABLE_PRICE_FONT_MIN=8;
const PRICE_TABLE_PRICE_FONT_MAX=22;

const EMAIL_TXT_HOTELS=[
  {id:'algara_beach',name:'Алгара Бийч'},
  {id:'grand_victoria',name:'Гранд Виктория'},
  {id:'sveti_mina',name:'Свети Мина'},
  {id:'vila_azura',name:'Вила Азура'},
  {id:'malina_residence',name:'Малина Резиденс'}
];
const DEFAULT_EMAIL_TXT_BUTTON_NAME='Groups Ultra All inclusive';

const TASK_REMINDER_OPTIONS=[
  {value:'none',label:'Без напомняне'},
  {value:'0',label:'В деня'},
  {value:'1',label:'1 ден преди'},
  {value:'2',label:'2 дни преди'},
  {value:'3',label:'3 дни преди'},
  {value:'7',label:'1 седмица преди'}
];



function getStoredQuickAccessOrder(){
  try{
    const raw=localStorage.getItem(QUICK_ACCESS_ORDER_KEY);
    if(raw)return JSON.parse(raw);
  }catch(e){}
  return null;
}
function normalizeQuickAccessOrder(order){
  const valid=QUICK_ACCESS_DEFAULT_ORDER;
  const source=Array.isArray(order)?order:[];
  const normalized=[];
  source.forEach(key=>{if(valid.includes(key)&&!normalized.includes(key))normalized.push(key);});
  valid.forEach(key=>{if(!normalized.includes(key))normalized.push(key);});
  return normalized;
}
function persistQuickAccessOrder(order){
  const normalized=normalizeQuickAccessOrder(order);
  try{localStorage.setItem(QUICK_ACCESS_ORDER_KEY,JSON.stringify(normalized))}catch(e){}
  if(typeof state!=='undefined'&&state){
    state.uiSettings=normalizeUiSettings(state.uiSettings||{});
    state.uiSettings.quickAccessOrder=normalized;
  }
  return normalized;
}
function getQuickAccessOrder(){
  const stored=(typeof state!=='undefined'&&state&&state.uiSettings&&state.uiSettings.quickAccessOrder)||getStoredQuickAccessOrder()||[];
  return normalizeQuickAccessOrder(stored);
}
function applyQuickAccessOrder(){
  const row=document.querySelector('.quick-access-row');
  if(!row)return;
  const colors=row.querySelector('.section-colors-wrap');
  const order=getQuickAccessOrder();
  order.forEach(key=>{
    const btn=row.querySelector(`[data-quick-section="${key}"]`);
    if(btn){
      btn.setAttribute('draggable','true');
      btn.title='Задръж и премести · '+btn.textContent.trim();
      if(colors)row.insertBefore(btn,colors); else row.appendChild(btn);
    }
  });
}
function saveQuickAccessOrderFromDom(){
  const row=document.querySelector('.quick-access-row');
  if(!row)return;
  const keys=Array.from(row.querySelectorAll('[data-quick-section]')).map(btn=>btn.dataset.quickSection);
  persistQuickAccessOrder(keys);
  saveStateSafe();
}
function initQuickAccessSorting(){
  applyQuickAccessOrder();
  const row=document.querySelector('.quick-access-row');
  if(!row)return;
  let draggedKey=null;
  row.querySelectorAll('[data-quick-section]').forEach(btn=>{
    btn.setAttribute('draggable','true');
    btn.addEventListener('dragstart',event=>{
      draggedKey=btn.dataset.quickSection;
      btn.classList.add('quick-dragging');
      window.__quickAccessWasDragged=false;
      try{event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',draggedKey)}catch(e){}
    });
    btn.addEventListener('dragover',event=>{
      if(!draggedKey||draggedKey===btn.dataset.quickSection)return;
      event.preventDefault();
      btn.classList.add('quick-drag-over');
      try{event.dataTransfer.dropEffect='move'}catch(e){}
    });
    btn.addEventListener('dragleave',()=>btn.classList.remove('quick-drag-over'));
    btn.addEventListener('drop',event=>{
      event.preventDefault();
      btn.classList.remove('quick-drag-over');
      const dragged=row.querySelector(`[data-quick-section="${draggedKey}"]`);
      if(!dragged||dragged===btn)return;
      const rect=btn.getBoundingClientRect();
      const before=event.clientX<rect.left+rect.width/2;
      row.insertBefore(dragged,before?btn:btn.nextSibling);
      window.__quickAccessWasDragged=true;
      saveQuickAccessOrderFromDom();
    });
    btn.addEventListener('dragend',()=>{
      row.querySelectorAll('.quick-dragging,.quick-drag-over').forEach(el=>el.classList.remove('quick-dragging','quick-drag-over'));
      draggedKey=null;
      if(window.__quickAccessWasDragged){setTimeout(()=>{window.__quickAccessWasDragged=false;},220);}
    });
  });
}

function defaultSectionThemes(){
  const base={};
  SECTION_THEME_SECTIONS.forEach(sec=>{base[sec.key]='blue'});
  return base;
}
function getSectionTheme(){
  try{
    const saved=localStorage.getItem(SECTION_THEME_KEY)||'blue';
    return SECTION_THEME_VALUES.includes(saved)?saved:'blue';
  }catch(e){return 'blue'}
}
function getStoredSectionThemes(){
  try{
    const raw=localStorage.getItem(SECTION_THEMES_KEY);
    if(raw)return JSON.parse(raw);
  }catch(e){}
  return null;
}
function normalizeSectionThemes(input){
  const fallback=getSectionTheme();
  const base=defaultSectionThemes();
  const source=input&&typeof input==='object'?input:{};
  SECTION_THEME_SECTIONS.forEach(sec=>{
    const value=source[sec.key];
    base[sec.key]=SECTION_THEME_VALUES.includes(value)?value:(SECTION_THEME_VALUES.includes(fallback)?fallback:'blue');
  });
  return base;
}
function setThemeVarsOnElement(element,palette){
  if(!element||!palette)return;
  element.style.setProperty('--section-theme-bg',palette.bg);
  element.style.setProperty('--section-theme-soft',palette.soft);
  element.style.setProperty('--section-theme-mid',palette.mid);
  element.style.setProperty('--section-theme-border',palette.border);
  element.style.setProperty('--section-theme-text',palette.text);
  element.style.setProperty('--section-theme-accent',palette.accent);
}
function applySectionTheme(theme){
  const safe=SECTION_THEME_VALUES.includes(theme)?theme:'blue';
  const palette=SECTION_THEME_PALETTES[safe]||SECTION_THEME_PALETTES.blue;
  if(document.body)document.body.dataset.sectionTheme=safe;
  [document.documentElement,document.body].filter(Boolean).forEach(root=>setThemeVarsOnElement(root,palette));
  try{localStorage.setItem(SECTION_THEME_KEY,safe)}catch(e){}
}
function sectionThemeTargets(section){
  const targets=[];
  if(section.selector){
    document.querySelectorAll(section.selector).forEach(el=>targets.push(el));
  }
  if(section.buttonId){
    const btn=document.getElementById(section.buttonId);
    const closest=btn&&btn.closest?btn.closest('.section'):null;
    if(closest)targets.push(closest);
  }
  return Array.from(new Set(targets.filter(Boolean)));
}
function colorQuickAccessButton(section,theme){
  const quick=section.quick||section.key;
  if(!quick)return;
  const palette=SECTION_THEME_PALETTES[theme]||SECTION_THEME_PALETTES.blue;
  document.querySelectorAll(`[data-quick-section="${quick}"]`).forEach(btn=>{
    btn.dataset.sectionTheme=theme;
    btn.style.background=palette.mid;
    btn.style.borderColor=palette.border;
    btn.style.color=palette.text;
  });
}
function persistSectionThemes(themes){
  const normalized=normalizeSectionThemes(themes);
  try{localStorage.setItem(SECTION_THEMES_KEY,JSON.stringify(normalized))}catch(e){}
  if(typeof state!=='undefined'&&state){state.sectionThemes=normalized;}
  return normalized;
}
function applyAllSectionThemes(){
  if(typeof state==='undefined'||!state)return;
  state.sectionThemes=normalizeSectionThemes(state.sectionThemes||getStoredSectionThemes()||{});
applyCancellationPresetMigration();
  SECTION_THEME_SECTIONS.forEach(section=>{
    const theme=state.sectionThemes[section.key]||'blue';
    const palette=SECTION_THEME_PALETTES[theme]||SECTION_THEME_PALETTES.blue;
    sectionThemeTargets(section).forEach(target=>{
      target.dataset.sectionThemeKey=section.key;
      target.dataset.sectionTheme=theme;
      setThemeVarsOnElement(target,palette);
    });
    colorQuickAccessButton(section,theme);
  });
  document.querySelectorAll('#sectionColorsPanel [data-section-theme-key]').forEach(btn=>{
    const active=(state.sectionThemes[btn.dataset.sectionThemeKey]||'blue')===btn.dataset.sectionTheme;
    btn.classList.toggle('active',active);
  });
}
function renderSectionThemeControls(){
  const list=document.getElementById('sectionColorsList');
  if(!list)return;
  const themes=normalizeSectionThemes((typeof state!=='undefined'&&state&&state.sectionThemes)||getStoredSectionThemes()||{});
  list.innerHTML=SECTION_THEME_SECTIONS.map(section=>{
    const selectedValue=themes[section.key]||'blue';
    const selectedPalette=SECTION_THEME_PALETTES[selectedValue]||SECTION_THEME_PALETTES.blue;
    const selectedLabel=SECTION_THEME_LABELS[selectedValue]||selectedValue;
    const buttons=SECTION_THEME_VALUES.map(value=>{
      const p=SECTION_THEME_PALETTES[value]||SECTION_THEME_PALETTES.blue;
      const active=themes[section.key]===value?' active':'';
      return `<button class="section-color-choice${active}" type="button" title="${escapeAttr(section.label)} · ${escapeAttr(SECTION_THEME_LABELS[value]||value)}" data-section-theme-key="${escapeAttr(section.key)}" data-section-theme="${escapeAttr(value)}" style="--choice-color:${escapeAttr(p.mid)};--choice-border:${escapeAttr(p.border)};--choice-accent:${escapeAttr(p.accent)};--choice-text:${escapeAttr(p.text)}"></button>`;
    }).join('');
    return `<div class="section-color-row"><div class="section-color-row-label"><span class="section-selected-swatch" style="--selected-color:${escapeAttr(selectedPalette.mid)};--selected-border:${escapeAttr(selectedPalette.border)}"></span><span class="section-color-row-label-text">${escapeHtml(section.label)}</span><span class="section-selected-name">${escapeHtml(selectedLabel)}</span></div><div class="section-color-row-buttons">${buttons}</div></div>`;
  }).join('');
  list.querySelectorAll('[data-section-theme-key]').forEach(btn=>{
    btn.onclick=(event)=>{
      event.preventDefault();event.stopPropagation();
      const current=normalizeSectionThemes((state&&state.sectionThemes)||{});
      current[btn.dataset.sectionThemeKey]=btn.dataset.sectionTheme;
      persistSectionThemes(current);
      renderSectionThemeControls();
      applyAllSectionThemes();
      saveStateSafe();
    };
  });
}
function initSectionThemeControls(){
  const toggle=document.getElementById('sectionColorsToggle');
  const panel=document.getElementById('sectionColorsPanel');
  if(!toggle||!panel)return;
  renderSectionThemeControls();
  applyAllSectionThemes();
  toggle.onclick=(event)=>{
    event.preventDefault();
    event.stopPropagation();
    renderSectionThemeControls();
    panel.classList.toggle('hidden');
    applyAllSectionThemes();
  };
  panel.onclick=(event)=>event.stopPropagation();
  if(!window.__sectionThemeOutsideClickBound){
    document.addEventListener('click',()=>{
      document.querySelectorAll('.section-colors-panel').forEach(p=>p.classList.add('hidden'));
    });
    window.__sectionThemeOutsideClickBound=true;
  }
}

applySectionTheme(getSectionTheme());
let state=loadState();
state.sectionThemes=normalizeSectionThemes(state.sectionThemes||getStoredSectionThemes()||{});
applyRoomInfoDisplaySettings();
let activeWeekId=state.activeWeekId||(state.weeks[0]&&state.weeks[0].id)||null;
const CANCEL_EXTRA_STORAGE_KEYS=['algara_prices_preview_lite_v26_override'];
let lastAcceptedStateSnapshot='';
let lastAcceptedExtraStorageSnapshot={};
let draggedPeriodId=null, draggedWeekId=null, draggedSubsectionId=null, draggedChecklistItemId=null, draggedRoomTypeId=null, draggedRoomHotelId=null, draggedEmailTxtTemplateId=null;
const collapsedMonths=new Set();
const monthNames=['Януари','Февруари','Март','Април','Май','Юни','Юли','Август','Септември','Октомври','Ноември','Декември'];
const sectionOpen={hotels:false,contracts:false,tasks:false,roomTypes:false,prices:false,ultra:false,discounts:false,discountReservations:false,form:false,email:false,emailTxt:false,checklist:false,cancellations:false};
let roomSettingsOpen=false;
let roomDisplayControlsOpen=false;
let roomServicesOpen=false;
let toMappingsOpen=false;
let activeToMappingHotelId=null;
let activeToMappingGroupId=null;
let emailTablePinned=false;
let hotelNightsOpen=false;
let hotelNightsYear=new Date().getFullYear();
let hotelNightsDialog=null;
let hotelNightsTargetsOpen=false;


const SIDEBAR_COLLAPSE_KEY='hotel_discount_sidebar_collapsed_v164';
function initSidebarCollapse(){
  const btn=document.getElementById('sidebarToggleBtn');
  if(!btn)return;
  function readCollapsed(){
    try{return localStorage.getItem(SIDEBAR_COLLAPSE_KEY)==='1'}catch(_){return false}
  }
  function saveCollapsed(value){
    try{localStorage.setItem(SIDEBAR_COLLAPSE_KEY,value?'1':'0')}catch(_){ }
  }
  function applyCollapsed(value){
    document.body.classList.toggle('sidebar-collapsed',!!value);
    btn.textContent=value?'▶':'◀';
    btn.setAttribute('aria-pressed',value?'true':'false');
    btn.setAttribute('title',value?'Покажи лявото меню':'Скрий лявото меню');
    btn.setAttribute('aria-label',value?'Покажи лявото меню':'Скрий лявото меню');
  }
  let collapsed=readCollapsed();
  applyCollapsed(collapsed);
  btn.addEventListener('click',()=>{
    collapsed=!document.body.classList.contains('sidebar-collapsed');
    applyCollapsed(collapsed);
    saveCollapsed(collapsed);
    if(activeDateInput||activeRangeInput)window.setTimeout(positionDatePicker,220);
  });
}
initSidebarCollapse();


function setSectionOpen(section,isOpen){
  sectionOpen[section]=isOpen;
  const config={
    hotels:{button:'toggleHotelsBtn',editor:'hotelsEditor',label:'Хотели'},
    contracts:{button:'toggleContractsBtn',editor:'contractsEditor',label:'Договори'},
    tasks:{button:'toggleTasksBtn',editor:'tasksEditor',label:'Задачи'},
    roomTypes:{button:'toggleRoomTypesSectionBtn',editor:'roomTypesSectionEditor',label:'Типове стаи'},
    prices:{button:'togglePricesBtn',editor:'pricesEditor',label:'Цени'},
    ultra:{button:'toggleUltraBtn',editor:'ultraEditor',label:'Ултра Ол Инклузив'},
    discounts:{button:'toggleDiscountsBtn',editor:'discountsEditor',label:'Отстъпки по хотели'},
    discountReservations:{button:'toggleDiscountReservationsBtn',editor:'discountReservationsEditor',label:'Резервации с отстъпки'},
    form:{button:'toggleWorkFormBtn',editor:'workFormEditor',label:'Форма'},
    email:{button:'toggleEmailTableBtn',editor:'emailTableEditor',label:'Таблица с имейли'},
    emailTxt:{button:'toggleEmailTxtBtn',editor:'emailTxtEditor',label:'Email TXT'},
    checklist:{button:'toggleChecklistBtn',editor:'checklistEditor',label:'Чек лист'},
    cancellations:{button:'toggleCancellationsBtn',editor:'cancellationsEditor',label:'Анулации и Депозити'}
  }[section];

  if(!config)return;
  const button=document.getElementById(config.button);
  const editor=document.getElementById(config.editor);
  if(!button||!editor)return;

  editor.classList.toggle('hidden',!isOpen);
  button.textContent=(isOpen?'▼ ':'▶ ')+config.label;
  if(section==='form'&&isOpen)window.setTimeout(renderWorkForm,0);
}

function toggleSection(section){
  setSectionOpen(section,!sectionOpen[section]);

  if(section==='email'){
    if(sectionOpen.email){
      setSectionOpen('discounts',true);
      renderEmailTable();
    }else if(emailTablePinned){
      emailTablePinned=false;
      renderPinnedEmailTable();
    }
  }
  if(section==='emailTxt'&&sectionOpen.emailTxt){
    renderEmailTxt();
  }
  if(section==='discountReservations'&&sectionOpen.discountReservations){
    renderDiscountReservations();
  }
  if(section==='form'&&sectionOpen.form){
    renderWorkForm();
  }
  if(section==='contracts'&&sectionOpen.contracts){
    renderContracts();
  }
  if(section==='tasks'&&sectionOpen.tasks){
    renderTasks();
  }
}

function applySectionStates(){
  setSectionOpen('hotels',sectionOpen.hotels);
  setSectionOpen('contracts',sectionOpen.contracts);
  setSectionOpen('tasks',sectionOpen.tasks);
  setSectionOpen('roomTypes',sectionOpen.roomTypes);
  setSectionOpen('prices',sectionOpen.prices);
  setSectionOpen('ultra',sectionOpen.ultra);
  setSectionOpen('discounts',sectionOpen.discounts);
  setSectionOpen('discountReservations',sectionOpen.discountReservations);
  setSectionOpen('form',sectionOpen.form);
  setSectionOpen('email',sectionOpen.email);
  setSectionOpen('emailTxt',sectionOpen.emailTxt);
  setSectionOpen('checklist',sectionOpen.checklist);
  setSectionOpen('cancellations',sectionOpen.cancellations);
}


let activeDateInput=null;
let activeRangeInput=null;
let rangeStartISO=null;
let rangeHoverISO=null;
let pickerMode='single';
let pickerMonth=new Date().getMonth();
let pickerYear=new Date().getFullYear();
const dayNames=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];

function isProjectFocusableField(el){
  if(!el||el.disabled||el.type==='hidden')return false;
  if(el.tabIndex<0)return false;
  if(!(el.matches&&el.matches('input,textarea,select,[contenteditable="true"]')))return false;
  if(el.closest&&el.closest('.date-picker'))return false;
  return !!(el.offsetWidth||el.offsetHeight||el.getClientRects().length);
}
function projectFocusableFields(){
  return Array.from(document.querySelectorAll('input,textarea,select,[contenteditable="true"]')).filter(isProjectFocusableField);
}
function focusProjectField(el){
  if(!el)return;
  try{el.focus({preventScroll:false});}catch(_){el.focus();}
  if(el.select&&el.matches&&el.matches('input:not([type="date"]):not([type="color"]),textarea')){
    try{el.select();}catch(_){}
  }
}
function handleProjectTabNavigation(e){
  if(e.key!=='Tab'||e.altKey||e.ctrlKey||e.metaKey)return;
  const active=document.activeElement;
  if(!isProjectFocusableField(active))return;
  const fields=projectFocusableFields();
  const currentIndex=fields.indexOf(active);
  if(currentIndex<0)return;
  const nextIndex=currentIndex+(e.shiftKey?-1:1);
  if(nextIndex<0||nextIndex>=fields.length)return;
  e.preventDefault();
  active.blur();
  window.setTimeout(()=>{
    const refreshed=projectFocusableFields();
    const target=refreshed[Math.min(nextIndex,refreshed.length-1)];
    focusProjectField(target);
  },0);
}
document.addEventListener('keydown',handleProjectTabNavigation,true);


document.addEventListener('click',e=>{
  if(e.target.closest&&e.target.closest('.week-options'))return;
  document.querySelectorAll('.week-options-menu').forEach(menu=>menu.classList.add('hidden'));
});

document.addEventListener('pointerdown',e=>{
  const rangeInput=e.target.closest && e.target.closest('input[data-date-range="true"]');
  const input=e.target.closest && e.target.closest('input[data-calendar="true"]');
  const picker=e.target.closest && e.target.closest('.date-picker');

  if(rangeInput){
    if(rangeInput.disabled)return;
    e.preventDefault();
    openDateRangePicker(rangeInput);
    return;
  }

  if(input){
    if(input.disabled)return;
    e.preventDefault();
    openDatePicker(input);
    return;
  }

  if(!picker)closeDatePicker();
});

window.addEventListener('resize',()=>{if(activeDateInput||activeRangeInput)positionDatePicker()});
window.addEventListener('scroll',()=>{if(activeDateInput||activeRangeInput)positionDatePicker()},true);

function getCalendarInputISO(input){
  if(!input)return null;
  const stored=input.dataset&&input.dataset.dateIso?input.dataset.dateIso:'';
  if(stored)return stored;
  return displayToISO(input.value);
}
function openDatePicker(input){
  activeDateInput=input;
  activeRangeInput=null;
  rangeStartISO=null;
  rangeHoverISO=null;
  pickerMode='single';
  const iso=getCalendarInputISO(input);
  const base=iso?parseISODate(iso):new Date();
  pickerMonth=base.getMonth();
  pickerYear=base.getFullYear();
  renderDatePicker();
  positionDatePicker();
}
function openDateRangePicker(input){
  activeRangeInput=input;
  activeDateInput=null;
  rangeStartISO=null;
  rangeHoverISO=null;
  pickerMode='range';
  const baseISO=input.dataset.from || toISODate(new Date());
  const base=parseISODate(baseISO);
  pickerMonth=base.getMonth();
  pickerYear=base.getFullYear();
  renderDatePicker();
  positionDatePicker();
}
function closeDatePicker(){
  const picker=document.querySelector('.date-picker');
  if(picker)picker.remove();
  activeDateInput=null;
  activeRangeInput=null;
  rangeStartISO=null;
  rangeHoverISO=null;
  pickerMode='single';
}
function positionDatePicker(){
  const picker=document.querySelector('.date-picker');
  const anchor=activeRangeInput||activeDateInput;
  if(!picker||!anchor)return;
  const rect=anchor.getBoundingClientRect();
  const margin=10;
  const pickerWidth=picker.offsetWidth||620;
  const left=Math.max(window.scrollX+margin,Math.min(rect.left+window.scrollX,window.scrollX+window.innerWidth-pickerWidth-margin));
  picker.style.left=left+'px';
  picker.style.top=(rect.bottom+window.scrollY+6)+'px';
}
function rangeNightCountLabel(iso){
  if(pickerMode!=='range'||!rangeStartISO||!rangeHoverISO||!iso||iso!==rangeHoverISO||iso===rangeStartISO)return '';
  const start=releasePeriodDateUTC(rangeStartISO);
  const current=releasePeriodDateUTC(iso);
  if(!Number.isFinite(start)||!Number.isFinite(current))return '';
  const nights=Math.abs(Math.round((current-start)/86400000));
  if(!nights)return '';
  return nights+' '+(nights===1?'нощувка':'нощувки');
}
function renderCalendarMonth(month,year,selectedISO,rangeFrom,rangeTo){
  const firstDay=new Date(year,month,1);
  const startOffset=(firstDay.getDay()+6)%7;
  const gridStart=new Date(year,month,1-startOffset);
  const visualRangeFrom=rangeFrom && rangeTo && rangeTo<rangeFrom ? rangeTo : rangeFrom;
  const visualRangeTo=rangeFrom && rangeTo && rangeTo<rangeFrom ? rangeFrom : rangeTo;
  let html=`<div class="date-picker-month"><div class="date-picker-month-title">${monthNames[month]} ${year}</div><div class="date-picker-grid">`;
  dayNames.forEach(day=>html+=`<div class="date-picker-day-name">${day}</div>`);
  for(let i=0;i<42;i++){
    const d=addDays(gridStart,i);
    const iso=toISODate(d);
    let classes=['date-picker-day'];
    if(d.getMonth()!==month)classes.push('other-month');
    if(pickerMode==='single' && iso===selectedISO)classes.push('selected');
    if(pickerMode==='range'){
      if(iso===rangeFrom)classes.push('range-start');
      if(iso===rangeTo)classes.push('range-end');
      if(rangeHoverISO && iso===rangeHoverISO)classes.push('range-hover');
      if(visualRangeFrom && visualRangeTo && iso>visualRangeFrom && iso<visualRangeTo)classes.push('range-between');
    }
    const nightLabel=rangeNightCountLabel(iso);
    const title=nightLabel?` title="${escapeAttr(nightLabel)}"`:'';
    html+=`<button type="button" class="${classes.join(' ')}" data-cal-date="${iso}"${title}><span class="date-picker-date-number">${d.getDate()}</span><span class="date-picker-night-note">${escapeHtml(nightLabel)}</span></button>`;
  }
  html+='</div></div>';
  return html;
}
function renderDatePicker(){
  let picker=document.querySelector('.date-picker');
  if(!picker){
    picker=document.createElement('div');
    document.body.appendChild(picker);
  }
  const singleMonth=pickerMode==='single'&&activeDateInput&&activeDateInput.dataset&&activeDateInput.dataset.calendarMonths==='1';
  picker.className='date-picker'+(singleMonth?' single-month':'');
  const selectedISO=activeDateInput?getCalendarInputISO(activeDateInput):null;
  const rangeFrom=activeRangeInput?(rangeStartISO || activeRangeInput.dataset.from):null;
  const rangeTo=activeRangeInput ? (rangeStartISO ? rangeHoverISO : activeRangeInput.dataset.to) : null;
  const hoverNightsLabel=(rangeStartISO && rangeHoverISO)?rangeNightCountLabel(rangeHoverISO):'';
  const nextMonthDate=new Date(pickerYear,pickerMonth+1,1);
  const pickerTitle=singleMonth?`${monthNames[pickerMonth]} ${pickerYear}`:`${monthNames[pickerMonth]} ${pickerYear} / ${monthNames[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()}`;
  let html=`<div class="date-picker-header">
    <button type="button" class="date-picker-nav" data-cal-prev>‹</button>
    <div class="date-picker-title">${pickerTitle}</div>
    <button type="button" class="date-picker-nav" data-cal-next>›</button>
  </div>`;
  if(pickerMode==='range'){
    html+=`<div class="date-picker-help">${rangeStartISO?(hoverNightsLabel?'Крайна дата: '+hoverNightsLabel:'Посочи/избери крайна дата'):'Избери начална дата'}</div>`;
  }
  html+=`<div class="date-picker-months">`;
  html+=renderCalendarMonth(pickerMonth,pickerYear,selectedISO,rangeFrom,rangeTo);
  if(!singleMonth)html+=renderCalendarMonth(nextMonthDate.getMonth(),nextMonthDate.getFullYear(),selectedISO,rangeFrom,rangeTo);
  html+=`</div><div class="date-picker-footer">
    <button type="button" data-cal-today>Днес</button>
    <button type="button" data-cal-close>Затвори</button>
  </div>`;

  picker.innerHTML=html;
  picker.querySelector('[data-cal-prev]').addEventListener('click',e=>{e.stopPropagation();changePickerMonth(-1)});
  picker.querySelector('[data-cal-next]').addEventListener('click',e=>{e.stopPropagation();changePickerMonth(1)});
  picker.querySelector('[data-cal-today]').addEventListener('click',e=>{e.stopPropagation();pickerMode==='range'?selectRangeCalendarDate(toISODate(new Date())):selectCalendarDate(toISODate(new Date()))});
  picker.querySelector('[data-cal-close]').addEventListener('click',e=>{e.stopPropagation();closeDatePicker()});
  picker.querySelectorAll('[data-cal-date]').forEach(btn=>{
    btn.addEventListener('pointerenter',e=>{if(pickerMode==='range')previewRangeCalendarDate(btn.dataset.calDate)});
    btn.addEventListener('focus',e=>{if(pickerMode==='range')previewRangeCalendarDate(btn.dataset.calDate)});
    btn.addEventListener('click',e=>{e.stopPropagation();pickerMode==='range'?selectRangeCalendarDate(btn.dataset.calDate):selectCalendarDate(btn.dataset.calDate)});
  });
}
function previewRangeCalendarDate(iso){
  if(pickerMode!=='range'||!rangeStartISO||!iso||iso===rangeHoverISO)return;
  rangeHoverISO=iso;
  renderDatePicker();
}
function changePickerMonth(delta){
  const d=new Date(pickerYear,pickerMonth+delta,1);
  pickerMonth=d.getMonth();
  pickerYear=d.getFullYear();
  renderDatePicker();
  positionDatePicker();
}
function selectCalendarDate(iso){
  if(!activeDateInput)return;
  activeDateInput.dataset.dateIso=iso;
  activeDateInput.value=isoToDisplay(iso);
  activeDateInput.classList.remove('invalid-date');
  activeDateInput.dispatchEvent(new Event('change',{bubbles:true}));
  closeDatePicker();
}
function selectRangeCalendarDate(iso){
  if(!activeRangeInput)return;

  if(!rangeStartISO){
    rangeStartISO=iso;
    rangeHoverISO=null;
    activeRangeInput.value=isoToDisplay(iso)+' - ...';
    renderDatePicker();
    positionDatePicker();
    return;
  }

  let from=rangeStartISO;
  let to=iso;
  if(to<from){
    const tmp=from;
    from=to;
    to=tmp;
  }

  activeRangeInput.value=isoToDisplay(from)+' - '+isoToDisplay(to);
  activeRangeInput.dataset.from=from;
  activeRangeInput.dataset.to=to;
  activeRangeInput.dispatchEvent(new CustomEvent('rangechange',{bubbles:true,detail:{from,to}}));
  closeDatePicker();
}
const weekList=document.getElementById('weekList'), mainPanel=document.getElementById('mainPanel'), searchInput=document.getElementById('searchInput');

document.getElementById('newWeekBtn').addEventListener('click',createNewWeek);
document.getElementById('exportBtn').addEventListener('click',exportData);
document.getElementById('importInput').addEventListener('change',importData);
const googleScriptUrlInput=document.getElementById('googleScriptUrlInput');
if(googleScriptUrlInput){
  googleScriptUrlInput.value=localStorage.getItem(GOOGLE_SYNC_URL_KEY)||DEFAULT_GOOGLE_SCRIPT_URL;
  googleScriptUrlInput.addEventListener('change',()=>saveGoogleScriptUrl());
  googleScriptUrlInput.addEventListener('blur',()=>saveGoogleScriptUrl());
}
const toggleGoogleUrlBtn=document.getElementById('toggleGoogleUrlBtn');
if(toggleGoogleUrlBtn){
  toggleGoogleUrlBtn.addEventListener('click',()=>toggleGoogleUrlSettings());
}
document.getElementById('testGoogleSyncBtn').addEventListener('click',testGoogleSheetsSync);
document.getElementById('saveGoogleSyncBtn').addEventListener('click',saveToGoogleSheets);
document.getElementById('loadGoogleSyncBtn').addEventListener('click',loadFromGoogleSheets);
document.getElementById('googleBackupsBtn').addEventListener('click',toggleGoogleBackups);
document.getElementById('refreshGoogleBackupsBtn').addEventListener('click',loadGoogleBackups);
document.getElementById('chooseGoogleBackupFileBtn').addEventListener('click',()=>document.getElementById('googleBackupFileInput').click());
document.getElementById('googleBackupFileInput').addEventListener('change',importGoogleBackupFile);
document.addEventListener('click',event=>{
  const button=event.target&&event.target.closest?event.target.closest('[data-cancel-changes]'):null;
  if(!button)return;
  event.preventDefault();
  cancelPendingChanges();
});
searchInput.addEventListener('input',renderWeekList);
bootstrapInitialState();

function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(raw){const parsed=JSON.parse(raw); if(parsed.weeks)return normalizeState(parsed)}
    for(const key of OLD_KEYS){const oldRaw=localStorage.getItem(key); if(oldRaw){const oldParsed=JSON.parse(oldRaw); if(oldParsed.weeks)return normalizeState(oldParsed)}}
  }catch(e){}
  return {weeks:[],activeWeekId:null,uiSettings:normalizeUiSettings({}),ultraAllInclusive:normalizeUltraAllInclusive({}),emailTxt:normalizeEmailTxt({}),toMappingsLocked:false,toMappingHotels:[],tasksByDate:{},taskNotesByDate:{},tasksUi:normalizeTasksUi({}),discountReservations:[],sectionThemes:normalizeSectionThemes(getStoredSectionThemes()||{}),attendanceFormV14:{}};
}

function clampNumber(value,min,max){
  const number=Number(value);
  if(!Number.isFinite(number))return min;
  return Math.min(max,Math.max(min,number));
}

function discountReservationLayoutMatchesPreset(rawFields,preset){
  if(!Array.isArray(rawFields)||rawFields.length!==preset.length)return false;
  return preset.every((def,index)=>{
    const item=rawFields[index];
    if(!item||String(item.key||'')!==def.key)return false;
    const span=clampNumber(item.span!==undefined?item.span:def.span,1,60);
    const row=clampNumber(item.row!==undefined?item.row:def.row,1,3);
    return span===def.span&&row===def.row;
  });
}
function isDiscountReservationDefaultLayoutKey(key){
  return DISCOUNT_RESERVATION_LAYOUT_DEFAULT.some(def=>def.key===key);
}
function isDiscountReservationCustomLayoutKey(key){
  return /^custom_[A-Za-z0-9_]+$/.test(String(key||''));
}
function sanitizeDiscountReservationCustomLabel(value){
  const label=String(value||'').trim().replace(/\s+/g,' ');
  return label.slice(0,32)||'Колона';
}
function normalizeDiscountReservationLayoutField(item,def){
  const source=item&&typeof item==='object'?item:{};
  const isClock=def&&(def.key==='clockNumber'||def.key==='quendooNumber');
  const isComment=def&&def.key==='comment';
  const forcedRow=isClock?2:(isComment?3:null);
  return {
    key:def.key,
    label:def.label,
    span:clampNumber(source.span!==undefined?source.span:def.span,1,60),
    row:forcedRow||clampNumber(source.row!==undefined?source.row:def.row,1,3),
    visible:source.visible===undefined?true:!!source.visible,
    custom:false
  };
}
function normalizeDiscountReservationCustomLayoutField(item,index){
  const source=item&&typeof item==='object'?item:{};
  const key=isDiscountReservationCustomLayoutKey(source.key)?String(source.key):('custom_'+uid()+'_'+index);
  return {
    key,
    label:sanitizeDiscountReservationCustomLabel(source.label||source.name||('Колона '+(index+1))),
    span:clampNumber(source.span!==undefined?source.span:6,1,60),
    row:clampNumber(source.row!==undefined?source.row:3,1,3),
    visible:source.visible===undefined?true:!!source.visible,
    custom:true
  };
}
function normalizeDiscountReservationLayout(input){
  let source=input&&typeof input==='object'?{...input}:{};
  const initialFields=Array.isArray(source.fields)?source.fields:[];
  const shouldResetToNewDefault=(!initialFields.length||Number(source.version||0)<DISCOUNT_RESERVATION_LAYOUT_VERSION) && (
    !initialFields.length||
    discountReservationLayoutMatchesPreset(initialFields,DISCOUNT_RESERVATION_LAYOUT_LEGACY_DEFAULT)||
    discountReservationLayoutMatchesPreset(initialFields,DISCOUNT_RESERVATION_LAYOUT_V193_DEFAULT)||
    discountReservationLayoutMatchesPreset(initialFields,DISCOUNT_RESERVATION_LAYOUT_V194_DEFAULT)||
    discountReservationLayoutMatchesPreset(initialFields,DISCOUNT_RESERVATION_LAYOUT_V5_DEFAULT)||
    discountReservationLayoutMatchesPreset(initialFields,DISCOUNT_RESERVATION_LAYOUT_V6_DEFAULT)||
    discountReservationLayoutMatchesPreset(initialFields,DISCOUNT_RESERVATION_LAYOUT_DEFAULT)
  );
  if(shouldResetToNewDefault){
    source={...source,version:DISCOUNT_RESERVATION_LAYOUT_VERSION,fields:DISCOUNT_RESERVATION_LAYOUT_DEFAULT.map(def=>({...def,visible:true,custom:false}))};
  }else if(Number(source.version||0)<DISCOUNT_RESERVATION_LAYOUT_VERSION){
    const originalByKey=new Map(initialFields.map(item=>[String(item&&item.key||''),item]));
    const promotedFields=DISCOUNT_RESERVATION_LAYOUT_DEFAULT.map(def=>{
      const stored=originalByKey.get(def.key)||{};
      return {...def,visible:stored.visible===undefined?true:!!stored.visible,custom:false};
    });
    initialFields.forEach((item,index)=>{
      const key=String(item&&item.key||'');
      if(!isDiscountReservationCustomLayoutKey(key))return;
      const customField=normalizeDiscountReservationCustomLayoutField(item,index);
      customField.row=3;
      promotedFields.push(customField);
    });
    source={...source,version:DISCOUNT_RESERVATION_LAYOUT_VERSION,fields:promotedFields};
  }
  const rawFields=Array.isArray(source.fields)?source.fields:[];
  const byKey=new Map(rawFields.map(item=>[String(item.key||''),item]));
  const used=new Set();
  const fields=[];
  rawFields.forEach((item,index)=>{
    const key=String(item&&item.key||'');
    const def=DISCOUNT_RESERVATION_LAYOUT_DEFAULT.find(f=>f.key===key);
    if(def&&!used.has(key)){
      used.add(key);
      fields.push(normalizeDiscountReservationLayoutField(item,def));
      return;
    }
    if(isDiscountReservationCustomLayoutKey(key)&&!used.has(key)){
      used.add(key);
      const customField=normalizeDiscountReservationCustomLayoutField(item,index);
      if(Number(source.version||0)<DISCOUNT_RESERVATION_LAYOUT_VERSION)customField.row=3;
      fields.push(customField);
    }
  });
  DISCOUNT_RESERVATION_LAYOUT_DEFAULT.forEach(def=>{
    if(!used.has(def.key)){
      const stored=byKey.get(def.key)||{};
      fields.push(normalizeDiscountReservationLayoutField(stored,def));
    }
  });
  return {locked:source.locked!==undefined?!!source.locked:true,version:DISCOUNT_RESERVATION_LAYOUT_VERSION,fields};
}
function ensureDiscountReservationLayout(){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  state.uiSettings.discountReservationLayout=normalizeDiscountReservationLayout(state.uiSettings.discountReservationLayout||{});
  return state.uiSettings.discountReservationLayout;
}
function updateDiscountReservationLayoutField(key,patch){
  const layout=ensureDiscountReservationLayout();
  if(layout.locked)return;
  const field=layout.fields.find(item=>item.key===key);
  if(!field)return;
  Object.assign(field,patch||{});
  field.span=clampNumber(field.span,1,60);
  field.row=clampNumber(field.row||1,1,3);
  field.visible=field.visible===undefined?true:!!field.visible;
  if(field.custom)field.label=sanitizeDiscountReservationCustomLabel(field.label);
  saveStateSafe();
  renderDiscountReservations();
}
function toggleDiscountReservationLayoutFieldVisible(key){
  const layout=ensureDiscountReservationLayout();
  if(layout.locked)return;
  const field=layout.fields.find(item=>item.key===key);
  if(!field)return;
  field.visible=field.visible===undefined?false:!field.visible;
  saveStateSafe();
  renderDiscountReservations();
}
function renameDiscountReservationLayoutCustomColumn(key,label){
  const layout=ensureDiscountReservationLayout();
  if(layout.locked)return;
  const field=layout.fields.find(item=>item.key===key&&item.custom);
  if(!field)return;
  field.label=sanitizeDiscountReservationCustomLabel(label);
  saveStateSafe();
  renderDiscountReservations();
}
function addDiscountReservationLayoutCustomColumn(label){
  const layout=ensureDiscountReservationLayout();
  if(layout.locked)return;
  const clean=sanitizeDiscountReservationCustomLabel(label);
  layout.fields.push({key:'custom_'+uid().replace(/[^A-Za-z0-9_]/g,'_'),label:clean,span:6,row:3,visible:true,custom:true});
  saveStateSafe();
  renderDiscountReservations();
}
function deleteDiscountReservationLayoutCustomColumn(key){
  const layout=ensureDiscountReservationLayout();
  if(layout.locked)return;
  const field=layout.fields.find(item=>item.key===key&&item.custom);
  if(!field)return;
  if(!confirm('Да изтрия ли колона „'+field.label+'“? Данните в нея ще останат в архива, но колоната няма да се показва.'))return;
  layout.fields=layout.fields.filter(item=>item.key!==key);
  saveStateSafe();
  renderDiscountReservations();
}
function moveDiscountReservationLayoutField(fromKey,toKey){
  const layout=ensureDiscountReservationLayout();
  if(layout.locked||!fromKey||!toKey||fromKey===toKey)return;
  const fromIndex=layout.fields.findIndex(item=>item.key===fromKey);
  const toIndex=layout.fields.findIndex(item=>item.key===toKey);
  if(fromIndex<0||toIndex<0)return;
  const [item]=layout.fields.splice(fromIndex,1);
  layout.fields.splice(toIndex,0,item);
  saveStateSafe();
  renderDiscountReservations();
}
function toggleDiscountReservationLayoutLock(){
  const layout=ensureDiscountReservationLayout();
  layout.locked=!layout.locked;
  saveStateSafe();
  renderDiscountReservations();
}
function toggleDiscountReservationLayoutPanel(){
  discountReservationLayoutOpen=!discountReservationLayoutOpen;
  renderDiscountReservations();
}
function renderDiscountReservationLayoutPanel(){
  if(!discountReservationLayoutOpen)return '';
  const layout=ensureDiscountReservationLayout();
  const sizeOptions=Array.from({length:60},(_,i)=>i+1).map(n=>`<option value="${n}">${n}</option>`).join('');
  const rowOptions=[1,2,3].map(n=>`<option value="${n}">Ред ${n}</option>`).join('');
  const items=layout.fields.map(field=>`<div class="discount-reservation-layout-item${layout.locked?' locked':''}${field.visible===false?' hidden-column':''}${field.custom?' custom-column':''}" draggable="${layout.locked?'false':'true'}" data-dr-layout-key="${escapeAttr(field.key)}">
      <span class="discount-reservation-layout-handle">☰</span>
      ${field.custom
        ? `<input class="discount-reservation-layout-name-input" type="text" value="${escapeAttr(field.label)}" title="Име на колоната" ${layout.locked?'disabled':''} data-dr-layout-label="${escapeAttr(field.key)}" />`
        : `<span class="discount-reservation-layout-label">${escapeHtml(field.label)}</span>`}
      <select title="Размер: 1 е най-малко" aria-label="Размер" ${layout.locked?'disabled':''} data-dr-layout-span="${escapeAttr(field.key)}">${sizeOptions}</select>
      <select title="Ред" aria-label="Ред" ${layout.locked?'disabled':''} data-dr-layout-row="${escapeAttr(field.key)}">${rowOptions}</select>
      <button class="small discount-reservation-visibility-btn" type="button" title="${field.visible===false?'Покажи колоната':'Скрий колоната'}" ${layout.locked?'disabled':''} data-dr-layout-visible="${escapeAttr(field.key)}">${field.visible===false?'🙈':'👁'}</button>
      ${field.custom?`<button class="danger small discount-reservation-custom-delete" type="button" title="Изтрий колоната" ${layout.locked?'disabled':''} data-dr-layout-delete="${escapeAttr(field.key)}">×</button>`:`<span class="discount-reservation-layout-spacer"></span>`}
    </div>`).join('');
  return `<div class="discount-reservation-layout-panel no-print" id="discountReservationLayoutPanel">
    <div class="discount-reservation-layout-head">
      <div><strong>Настройки на полетата</strong><span>Размести полетата, избери размер, ред 1/2/3 и покажи/скрий колони. Скритите колони остават в настройките и можеш пак да ги включиш.</span></div>
      <button class="small ${layout.locked?'success':'danger'}" type="button" data-dr-layout-lock>${layout.locked?'🔒 Заключено':'🔓 Отключено'}</button>
    </div>
    <div class="discount-reservation-custom-add">
      <input type="text" id="discountReservationNewColumnName" placeholder="Име на нова колона" ${layout.locked?'disabled':''} />
      <button class="small success" type="button" id="discountReservationAddColumnBtn" ${layout.locked?'disabled':''}>+ Добави колона</button>
    </div>
    <div class="discount-reservation-layout-grid">
      <div class="discount-reservation-layout-header" aria-hidden="true">
        <span></span><span>Поле</span><span>Име</span><span>Размер</span><span>Ред</span><span>Покажи</span><span>Изтрий</span>
      </div>
      ${items}
    </div>
  </div>`;
}
function bindDiscountReservationLayoutPanel(){
  const panel=document.getElementById('discountReservationLayoutPanel');
  if(!panel)return;
  const layout=ensureDiscountReservationLayout();
  const lockBtn=panel.querySelector('[data-dr-layout-lock]');
  if(lockBtn)lockBtn.addEventListener('click',toggleDiscountReservationLayoutLock);
  const addBtn=panel.querySelector('#discountReservationAddColumnBtn');
  const addInput=panel.querySelector('#discountReservationNewColumnName');
  if(addBtn&&addInput){
    addBtn.addEventListener('click',()=>{
      const name=String(addInput.value||'').trim();
      addDiscountReservationLayoutCustomColumn(name||'Колона');
    });
    addInput.addEventListener('keydown',event=>{
      if(event.key==='Enter'){
        event.preventDefault();
        addDiscountReservationLayoutCustomColumn(addInput.value||'Колона');
      }
    });
  }
  panel.querySelectorAll('[data-dr-layout-span]').forEach(select=>{
    const key=select.dataset.drLayoutSpan;
    const field=layout.fields.find(item=>item.key===key);
    if(field)select.value=String(field.span||1);
    select.addEventListener('change',()=>updateDiscountReservationLayoutField(key,{span:Number(select.value)||1}));
  });
  panel.querySelectorAll('[data-dr-layout-row]').forEach(select=>{
    const key=select.dataset.drLayoutRow;
    const field=layout.fields.find(item=>item.key===key);
    if(field)select.value=String(field.row||1);
    select.addEventListener('change',()=>updateDiscountReservationLayoutField(key,{row:Number(select.value)||1}));
  });
  panel.querySelectorAll('[data-dr-layout-visible]').forEach(btn=>{
    btn.addEventListener('click',()=>toggleDiscountReservationLayoutFieldVisible(btn.dataset.drLayoutVisible));
  });
  panel.querySelectorAll('[data-dr-layout-label]').forEach(input=>{
    const key=input.dataset.drLayoutLabel;
    input.addEventListener('change',()=>renameDiscountReservationLayoutCustomColumn(key,input.value));
    input.addEventListener('blur',()=>renameDiscountReservationLayoutCustomColumn(key,input.value));
  });
  panel.querySelectorAll('[data-dr-layout-delete]').forEach(btn=>{
    btn.addEventListener('click',()=>deleteDiscountReservationLayoutCustomColumn(btn.dataset.drLayoutDelete));
  });
  panel.querySelectorAll('.discount-reservation-layout-item').forEach(item=>{
    item.addEventListener('dragstart',event=>{
      if(layout.locked)return;
      draggedDiscountReservationLayoutKey=item.dataset.drLayoutKey;
      item.classList.add('dragging');
      event.dataTransfer.effectAllowed='move';
      event.dataTransfer.setData('text/plain',draggedDiscountReservationLayoutKey);
    });
    item.addEventListener('dragover',event=>{
      if(layout.locked)return;
      event.preventDefault();
      if(item.dataset.drLayoutKey!==draggedDiscountReservationLayoutKey)item.classList.add('drag-over');
    });
    item.addEventListener('dragleave',()=>item.classList.remove('drag-over'));
    item.addEventListener('drop',event=>{
      if(layout.locked)return;
      event.preventDefault();
      item.classList.remove('drag-over');
      moveDiscountReservationLayoutField(draggedDiscountReservationLayoutKey,item.dataset.drLayoutKey);
    });
    item.addEventListener('dragend',()=>{
      item.classList.remove('dragging');
      panel.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));
      draggedDiscountReservationLayoutKey=null;
    });
  });
}
function discountReservationLayoutStyle(fieldOrKey){
  const layout=ensureDiscountReservationLayout();
  const key=typeof fieldOrKey==='string'?fieldOrKey:(fieldOrKey&&fieldOrKey.key);
  const field=(fieldOrKey&&typeof fieldOrKey==='object'?fieldOrKey:null)||layout.fields.find(item=>item.key===key)||DISCOUNT_RESERVATION_LAYOUT_DEFAULT.find(item=>item.key===key)||{span:10,row:1};
  const row=clampNumber(field.row||1,1,3);
  const rowSpan='span 1';
  return `--dr-span:${clampNumber(field.span||10,1,60)};--dr-row:${row};--dr-row-span:${rowSpan}`;
}
function discountReservationTabIndex(key,index){
  const layout=ensureDiscountReservationLayout();
  const order=layout.fields.map(f=>f.key);
  const pos=order.indexOf(key);
  return String(1000+index*50+(pos<0?40:pos));
}
function discountReservationContactRole(field){
  if(!field||!field.custom)return '';
  const text=String((field.label||'')+' '+(field.key||'')).toLowerCase();
  if(/имейл|мейл|e-?mail|mail/.test(text))return 'email';
  if(/телефон|тел\.|phone|tel|gsm|мобилен/.test(text))return 'phone';
  return '';
}
function discountReservationContactPair(field){
  const role=discountReservationContactRole(field);
  if(!role)return null;
  const layout=ensureDiscountReservationLayout();
  const email=layout.fields.find(item=>item&&item.visible!==false&&discountReservationContactRole(item)==='email')||null;
  const phone=layout.fields.find(item=>item&&item.visible!==false&&discountReservationContactRole(item)==='phone')||null;
  if(!email||!phone)return null;
  return {email,phone,role};
}
function renderDiscountReservationField(item,fieldOrKey,index,hotelOptions,nights){
  const field=typeof fieldOrKey==='string'
    ? (ensureDiscountReservationLayout().fields.find(layoutField=>layoutField.key===fieldOrKey)||{key:fieldOrKey,label:''})
    : fieldOrKey;
  if(field&&field.visible===false)return '';
  const key=field&&field.key?field.key:String(fieldOrKey||'');
  const common=`data-res-layout-field="${escapeAttr(key)}" style="${escapeAttr(discountReservationLayoutStyle(field||key))}"`;
  const tab=discountReservationTabIndex(key,index);
  const editable=!!(item&&item.isEditing);
  const editAttr=editable?'':' disabled';
  if(key==='number')return `<div class="discount-reservation-number" ${common} title="Номер по ред">${escapeHtml(item.autoNumber||index+1)}</div>`;
  if(key==='reservationDate'){
    const reservationISO=normalizeDiscountReservationDateISO(item.reservationDate||'')||toISODate(new Date());
    return `<input class="discount-reservation-created-date" ${common} type="text" inputmode="numeric" maxlength="5" placeholder="Дата" value="${escapeAttr(shortDisplayDate(item.reservationDate||isoToDisplay(reservationISO)||''))}" tabindex="${tab}" data-calendar="true" data-calendar-months="1" readonly data-date-iso="${escapeAttr(reservationISO)}" data-discount-reservation-field="reservationDate"${editAttr} />`;
  }
  if(key==='clockNumber'){
    const clocks=discountReservationClockEditorValues(item);
    const values=clocks.length?clocks:[''];
    const addBtn=editable?`<button class="discount-reservation-clock-add" type="button" title="Добави още Clock номер" data-discount-reservation-clock-add="true">+</button>`:'';
    const inputs=values.map((value,clockIndex)=>`<input class="discount-reservation-clock" type="text" inputmode="numeric" maxlength="6" placeholder="Clock" value="${escapeAttr(value)}" tabindex="${Number(tab)+clockIndex}" data-discount-reservation-clock-index="${clockIndex}"${editAttr} />`).join('');
    return `<div class="discount-reservation-clock-list" ${common}>
      ${addBtn}
      ${inputs}
    </div>`;
  }
  if(key==='quendooNumber')return `<input class="discount-reservation-quendoo" ${common} type="text" inputmode="numeric" maxlength="20" placeholder="Quendoo" value="${escapeAttr(item.quendooNumber||'')}" tabindex="${tab}" data-discount-reservation-field="quendooNumber"${editAttr} />`;
  if(key==='hotel')return `<select class="discount-reservation-hotel" ${common} tabindex="${tab}" data-discount-reservation-field="hotel"${editAttr}>${hotelOptions}</select>`;
  if(key==='guestName')return `<input class="discount-reservation-guest" ${common} type="text" placeholder="Имена на госта" value="${escapeAttr(item.guestName||'')}" tabindex="${tab}" data-discount-reservation-field="guestName"${editAttr} />`;
  if(key==='stay'){
    const from=item.checkInISO||todayISO();
    const to=item.checkOutISO||item.checkInISO||todayISO();
    return `<div class="discount-reservation-stay" ${common}>
      <input class="discount-reservation-date discount-reservation-checkin" type="text" readonly inputmode="numeric" maxlength="5" placeholder="ChIN" value="${escapeAttr(item.checkIn||'')}" tabindex="${tab}" data-open-discount-reservation-range="${escapeAttr(item.id)}"${editAttr} />
      <input class="discount-reservation-date discount-reservation-checkout" type="text" readonly inputmode="numeric" maxlength="5" placeholder="ChOUT" value="${escapeAttr(item.checkOut||'')}" tabindex="${Number(tab)+1}" data-open-discount-reservation-range="${escapeAttr(item.id)}"${editAttr} />
      <input class="discount-reservation-nights-trigger" type="text" readonly title="Избери ChIN / ChOUT" placeholder="Нощ." value="${escapeAttr(nights?nights+' н.':'')}" tabindex="${Number(tab)+2}" data-date-range="true" data-from="${escapeAttr(from)}" data-to="${escapeAttr(to)}" data-discount-reservation-range="${escapeAttr(item.id)}"${editAttr} />
    </div>`;
  }
  if(key==='roomType')return `<input class="discount-reservation-room" ${common} type="text" maxlength="12" placeholder="Тип стая" value="${escapeAttr(item.roomType||'')}" tabindex="${tab}" data-discount-reservation-field="roomType"${editAttr} />`;
  if(key==='price')return `<input class="discount-reservation-price" ${common} type="text" inputmode="decimal" maxlength="10" placeholder="Цена" value="${escapeAttr(item.price||'')}" tabindex="${tab}" data-discount-reservation-field="price"${editAttr} />`;
  if(key==='discount')return `<label class="discount-reservation-percent-wrap" ${common}><input class="discount-reservation-discount" type="text" inputmode="decimal" maxlength="8" placeholder="%" value="${escapeAttr(normalizeDiscountReservationPercent(item.discount||''))}" tabindex="${tab}" data-discount-reservation-field="discount"${editAttr} /></label>`;
  if(key==='comment')return `<textarea class="discount-reservation-comment" ${common} rows="3" placeholder="Коментар" tabindex="${tab}" data-discount-reservation-field="comment"${editAttr}>${escapeHtml(item.comment||'')}</textarea>`;
  if(isDiscountReservationCustomLayoutKey(key)){
    const contactPair=discountReservationContactPair(field);
    if(contactPair&&contactPair.role==='phone')return '';
    if(contactPair&&contactPair.role==='email'){
      const emailValue=item&&item.customFields&&item.customFields[contactPair.email.key]!==undefined?String(item.customFields[contactPair.email.key]):'';
      const phoneValue=item&&item.customFields&&item.customFields[contactPair.phone.key]!==undefined?String(item.customFields[contactPair.phone.key]):'';
      return `<div class="discount-reservation-contact-stack" ${common}>
        <input class="discount-reservation-custom discount-reservation-contact-email" type="text" placeholder="${escapeAttr(contactPair.email.label||'Имейл')}" value="${escapeAttr(emailValue)}" tabindex="${tab}" data-discount-reservation-custom-field="${escapeAttr(contactPair.email.key)}"${editAttr} />
        <input class="discount-reservation-custom discount-reservation-contact-phone" type="text" placeholder="${escapeAttr(contactPair.phone.label||'Телефон')}" value="${escapeAttr(phoneValue)}" tabindex="${Number(tab)+1}" data-discount-reservation-custom-field="${escapeAttr(contactPair.phone.key)}"${editAttr} />
      </div>`;
    }
    const value=item&&item.customFields&&item.customFields[key]!==undefined?String(item.customFields[key]):'';
    const label=field&&field.label?field.label:'Колона';
    return `<input class="discount-reservation-custom" ${common} type="text" placeholder="${escapeAttr(label)}" value="${escapeAttr(value)}" tabindex="${tab}" data-discount-reservation-custom-field="${escapeAttr(key)}"${editAttr} />`;
  }
  return '';
}

function normalizeUiSettings(settings){
  const oldSharedFont=settings&&settings.roomInfoFontSize!==undefined?settings.roomInfoFontSize:undefined;
  return {
    roomNameColumnWidth:clampNumber(settings&&settings.roomNameColumnWidth!==undefined?settings.roomNameColumnWidth:ROOM_NAME_COLUMN_DEFAULT,ROOM_NAME_COLUMN_MIN,ROOM_NAME_COLUMN_MAX),
    roomNameOffset:clampNumber(settings&&settings.roomNameOffset!==undefined?settings.roomNameOffset:ROOM_NAME_OFFSET_DEFAULT,ROOM_NAME_OFFSET_MIN,ROOM_NAME_OFFSET_MAX),
    roomNameFontSize:clampNumber(settings&&settings.roomNameFontSize!==undefined?settings.roomNameFontSize:(oldSharedFont!==undefined?oldSharedFont:ROOM_NAME_FONT_DEFAULT),ROOM_NAME_FONT_MIN,ROOM_NAME_FONT_MAX),
    roomKindColumnWidth:clampNumber(settings&&settings.roomKindColumnWidth!==undefined?settings.roomKindColumnWidth:ROOM_KIND_COLUMN_DEFAULT,ROOM_KIND_COLUMN_MIN,ROOM_KIND_COLUMN_MAX),
    roomKindFontSize:clampNumber(settings&&settings.roomKindFontSize!==undefined?settings.roomKindFontSize:(oldSharedFont!==undefined?oldSharedFont:ROOM_KIND_FONT_DEFAULT),ROOM_KIND_FONT_MIN,ROOM_KIND_FONT_MAX),
    roomSquareFontSize:clampNumber(settings&&settings.roomSquareFontSize!==undefined?settings.roomSquareFontSize:(settings&&settings.roomKindFontSize!==undefined?settings.roomKindFontSize:(oldSharedFont!==undefined?oldSharedFont:ROOM_SQUARE_FONT_DEFAULT)),ROOM_SQUARE_FONT_MIN,ROOM_SQUARE_FONT_MAX),
    roomExtraFontSize:clampNumber(settings&&settings.roomExtraFontSize!==undefined?settings.roomExtraFontSize:(oldSharedFont!==undefined?oldSharedFont:ROOM_EXTRA_FONT_DEFAULT),ROOM_EXTRA_FONT_MIN,ROOM_EXTRA_FONT_MAX),
    priceTableRoomColWidth:clampNumber(settings&&settings.priceTableRoomColWidth!==undefined?settings.priceTableRoomColWidth:PRICE_TABLE_ROOM_COL_DEFAULT,PRICE_TABLE_ROOM_COL_MIN,PRICE_TABLE_ROOM_COL_MAX),
    priceTablePeriodColWidth:clampNumber(settings&&settings.priceTablePeriodColWidth!==undefined?settings.priceTablePeriodColWidth:PRICE_TABLE_PERIOD_COL_DEFAULT,PRICE_TABLE_PERIOD_COL_MIN,PRICE_TABLE_PERIOD_COL_MAX),
    priceTableRowHeight:clampNumber(settings&&settings.priceTableRowHeight!==undefined?settings.priceTableRowHeight:PRICE_TABLE_ROW_HEIGHT_DEFAULT,PRICE_TABLE_ROW_HEIGHT_MIN,PRICE_TABLE_ROW_HEIGHT_MAX),
    priceTableRoomFontSize:clampNumber(settings&&settings.priceTableRoomFontSize!==undefined?settings.priceTableRoomFontSize:PRICE_TABLE_ROOM_FONT_DEFAULT,PRICE_TABLE_ROOM_FONT_MIN,PRICE_TABLE_ROOM_FONT_MAX),
    priceTablePeriodFontSize:clampNumber(settings&&settings.priceTablePeriodFontSize!==undefined?settings.priceTablePeriodFontSize:PRICE_TABLE_PERIOD_FONT_DEFAULT,PRICE_TABLE_PERIOD_FONT_MIN,PRICE_TABLE_PERIOD_FONT_MAX),
    priceTablePriceFontSize:clampNumber(settings&&settings.priceTablePriceFontSize!==undefined?settings.priceTablePriceFontSize:PRICE_TABLE_PRICE_FONT_DEFAULT,PRICE_TABLE_PRICE_FONT_MIN,PRICE_TABLE_PRICE_FONT_MAX),
    priceTableSettingsOpen:!!(settings&&settings.priceTableSettingsOpen),
    priceTableLocked:!!(settings&&settings.priceTableLocked),
    quickAccessOrder:normalizeQuickAccessOrder((settings&&settings.quickAccessOrder)||getStoredQuickAccessOrder()||[]),
    discountReservationLayout:normalizeDiscountReservationLayout(settings&&settings.discountReservationLayout)
  };
}
function applyRoomInfoDisplaySettings(){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  document.documentElement.style.setProperty('--room-name-column-width',state.uiSettings.roomNameColumnWidth+'px');
  document.documentElement.style.setProperty('--room-name-offset',state.uiSettings.roomNameOffset+'px');
  document.documentElement.style.setProperty('--room-name-font-size',state.uiSettings.roomNameFontSize+'px');
  document.documentElement.style.setProperty('--room-kind-column-width',state.uiSettings.roomKindColumnWidth+'px');
  document.documentElement.style.setProperty('--room-kind-font-size',state.uiSettings.roomKindFontSize+'px');
  document.documentElement.style.setProperty('--room-square-font-size',state.uiSettings.roomSquareFontSize+'px');
  document.documentElement.style.setProperty('--room-extra-font-size',state.uiSettings.roomExtraFontSize+'px');
  document.documentElement.style.setProperty('--price-table-room-col-width',state.uiSettings.priceTableRoomColWidth+'px');
  document.documentElement.style.setProperty('--price-table-period-col-width',state.uiSettings.priceTablePeriodColWidth+'px');
  document.documentElement.style.setProperty('--price-table-row-height',state.uiSettings.priceTableRowHeight+'px');
  document.documentElement.style.setProperty('--price-table-room-font-size',state.uiSettings.priceTableRoomFontSize+'px');
  document.documentElement.style.setProperty('--price-table-period-font-size',state.uiSettings.priceTablePeriodFontSize+'px');
  document.documentElement.style.setProperty('--price-table-price-font-size',state.uiSettings.priceTablePriceFontSize+'px');
}
function updateRoomDisplayStatus(){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  const nameStatus=document.getElementById('roomNameDisplayStatus');
  const kindStatus=document.getElementById('roomDisplayStatus');
  const squareStatus=document.getElementById('roomSquareDisplayStatus');
  const extraStatus=document.getElementById('roomExtraDisplayStatus');
  if(nameStatus)nameStatus.textContent='Позиция: '+state.uiSettings.roomNameOffset+'px · Шрифт: '+state.uiSettings.roomNameFontSize+'px';
  if(kindStatus)kindStatus.textContent='Позиция: '+state.uiSettings.roomNameColumnWidth+'px · Шрифт: '+state.uiSettings.roomKindFontSize+'px';
  if(squareStatus)squareStatus.textContent='Размер: '+state.uiSettings.roomSquareFontSize+'px';
  if(extraStatus)extraStatus.textContent='Позиция: '+state.uiSettings.roomKindColumnWidth+'px · Шрифт: '+state.uiSettings.roomExtraFontSize+'px';
}
function adjustRoomNamePosition(delta){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  state.uiSettings.roomNameOffset=clampNumber(state.uiSettings.roomNameOffset+delta,ROOM_NAME_OFFSET_MIN,ROOM_NAME_OFFSET_MAX);
  applyRoomInfoDisplaySettings();
  saveState();
  updateRoomDisplayStatus();
}
function adjustRoomNameFontSize(delta){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  state.uiSettings.roomNameFontSize=clampNumber(state.uiSettings.roomNameFontSize+delta,ROOM_NAME_FONT_MIN,ROOM_NAME_FONT_MAX);
  applyRoomInfoDisplaySettings();
  saveState();
  updateRoomDisplayStatus();
}
function adjustRoomKindPosition(delta){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  state.uiSettings.roomNameColumnWidth=clampNumber(state.uiSettings.roomNameColumnWidth+delta,ROOM_NAME_COLUMN_MIN,ROOM_NAME_COLUMN_MAX);
  applyRoomInfoDisplaySettings();
  saveState();
  updateRoomDisplayStatus();
}
function adjustRoomKindFontSize(delta){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  state.uiSettings.roomKindFontSize=clampNumber(state.uiSettings.roomKindFontSize+delta,ROOM_KIND_FONT_MIN,ROOM_KIND_FONT_MAX);
  applyRoomInfoDisplaySettings();
  saveState();
  updateRoomDisplayStatus();
}
function adjustRoomSquareFontSize(delta){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  state.uiSettings.roomSquareFontSize=clampNumber(state.uiSettings.roomSquareFontSize+delta,ROOM_SQUARE_FONT_MIN,ROOM_SQUARE_FONT_MAX);
  applyRoomInfoDisplaySettings();
  saveState();
  updateRoomDisplayStatus();
}
function adjustRoomExtraPosition(delta){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  state.uiSettings.roomKindColumnWidth=clampNumber(state.uiSettings.roomKindColumnWidth+delta,ROOM_KIND_COLUMN_MIN,ROOM_KIND_COLUMN_MAX);
  applyRoomInfoDisplaySettings();
  saveState();
  updateRoomDisplayStatus();
}
function adjustRoomExtraFontSize(delta){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  state.uiSettings.roomExtraFontSize=clampNumber(state.uiSettings.roomExtraFontSize+delta,ROOM_EXTRA_FONT_MIN,ROOM_EXTRA_FONT_MAX);
  applyRoomInfoDisplaySettings();
  saveState();
  updateRoomDisplayStatus();
}
function setupRoomDisplayControls(){
  const nameLeftBtn=document.getElementById('moveRoomNameLeftBtn');
  const nameRightBtn=document.getElementById('moveRoomNameRightBtn');
  const nameDecreaseBtn=document.getElementById('decreaseRoomNameFontBtn');
  const nameIncreaseBtn=document.getElementById('increaseRoomNameFontBtn');
  const leftBtn=document.getElementById('moveRoomKindLeftBtn');
  const rightBtn=document.getElementById('moveRoomKindRightBtn');
  const decreaseBtn=document.getElementById('decreaseRoomInfoFontBtn');
  const increaseBtn=document.getElementById('increaseRoomInfoFontBtn');
  const squareDecreaseBtn=document.getElementById('decreaseRoomSquareFontBtn');
  const squareIncreaseBtn=document.getElementById('increaseRoomSquareFontBtn');
  const extraLeftBtn=document.getElementById('moveRoomExtraLeftBtn');
  const extraRightBtn=document.getElementById('moveRoomExtraRightBtn');
  const extraDecreaseBtn=document.getElementById('decreaseRoomExtraFontBtn');
  const extraIncreaseBtn=document.getElementById('increaseRoomExtraFontBtn');
  if(nameLeftBtn)nameLeftBtn.onclick=()=>adjustRoomNamePosition(-5);
  if(nameRightBtn)nameRightBtn.onclick=()=>adjustRoomNamePosition(5);
  if(nameDecreaseBtn)nameDecreaseBtn.onclick=()=>adjustRoomNameFontSize(-1);
  if(nameIncreaseBtn)nameIncreaseBtn.onclick=()=>adjustRoomNameFontSize(1);
  if(leftBtn)leftBtn.onclick=()=>adjustRoomKindPosition(-10);
  if(rightBtn)rightBtn.onclick=()=>adjustRoomKindPosition(10);
  if(decreaseBtn)decreaseBtn.onclick=()=>adjustRoomKindFontSize(-1);
  if(increaseBtn)increaseBtn.onclick=()=>adjustRoomKindFontSize(1);
  if(squareDecreaseBtn)squareDecreaseBtn.onclick=()=>adjustRoomSquareFontSize(-1);
  if(squareIncreaseBtn)squareIncreaseBtn.onclick=()=>adjustRoomSquareFontSize(1);
  if(extraLeftBtn)extraLeftBtn.onclick=()=>adjustRoomExtraPosition(-10);
  if(extraRightBtn)extraRightBtn.onclick=()=>adjustRoomExtraPosition(10);
  if(extraDecreaseBtn)extraDecreaseBtn.onclick=()=>adjustRoomExtraFontSize(-1);
  if(extraIncreaseBtn)extraIncreaseBtn.onclick=()=>adjustRoomExtraFontSize(1);
  updateRoomDisplayStatus();
}


function normalizeUltraAllInclusive(input){
  const normalized={selectedHotelId:'algara_beach',hotels:{}};
  const source=input&&typeof input==='object'?input:{};
  const sourceHotels=source.hotels&&typeof source.hotels==='object'?source.hotels:{};
  ULTRA_ALL_INCLUSIVE_HOTELS.forEach(hotel=>{
    const existing=sourceHotels[hotel.id]||{};
    normalized.hotels[hotel.id]={
      id:hotel.id,
      name:hotel.name,
      locked:!!existing.locked,
      html:existing.html!==undefined?String(existing.html):(hotel.id==='algara_beach'?DEFAULT_ALGARA_ULTRA_HTML:'')
    };
  });
  if(source.selectedHotelId&&normalized.hotels[source.selectedHotelId]){
    normalized.selectedHotelId=source.selectedHotelId;
  }
  return normalized;
}
function getSelectedUltraHotel(){
  state.ultraAllInclusive=normalizeUltraAllInclusive(state.ultraAllInclusive||{});
  return state.ultraAllInclusive.hotels[state.ultraAllInclusive.selectedHotelId]||state.ultraAllInclusive.hotels.algara_beach;
}
function saveUltraInfoFromBox(){
  const box=document.getElementById('ultraInfoBox');
  if(!box)return;
  state.ultraAllInclusive=normalizeUltraAllInclusive(state.ultraAllInclusive||{});
  const selected=getSelectedUltraHotel();
  if(!selected)return;
  selected.html=box.innerHTML;
  state.ultraAllInclusive.hotels[selected.id]=selected;
  saveState();
}
function toggleUltraInfoLock(){
  const box=document.getElementById('ultraInfoBox');
  state.ultraAllInclusive=normalizeUltraAllInclusive(state.ultraAllInclusive||{});
  const selected=getSelectedUltraHotel();
  if(!selected)return;

  if(!selected.locked && box){
    selected.html=box.innerHTML;
    selected.locked=true;
  }else{
    if(!confirm('Да отключа ли информацията за '+selected.name+'?'))return;
    selected.locked=false;
  }

  state.ultraAllInclusive.hotels[selected.id]=selected;
  saveState();
  renderUltraAllInclusive();
}
function renderUltraAllInclusive(){
  const tabs=document.getElementById('ultraHotelTabs');
  const title=document.getElementById('ultraHotelTitle');
  const box=document.getElementById('ultraInfoBox');
  const saveBtn=document.getElementById('saveUltraInfoBtn');
  const clearBtn=document.getElementById('clearUltraInfoBtn');
  const lockBtn=document.getElementById('lockUltraInfoBtn');
  const lockStatus=document.getElementById('ultraLockStatus');
  if(!tabs||!title||!box||!saveBtn||!clearBtn||!lockBtn||!lockStatus)return;

  state.ultraAllInclusive=normalizeUltraAllInclusive(state.ultraAllInclusive||{});
  const selected=getSelectedUltraHotel();

  tabs.innerHTML='';
  ULTRA_ALL_INCLUSIVE_HOTELS.forEach(hotel=>{
    const tab=document.createElement('button');
    tab.type='button';
    tab.className='hotel-tab small'+(hotel.id===selected.id?' active':'');
    tab.innerHTML=`<span class="hotel-name">${escapeHtml(hotel.name)}</span><span class="hotel-operation">Ultra All Inclusive</span>`;
    tab.addEventListener('click',()=>{
      saveUltraInfoFromBox();
      state.ultraAllInclusive.selectedHotelId=hotel.id;
      saveState();
      renderUltraAllInclusive();
    });
    tabs.appendChild(tab);
  });

  title.textContent='Ултра Ол Инклузив — '+selected.name;
  box.innerHTML=selected.html||'';
  box.setAttribute('contenteditable',selected.locked?'false':'true');
  box.classList.toggle('locked',!!selected.locked);
  box.oninput=selected.locked?null:()=>saveUltraInfoFromBox();

  lockStatus.textContent=selected.locked?'Заключено':'Отключено';
  lockStatus.classList.toggle('locked',!!selected.locked);
  lockBtn.textContent=selected.locked?'🔓 Отключи':'🔒 Заключи';
  lockBtn.classList.toggle('danger',!!selected.locked);
  lockBtn.classList.toggle('success',!selected.locked);
  lockBtn.onclick=()=>toggleUltraInfoLock();

  saveBtn.disabled=!!selected.locked;
  clearBtn.disabled=!!selected.locked;
  saveBtn.title=selected.locked?'Отключи информацията, за да можеш да записваш промени.':'';
  clearBtn.title=selected.locked?'Отключи информацията, за да можеш да изчистиш текста.':'';

  saveBtn.onclick=()=>{
    if(selected.locked)return;
    saveUltraInfoFromBox();
    saveJsonFromButton(saveBtn);
  };
  clearBtn.onclick=()=>{
    if(selected.locked)return;
    if(!confirm('Да изчистя ли текста за '+selected.name+'?'))return;
    selected.html='';
    state.ultraAllInclusive.hotels[selected.id]=selected;
    saveState();
    renderUltraAllInclusive();
  };
}



function normalizeEmailTxt(input){
  const normalized={selectedHotelId:'algara_beach',hotels:{}};
  const source=input&&typeof input==='object'?input:{};
  const sourceHotels=source.hotels&&typeof source.hotels==='object'?source.hotels:{};
  EMAIL_TXT_HOTELS.forEach(hotel=>{
    const existing=sourceHotels[hotel.id]||{};
    const hadTemplateArray=Array.isArray(existing.templates);
    let templates=hadTemplateArray?existing.templates:[];
    if(!templates.length && existing.html!==undefined){
      templates=[{id:existing.templateId||uid()+'_emailtxt_0',name:existing.name||DEFAULT_EMAIL_TXT_BUTTON_NAME,html:existing.html||'',locked:!!existing.locked}];
    }
    if(!templates.length && !hadTemplateArray){
      templates=[{id:uid()+'_emailtxt_default',name:DEFAULT_EMAIL_TXT_BUTTON_NAME,html:'',locked:false}];
    }
    templates=templates.map((item,index)=>({
      id:item.id||uid()+'_emailtxt_'+index,
      name:item.name||item.title||DEFAULT_EMAIL_TXT_BUTTON_NAME,
      html:item.html!==undefined?String(item.html):(item.text!==undefined?String(item.text):''),
      locked:!!item.locked
    }));
    let selectedTemplateId=existing.selectedTemplateId||'';
    if(templates.length && !templates.find(t=>t.id===selectedTemplateId))selectedTemplateId=templates[0].id;
    if(!templates.length)selectedTemplateId='';
    normalized.hotels[hotel.id]={id:hotel.id,name:hotel.name,selectedTemplateId,templates};
  });
  if(source.selectedHotelId&&normalized.hotels[source.selectedHotelId])normalized.selectedHotelId=source.selectedHotelId;
  return normalized;
}
function getSelectedEmailTxtHotel(){
  state.emailTxt=normalizeEmailTxt(state.emailTxt||{});
  return state.emailTxt.hotels[state.emailTxt.selectedHotelId]||state.emailTxt.hotels.algara_beach;
}
function getSelectedEmailTxtTemplate(){
  const hotel=getSelectedEmailTxtHotel();
  if(!hotel||!Array.isArray(hotel.templates)||!hotel.templates.length)return null;
  let template=hotel.templates.find(item=>item.id===hotel.selectedTemplateId)||hotel.templates[0]||null;
  if(template)hotel.selectedTemplateId=template.id;
  return template;
}
function selectEmailTxtHotel(hotelId){
  state.emailTxt=normalizeEmailTxt(state.emailTxt||{});
  if(state.emailTxt.hotels[hotelId]){
    state.emailTxt.selectedHotelId=hotelId;
    const hotel=state.emailTxt.hotels[hotelId];
    if(!hotel.templates.find(item=>item.id===hotel.selectedTemplateId) && hotel.templates[0]){
      hotel.selectedTemplateId=hotel.templates[0].id;
    }
    return hotel;
  }
  return getSelectedEmailTxtHotel();
}
function selectEmailTxtTemplate(templateId){
  state.emailTxt=normalizeEmailTxt(state.emailTxt||{});
  const hotel=getSelectedEmailTxtHotel();
  if(!hotel)return null;
  const template=hotel.templates.find(item=>item.id===templateId)||null;
  if(template)hotel.selectedTemplateId=template.id;
  return template;
}
function getEmailTxtTemplateById(hotelId,templateId){
  state.emailTxt=normalizeEmailTxt(state.emailTxt||{});
  const hotel=state.emailTxt.hotels[hotelId];
  if(!hotel)return null;
  return hotel.templates.find(item=>item.id===templateId)||null;
}
function saveEmailTxtFromBox(options={}){
  const box=document.getElementById('emailTxtBox');
  if(!box)return;
  state.emailTxt=normalizeEmailTxt(state.emailTxt||{});
  const template=getSelectedEmailTxtTemplate();
  if(!template||template.locked)return;
  template.html=box.innerHTML;
  if(options&&options.deferred)scheduleSilentStateSave();
  else saveStateSafe();
}
function addEmailTxtTemplate(){
  saveEmailTxtFromBox();
  const hotel=getSelectedEmailTxtHotel();
  if(!hotel)return;
  const count=(hotel.templates||[]).length+1;
  const template={id:uid()+'_emailtxt',name:'Нов текст '+count,html:'',locked:false};
  hotel.templates.push(template);
  hotel.selectedTemplateId=template.id;
  saveStateSafe();
  renderEmailTxt();
}
function renameEmailTxtTemplate(){
  const input=document.getElementById('emailTxtButtonNameInput');
  const template=getSelectedEmailTxtTemplate();
  if(!input||!template)return;
  const name=input.value.trim();
  if(!name){alert('Напиши име на бутона.');return;}
  template.name=name;
  saveStateSafe();
  renderEmailTxt();
}
function deleteEmailTxtTemplate(){
  state.emailTxt=normalizeEmailTxt(state.emailTxt||{});
  const hotel=state.emailTxt.hotels[state.emailTxt.selectedHotelId]||state.emailTxt.hotels.algara_beach;
  if(!hotel||!Array.isArray(hotel.templates)||!hotel.templates.length){
    alert('Няма бутон за изтриване.');
    return;
  }
  const template=hotel.templates.find(item=>item.id===hotel.selectedTemplateId)||hotel.templates[0]||null;
  if(!template)return;
  if(!confirm('Да изтрия ли бутона „'+template.name+'“?'))return;
  const oldIndex=hotel.templates.findIndex(item=>item.id===template.id);
  hotel.templates=hotel.templates.filter(item=>item.id!==template.id);
  if(hotel.templates.length){
    const nextIndex=Math.min(Math.max(oldIndex,0),hotel.templates.length-1);
    hotel.selectedTemplateId=hotel.templates[nextIndex].id;
  }else{
    hotel.selectedTemplateId='';
  }
  saveStateSafe();
  renderEmailTxt();
}
function reorderEmailTxtTemplate(sourceId,targetId){
  if(!sourceId||!targetId||sourceId===targetId)return;
  saveEmailTxtFromBox();
  state.emailTxt=normalizeEmailTxt(state.emailTxt||{});
  const hotel=getSelectedEmailTxtHotel();
  if(!hotel||!Array.isArray(hotel.templates))return;
  const from=hotel.templates.findIndex(item=>item.id===sourceId);
  const to=hotel.templates.findIndex(item=>item.id===targetId);
  if(from<0||to<0||from===to)return;
  const [moved]=hotel.templates.splice(from,1);
  hotel.templates.splice(to,0,moved);
  hotel.selectedTemplateId=moved.id;
  saveStateSafe();
  renderEmailTxt();
}
function toggleEmailTxtLock(){
  const box=document.getElementById('emailTxtBox');
  const template=getSelectedEmailTxtTemplate();
  if(!template)return;
  if(!template.locked){
    if(box)template.html=box.innerHTML;
    template.locked=true;
  }else{
    if(!confirm('Да отключа ли текста „'+template.name+'“?'))return;
    template.locked=false;
  }
  saveStateSafe();
  renderEmailTxt();
}
function plainTextFromHtml(html){
  const div=document.createElement('div');
  div.innerHTML=html||'';
  return div.innerText||div.textContent||'';
}
async function copyEmailTxtContent(){
  const box=document.getElementById('emailTxtBox');
  const template=getSelectedEmailTxtTemplate();
  if(!box||!template)return;
  if(!template.locked)saveEmailTxtFromBox();
  const html=box.innerHTML||'';
  const text=box.innerText||plainTextFromHtml(html);
  try{
    if(navigator.clipboard&&window.ClipboardItem){
      await navigator.clipboard.write([new ClipboardItem({
        'text/html':new Blob([html],{type:'text/html'}),
        'text/plain':new Blob([text],{type:'text/plain'})
      })]);
    }else{
      const selection=window.getSelection();
      const range=document.createRange();
      range.selectNodeContents(box);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      selection.removeAllRanges();
    }
    const status=document.getElementById('emailTxtLockStatus');
    if(status){
      const old=status.textContent;
      status.textContent='Копирано';
      setTimeout(()=>{renderEmailTxt()},700);
    }
  }catch(error){
    console.error(error);
    alert('Не успях да копирам автоматично. Маркирай текста и копирай с Ctrl+C / Copy.');
  }
}
function renderEmailTxt(){
  const hotelTabs=document.getElementById('emailTxtHotelTabs');
  const templateTabs=document.getElementById('emailTxtTemplateTabs');
  const title=document.getElementById('emailTxtTitle');
  const box=document.getElementById('emailTxtBox');
  const input=document.getElementById('emailTxtButtonNameInput');
  const renameBtn=document.getElementById('renameEmailTxtTemplateBtn');
  const addBtn=document.getElementById('addEmailTxtTemplateBtn');
  const deleteBtn=document.getElementById('deleteEmailTxtTemplateBtn');
  const lockBtn=document.getElementById('lockEmailTxtBtn');
  const copyBtn=document.getElementById('copyEmailTxtBtn');
  const lockStatus=document.getElementById('emailTxtLockStatus');
  if(!hotelTabs||!templateTabs||!title||!box||!input||!renameBtn||!addBtn||!deleteBtn||!lockBtn||!copyBtn||!lockStatus)return;

  state.emailTxt=normalizeEmailTxt(state.emailTxt||{});
  const hotel=getSelectedEmailTxtHotel();
  const template=getSelectedEmailTxtTemplate();
  if(!hotel)return;

  hotelTabs.innerHTML='';
  EMAIL_TXT_HOTELS.forEach(item=>{
    const tab=document.createElement('button');
    tab.type='button';
    tab.className='hotel-tab small'+(item.id===hotel.id?' active':'');
    tab.innerHTML=`<span class="hotel-name">${escapeHtml(item.name)}</span><span class="hotel-operation">Email TXT</span>`;
    tab.addEventListener('click',()=>{
      saveEmailTxtFromBox();
      selectEmailTxtHotel(item.id);
      saveStateSafe();
      renderEmailTxt();
    });
    hotelTabs.appendChild(tab);
  });

  templateTabs.innerHTML='';
  hotel.templates.forEach(item=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='email-txt-template-tab'+(template&&item.id===template.id?' active':'');
    btn.dataset.emailTxtTemplateId=item.id;
    btn.draggable=true;
    btn.innerHTML=`<span class="drag-mark">↕</span><span class="email-txt-template-name">${escapeHtml(item.name||DEFAULT_EMAIL_TXT_BUTTON_NAME)}</span>`;
    btn.addEventListener('click',()=>{
      saveEmailTxtFromBox();
      selectEmailTxtTemplate(item.id);
      saveStateSafe();
      renderEmailTxt();
    });
    btn.addEventListener('dragstart',e=>{
      draggedEmailTxtTemplateId=item.id;
      btn.classList.add('dragging');
      e.dataTransfer.effectAllowed='move';
      e.dataTransfer.setData('text/plain',item.id);
    });
    btn.addEventListener('dragover',e=>{
      e.preventDefault();
      if(btn.dataset.emailTxtTemplateId!==draggedEmailTxtTemplateId)btn.classList.add('drag-over');
    });
    btn.addEventListener('dragleave',()=>btn.classList.remove('drag-over'));
    btn.addEventListener('drop',e=>{
      e.preventDefault();
      btn.classList.remove('drag-over');
      reorderEmailTxtTemplate(draggedEmailTxtTemplateId,item.id);
    });
    btn.addEventListener('dragend',()=>{
      btn.classList.remove('dragging');
      templateTabs.querySelectorAll('.drag-over').forEach(tab=>tab.classList.remove('drag-over'));
      draggedEmailTxtTemplateId=null;
    });
    templateTabs.appendChild(btn);
  });

  if(!template){
    title.textContent=hotel.name+' — няма бутон';
    input.value='';
    input.oninput=null;
    renameBtn.onclick=null;
    addBtn.onclick=()=>addEmailTxtTemplate();
    deleteBtn.onclick=()=>deleteEmailTxtTemplate();
    lockBtn.onclick=null;
    copyBtn.onclick=null;
    box.innerHTML='<div class="email-txt-empty">Няма създаден бутон за този хотел. Натисни „+ Добави бутон“, за да създадеш нов текст.</div>';
    box.setAttribute('contenteditable','false');
    box.classList.add('locked');
    box.oninput=null;
    lockStatus.textContent='Няма бутон';
    lockStatus.classList.add('locked');
    lockBtn.textContent='🔒 Заключи';
    lockBtn.classList.remove('success');
    lockBtn.classList.add('danger');
    deleteBtn.disabled=true;
    renameBtn.disabled=true;
    input.disabled=true;
    copyBtn.disabled=true;
    lockBtn.disabled=true;
    return;
  }

  title.textContent=hotel.name+' — '+(template.name||DEFAULT_EMAIL_TXT_BUTTON_NAME);
  input.value=template.name||'';
  input.oninput=()=>{
    const value=input.value.trim();
    if(value){
      const currentTemplate=getEmailTxtTemplateById(hotel.id,template.id);
      if(!currentTemplate)return;
      currentTemplate.name=value;
      title.textContent=hotel.name+' — '+value;
      const active=templateTabs.querySelector('.email-txt-template-tab.active .email-txt-template-name');
      if(active)active.textContent=value;
      scheduleSilentStateSave();
    }
  };
  input.onblur=()=>flushScheduledSilentStateSave();
  renameBtn.onclick=()=>renameEmailTxtTemplate();
  addBtn.onclick=()=>addEmailTxtTemplate();
  deleteBtn.onclick=()=>deleteEmailTxtTemplate();
  lockBtn.onclick=()=>toggleEmailTxtLock();
  copyBtn.onclick=()=>copyEmailTxtContent();

  box.innerHTML=template.html||'';
  box.setAttribute('contenteditable',template.locked?'false':'true');
  box.classList.toggle('locked',!!template.locked);
  box.oninput=template.locked?null:()=>saveEmailTxtFromBox({deferred:true});
  box.onblur=template.locked?null:()=>flushScheduledSilentStateSave();

  lockStatus.textContent=template.locked?'Заключено':'Отключено';
  lockStatus.classList.toggle('locked',!!template.locked);
  lockBtn.textContent=template.locked?'🔓 Отключи':'🔒 Заключи';
  lockBtn.classList.toggle('danger',!!template.locked);
  lockBtn.classList.toggle('success',!template.locked);
  deleteBtn.disabled=false;
  renameBtn.disabled=!!template.locked;
  input.disabled=!!template.locked;
  copyBtn.disabled=false;
  lockBtn.disabled=false;
}


function normalizePriceChildAges(input,childrenCount){
  const source=Array.isArray(input&&input.childAges)
    ? input.childAges
    : (Array.isArray(input&&input.childrenAges)?input.childrenAges:[]);
  const count=Math.max(0,Number(childrenCount)||0);
  const ages=[];
  for(let i=0;i<count;i++){
    const raw=source[i]!==undefined&&source[i]!==null&&source[i]!=='' ? source[i] : '2';
    let age=Number(raw);
    if(!Number.isFinite(age))age=2;
    age=Math.max(0,Math.min(12,Math.round(age)));
    ages.push(String(age));
  }
  return ages;
}
function getPricePaidOccupancy(pc){
  const baseAdults=Math.max(0,Number(pc&&pc.adults)||0);
  const totalChildren=Math.max(0,Number(pc&&pc.children)||0);
  const childAges=normalizePriceChildAges(pc,totalChildren);
  let freeChildren=0,paidChildren=0,childrenAsAdults=0;
  childAges.forEach(value=>{
    const age=Number(value);
    if(age<=1)freeChildren+=1;
    else if(age>=2&&age<=11)paidChildren+=1;
    else childrenAsAdults+=1;
  });
  return {
    baseAdults,
    totalChildren,
    childAges,
    freeChildren,
    paidChildren,
    childrenAsAdults,
    effectiveAdults:baseAdults+childrenAsAdults,
    effectiveChildren:paidChildren
  };
}
function renderPriceChildAgeControls(pc){
  const childCount=Math.max(0,Number(pc&&pc.children)||0);
  if(!childCount)return '<div class="price-occupancy-summary">Няма избрани деца.</div>';
  const ages=normalizePriceChildAges(pc,childCount);
  const options=Array.from({length:13},(_,age)=>`<option value="${age}">${age===12?'12+':age} г.</option>`);
  const fields=ages.map((age,index)=>`<div class="price-child-age-field"><label>Възраст дете ${index+1}</label><select data-price-child-age="${index}">${options.map(option=>option.replace(`value="${age}"`,`value="${age}" selected`)).join('')}</select></div>`).join('');
  return `<div class="price-child-ages">${fields}</div><div class="price-occupancy-summary">${escapeHtml(renderPriceOccupancySummaryText(getPricePaidOccupancy({...pc,childAges:ages})))}</div>`;
}
function renderPriceOccupancySummaryText(occupancy){
  if(!occupancy)return '';
  const parts=[`Смята се като ${occupancy.effectiveAdults}+${occupancy.effectiveChildren}`];
  if(occupancy.freeChildren>0)parts.push(`${occupancy.freeChildren} дете ${occupancy.freeChildren===1?'безплатно':'безплатни'} (0–1 г.)`);
  if(occupancy.childrenAsAdults>0)parts.push(`${occupancy.childrenAsAdults} дете ${occupancy.childrenAsAdults===1?'като възрастен':'като възрастни'} (12+ г.)`);
  return parts.join(' · ');
}
function updatePriceChildAge(index,value){
  const week=getActiveWeek();
  if(!week)return;
  const pc=getPriceCalculatorState(week);
  pc.childAges=normalizePriceChildAges(pc,pc.children);
  pc.childAges[index]=String(value);
  touchWeek(week);
  renderPrices();
}

function normalizePriceCalculator(input,week){
  const start=(input&&input.checkIn)||week.startDate||toISODate(new Date());
  let end=(input&&input.checkOut)||week.endDate||toISODate(addDays(parseISODate(start),1));
  if(end<=start)end=toISODate(addDays(parseISODate(start),1));
  const childrenCount=String((input&&input.children)!==undefined?input.children:'0');
  const rawReservationDate=(input&&(input.reservationDate||input.bookingDate))||toISODate(new Date());
  const reservationDate=/^\d{4}-\d{2}-\d{2}$/.test(String(rawReservationDate))?String(rawReservationDate):(displayToISO(rawReservationDate)||toISODate(new Date()));
  return {
    checkIn:start,
    checkOut:end,
    reservationDate,
    adults:String((input&&input.adults)!==undefined?input.adults:'2'),
    children:childrenCount,
    childAges:normalizePriceChildAges(input,childrenCount),
    selectedRoom:(input&&input.selectedRoom)||''
  };
}
function isAlgaraHotel(hotel){
  const name=String((hotel&&hotel.name)||'').toLowerCase();
  return name.includes('алгара')||name.includes('algara');
}
function isGrandVictoriaHotel(hotel){
  const name=String((hotel&&hotel.name)||'').toLowerCase();
  return name.includes('гранд виктория')||name.includes('grand victoria')||name.includes('grand viktoria');
}
function getPriceDatasetForHotel(hotel,sub){
  if(isAlgaraHotel(hotel)){
    return (isDirectPriceSubsection(sub)||isBookingPriceSubsection(sub))&&window.ALGARA_PRICES_PREVIEW_LITE_V26?window.ALGARA_PRICES_PREVIEW_LITE_V26:null;
  }
  if(isGrandVictoriaHotel(hotel))return isBookingPriceSubsection(sub)?null:GRAND_VICTORIA_S26_PRICE_DATA;
  return null;
}
function getPriceDatasetHotelName(data,hotel){
  return (data&&data.hotel)||((hotel&&hotel.name)||'Избран хотел');
}
function isDirectPriceSubsection(sub){
  const name=String((sub&&sub.name)||'').trim().toLowerCase();
  return name==='direct'||name==='директ'||name.includes('direct');
}
function isBookingPriceSubsection(sub){
  const name=String((sub&&sub.name)||'').trim().toLowerCase();
  return name==='booking'||name==='booking.com'||name.includes('booking')||name.includes('букинг')||name.includes('expedia')||name.includes('експедия');
}
function isSupportedPriceSubsection(sub){
  return isDirectPriceSubsection(sub)||isBookingPriceSubsection(sub);
}
function getPriceSubsectionLabel(sub){
  return (sub&&sub.name)||'избран канал';
}
function getPriceCalculatorState(week){
  if(!week)return null;
  if(!week.priceCalculator)week.priceCalculator=normalizePriceCalculator({},week);
  week.priceCalculator.childAges=normalizePriceChildAges(week.priceCalculator,week.priceCalculator.children);
  return week.priceCalculator;
}
function updatePriceCalculatorField(field,value){
  const week=getActiveWeek();
  if(!week)return;
  const pc=getPriceCalculatorState(week);
  pc[field]=value;
  if(field==='children'){
    pc.childAges=normalizePriceChildAges(pc,value);
  }
  if(field==='checkIn'&&pc.checkOut<=pc.checkIn){
    pc.checkOut=toISODate(addDays(parseISODate(pc.checkIn),1));
  }
  if(field==='checkOut'&&pc.checkOut<=pc.checkIn){
    alert('Датата на напускане трябва да е след датата на настаняване.');
    pc.checkOut=toISODate(addDays(parseISODate(pc.checkIn),1));
  }
  touchWeek(week);
  renderPrices();
}
function priceDateList(startISO,endISO){
  const dates=[];
  if(!startISO||!endISO||endISO<=startISO)return dates;
  let current=parseISODate(startISO);
  const end=parseISODate(endISO);
  while(current<end){
    dates.push(toISODate(current));
    current=addDays(current,1);
    if(dates.length>90)break;
  }
  return dates;
}
function dateInRangeInclusive(iso,from,to){
  return !!iso&&!!from&&!!to&&iso>=from&&iso<=to;
}
function findAlgaraPeriodForDate(iso,data){
  data=data||ALGARA_S26_PRICE_DATA;
  return (data.periods||[]).find(period=>(period.intervals||[]).some(interval=>dateInRangeInclusive(iso,interval.start,interval.end)));
}
function splitRoomConfigOptions(config){
  return String(config||'').split('/').map(part=>{
    const m=part.trim().match(/^(\d+)\s*\+\s*(\d+)$/);
    return m?{adults:Number(m[1]),children:Number(m[2]),label:part.trim()}:null;
  }).filter(Boolean);
}
function configMatchesOccupancy(config,adults,children){
  return splitRoomConfigOptions(config).some(opt=>opt.adults===adults&&opt.children===children);
}
function chooseAlgaraConfig(room,adults,children){
  const configs=(room&&room.configs)||[];
  const exact=configs.find(config=>configMatchesOccupancy(config,adults,children));
  if(exact)return exact;

  // За стаи без специална DBL формула използваме минималната базова
  // конфигурация на стаята при по-малки запитвания, напр. AP Lux/Beach House → 2+2.
  if((adults<=2&&children<=2)&&configs[0])return configs[0];

  const candidates=configs.map(config=>({config,options:splitRoomConfigOptions(config)}))
    .filter(item=>item.options.some(opt=>opt.adults>=adults&&opt.children>=children))
    .sort((a,b)=>{
      const bestA=Math.min(...a.options.map(opt=>Math.max(0,opt.adults-adults)+Math.max(0,opt.children-children)+opt.adults+opt.children/10));
      const bestB=Math.min(...b.options.map(opt=>Math.max(0,opt.adults-adults)+Math.max(0,opt.children-children)+opt.adults+opt.children/10));
      return bestA-bestB;
    });
  return candidates[0]?candidates[0].config:'';
}
function isAlgaraDblFormulaRoom(room){
  if(room&&room.formulaRoom)return true;
  const original=String((room&&room.original)||'');
  return ['TW St','TW side','TW Sea','TW R'].includes(original);
}
function algaraSingleCoefficient(periodId){
  const coefficients={P1:1.5,P2:1.6,P3:1.7,P4:1.8,P5:1.9,P6:1.9};
  return coefficients[periodId]||1;
}
function getAlgaraAdultBasePrice(roomOriginal,periodId,data,date){
  const baseRecord=findAlgaraPriceRecord(roomOriginal,'2+0/1+1',periodId,data)||findAlgaraPriceRecord(roomOriginal,'2+0',periodId,data);
  if(date&&baseRecord){
    const daily=getGrandVictoriaDirectDailyPrice(roomOriginal,baseRecord.config,periodId,date,data);
    if(daily!==null)return daily/2;
  }
  return baseRecord?Number(baseRecord.price||0)/2:0;
}
function isGrandVictoriaAppSmallRoom(room,data){
  return data===GRAND_VICTORIA_S26_PRICE_DATA&&String((room&&room.original)||'').trim()==='AM 1debroom';
}
function algaraDblMultiplier(adults,children,periodId){
  const coefficient=algaraSingleCoefficient(periodId);
  if(adults===1&&children===0)return coefficient;
  if(adults===1&&children===1)return coefficient;
  if(adults===1&&children===2)return 2;
  if(adults===2&&children===0)return 2;
  if(adults===2&&children===1)return 2.25;
  if(adults===2&&children===2)return 2.5;
  if(adults===3&&children===0)return 2.8;
  return null;
}
function algaraDblFormulaLabel(adults,children,periodId){
  const coefficient=algaraSingleCoefficient(periodId);
  const occupancy=`${adults}+${children}`;
  if(adults===1&&children===0)return `${occupancy} · коеф. ${String(coefficient).replace('.',',')}`;
  if(adults===1&&children===1)return `${occupancy} = 1+0 · коеф. ${String(coefficient).replace('.',',')}`;
  if(adults===1&&children===2)return `${occupancy} = 2+0`;
  return occupancy;
}
function getAlgaraPriceInfo(room,adults,children,period,data,date){
  data=data||ALGARA_S26_PRICE_DATA;
  if(!room||!period)return null;

  if(isAlgaraDblFormulaRoom(room)){
    const multiplier=algaraDblMultiplier(adults,children,period.id);
    if(multiplier===null)return null;
    const adultBase=getAlgaraAdultBasePrice(room.original,period.id,data,date);
    if(!adultBase)return null;
    const price=Math.round(adultBase*multiplier*100)/100;
    return {
      price,
      config:`${adults}+${children}`,
      displayConfig:algaraDblFormulaLabel(adults,children,period.id),
      formulaNote:`DBL формула: 1 възрастен ${formatPriceEuro(adultBase)} × ${String(multiplier).replace('.',',')} = ${formatPriceEuro(price)}`,
      isFormula:true
    };
  }

  const config=chooseAlgaraConfig(room,adults,children);
  if(!config)return null;
  const record=findAlgaraPriceRecord(room.original,config,period.id,data);
  if(!record)return null;
  const daily=date?getGrandVictoriaDirectDailyPrice(room.original,config,period.id,date,data):null;
  const usedFallback=!configMatchesOccupancy(config,adults,children);
  return {
    price:daily!==null?daily:(Number(record.price)||0),
    config,
    displayConfig:usedFallback?`${adults}+${children} → ${config}`:config,
    formulaNote:usedFallback?`Минимална цена за стаята: ${config}`:'',
    isFormula:false
  };
}
function priceNoAccommodationText(occupancy){
  const adults=Number(occupancy&&occupancy.effectiveAdults)||0;
  const children=Number(occupancy&&occupancy.effectiveChildren)||0;
  if(adults>0&&children===0)return `Не може да се настанят ${adults} ${adults===1?'възрастен':'възрастни'}`;
  if(adults>0)return `Не може да се настанят ${adults} ${adults===1?'възрастен':'възрастни'} + ${children} ${children===1?'дете':'деца'}`;
  return 'Не може да се настани избраната конфигурация';
}
function findAlgaraPriceRecord(roomOriginal,config,periodId,data){
  data=data||ALGARA_S26_PRICE_DATA;
  return (data.records||[]).find(record=>record.room_original===roomOriginal&&record.config===config&&record.period_id===periodId);
}
function formatPriceEuro(value){
  const num=Number(value)||0;
  return num.toFixed(2).replace('.',',')+' €';
}
function findDiscountPercentForDate(iso,sub){
  const periods=(sub&&Array.isArray(sub.periods))?sub.periods:[];
  const match=periods.find(period=>dateInRangeInclusive(iso,period.fromDate,period.toDate));
  const percent=match?Number(String(match.discount||'').replace(',','.')):0;
  return Number.isFinite(percent)?Math.max(0,percent):0;
}

function priceMatchKey(value){
  return String(value||'').toLowerCase().replace(/\s+/g,' ').trim();
}
function findWeekByReservationDate(reservationDate,currentWeek){
  const iso=reservationDate||toISODate(new Date());
  const weeks=(state.weeks||[]).filter(week=>dateInRangeInclusive(iso,week.startDate,week.endDate));
  if(!weeks.length)return null;
  return weeks.find(week=>currentWeek&&week.id===currentWeek.id)||weeks.sort((a,b)=>String(a.startDate||'').localeCompare(String(b.startDate||'')))[0];
}
function findMatchingHotelForDiscountSource(sourceWeek,currentWeek,currentHotel,data){
  if(!sourceWeek||!Array.isArray(sourceWeek.hotels)||!sourceWeek.hotels.length)return null;
  if(!currentHotel)return sourceWeek.hotels[0]||null;
  const nameKey=priceMatchKey(currentHotel.name);
  const byName=nameKey?sourceWeek.hotels.find(h=>priceMatchKey(h.name)===nameKey):null;
  if(byName)return byName;
  const currentIndex=(currentWeek&&Array.isArray(currentWeek.hotels))?currentWeek.hotels.findIndex(h=>h.id===currentHotel.id):-1;
  if(currentIndex>=0&&sourceWeek.hotels[currentIndex])return sourceWeek.hotels[currentIndex];
  const byDataset=sourceWeek.hotels.find(h=>getPriceDatasetForHotel(h)===data);
  return byDataset||sourceWeek.hotels[0]||null;
}
function findMatchingSubsectionForDiscountSource(sourceHotel,currentSub){
  const subsections=(sourceHotel&&Array.isArray(sourceHotel.subsections))?sourceHotel.subsections:[];
  if(!subsections.length)return null;
  const nameKey=priceMatchKey(currentSub&&currentSub.name);
  const byName=nameKey?subsections.find(sub=>priceMatchKey(sub.name)===nameKey):null;
  if(byName)return byName;
  if(isDirectPriceSubsection(currentSub)){
    const direct=subsections.find(sub=>isDirectPriceSubsection(sub));
    if(direct)return direct;
  }
  return subsections[0]||null;
}
function getPriceDiscountSource(reservationDate,currentWeek,currentHotel,currentSub,data){
  const iso=reservationDate||toISODate(new Date());
  const fallback={reservationDate:iso,week:currentWeek,hotel:currentHotel,sub:currentSub,found:false,usedFallback:true,message:`Няма намерена седмица за дата на резервация ${isoToDisplay(iso)}. Използвам отстъпките от текущо избрания канал.`};
  const sourceWeek=findWeekByReservationDate(iso,currentWeek);
  if(!sourceWeek)return fallback;
  const sourceHotel=findMatchingHotelForDiscountSource(sourceWeek,currentWeek,currentHotel,data);
  if(!sourceHotel){
    return {...fallback,week:sourceWeek,message:`Намерена е седмица за ${isoToDisplay(iso)}, но няма съвпадащ хотел. Използвам текущо избрания канал.`};
  }
  const sourceSub=findMatchingSubsectionForDiscountSource(sourceHotel,currentSub);
  if(!sourceSub){
    return {...fallback,week:sourceWeek,hotel:sourceHotel,message:`Намерена е седмица за ${isoToDisplay(iso)}, но няма съвпадащ канал. Използвам текущо избрания канал.`};
  }
  const title=makeTitle(sourceWeek.startDate,sourceWeek.endDate,sourceWeek.customTitle);
  const hotelName=sourceHotel.name||currentHotel&&currentHotel.name||'избран хотел';
  const channelName=sourceSub.name||currentSub&&currentSub.name||'избран канал';
  return {
    reservationDate:iso,
    week:sourceWeek,
    hotel:sourceHotel,
    sub:sourceSub,
    found:true,
    usedFallback:false,
    title,
    hotelName,
    channelName,
    message:`Отстъпките се взимат от седмица „${title}“ → ${hotelName} → ${channelName}, според дата на резервация ${isoToDisplay(iso)}.`
  };
}
function renderPriceDiscountSourceNotice(discountSource){
  if(!discountSource)return '';
  const message=discountSource.message||'';
  const cls=discountSource.usedFallback?'price-warning':'price-discount-source';
  return `<div class="${cls}">${escapeHtml(message)}</div>`;
}
function formatDiscountPercent(value){
  const num=Number(value)||0;
  const rounded=Math.round(num*100)/100;
  return String(rounded).replace('.',',')+'%';
}
function buildPriceDiscountSegments(nightRows){
  const rows=(nightRows||[]).filter(row=>Number(row.discount)>0);
  const segments=[];
  rows.forEach(row=>{
    const percent=Number(row.discount)||0;
    const base=Number(row.base)||0;
    const amount=base*percent/100;
    const last=segments[segments.length-1];
    if(last&&last.percent===percent&&toISODate(addDays(parseISODate(last.end),1))===row.date){
      last.end=row.date;
      last.nights+=1;
      last.base+=base;
      last.amount+=amount;
    }else{
      segments.push({start:row.date,end:row.date,percent,nights:1,base,amount});
    }
  });
  return segments;
}
function uniqueNonZeroDiscounts(nightRows){
  const values=[];
  (nightRows||[]).forEach(row=>{
    const percent=Number(row.discount)||0;
    if(percent>0&&!values.some(value=>Math.abs(value-percent)<0.0001))values.push(percent);
  });
  return values;
}
function weightedAverageDiscount(calculation){
  const base=Number(calculation&&calculation.baseTotal)||0;
  const discount=Number(calculation&&calculation.discountTotal)||0;
  return base>0?discount/base*100:0;
}
function renderPriceDiscountDetails(calculation){
  const segments=buildPriceDiscountSegments(calculation&&calculation.nightRows);
  if(!segments.length)return '';
  const unique=uniqueNonZeroDiscounts(calculation&&calculation.nightRows);
  const rows=segments.map(segment=>{
    const dateText=segment.start===segment.end?isoToDisplay(segment.start):`${isoToDisplay(segment.start)} – ${isoToDisplay(segment.end)}`;
    return `<div class="price-discount-detail-row"><span class="price-discount-date"><span class="price-discount-date-main">${escapeHtml(dateText)}</span><span class="price-discount-nights">${segment.nights} нощ.</span></span><strong class="price-discount-amount">${escapeHtml(formatDiscountPercent(segment.percent))} · -${escapeHtml(formatPriceEuro(segment.amount))}</strong></div>`;
  }).join('');
  const average=unique.length>1?`<div class="price-discount-average">Средна отстъпка: ${escapeHtml(formatDiscountPercent(weightedAverageDiscount(calculation)))}</div>`:'';
  return `<div class="price-discount-detail"><div class="price-discount-detail-title">Разбивка на отстъпката от канала</div>${rows}${average}</div>`;
}
function calculateAlgaraStayPrice(pc,sub,data){
  data=data||ALGARA_S26_PRICE_DATA;
  const rooms=data.rooms||[];
  const selectedRoom=rooms.find(room=>room.original===pc.selectedRoom)||rooms[0];
  if(!selectedRoom)return {error:'Няма въведени стаи в ценовата таблица.'};
  const nights=priceDateList(pc.checkIn,pc.checkOut);
  if(!nights.length)return {error:'Избери валиден период с поне 1 нощувка.'};
  const occupancy=getPricePaidOccupancy(pc);
  const adults=occupancy.effectiveAdults;
  const children=occupancy.effectiveChildren;
  let baseTotal=0,discountTotal=0;
  const missing=[];
  const nightRows=[];
  const formulaNotes=[];
  const configLabels=[];

  nights.forEach(iso=>{
    const period=findAlgaraPeriodForDate(iso,data);
    if(!period){missing.push(iso);return;}
    const priceInfo=getAlgaraPriceInfo(selectedRoom,adults,children,period,data,iso);
    if(!priceInfo){missing.push(iso);return;}
    const base=Number(priceInfo.price)||0;
    const discount=findDiscountPercentForDate(iso,sub);
    const discountAmount=base*discount/100;
    baseTotal+=base;
    discountTotal+=discountAmount;
    if(priceInfo.formulaNote&&!formulaNotes.includes(priceInfo.formulaNote))formulaNotes.push(priceInfo.formulaNote);
    if(priceInfo.displayConfig&&!configLabels.includes(priceInfo.displayConfig))configLabels.push(priceInfo.displayConfig);
    nightRows.push({date:iso,period:period.label,periodId:period.id,base,discount,final:base-discountAmount,config:priceInfo.config,displayConfig:priceInfo.displayConfig,formulaNote:priceInfo.formulaNote});
  });

  if(!nightRows.length){
    return {error:priceNoAccommodationText(occupancy),room:selectedRoom,occupancy,nights:nights.length,missing,nightRows:[]};
  }

  return {
    room:selectedRoom,
    config:configLabels.length>1?'по периоди':(configLabels[0]||`${adults}+${children}`),
    configLabels,
    formulaNotes,
    nights:nights.length,
    calculatedNights:nightRows.length,
    baseTotal,
    discountTotal,
    finalTotal:baseTotal-discountTotal,
    occupancy,
    missing,
    nightRows
  };
}

function renderPriceTableSettingsPanel(){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  const s=state.uiSettings;
  const locked=!!s.priceTableLocked;
  const disabled=locked?' disabled':'';
  const hidden=s.priceTableSettingsOpen?'':' hidden';
  const lockText=locked?'🔒 Отключи таблицата':'🔓 Заключи таблицата';
  const lockClass=locked?' active':'';
  const panelClass=locked?'price-table-settings-panel locked':'price-table-settings-panel';
  return `<div class="price-table-topbar no-print">
      <h4>Таблица с цени</h4>
      <div class="price-table-actions">
        <button id="togglePriceTableSettingsBtn" class="small" type="button">⚙️ Настройки таблица</button>
        <button id="lockPriceTableSettingsBtn" class="small${lockClass}" type="button">${lockText}</button>
      </div>
    </div>
    <div id="priceTableSettingsPanel" class="${panelClass}${hidden}">
      <div class="price-table-settings-grid">
        <div class="price-table-setting-group"><strong>Размер на колоните</strong><div class="price-table-setting-buttons"><button class="small" data-price-table-adjust="priceTableRoomColWidth" data-delta="-10"${disabled}>Стаи −</button><button class="small" data-price-table-adjust="priceTableRoomColWidth" data-delta="10"${disabled}>Стаи +</button><button class="small" data-price-table-adjust="priceTablePeriodColWidth" data-delta="-6"${disabled}>Периоди −</button><button class="small" data-price-table-adjust="priceTablePeriodColWidth" data-delta="6"${disabled}>Периоди +</button></div></div>
        <div class="price-table-setting-group"><strong>Височина на редовете</strong><div class="price-table-setting-buttons"><button class="small" data-price-table-adjust="priceTableRowHeight" data-delta="-4"${disabled}>Редове −</button><button class="small" data-price-table-adjust="priceTableRowHeight" data-delta="4"${disabled}>Редове +</button></div></div>
        <div class="price-table-setting-group"><strong>Шрифт: имена на стаи</strong><div class="price-table-setting-buttons"><button class="small" data-price-table-adjust="priceTableRoomFontSize" data-delta="-1"${disabled}>A− стаи</button><button class="small" data-price-table-adjust="priceTableRoomFontSize" data-delta="1"${disabled}>A+ стаи</button></div></div>
        <div class="price-table-setting-group"><strong>Шрифт: периоди</strong><div class="price-table-setting-buttons"><button class="small" data-price-table-adjust="priceTablePeriodFontSize" data-delta="-1"${disabled}>A− периоди</button><button class="small" data-price-table-adjust="priceTablePeriodFontSize" data-delta="1"${disabled}>A+ периоди</button></div></div>
        <div class="price-table-setting-group"><strong>Шрифт: цени</strong><div class="price-table-setting-buttons"><button class="small" data-price-table-adjust="priceTablePriceFontSize" data-delta="-1"${disabled}>A− цени</button><button class="small" data-price-table-adjust="priceTablePriceFontSize" data-delta="1"${disabled}>A+ цени</button></div></div>
      </div>
      <div id="priceTableSettingsStatus" class="price-table-settings-status">Колона стаи: ${s.priceTableRoomColWidth}px · Колона периоди: ${s.priceTablePeriodColWidth}px · Ред: ${s.priceTableRowHeight}px · Шрифт стаи: ${s.priceTableRoomFontSize}px · Шрифт периоди: ${s.priceTablePeriodFontSize}px · Шрифт цени: ${s.priceTablePriceFontSize}px</div>
      ${locked?'<div class="price-table-lock-note">Таблицата е заключена. Отключи я, за да променяш размерите.</div>':''}
    </div>`;
}
function priceTableSettingBounds(key){
  const bounds={
    priceTableRoomColWidth:[PRICE_TABLE_ROOM_COL_MIN,PRICE_TABLE_ROOM_COL_MAX],
    priceTablePeriodColWidth:[PRICE_TABLE_PERIOD_COL_MIN,PRICE_TABLE_PERIOD_COL_MAX],
    priceTableRowHeight:[PRICE_TABLE_ROW_HEIGHT_MIN,PRICE_TABLE_ROW_HEIGHT_MAX],
    priceTableRoomFontSize:[PRICE_TABLE_ROOM_FONT_MIN,PRICE_TABLE_ROOM_FONT_MAX],
    priceTablePeriodFontSize:[PRICE_TABLE_PERIOD_FONT_MIN,PRICE_TABLE_PERIOD_FONT_MAX],
    priceTablePriceFontSize:[PRICE_TABLE_PRICE_FONT_MIN,PRICE_TABLE_PRICE_FONT_MAX]
  };
  return bounds[key]||[0,999];
}
function adjustPriceTableSetting(key,delta){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  if(state.uiSettings.priceTableLocked)return;
  const bounds=priceTableSettingBounds(key);
  state.uiSettings[key]=clampNumber((Number(state.uiSettings[key])||0)+Number(delta||0),bounds[0],bounds[1]);
  applyRoomInfoDisplaySettings();
  saveState();
  renderPrices();
}
function togglePriceTableSettings(){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  state.uiSettings.priceTableSettingsOpen=!state.uiSettings.priceTableSettingsOpen;
  saveState();
  renderPrices();
}
function togglePriceTableLock(){
  state.uiSettings=normalizeUiSettings(state.uiSettings||{});
  state.uiSettings.priceTableLocked=!state.uiSettings.priceTableLocked;
  saveState();
  renderPrices();
}
function setupPriceTableSettingsControls(container){
  if(!container)return;
  const toggle=container.querySelector('#togglePriceTableSettingsBtn');
  const lock=container.querySelector('#lockPriceTableSettingsBtn');
  if(toggle)toggle.addEventListener('click',togglePriceTableSettings);
  if(lock)lock.addEventListener('click',togglePriceTableLock);
  container.querySelectorAll('[data-price-table-adjust]').forEach(btn=>{
    btn.addEventListener('click',()=>adjustPriceTableSetting(btn.dataset.priceTableAdjust,Number(btn.dataset.delta||0)));
  });
}
function renderPriceHotelTabs(week,container){
  if(!container)return;
  container.innerHTML='';
  if(!week)return;
  week.hotels.forEach((hotel,index)=>{
    const name=hotel.name.trim()||`Хотел ${index+1}`;
    const btn=document.createElement('button');
    btn.className='hotel-tab small'+(hotel.id===week.selectedHotelId?' active':'');
    btn.innerHTML=`<span class="hotel-name">${escapeHtml(name)}</span>${operationRangeLabel(hotel)?`<span class="hotel-operation">${escapeHtml(operationRangeLabel(hotel))}</span>`:''}`;
    btn.addEventListener('click',()=>selectHotel(hotel.id));
    container.appendChild(btn);
  });
}
function renderPriceSubsectionTabs(hotel,container){
  if(!container)return;
  container.innerHTML='';
  if(!hotel)return;
  (hotel.subsections||[]).forEach((sub,index)=>{
    const btn=document.createElement('button');
    btn.className='subsection-tab small'+(sub.id===hotel.selectedSubsectionId?' active':'');
    btn.textContent=sub.name||`Канал ${index+1}`;
    btn.addEventListener('click',()=>selectSubsection(sub.id));
    container.appendChild(btn);
  });
}
function renderAlgaraPriceTable(pc,data){
  data=data||ALGARA_S26_PRICE_DATA;
  const periods=data.periods||[];
  const rooms=data.rooms||[];
  const occupancy=getPricePaidOccupancy(pc);
  const adults=occupancy.effectiveAdults;
  const children=occupancy.effectiveChildren;
  const rows=rooms.map(room=>{
    const cells=periods.map(period=>{
      const priceInfo=getAlgaraPriceInfo(room,adults,children,period,data);
      return priceInfo?`<td><span class="price-table-euro">${escapeHtml(formatPriceEuro(priceInfo.price))}</span><small>${escapeHtml(priceInfo.displayConfig||priceInfo.config)}</small></td>`:`<td class="price-unavailable">${escapeHtml(priceNoAccommodationText(occupancy))}</td>`;
    }).join('');
    return `<tr class="${room.original===pc.selectedRoom?'active':''}"><td>${escapeHtml(room.display||room.original)}</td>${cells}</tr>`;
  }).join('');
  const header=periods.map(period=>`<th><span class="price-period-lines">${String(period.label||'').split('\n').map(line=>`<span>${escapeHtml(line)}</span>`).join('')}</span></th>`).join('');
  const colgroup=`<colgroup><col style="width:var(--price-table-room-col-width)">${periods.map(()=>'<col style="width:var(--price-table-period-col-width)">').join('')}</colgroup>`;
  return `<div class="price-table-wrap"><table class="price-table">${colgroup}<thead><tr><th>Тип стая</th>${header}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
function renderAlgaraPriceContent(week,hotel,sub,container,data){
  if(window.isAlgaraLiteDataset&&window.isAlgaraLiteDataset(data)&&window.renderAlgaraLitePriceContent){
    return window.renderAlgaraLitePriceContent(week,hotel,sub,container,data);
  }
  if(isAlgaraHotel(hotel)){
    container.innerHTML=`<div class="price-placeholder"><strong>${escapeHtml(hotel.name||'Algara Beach')}</strong><br>Алгара вече използва само новия калкулатор за канал <strong>Direct</strong>. Старите ценови таблици и старото смятане са изключени.</div>`;
    return;
  }
  data=data||ALGARA_S26_PRICE_DATA;
  const pc=getPriceCalculatorState(week);
  const rooms=data.rooms||[];
  if((!pc.selectedRoom||!rooms.some(room=>room.original===pc.selectedRoom))&&rooms[0])pc.selectedRoom=rooms[0].original;
  const discountSource=getPriceDiscountSource(pc.reservationDate,week,hotel,sub,data);
  const calculation=calculateAlgaraStayPrice(pc,(discountSource&&discountSource.sub)||sub||{},data);
  calculation.discountSource=discountSource;
  const selectedNights=priceDateList(pc.checkIn,pc.checkOut).length;
  const roomButtons=rooms.map(room=>`<button class="price-room-button ${room.original===pc.selectedRoom?'active':''}" type="button" data-price-room="${escapeAttr(room.original)}">${escapeHtml(room.display||room.original)}</button>`).join('');
  let resultHtml='';
  if(calculation.error){
    resultHtml=`<div class="price-warning">${escapeHtml(calculation.error)}</div>`;
  }else{
    const discountPercents=uniqueNonZeroDiscounts(calculation.nightRows||[]);
    const hasUndiscountedNights=(calculation.nightRows||[]).some(row=>!(Number(row.discount)>0));
    let discountLabel='Отстъпка от канал';
    if(discountPercents.length>1){
      discountLabel+=` (средно ${formatDiscountPercent(weightedAverageDiscount(calculation))})`;
    }else if(discountPercents.length===1){
      discountLabel+=hasUndiscountedNights?` (${formatDiscountPercent(discountPercents[0])} за част от престоя)`: ` (${formatDiscountPercent(discountPercents[0])})`;
    }
    const discountLine=calculation.discountTotal>0
      ? `<div class="price-breakdown-row"><span>${escapeHtml(discountLabel)}</span><strong>-${escapeHtml(formatPriceEuro(calculation.discountTotal))}</strong></div>`
      : `<div class="price-breakdown-row"><span>Отстъпка от канал</span><strong>няма приложена</strong></div>`;
    const discountDetails=renderPriceDiscountDetails(calculation);
    const missing=calculation.missing&&calculation.missing.length
      ? `<div class="price-warning">За следните дати няма намерена цена в таблицата: ${escapeHtml(calculation.missing.map(isoToDisplay).join(', '))}</div>`
      : '';
    const applied=(calculation.nightRows||[]).some(row=>row.discount>0)
      ? `<div class="price-applied-discounts">Приложени са отстъпките от седмицата на датата на резервация, по нощувки. Ако датата на нощувката попада в период с отстъпка, тя се приспада автоматично.</div>`
      : `<div class="price-applied-discounts">За избрания престой няма съвпадение с периодите за отстъпка в седмицата на датата на резервация.</div>`;
    const sourceWeek=discountSource&&discountSource.week?discountSource.week:week;
    const validUntil=sourceWeek&&sourceWeek.endDate?isoToDisplay(sourceWeek.endDate):'';
    const validUntilHtml=validUntil?`<div class="price-valid-until">Отстъпките са според седмица до ${escapeHtml(validUntil)}</div>`:'';
    resultHtml=`<div class="price-result-box">
      <div class="muted">Тотал за ${calculation.nights} нощувки · ${escapeHtml(calculation.room.display||calculation.room.original)} · ${escapeHtml(calculation.config)}</div>
      <div class="price-occupancy-summary">${escapeHtml(renderPriceOccupancySummaryText(calculation.occupancy))}</div>
      ${calculation.formulaNotes&&calculation.formulaNotes.length?`<div class="price-mini-muted">${calculation.formulaNotes.map(note=>escapeHtml(note)).join('<br>')}</div>`:''}
      <div class="price-total">${escapeHtml(formatPriceEuro(calculation.finalTotal))}</div>
      ${validUntilHtml}
      <div class="price-breakdown">
        <div class="price-breakdown-row"><span>Базова цена</span><strong>${escapeHtml(formatPriceEuro(calculation.baseTotal))}</strong></div>
        ${discountLine}
        <div class="price-breakdown-row"><span>Тотал</span><strong>${escapeHtml(formatPriceEuro(calculation.finalTotal))}</strong></div>
      </div>
      ${applied}
      ${discountDetails}
    </div>${missing}`;
  }
  const discountSourceNotice=renderPriceDiscountSourceNotice(discountSource);
  container.innerHTML=`
    <div class="prices-context">
      <span class="price-chip">Хотел: ${escapeHtml(hotel.name||'Алгара Бийч')}</span>
      <span class="price-chip">Канал: ${escapeHtml((sub&&sub.name)||'няма избран канал')}</span>
      <span class="price-chip">Сезон S26</span>
    </div>
    <div class="prices-layout">
      <div class="price-card">
        <h4>Калкулатор</h4>
        <div class="price-controls-grid">
          <div class="full"><label for="priceReservationDate">Дата на резервация</label><input id="priceReservationDate" type="text" inputmode="numeric" data-calendar="true" readonly data-date-iso="${escapeAttr(pc.reservationDate)}" value="${escapeAttr(isoToDisplay(pc.reservationDate))}" /></div>
          <div class="full price-stay-row"><div><label for="priceStayRange">Начало и край на престоя</label><input id="priceStayRange" class="price-stay-range-input" type="text" inputmode="numeric" data-date-range="true" readonly data-from="${escapeAttr(pc.checkIn)}" data-to="${escapeAttr(pc.checkOut)}" value="${escapeAttr(isoToDisplay(pc.checkIn)+' - '+isoToDisplay(pc.checkOut))}" /></div><div class="price-nights-pill"><span>Нощувки</span><strong>${selectedNights}</strong></div></div>
          <div class="price-occupancy-row">
            <div class="price-occupancy-field"><label for="priceAdults">Възрастни</label><select id="priceAdults">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${String(n)===String(pc.adults)?'selected':''}>${n}</option>`).join('')}</select></div>
            <div class="price-occupancy-field"><label for="priceChildren">Деца</label><select id="priceChildren">${[0,1,2,3,4].map(n=>`<option value="${n}" ${String(n)===String(pc.children)?'selected':''}>${n}</option>`).join('')}</select></div>
          </div>
          ${renderPriceChildAgeControls(pc)}
          <div class="full"><label>Тип стая</label><div class="price-room-buttons">${roomButtons}</div></div>
        </div>
        <div class="price-mini-muted">${escapeHtml(getPriceDatasetHotelName(data,hotel))} → ${escapeHtml(getPriceSubsectionLabel(sub))}.</div>
        ${discountSourceNotice}
        <div class="price-discount-source">Цените на стаите са от S26 таблицата. Отстъпките се избират по „Дата на резервация“ от съответната седмица в „Отстъпки по хотели“.</div>
        ${resultHtml}
      </div>
      <div class="price-card price-table-card">
        ${renderPriceTableSettingsPanel()}
        <div class="price-mini-muted">Показват се цените според избраните възрастни и възрастите на децата. За формулните стаи 1+0 и 1+1 се смятат по сезонен коефициент, 1+2 се смята като 2+0. За AP Lux/Beach House и другите големи стаи минималната цена остава базовата конфигурация, например 2+2.</div>
        ${renderAlgaraPriceTable(pc,data)}
      </div>
    </div>`;
  const reservationDate=document.getElementById('priceReservationDate');
  const stayRange=document.getElementById('priceStayRange');
  const adults=document.getElementById('priceAdults');
  const children=document.getElementById('priceChildren');
  setupPriceTableSettingsControls(container);
  if(stayRange)stayRange.addEventListener('rangechange',event=>{
    const detail=event.detail||{};
    if(!detail.from||!detail.to)return;
    const weekNow=getActiveWeek();
    if(!weekNow)return;
    const pcNow=getPriceCalculatorState(weekNow);
    pcNow.checkIn=detail.from;
    pcNow.checkOut=detail.to<=detail.from?toISODate(addDays(parseISODate(detail.from),1)):detail.to;
    touchWeek(weekNow);
    renderPrices();
  });
  if(reservationDate)reservationDate.addEventListener('change',()=>updatePriceCalculatorField('reservationDate',reservationDate.dataset.dateIso||displayToISO(reservationDate.value)||toISODate(new Date())));
  if(adults)adults.addEventListener('change',()=>updatePriceCalculatorField('adults',adults.value));
  if(children)children.addEventListener('change',()=>updatePriceCalculatorField('children',children.value));
  container.querySelectorAll('[data-price-child-age]').forEach(select=>select.addEventListener('change',()=>updatePriceChildAge(Number(select.dataset.priceChildAge),select.value)));
  container.querySelectorAll('[data-price-room]').forEach(btn=>btn.addEventListener('click',()=>updatePriceCalculatorField('selectedRoom',btn.dataset.priceRoom)));
}
function renderGrandVictoriaDirectSettingsPanel(hotel,rooms){
  if(!renderGrandVictoriaDirectSetupContent.settingsOpen)return '';
  const rows=(rooms||[]).map(item=>{
    const room=item.room||{};
    const meta=[
      roomTypeKindLabel(room),
      roomTypeSquareMetersLabel(room),
      roomTypePriceCapacity(room)?'Цена за '+roomTypePriceCapacity(room):'',
      roomTypeCapacityText(room)?'Капацитет '+roomTypeCapacityText(room):'',
      typeof roomTypeServicesText==='function'&&roomTypeServicesText(room,hotel)?'Услуги: '+roomTypeServicesText(room,hotel):''
    ].filter(Boolean);
    return `<div class="grand-victoria-settings-room">
      <strong>${escapeHtml(item.label||('Стая '+(item.index+1)))}</strong>
      <span>${escapeHtml(meta.join(' · ')||'Няма допълнителни данни.')}</span>
    </div>`;
  }).join('') || '<div class="price-warning">Няма въведени типове стаи за Гранд Виктория.</div>';
  return `<div class="algara-lite-settings-host">
    <div class="algara-lite-settings-panel no-print">
      <div class="algara-lite-settings-note">Това са настройките за подготвения калкулатор на Гранд Виктория Direct. Засега показват типовете стаи; ценовите полета ще ги добавим, когато дадеш правилата и цените.</div>
      <div class="grand-victoria-settings-list">${rows}</div>
    </div>
  </div>`;
}
function renderGrandVictoriaDirectSetupContent(week,hotel,sub,container){
  const pc=getPriceCalculatorState(week);
  const roomTypes=Array.isArray(hotel&&hotel.roomTypes)?hotel.roomTypes:[];
  const rooms=roomTypes.map((room,index)=>({room,index,key:room.id||room.name||('room_'+index),label:roomTypeDisplayLabel(room,index)}));
  if((!pc.selectedRoom||!rooms.some(item=>item.key===pc.selectedRoom))&&rooms[0])pc.selectedRoom=rooms[0].key;
  const selected=rooms.find(item=>item.key===pc.selectedRoom)||rooms[0]||null;
  const selectedNights=priceDateList(pc.checkIn,pc.checkOut).length;
  const occupancy=getPricePaidOccupancy(pc);
  const roomButtons=rooms.length
    ? rooms.map(item=>`<button class="price-room-button ${item.key===pc.selectedRoom?'active':''}" type="button" data-price-room="${escapeAttr(item.key)}">${escapeHtml(item.label||('Стая '+(item.index+1)))}</button>`).join('')
    : '<div class="price-placeholder compact">Няма въведени типове стаи за този хотел.</div>';
  const selectedRoom=selected&&selected.room;
  const roomMeta=selectedRoom ? [
    roomTypeKindLabel(selectedRoom),
    roomTypeSquareMetersLabel(selectedRoom),
    roomTypePriceCapacity(selectedRoom)?'Цена за '+roomTypePriceCapacity(selectedRoom):'',
    roomTypeCapacityText(selectedRoom)?'Капацитет '+roomTypeCapacityText(selectedRoom):''
  ].filter(Boolean) : [];
  const services=selectedRoom&&typeof roomTypeServicesText==='function'?roomTypeServicesText(selectedRoom,hotel):'';
  const settingsHtml=renderGrandVictoriaDirectSettingsPanel(hotel,rooms);
  const resultHtml=selectedRoom
    ? `<div class="price-result-box grand-victoria-setup-result">
        <div class="muted">Подготвен калкулатор за ${escapeHtml(hotel.name||'Гранд Виктория')} · ${escapeHtml((sub&&sub.name)||'Direct')}</div>
        <div class="price-total">Очаква ценови правила</div>
        <div class="price-breakdown">
          <div class="price-breakdown-row"><span>Избрана стая</span><strong>${escapeHtml(selected.label)}</strong></div>
          <div class="price-breakdown-row"><span>Престой</span><strong>${selectedNights} нощувки</strong></div>
          <div class="price-breakdown-row"><span>Настаняване</span><strong>${escapeHtml(renderPriceOccupancySummaryText(occupancy))}</strong></div>
          ${roomMeta.map(text=>`<div class="price-breakdown-row"><span>Данни от Типове стаи</span><strong>${escapeHtml(text)}</strong></div>`).join('')}
          ${services?`<div class="price-breakdown-row"><span>Услуги</span><strong>${escapeHtml(services)}</strong></div>`:''}
        </div>
        <div class="price-applied-discounts">Типовете стаи са взети от раздел „Типове стаи“. След като ми дадеш правилата и цените за Гранд Виктория Direct, тук ще започне реалното смятане.</div>
      </div>`
    : `<div class="price-warning">Първо добави типове стаи за Гранд Виктория в раздел „Типове стаи“.</div>`;
  container.innerHTML=`
    <div class="prices-context">
      <span class="price-chip">Хотел: ${escapeHtml(hotel.name||'Гранд Виктория')}</span>
      <span class="price-chip">Канал: ${escapeHtml((sub&&sub.name)||'Direct')}</span>
      <span class="price-chip">Подготовка Direct</span>
    </div>
    <div class="prices-layout algara-lite-layout">
      <div class="price-card algara-lite-calculator-card grand-victoria-setup-card">
        <div class="algara-lite-calculator-topbar">
          <h4>Калкулатор</h4>
          <button id="toggleGrandVictoriaSettingsBtn" class="small" type="button">${renderGrandVictoriaDirectSetupContent.settingsOpen?'Скрий настройките':'Настройки'}</button>
        </div>
        <div class="price-controls-grid">
          <div class="full"><label for="priceReservationDate">Дата на резервация</label><input id="priceReservationDate" type="text" inputmode="numeric" data-calendar="true" readonly data-date-iso="${escapeAttr(pc.reservationDate)}" value="${escapeAttr(isoToDisplay(pc.reservationDate))}" /></div>
          <div class="full price-stay-row"><div><label for="priceStayRange">Начало и край на престоя</label><input id="priceStayRange" class="price-stay-range-input" type="text" inputmode="numeric" data-date-range="true" readonly data-from="${escapeAttr(pc.checkIn)}" data-to="${escapeAttr(pc.checkOut)}" value="${escapeAttr(isoToDisplay(pc.checkIn)+' - '+isoToDisplay(pc.checkOut))}" /></div><div class="price-nights-pill"><span>Нощувки</span><strong>${selectedNights}</strong></div></div>
          <div class="price-occupancy-row">
            <div class="price-occupancy-field"><label for="priceAdults">Възрастни</label><select id="priceAdults">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${String(n)===String(pc.adults)?'selected':''}>${n}</option>`).join('')}</select></div>
            <div class="price-occupancy-field"><label for="priceChildren">Деца</label><select id="priceChildren">${[0,1,2,3,4,5,6].map(n=>`<option value="${n}" ${String(n)===String(pc.children)?'selected':''}>${n}</option>`).join('')}</select></div>
          </div>
          ${renderPriceChildAgeControls(pc)}
          <div class="full price-room-section"><label>Тип стая</label><div class="price-room-buttons">${roomButtons}</div></div>
        </div>
        <div class="price-mini-muted">Гранд Виктория Direct използва S26 база с дневни настройки на цените.</div>
        ${resultHtml}
        ${settingsHtml}
      </div>
    </div>`;
  const reservationDate=container.querySelector('#priceReservationDate');
  const stayRange=container.querySelector('#priceStayRange');
  const adults=container.querySelector('#priceAdults');
  const children=container.querySelector('#priceChildren');
  const settingsBtn=container.querySelector('#toggleGrandVictoriaSettingsBtn');
  if(settingsBtn)settingsBtn.addEventListener('click',()=>{renderGrandVictoriaDirectSetupContent.settingsOpen=!renderGrandVictoriaDirectSetupContent.settingsOpen;renderPrices();});
  if(stayRange)stayRange.addEventListener('rangechange',event=>{
    const detail=event.detail||{};
    if(!detail.from||!detail.to)return;
    const weekNow=getActiveWeek();
    if(!weekNow)return;
    const pcNow=getPriceCalculatorState(weekNow);
    pcNow.checkIn=detail.from;
    pcNow.checkOut=detail.to<=detail.from?toISODate(addDays(parseISODate(detail.from),1)):detail.to;
    touchWeek(weekNow);
    renderPrices();
  });
  if(reservationDate)reservationDate.addEventListener('change',()=>updatePriceCalculatorField('reservationDate',reservationDate.dataset.dateIso||displayToISO(reservationDate.value)||toISODate(new Date())));
  if(adults)adults.addEventListener('change',()=>updatePriceCalculatorField('adults',adults.value));
  if(children)children.addEventListener('change',()=>updatePriceCalculatorField('children',children.value));
  container.querySelectorAll('[data-price-child-age]').forEach(select=>select.addEventListener('change',()=>updatePriceChildAge(Number(select.dataset.priceChildAge),select.value)));
  container.querySelectorAll('[data-price-room]').forEach(btn=>btn.addEventListener('click',()=>updatePriceCalculatorField('selectedRoom',btn.dataset.priceRoom)));
}
const GRAND_VICTORIA_DIRECT_OVERRIDE_KEY='grand_victoria_s26_direct_price_override';
function readGrandVictoriaDirectOverrides(){
  try{
    const parsed=JSON.parse(localStorage.getItem(GRAND_VICTORIA_DIRECT_OVERRIDE_KEY)||'{}');
    return parsed&&typeof parsed==='object'?parsed:{};
  }catch(err){
    return {};
  }
}
function saveGrandVictoriaDirectOverrides(overrides){
  try{localStorage.setItem(GRAND_VICTORIA_DIRECT_OVERRIDE_KEY,JSON.stringify(overrides||{}));}catch(err){}
}
const GRAND_VICTORIA_DIRECT_DAILY_OVERRIDE_KEY='grand_victoria_s26_direct_daily_price_override';
function readGrandVictoriaDirectDailyOverrides(){
  try{
    const parsed=JSON.parse(localStorage.getItem(GRAND_VICTORIA_DIRECT_DAILY_OVERRIDE_KEY)||'{}');
    return parsed&&typeof parsed==='object'?parsed:{};
  }catch(err){
    return {};
  }
}
function saveGrandVictoriaDirectDailyOverrides(overrides){
  try{localStorage.setItem(GRAND_VICTORIA_DIRECT_DAILY_OVERRIDE_KEY,JSON.stringify(overrides||{}));}catch(err){}
}
function isGrandVictoriaPriceData(data){
  return !!data&&String(data.hotel||'').trim()==='Гранд Виктория'&&String(data.season||'').trim()==='S26';
}
function grandVictoriaDirectOverrideKey(roomOriginal,config,periodId){
  return [roomOriginal,config,periodId].join('|||');
}
function grandVictoriaDirectDailyOverrideKey(roomOriginal,config,date){
  return [roomOriginal,config,date].join('|||');
}
function parseGrandVictoriaDirectPrice(value){
  const normalized=String(value||'').trim().replace(/\s/g,'').replace(',','.');
  const price=Number(normalized);
  return Number.isFinite(price)?Math.round(price*100)/100:null;
}
function grandVictoriaDirectPeriodDates(periods){
  const dates=[];
  (periods||[]).forEach(period=>{
    (period.intervals||[]).forEach((interval,intervalIndex)=>{
      if(!interval.start||!interval.end)return;
      let current=parseISODate(interval.start);
      const end=parseISODate(interval.end);
      let offset=0;
      while(current&&end&&current<=end){
        const date=toISODate(current);
        dates.push({date,periodId:period.id,periodLabel:period.label||period.id||'',intervalIndex,offset,intervalLabel:interval.label||''});
        current=addDays(current,1);
        offset+=1;
        if(offset>370)break;
      }
    });
  });
  return dates.sort((a,b)=>String(a.date).localeCompare(String(b.date)));
}
function grandVictoriaDirectIntervalDates(interval){
  const dates=[];
  if(!interval||!interval.start||!interval.end)return dates;
  let current=parseISODate(interval.start);
  const end=parseISODate(interval.end);
  let offset=0;
  while(current&&end&&current<=end){
    dates.push(toISODate(current));
    current=addDays(current,1);
    offset+=1;
    if(offset>370)break;
  }
  return dates;
}
function grandVictoriaDirectMirrorDatesForDate(date,periods){
  let source=null;
  (periods||[]).forEach(period=>{
    (period.intervals||[]).forEach((interval,intervalIndex)=>{
      if(source||!dateInRangeInclusive(date,interval.start,interval.end))return;
      const offset=Math.round((parseISODate(date)-parseISODate(interval.start))/(24*60*60*1000));
      source={period,intervalIndex,offset};
    });
  });
  if(!source)return [];
  return (source.period.intervals||[]).map((interval,intervalIndex)=>{
    if(intervalIndex===source.intervalIndex)return '';
    const target=toISODate(addDays(parseISODate(interval.start),source.offset));
    return dateInRangeInclusive(target,interval.start,interval.end)?target:'';
  }).filter(Boolean);
}
function grandVictoriaDirectBulkMirrorDatesForRange(from,to,periods){
  const selected=new Set(grandVictoriaDirectPeriodDates(periods).filter(item=>item.date>=from&&item.date<=to).map(item=>item.date));
  const mirrors=new Set();
  (periods||[]).forEach(period=>{
    const intervals=period.intervals||[];
    intervals.forEach((interval,intervalIndex)=>{
      const sourceDates=grandVictoriaDirectIntervalDates(interval);
      if(!sourceDates.length||!sourceDates.some(date=>selected.has(date)))return;
      const wholeIntervalSelected=sourceDates.every(date=>selected.has(date));
      intervals.forEach((targetInterval,targetIndex)=>{
        if(targetIndex===intervalIndex)return;
        const targetDates=grandVictoriaDirectIntervalDates(targetInterval);
        if(wholeIntervalSelected){
          targetDates.forEach(date=>mirrors.add(date));
          return;
        }
        sourceDates.forEach((date,offset)=>{
          if(selected.has(date)&&targetDates[offset])mirrors.add(targetDates[offset]);
        });
      });
    });
  });
  return Array.from(mirrors);
}
function getGrandVictoriaDirectDailyPrice(roomOriginal,config,periodId,date,data){
  if(!isGrandVictoriaPriceData(data))return null;
  const daily=(data&&data._gvDailyOverrides)||readGrandVictoriaDirectDailyOverrides();
  const dailyKey=grandVictoriaDirectDailyOverrideKey(roomOriginal,config,date);
  if(daily[dailyKey]!==undefined){
    const price=parseGrandVictoriaDirectPrice(daily[dailyKey]);
    if(price!==null)return price;
  }
  const record=findAlgaraPriceRecord(roomOriginal,config,periodId,data);
  return record?Number(record.price)||0:null;
}
function getGrandVictoriaDirectDisplayPrice(roomOriginal,config,periodId,date,data){
  const price=getGrandVictoriaDirectDailyPrice(roomOriginal,config,periodId,date,data);
  return price===null?'':String(price.toFixed(2)).replace('.',',');
}
function getGrandVictoriaDirectPriceData(){
  const data=JSON.parse(JSON.stringify(GRAND_VICTORIA_S26_PRICE_DATA));
  const overrides=readGrandVictoriaDirectOverrides();
  data._gvDailyOverrides=readGrandVictoriaDirectDailyOverrides();
  (data.records||[]).forEach(record=>{
    const key=grandVictoriaDirectOverrideKey(record.room_original,record.config,record.period_id);
    if(overrides[key]===undefined)return;
    const price=Number(String(overrides[key]).replace(',','.'));
    if(Number.isFinite(price))record.price=Math.round(price*100)/100;
  });
  return data;
}
function setGrandVictoriaDirectPriceOverride(roomOriginal,config,periodId,value){
  const normalized=String(value||'').trim().replace(/\s/g,'').replace(',','.');
  const price=Number(normalized);
  if(!Number.isFinite(price))return;
  const overrides=readGrandVictoriaDirectOverrides();
  overrides[grandVictoriaDirectOverrideKey(roomOriginal,config,periodId)]=Math.round(price*100)/100;
  saveGrandVictoriaDirectOverrides(overrides);
}
function setGrandVictoriaDirectDailyPriceOverride(roomOriginal,config,date,value,copyMirrors=true){
  const price=parseGrandVictoriaDirectPrice(value);
  if(price===null)return;
  const overrides=readGrandVictoriaDirectDailyOverrides();
  const dates=[date];
  if(copyMirrors){
    grandVictoriaDirectMirrorDatesForDate(date,GRAND_VICTORIA_S26_PRICE_DATA.periods).forEach(mirrorDate=>{
      if(!dates.includes(mirrorDate))dates.push(mirrorDate);
    });
  }
  dates.forEach(targetDate=>{
    overrides[grandVictoriaDirectDailyOverrideKey(roomOriginal,config,targetDate)]=price;
  });
  saveGrandVictoriaDirectDailyOverrides(overrides);
}
function setGrandVictoriaDirectBulkPrice(roomOriginal,config,fromDate,toDate,value){
  const price=parseGrandVictoriaDirectPrice(value);
  if(price===null||!fromDate||!toDate)return;
  const from=fromDate<=toDate?fromDate:toDate;
  const to=toDate>=fromDate?toDate:fromDate;
  const targetDates=new Set(grandVictoriaDirectPeriodDates(GRAND_VICTORIA_S26_PRICE_DATA.periods)
    .filter(item=>item.date>=from&&item.date<=to)
    .map(item=>item.date));
  grandVictoriaDirectBulkMirrorDatesForRange(from,to,GRAND_VICTORIA_S26_PRICE_DATA.periods).forEach(date=>targetDates.add(date));
  const overrides=readGrandVictoriaDirectDailyOverrides();
  targetDates.forEach(date=>{
    overrides[grandVictoriaDirectDailyOverrideKey(roomOriginal,config,date)]=price;
  });
  saveGrandVictoriaDirectDailyOverrides(overrides);
}
function resetGrandVictoriaDirectPriceOverrides(){
  try{localStorage.removeItem(GRAND_VICTORIA_DIRECT_OVERRIDE_KEY);}catch(err){}
  try{localStorage.removeItem(GRAND_VICTORIA_DIRECT_DAILY_OVERRIDE_KEY);}catch(err){}
  renderPrices();
}
function renderGrandVictoriaDirectPriceSettings(data){
  const periods=(data&&data.periods)||[];
  const rooms=(data&&data.rooms)||[];
  const dates=grandVictoriaDirectPeriodDates(periods);
  const header=dates.map(item=>`<th><span class="price-period-lines"><span>${escapeHtml(isoToDisplay(item.date))}</span><small>${escapeHtml(item.periodId||'')}</small></span></th>`).join('');
  return rooms.map(room=>{
    const rows=(room.configs||[]).map(config=>{
      const cells=dates.map(item=>{
        const value=getGrandVictoriaDirectDisplayPrice(room.original,config,item.periodId,item.date,data);
        return `<td><input class="algara-lite-price-input" type="text" inputmode="decimal" value="${escapeAttr(value)}" data-gv-price-room="${escapeAttr(room.original)}" data-gv-price-config="${escapeAttr(config)}" data-gv-price-date="${escapeAttr(item.date)}"></td>`;
      }).join('');
      return `<tr><th>${escapeHtml(config)}</th>${cells}</tr>`;
    }).join('');
    return `<section class="algara-lite-room-settings-block">
      <div class="algara-lite-room-settings-title">${escapeHtml(room.display||room.original)}</div>
      <div class="algara-lite-table-wrap">
        <table class="algara-lite-price-table">
          <thead><tr><th>Настаняване</th>${header}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>`;
  }).join('');
}
function renderGrandVictoriaDirectBulkControls(data){
  const dates=grandVictoriaDirectPeriodDates((data&&data.periods)||[]);
  const first=dates[0]&&dates[0].date||'';
  const last=dates[dates.length-1]&&dates[dates.length-1].date||first;
  const options=((data&&data.rooms)||[]).flatMap(room=>(room.configs||[]).map(config=>{
    const value=[room.original,config].join('|||');
    return `<option value="${escapeAttr(value)}">${escapeHtml((room.display||room.original)+' / '+config)}</option>`;
  })).join('');
  if(!options)return '';
  return `<div class="grand-victoria-bulk-panel">
    <label>Стая / настаняване<select id="grandVictoriaBulkTarget">${options}</select></label>
    <label>От дата<input id="grandVictoriaBulkFrom" type="text" inputmode="numeric" data-calendar="true" readonly data-date-iso="${escapeAttr(first)}" value="${escapeAttr(isoToDisplay(first))}"></label>
    <label>До дата<input id="grandVictoriaBulkTo" type="text" inputmode="numeric" data-calendar="true" readonly data-date-iso="${escapeAttr(last)}" value="${escapeAttr(isoToDisplay(last))}"></label>
    <label>Цена<input id="grandVictoriaBulkPrice" type="text" inputmode="decimal" placeholder="0,00"></label>
    <button id="applyGrandVictoriaBulkPricesBtn" class="small success" type="button">Попълни</button>
  </div>`;
}
function renderGrandVictoriaDirectSettingsPanelV2(data){
  if(!renderGrandVictoriaDirectSetupContentV2.settingsOpen)return '';
  const tables=renderGrandVictoriaDirectPriceSettings(data);
  const bulkControls=renderGrandVictoriaDirectBulkControls(data);
  return `<div class="algara-lite-settings-host">
    <div class="algara-lite-settings-panel no-print">
      <div class="algara-lite-settings-topbar">
        <h4>Настройки на цени</h4>
        <button id="resetGrandVictoriaPricesBtn" class="small" type="button">Върни вградените цени</button>
      </div>
      <div class="algara-lite-settings-note">Цените са ден по ден за Гранд Виктория Direct. Когато попълниш дата от огледален период, същата цена се копира и в съответната огледална дата.</div>
      ${bulkControls}
      <div class="algara-lite-all-room-tables">${tables||'<div class="price-warning">Няма въведени цени за Гранд Виктория.</div>'}</div>
    </div>
  </div>`;
}
function renderGrandVictoriaDirectResult(calculation,discountSource,week,hotel,sub){
  if(calculation.error)return `<div class="price-warning">${escapeHtml(calculation.error)}</div>`;
  const hasDiscount=Number(calculation.discountTotal)>0;
  const average=weightedAverageDiscount(calculation);
  const discountSourceNotice=renderPriceDiscountSourceNotice(discountSource);
  const discountDetails=renderPriceDiscountDetails(calculation);
  const missing=calculation.missing&&calculation.missing.length
    ? `<div class="price-warning">За следните дати няма намерена цена: ${escapeHtml(calculation.missing.map(isoToDisplay).join(', '))}</div>`
    : '';
  const sourceWeek=discountSource&&discountSource.week?discountSource.week:week;
  const validUntil=sourceWeek&&sourceWeek.endDate?isoToDisplay(sourceWeek.endDate):'';
  return `${discountSourceNotice}
    <div class="price-result-box grand-victoria-setup-result algara-lite-result">
      <div class="muted">Тотал за ${calculation.nights} нощувки · ${escapeHtml(calculation.room.display||calculation.room.original)} · ${escapeHtml(calculation.config)}</div>
      <div class="price-occupancy-summary">${escapeHtml(renderPriceOccupancySummaryText(calculation.occupancy))}</div>
      ${calculation.formulaNotes&&calculation.formulaNotes.length?`<div class="price-mini-muted">${calculation.formulaNotes.map(note=>escapeHtml(note)).join('<br>')}</div>`:''}
      <div class="algara-lite-price-pair">
        ${hasDiscount?`<div class="algara-lite-old-price"><span>Реална цена</span><del>${escapeHtml(formatPriceEuro(calculation.baseTotal))}</del></div>`:''}
        <div class="algara-lite-final-price"><span>${hasDiscount?'Нова цена':'Цена'}</span><strong>${escapeHtml(formatPriceEuro(calculation.finalTotal))}</strong></div>
        ${hasDiscount?`<div class="algara-lite-average"><span>Средна отстъпка:</span><strong>${escapeHtml(formatDiscountPercent(average))}</strong></div>`:''}
      </div>
      ${validUntil?`<div class="price-valid-until">Отстъпките са според седмица до ${escapeHtml(validUntil)}</div>`:''}
      <div class="price-breakdown">
        <div class="price-breakdown-row"><span>Базова цена</span><strong>${escapeHtml(formatPriceEuro(calculation.baseTotal))}</strong></div>
        <div class="price-breakdown-row"><span>Отстъпка от канала</span><strong>${hasDiscount?'-'+escapeHtml(formatPriceEuro(calculation.discountTotal)):'няма приложена'}</strong></div>
        <div class="price-breakdown-row"><span>Крайна цена</span><strong>${escapeHtml(formatPriceEuro(calculation.finalTotal))}</strong></div>
      </div>
      <div class="price-applied-discounts">${hasDiscount?'Отстъпките се прилагат по нощувки според датата на резервация и периодите в раздел „Отстъпки по хотели“.':'За избрания престой няма намерена приложима отстъпка според датата на резервация.'}</div>
      ${discountDetails}
    </div>${missing}`;
}
function renderGrandVictoriaDirectSetupContentV2(week,hotel,sub,container){
  const data=getGrandVictoriaDirectPriceData();
  const pc=getPriceCalculatorState(week);
  const rooms=(data&&data.rooms)||[];
  if((!pc.selectedRoom||!rooms.some(room=>room.original===pc.selectedRoom))&&rooms[0])pc.selectedRoom=rooms[0].original;
  const selectedNights=priceDateList(pc.checkIn,pc.checkOut).length;
  const roomButtons=rooms.length
    ? rooms.map(room=>`<button class="price-room-button ${room.original===pc.selectedRoom?'active':''}" type="button" data-price-room="${escapeAttr(room.original)}">${escapeHtml(room.display||room.original)}</button>`).join('')
    : '<div class="price-placeholder compact">Няма въведени цени за този хотел.</div>';
  const discountSource=getPriceDiscountSource(pc.reservationDate,week,hotel,sub,data);
  const calculation=calculateAlgaraStayPrice(pc,(discountSource&&discountSource.sub)||sub||{},data);
  const settingsHtml=renderGrandVictoriaDirectSettingsPanelV2(data);
  const resultHtml=renderGrandVictoriaDirectResult(calculation,discountSource,week,hotel,sub);
  container.innerHTML=`
    <div class="prices-context">
      <span class="price-chip">Хотел: ${escapeHtml(hotel.name||'Гранд Виктория')}</span>
      <span class="price-chip">Канал: ${escapeHtml((sub&&sub.name)||'Direct')}</span>
      <span class="price-chip">Сезон S26</span>
    </div>
    <div class="prices-layout algara-lite-layout">
      <div class="price-card algara-lite-calculator-card grand-victoria-setup-card">
        <div class="algara-lite-calculator-topbar">
          <h4>Калкулатор</h4>
          <button id="toggleGrandVictoriaSettingsBtn" class="small" type="button">${renderGrandVictoriaDirectSetupContentV2.settingsOpen?'Скрий настройките':'Настройки'}</button>
        </div>
        <div class="price-controls-grid">
          <div class="full"><label for="priceReservationDate">Дата на резервация</label><input id="priceReservationDate" type="text" inputmode="numeric" data-calendar="true" readonly data-date-iso="${escapeAttr(pc.reservationDate)}" value="${escapeAttr(isoToDisplay(pc.reservationDate))}" /></div>
          <div class="full price-stay-row"><div><label for="priceStayRange">Начало и край на престоя</label><input id="priceStayRange" class="price-stay-range-input" type="text" inputmode="numeric" data-date-range="true" readonly data-from="${escapeAttr(pc.checkIn)}" data-to="${escapeAttr(pc.checkOut)}" value="${escapeAttr(isoToDisplay(pc.checkIn)+' - '+isoToDisplay(pc.checkOut))}" /></div><div class="price-nights-pill"><span>Нощувки</span><strong>${selectedNights}</strong></div></div>
          <div class="price-occupancy-row">
            <div class="price-occupancy-field"><label for="priceAdults">Възрастни</label><select id="priceAdults">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${String(n)===String(pc.adults)?'selected':''}>${n}</option>`).join('')}</select></div>
            <div class="price-occupancy-field"><label for="priceChildren">Деца</label><select id="priceChildren">${[0,1,2,3,4,5,6].map(n=>`<option value="${n}" ${String(n)===String(pc.children)?'selected':''}>${n}</option>`).join('')}</select></div>
          </div>
          ${renderPriceChildAgeControls(pc)}
          <div class="full price-room-section"><label>Тип стая</label><div class="price-room-buttons">${roomButtons}</div></div>
        </div>
        <div class="price-mini-muted">Цените са от вградената S26 таблица за Гранд Виктория Direct. Настройките са скрити и се използват само за преизчисляване.</div>
        ${resultHtml}
        ${settingsHtml}
      </div>
    </div>`;
  const reservationDate=container.querySelector('#priceReservationDate');
  const stayRange=container.querySelector('#priceStayRange');
  const adults=container.querySelector('#priceAdults');
  const children=container.querySelector('#priceChildren');
  const settingsBtn=container.querySelector('#toggleGrandVictoriaSettingsBtn');
  const resetBtn=container.querySelector('#resetGrandVictoriaPricesBtn');
  if(settingsBtn)settingsBtn.addEventListener('click',()=>{renderGrandVictoriaDirectSetupContentV2.settingsOpen=!renderGrandVictoriaDirectSetupContentV2.settingsOpen;renderPrices();});
  if(resetBtn)resetBtn.addEventListener('click',resetGrandVictoriaDirectPriceOverrides);
  container.querySelectorAll('[data-gv-price-date]').forEach(input=>{
    input.addEventListener('change',()=>{
      setGrandVictoriaDirectDailyPriceOverride(input.dataset.gvPriceRoom,input.dataset.gvPriceConfig,input.dataset.gvPriceDate,input.value,true);
      renderPrices();
    });
  });
  const bulkBtn=container.querySelector('#applyGrandVictoriaBulkPricesBtn');
  if(bulkBtn)bulkBtn.addEventListener('click',()=>{
    const target=container.querySelector('#grandVictoriaBulkTarget');
    const from=container.querySelector('#grandVictoriaBulkFrom');
    const to=container.querySelector('#grandVictoriaBulkTo');
    const price=container.querySelector('#grandVictoriaBulkPrice');
    const parts=String(target&&target.value||'').split('|||');
    if(parts.length<2)return;
    setGrandVictoriaDirectBulkPrice(parts[0],parts.slice(1).join('|||'),from&&from.dataset.dateIso, to&&to.dataset.dateIso, price&&price.value);
    renderPrices();
  });
  if(stayRange)stayRange.addEventListener('rangechange',event=>{
    const detail=event.detail||{};
    if(!detail.from||!detail.to)return;
    const weekNow=getActiveWeek();
    if(!weekNow)return;
    const pcNow=getPriceCalculatorState(weekNow);
    pcNow.checkIn=detail.from;
    pcNow.checkOut=detail.to<=detail.from?toISODate(addDays(parseISODate(detail.from),1)):detail.to;
    touchWeek(weekNow);
    renderPrices();
  });
  if(reservationDate)reservationDate.addEventListener('change',()=>updatePriceCalculatorField('reservationDate',reservationDate.dataset.dateIso||displayToISO(reservationDate.value)||toISODate(new Date())));
  if(adults)adults.addEventListener('change',()=>updatePriceCalculatorField('adults',adults.value));
  if(children)children.addEventListener('change',()=>updatePriceCalculatorField('children',children.value));
  container.querySelectorAll('[data-price-child-age]').forEach(select=>select.addEventListener('change',()=>updatePriceChildAge(Number(select.dataset.priceChildAge),select.value)));
  container.querySelectorAll('[data-price-room]').forEach(btn=>btn.addEventListener('click',()=>updatePriceCalculatorField('selectedRoom',btn.dataset.priceRoom)));
}
function renderPrices(){
  const week=getActiveWeek();
  const hotelTabs=document.getElementById('priceHotelTabs');
  const subsectionTabs=document.getElementById('priceSubsectionTabs');
  const container=document.getElementById('priceCalculatorContent');
  if(!container)return;
  const hotel=getSelectedHotel(week);
  const sub=getSelectedSubsection(hotel);
  renderPriceHotelTabs(week,hotelTabs);
  renderPriceSubsectionTabs(hotel,subsectionTabs);
  if(!week||!hotel){
    container.innerHTML='<div class="price-placeholder">Няма избран хотел.</div>';
    return;
  }
  if(isGrandVictoriaHotel(hotel)&&isDirectPriceSubsection(sub)){
    renderGrandVictoriaDirectSetupContentV2(week,hotel,sub,container);
    return;
  }
  const priceData=getPriceDatasetForHotel(hotel,sub);
  if(!priceData){
    if(isAlgaraHotel(hotel)){
      container.innerHTML=`<div class="price-placeholder"><strong>${escapeHtml(hotel.name||'Algara Beach')}</strong><br>Алгара вече използва само новия калкулатор за канал <strong>Direct</strong>. Старите ценови таблици и старото смятане са изключени.</div>`;
      return;
    }
    container.innerHTML=`<div class="price-placeholder"><strong>${escapeHtml(hotel.name||'Избран хотел')}</strong><br>За този хотел още няма въведена ценова таблица. Когато ми подадеш цените, ще ги добавим тук и секцията ще се сменя автоматично при избора на хотела.</div>`;
    return;
  }
  if(!isSupportedPriceSubsection(sub)){
    container.innerHTML=`<div class="price-placeholder"><strong>${escapeHtml(hotel.name||getPriceDatasetHotelName(priceData,hotel))}</strong><br>Ценовата таблица S26 за този хотел е въведена за каналите <strong>Direct</strong> и <strong>Booking/Expedia</strong>. Смени канала на Direct или Booking, за да се показват цените и калкулаторът.</div>`;
    return;
  }
  renderAlgaraPriceContent(week,hotel,sub,container,priceData);
}


function hotelCancellationKey(hotel){
  const raw=(hotel&&(hotel.name||hotel.id))?String(hotel.name||hotel.id):'hotel';
  return raw.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^\w\u0400-\u04ff-]+/g,'').slice(0,80)||((hotel&&hotel.id)||'hotel');
}
function cancellationChannelKey(channel){
  const raw=(channel&&(channel.name||channel.id))?String(channel.name||channel.id):'direct';
  return raw.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^\w\u0400-\u04ff-]+/g,'').slice(0,80)||((channel&&channel.id)||'direct');
}
function defaultCancellationCriteria(){
  return [
    {id:uid()+'_cancrit_free',name:'Безплатна анулация',fromDays:'31',toDays:'999',action:'free',percent:'',note:'Безплатна анулация.'},
    {id:uid()+'_cancrit_percent',name:'50% санкция',fromDays:'8',toDays:'30',action:'percent',percent:'50',note:'Санкция процент от стойността на резервацията.'},
    {id:uid()+'_cancrit_nonref',name:'Невъзвращаема стойност',fromDays:'0',toDays:'7',action:'nonrefundable',percent:'100',note:'Невъзвращаема стойност.'}
  ];
}
function normalizeCancellationDays(value,fallback){
  const raw=(value===undefined||value===null||value==='')?fallback:value;
  const n=parseInt(String(raw||'').replace(/[^0-9]/g,''),10);
  return Number.isFinite(n)?String(Math.max(0,n)):String(fallback||0);
}
function normalizeCancellationAction(value){
  const raw=String(value||'percent').toLowerCase();
  if(raw==='free'||raw==='безплатно')return'free';
  if(raw==='nonrefundable'||raw==='non_refundable'||raw==='no_refund'||raw==='невъзвращаема'||raw==='невъзстановима')return'nonrefundable';
  return'percent';
}
function defaultCancellationPeriods(){
  return [];
}
function normalizeCancellationPeriod(item,index){
  const p=item||{};
  const today=todayISO?todayISO():toISODate(new Date());
  const year=(p.fromDate&&parseISODate(p.fromDate).getFullYear())||(p.toDate&&parseISODate(p.toDate).getFullYear())||(new Date()).getFullYear();
  const fromDate=p.fromDate||p.from||p.startDate||p.start||displayToISO(p.fromDisplay||'01.05',year)||`${year}-05-01`;
  const toDate=p.toDate||p.to||p.endDate||p.end||displayToISO(p.toDisplay||'15.05',year)||`${year}-05-15`;
  const action=normalizeCancellationAction(p.action||p.kind||p.chargeType||'percent');
  return {
    id:p.id||uid()+'_canperiod_'+index,
    name:String(p.name||p.title||p.label||('Период '+(index+1))),
    fromDate,
    toDate,
    days:normalizeCancellationDays(p.days!==undefined?p.days:(p.cancelDays!==undefined?p.cancelDays:p.cancellationDays),3),
    action,
    percent:action==='free'?'':String(p.percent||p.penalty||p.value||(action==='nonrefundable'?'100':'50')),
    note:String(p.note||p.description||'')
  };
}
function normalizeCancellationPeriods(items){
  const source=Array.isArray(items)?items:[];
  return source.map(normalizeCancellationPeriod).filter(p=>p&&p.fromDate&&p.toDate);
}
function normalizeCancellationCriterion(item,index){
  const c=item||{};
  let from=c.fromDays!==undefined?c.fromDays:(c.minDays!==undefined?c.minDays:c.from);
  let to=c.toDays!==undefined?c.toDays:(c.maxDays!==undefined?c.maxDays:c.to);
  const oldMode=String(c.mode||c.type||c.period||'');
  const oldDays=c.daysBefore||c.days||c.beforeDays;
  if((from===undefined||to===undefined)&&oldMode){
    if(oldMode==='beforeOrMore'){
      from=oldDays||30; to=999;
    }else if(oldMode==='noShow'){
      from=0; to=0;
    }else{
      from=0; to=oldDays||30;
    }
  }
  const action=normalizeCancellationAction(c.action||c.chargeType||c.kind);
  const percent=action==='free'?'':String(c.percent||c.penalty||c.value||(action==='nonrefundable'?'100':''));
  const fallbackName=action==='free'?'Безплатна анулация':(action==='nonrefundable'?'Невъзвращаема стойност':'Санкция');
  return {
    id:c.id||uid()+'_cancrit_'+index,
    name:String(c.name||c.title||c.label||fallbackName),
    fromDays:normalizeCancellationDays(from,0),
    toDays:normalizeCancellationDays(to,30),
    action,
    percent,
    note:String(c.note||c.description||'')
  };
}
function normalizeCancellationPolicy(item){
  const policy=item||{};
  const criteria=Array.isArray(policy.criteria)?policy.criteria.map(normalizeCancellationCriterion):defaultCancellationCriteria();
  return {
    locked:!!policy.locked,
    bookingDate:policy.bookingDate||policy.reservationDate||policy.checkDate||todayISO(),
    checkInDate:policy.checkInDate||policy.arrivalDate||toISODate(new Date()),
    periodModeEnabled:!!(policy.periodModeEnabled||policy.useCancellationPeriods||policy.periodsEnabled),
    cancellationPeriods:normalizeCancellationPeriods(policy.cancellationPeriods||policy.periods||policy.periodRules||[]),
    criteria:criteria.length?criteria:defaultCancellationCriteria()
  };
}

function normalizeCancellationChannel(item,index){
  if(typeof item==='string')item={name:item};
  const ch=item||{};
  const rawName=String(ch.name||ch.title||ch.label||ch.id||('Канал '+(index+1))).trim();
  const id=String(ch.id||cancellationChannelKey({name:rawName})||uid()+'_canch_'+index).trim();
  return {id:id||uid()+'_canch_'+index,name:rawName||('Канал '+(index+1))};
}
function defaultCancellationChannels(){
  return [{id:'direct',name:'Direct'}];
}
function channelNameFromKey(key){
  const raw=String(key||'').trim();
  if(!raw)return'Канал';
  const known={direct:'Direct',booking:'Booking',other:'Other'};
  if(known[raw])return known[raw];
  return raw.replace(/[_-]+/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
}
function normalizeCancellationChannelList(entry){
  const channels=[];
  const add=(item,index)=>{
    const normalized=normalizeCancellationChannel(item,index);
    if(!channels.some(ch=>ch.id===normalized.id))channels.push(normalized);
  };
  if(Array.isArray(entry.customChannels))entry.customChannels.forEach(add);
  else if(Array.isArray(entry.channelsList))entry.channelsList.forEach(add);
  else if(Array.isArray(entry.channelTabs))entry.channelTabs.forEach(add);
  if(!channels.length&&entry.channels&&typeof entry.channels==='object'){
    Object.keys(entry.channels).forEach((key,index)=>add({id:key,name:channelNameFromKey(key)},index));
  }
  if(!channels.length)defaultCancellationChannels().forEach(add);
  return channels;
}
function normalizeCancellationHotelEntry(item){
  const entry=item||{};
  const channels={};
  if(entry.channels&&typeof entry.channels==='object'){
    Object.keys(entry.channels).forEach(key=>{channels[key]=normalizeCancellationPolicy(entry.channels[key]);});
  }else if(entry.byChannel&&typeof entry.byChannel==='object'){
    Object.keys(entry.byChannel).forEach(key=>{channels[key]=normalizeCancellationPolicy(entry.byChannel[key]);});
  }else{
    const maybeOldPolicy=entry.criteria||entry.checkInDate||entry.freeCancellation||entry.noShowPercent||entry.locked;
    if(maybeOldPolicy)channels.direct=normalizeCancellationPolicy(entry);
  }
  const customChannels=normalizeCancellationChannelList({...entry,channels});
  customChannels.forEach(ch=>{if(!channels[ch.id])channels[ch.id]=normalizeCancellationPolicy({});});
  let selected=entry.selectedChannelKey||entry.selectedChannelId||'';
  if(!customChannels.some(ch=>ch.id===selected))selected=customChannels[0]?customChannels[0].id:'';
  const selectedPolicy=selected&&channels[selected]?channels[selected]:(Object.values(channels)[0]||{});
  const checkInDate=entry.checkInDate||entry.evaluationCheckInDate||selectedPolicy.checkInDate||toISODate(new Date());
  return {selectedChannelKey:selected,customChannels,channels,checkInDate};
}
function normalizeCancellationPolicies(input){
  const source=input||{};
  const hotelsSource=source.hotels||source.byHotel||{};
  const hotels={};
  Object.keys(hotelsSource||{}).forEach(key=>{hotels[key]=normalizeCancellationHotelEntry(hotelsSource[key]);});
  return {
    selectedHotelKey:source.selectedHotelKey||source.selectedHotelId||'',
    presetVersion:source.presetVersion||source.cancellationPresetVersion||'',
    hotels
  };
}



function shortDisplayDate(value){
  if(!value)return '';
  const raw=String(value||'').trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(raw))return isoToDisplay(raw);
  const iso=displayToISO(raw,new Date().getFullYear());
  return iso?isoToDisplay(iso):raw.slice(0,5);
}
function normalizeDiscountReservationDateISO(value){
  if(!value)return '';
  const raw=String(value||'').trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(raw))return raw;
  return displayToISO(raw,new Date().getFullYear())||'';
}
function sanitizeDiscountReservationClockNumber(value){
  return String(value===undefined||value===null?'':value).replace(/\D/g,'').slice(0,6);
}
function compactDiscountReservationClockNumbers(values){
  const cleaned=[];
  (Array.isArray(values)?values:[]).forEach(value=>{
    const raw=sanitizeDiscountReservationClockNumber(value);
    if(raw&&!cleaned.includes(raw))cleaned.push(raw);
  });
  return cleaned.filter(value=>{
    const hasLonger=cleaned.some(other=>other!==value&&other.startsWith(value));
    if(!hasLonger)return true;
    if(value.length<5)return false;
    const hasShorterPrefix=cleaned.some(other=>other!==value&&value.startsWith(other)&&other.length<value.length);
    return !hasShorterPrefix;
  });
}
function discountReservationRawClockValues(item){
  const values=[];
  let hasArraySource=false;
  const add=value=>values.push(sanitizeDiscountReservationClockNumber(value));
  if(item&&Array.isArray(item.clockNumbers)){
    hasArraySource=true;
    item.clockNumbers.forEach(add);
  }
  if(item&&Array.isArray(item.clockNumberList)){
    hasArraySource=true;
    item.clockNumberList.forEach(add);
  }
  if(item&&Array.isArray(item.clockNumbersList)){
    hasArraySource=true;
    item.clockNumbersList.forEach(add);
  }
  const legacy=item&&(item.clockNumber||item.clockReservationNumber||item.reservationNumber||item.clockNo||item.clockId);
  if(!hasArraySource&&legacy!==undefined&&legacy!==null){
    String(legacy).split(/[,\s;|]+/).forEach(add);
  }
  return values;
}
function normalizeDiscountReservationClockNumbers(item){
  return compactDiscountReservationClockNumbers(discountReservationRawClockValues(item));
}
function syncDiscountReservationClockNumber(item){
  if(!item)return;
  const source=Array.isArray(item.clockNumbers)?item.clockNumbers:discountReservationRawClockValues(item);
  const clocks=compactDiscountReservationClockNumbers(source);
  item.clockNumbers=clocks;
  item.clockNumber=clocks.join(', ');
}
function discountReservationClockEditorValues(item){
  const raw=discountReservationRawClockValues(item);
  if(raw.length){
    const clocks=compactDiscountReservationClockNumbers(raw);
    const emptyCount=item&&item.isEditing?raw.filter(value=>!value).length:0;
    for(let i=0;i<emptyCount;i+=1)clocks.push('');
    return clocks;
  }
  return normalizeDiscountReservationClockNumbers(item);
}
function discountReservationClockText(item){
  return normalizeDiscountReservationClockNumbers(item).join(', ');
}
function normalizeDiscountReservationPercent(value){
  return String(value===undefined||value===null?'':value).replace(/%/g,'').trim().slice(0,20);
}
function normalizeDiscountReservations(items){
  const normalized=(Array.isArray(items)?items:[]).map((item,index)=>{
    const checkInISO=item&&(item.checkInISO||item.checkInDateISO||item.checkInDate)?String(item.checkInISO||item.checkInDateISO||item.checkInDate):normalizeDiscountReservationDateISO(item&&(item.checkIn||item.chin||item.fromDate));
    const checkOutISO=item&&(item.checkOutISO||item.checkOutDateISO||item.checkOutDate)?String(item.checkOutISO||item.checkOutDateISO||item.checkOutDate):normalizeDiscountReservationDateISO(item&&(item.checkOut||item.chout||item.toDate));
    const createdAt=item&&item.createdAt?String(item.createdAt):new Date(Date.now()-index).toISOString();
    const rawAutoNumber=item&&(item.autoNumber!==undefined||item.number!==undefined||item.no!==undefined)?Number(item.autoNumber!==undefined?item.autoNumber:(item.number!==undefined?item.number:item.no)):NaN;
    const rawClockNumbers=item&&Array.isArray(item.clockNumbers)
      ? item.clockNumbers.map(value=>sanitizeDiscountReservationClockNumber(value))
      : null;
    const clockNumbers=rawClockNumbers&&rawClockNumbers.length&&item&&item.isEditing
      ? discountReservationClockEditorValues(item)
      : normalizeDiscountReservationClockNumbers(item);
    const rawQuendooNumber=item&&(item.quendooNumber!==undefined||item.quendoo!==undefined||item.quendooNo!==undefined||item.quendooId!==undefined||item.quendooReservationNumber!==undefined)
      ? (item.quendooNumber!==undefined?item.quendooNumber:(item.quendoo!==undefined?item.quendoo:(item.quendooNo!==undefined?item.quendooNo:(item.quendooId!==undefined?item.quendooId:item.quendooReservationNumber))))
      : '';
    return {
      id:item&&item.id?String(item.id):uid()+'_dr_'+index,
      hotel:item&&item.hotel?String(item.hotel):'',
      reservationDate:item&&(item.reservationDate||item.createdDate||item.bookingDate||item.creationDate)?shortDisplayDate(item.reservationDate||item.createdDate||item.bookingDate||item.creationDate):'',
      clockNumber:clockNumbers.filter(Boolean).join(', '),
      clockNumbers,
      quendooNumber:rawQuendooNumber===undefined||rawQuendooNumber===null?'':String(rawQuendooNumber).trim(),
      guestName:item&&(item.guestName||item.guest||item.names)?String(item.guestName||item.guest||item.names):'',
      checkInISO,
      checkOutISO,
      checkIn:checkInISO?isoToDisplay(checkInISO):(item&&(item.checkIn||item.chin||item.fromDate)?shortDisplayDate(item.checkIn||item.chin||item.fromDate):''),
      checkOut:checkOutISO?isoToDisplay(checkOutISO):(item&&(item.checkOut||item.chout||item.toDate)?shortDisplayDate(item.checkOut||item.chout||item.toDate):''),
      roomType:item&&(item.roomType||item.room||item.type)?String(item.roomType||item.room||item.type):'',
      price:item&&item.price!==undefined?String(item.price):'',
      discount:item&&item.discount!==undefined?normalizeDiscountReservationPercent(item.discount):'',
      comment:item&&(item.comment||item.note||item.text)?String(item.comment||item.note||item.text):'',
      isEditing:item&&item.isEditing!==undefined?!!item.isEditing:false,
      createdAt,
      updatedAt:item&&item.updatedAt?String(item.updatedAt):(item&&item.createdAt?String(item.createdAt):new Date().toISOString()),
      autoNumber:Number.isFinite(rawAutoNumber)&&rawAutoNumber>0?Math.floor(rawAutoNumber):null,
      customFields:item&&item.customFields&&typeof item.customFields==='object'?Object.fromEntries(Object.entries(item.customFields).map(([k,v])=>[String(k),String(v===undefined||v===null?'':v)])):{}
    };
  });
  const used=new Set(normalized.filter(item=>item.autoNumber).map(item=>item.autoNumber));
  let next=1;
  normalized
    .filter(item=>!item.autoNumber)
    .sort((a,b)=>new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime())
    .forEach(item=>{
      while(used.has(next))next+=1;
      item.autoNumber=next;
      used.add(next);
    });
  return normalized.sort((a,b)=>{
    const ad=new Date(a.createdAt).getTime();
    const bd=new Date(b.createdAt).getTime();
    if(ad!==bd)return bd-ad;
    return (Number(b.autoNumber)||0)-(Number(a.autoNumber)||0);
  });
}
function ensureDiscountReservations(){
  if(!state)return [];
  state.discountReservations=normalizeDiscountReservations(state.discountReservations||state.reservationsWithDiscounts||state.discountedReservations||[]);
  delete state.reservationsWithDiscounts;
  delete state.discountedReservations;
  return state.discountReservations;
}
function formatDiscountReservationCreatedAt(value){
  const date=value?new Date(value):null;
  if(!date||Number.isNaN(date.getTime()))return '';
  return date.toLocaleString('bg-BG',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
}
function formatDiscountReservationDateToday(){
  const d=new Date();
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;
}
function discountReservationNights(item){
  if(!item||!item.checkInISO||!item.checkOutISO)return '';
  const days=diffDays(item.checkInISO,item.checkOutISO);
  return days>0?String(days):'';
}
function addDiscountReservation(){
  const list=ensureDiscountReservations();
  const now=new Date().toISOString();
  const nextNumber=list.reduce((max,item)=>Math.max(max,Number(item.autoNumber)||0),0)+1;
  list.unshift({id:uid()+'_dr',hotel:'',reservationDate:formatDiscountReservationDateToday(),clockNumber:'',clockNumbers:[],quendooNumber:'',guestName:'',checkInISO:'',checkOutISO:'',checkIn:'',checkOut:'',roomType:'',price:'',discount:'',comment:'',customFields:{},isEditing:true,createdAt:now,updatedAt:now,autoNumber:nextNumber});
  saveStateSafe();
  renderDiscountReservations();
  window.setTimeout(()=>{
    const first=document.querySelector('#discountReservationsList [data-discount-reservation-field="guestName"]')||document.querySelector('#discountReservationsList [data-discount-reservation-field="hotel"]');
    if(first)first.focus();
  },20);
}
function setDiscountReservationEditing(id,isEditing){
  const item=ensureDiscountReservations().find(r=>r.id===id);
  if(!item)return;
  item.isEditing=!!isEditing;
  item.updatedAt=new Date().toISOString();
  saveStateSafe();
  renderDiscountReservations();
}
function isDiscountReservationEditable(id){
  const item=ensureDiscountReservations().find(r=>r.id===id);
  return !!(item&&item.isEditing);
}
function updateDiscountReservation(id,field,value,options={}){
  const item=ensureDiscountReservations().find(r=>r.id===id);
  if(!item||!item.isEditing)return;
  if(field==='reservationDate')value=shortDisplayDate(value);
  if(field==='discount')value=normalizeDiscountReservationPercent(value);
  if(field==='clockNumber'){
    const clocks=compactDiscountReservationClockNumbers(String(value||'').split(/[,\s;|]+/));
    item.clockNumbers=[...new Set(clocks)];
    item.clockNumber=item.clockNumbers.join(', ');
  }else{
    item[field]=value;
  }
  item.updatedAt=new Date().toISOString();
  if(options&&options.deferred)scheduleSilentStateSave();
  else saveStateSafe();
  const summary=document.getElementById('discountReservationsSummary');
  if(summary)summary.textContent=`Общо: ${ensureDiscountReservations().length} резервации`;
}
function updateDiscountReservationClock(id,index,value,options={}){
  const item=ensureDiscountReservations().find(r=>r.id===id);
  if(!item||!item.isEditing)return;
  const clocks=normalizeDiscountReservationClockNumbers(item);
  while(clocks.length<=index)clocks.push('');
  clocks[index]=sanitizeDiscountReservationClockNumber(value);
  item.clockNumbers=clocks.map(clock=>sanitizeDiscountReservationClockNumber(clock));
  syncDiscountReservationClockNumber(item);
  item.updatedAt=new Date().toISOString();
  if(options&&options.deferred)scheduleSilentStateSave();
  else saveStateSafe();
}
function addDiscountReservationClock(id){
  const item=ensureDiscountReservations().find(r=>r.id===id);
  if(!item||!item.isEditing)return;
  const clocks=discountReservationClockEditorValues(item);
  if(!clocks.length)clocks.push('');
  clocks.push('');
  item.clockNumbers=clocks;
  item.clockNumber=clocks.filter(Boolean).join(', ');
  item.updatedAt=new Date().toISOString();
  saveStateSafe();
  renderDiscountReservations();
  window.setTimeout(()=>{
    const inputs=document.querySelectorAll(`[data-discount-reservation-id="${CSS.escape(id)}"] [data-discount-reservation-clock-index]`);
    const last=inputs[inputs.length-1];
    if(last)last.focus();
  },20);
}
function removeDiscountReservationClock(id,index){
  const item=ensureDiscountReservations().find(r=>r.id===id);
  if(!item||!item.isEditing)return;
  const clocks=normalizeDiscountReservationClockNumbers(item);
  clocks.splice(index,1);
  item.clockNumbers=clocks;
  syncDiscountReservationClockNumber(item);
  item.updatedAt=new Date().toISOString();
  saveStateSafe();
  renderDiscountReservations();
}
function updateDiscountReservationCustomField(id,key,value,options={}){
  const item=ensureDiscountReservations().find(r=>r.id===id);
  if(!item||!item.isEditing||!isDiscountReservationCustomLayoutKey(key))return;
  if(!item.customFields||typeof item.customFields!=='object')item.customFields={};
  item.customFields[key]=String(value||'');
  item.updatedAt=new Date().toISOString();
  if(options&&options.deferred)scheduleSilentStateSave();
  else saveStateSafe();
}
function updateDiscountReservationRange(id,from,to){
  const item=ensureDiscountReservations().find(r=>r.id===id);
  if(!item||!item.isEditing)return;
  item.checkInISO=from||'';
  item.checkOutISO=to||'';
  item.checkIn=from?isoToDisplay(from):'';
  item.checkOut=to?isoToDisplay(to):'';
  item.updatedAt=new Date().toISOString();
  saveStateSafe();
  renderDiscountReservations();
}
function deleteDiscountReservation(id){
  const item=ensureDiscountReservations().find(r=>r.id===id);
  const label=item&&(item.guestName||item.hotel||item.roomType)?` за ${item.guestName||item.hotel||item.roomType}`:'';
  if(!confirm('Да изтрия ли резервацията'+label+'?'))return;
  state.discountReservations=ensureDiscountReservations().filter(r=>r.id!==id);
  saveStateSafe();
  renderDiscountReservations();
}
function autoResizeDiscountReservationComment(field){
  if(!field)return;
  const computedMin=parseFloat(getComputedStyle(field).minHeight)||74;
  const minHeight=Math.max(74,computedMin);
  field.style.setProperty('overflow-y','hidden','important');
  field.style.setProperty('resize','none','important');
  field.style.setProperty('max-height','none','important');
  field.style.setProperty('height','auto','important');
  const nextHeight=Math.max(minHeight,field.scrollHeight+4);
  field.style.setProperty('height',nextHeight+'px','important');
}
function discountReservationAutoSizeText(field){
  if(!field)return '';
  if(field.tagName==='SELECT'){
    const selected=field.selectedOptions&&field.selectedOptions[0];
    return (selected&&selected.textContent)||field.value||'';
  }
  return field.value||field.placeholder||'';
}
function autoSizeDiscountReservationField(field){
  if(!field||field.tagName==='TEXTAREA'){
    if(field&&field.tagName==='TEXTAREA')autoResizeDiscountReservationComment(field);
    return;
  }
  const text=discountReservationAutoSizeText(field).trim();
  const baseLength=text.length||String(field.placeholder||'').length||4;
  let minCh=6;
  let maxCh=34;
  if(field.classList.contains('discount-reservation-created-date')){minCh=6;maxCh=8}
  if(field.classList.contains('discount-reservation-clock')){minCh=8;maxCh=12}
  if(field.classList.contains('discount-reservation-quendoo')){minCh=10;maxCh=20}
  if(field.classList.contains('discount-reservation-room')){minCh=7;maxCh=16}
  if(field.classList.contains('discount-reservation-price')){minCh=8;maxCh=14}
  if(field.classList.contains('discount-reservation-discount')){minCh=5;maxCh=10}
  if(field.classList.contains('discount-reservation-guest')){minCh=14;maxCh=42}
  if(field.classList.contains('discount-reservation-hotel')){minCh=14;maxCh=34}
  if(field.classList.contains('discount-reservation-contact-email')){minCh=16;maxCh=42}
  if(field.classList.contains('discount-reservation-contact-phone')){minCh=12;maxCh=24}
  if(field.classList.contains('discount-reservation-date')){minCh=7;maxCh=9}
  if(field.classList.contains('discount-reservation-nights-trigger')){minCh=7;maxCh=10}
  const widthCh=Math.max(minCh,Math.min(maxCh,baseLength+2));
  const widthValue=`min(${widthCh}ch, 100%)`;
  field.style.setProperty('width',widthValue,'important');
  field.style.setProperty('max-width','100%','important');
  const percentWrap=field.closest('.discount-reservation-percent-wrap');
  if(percentWrap){
    percentWrap.style.setProperty('width',widthValue,'important');
    percentWrap.style.setProperty('max-width','100%','important');
  }
}
function autoSizeDiscountReservationFields(root){
  if(!root)return;
  root.querySelectorAll('.discount-reservation-fields input, .discount-reservation-fields select, .discount-reservation-fields textarea').forEach(field=>autoSizeDiscountReservationField(field));
}
function renderDiscountReservations(){
  const listEl=document.getElementById('discountReservationsList');
  const summary=document.getElementById('discountReservationsSummary');
  const settingsPanel=document.getElementById('discountReservationLayoutSettingsHost');
  if(!listEl)return;
  const reservations=ensureDiscountReservations();
  const layout=ensureDiscountReservationLayout();
  if(summary)summary.textContent=`Общо: ${reservations.length} резервации`;
  if(settingsPanel){
    settingsPanel.innerHTML=renderDiscountReservationLayoutPanel();
    bindDiscountReservationLayoutPanel();
  }
  const settingsBtn=document.getElementById('discountReservationLayoutBtn');
  if(settingsBtn){
    settingsBtn.classList.toggle('active',discountReservationLayoutOpen);
    settingsBtn.title='Настройки на полетата';
    settingsBtn.onclick=toggleDiscountReservationLayoutPanel;
  }
  if(!reservations.length){
    listEl.innerHTML='<div class="discount-reservations-empty">Няма добавени резервации с отстъпки. Натисни „+ Добави резервация“.</div>';
    return;
  }
  const hotelOptions=['',...DISCOUNT_RESERVATION_HOTELS].map(name=>`<option value="${escapeAttr(name)}">${escapeHtml(name||'Хотел')}</option>`).join('');
  listEl.innerHTML=reservations.map((item,index)=>{
    const nights=discountReservationNights(item);
    const fields=layout.fields.map(field=>renderDiscountReservationField(item,field,index,hotelOptions,nights)).join('');
    const editing=!!item.isEditing;
    const actions=editing
      ? `<button class="success small discount-reservation-save" type="button" data-dr-save title="Запази и заключи">✓ Запази</button><button class="small cancel-changes-btn" type="button" data-cancel-changes="true" title="Върни последната запазена версия">Откажи</button><button class="danger small discount-reservation-delete" type="button" title="Изтрий">Изтрий</button>`
      : `<button class="small discount-reservation-edit" type="button" data-dr-edit title="Редактирай резервацията">✎ Редактирай</button>`;
    return `<div class="discount-reservation-card ${editing?'editing':'locked'}" data-discount-reservation-id="${escapeAttr(item.id)}">
      <div class="discount-reservation-fields reservation-layout-custom">
        ${fields}
      </div>
      <div class="discount-reservation-footer">
        <div class="discount-reservation-created">Запис в системата: ${escapeHtml(formatDiscountReservationCreatedAt(item.createdAt))}</div>
        <div class="discount-reservation-actions">${actions}</div>
      </div>
    </div>`;
  }).join('');
  listEl.querySelectorAll('.discount-reservation-card').forEach((card,cardIndex)=>{
    const id=card.dataset.discountReservationId;
    const currentItem=ensureDiscountReservations().find(r=>r.id===id)||{};
    const editable=!!currentItem.isEditing;
    const hotelSelect=card.querySelector('.discount-reservation-hotel');
    if(hotelSelect)hotelSelect.value=currentItem.hotel||'';
    card.querySelectorAll('.discount-reservation-comment').forEach(field=>{
      autoResizeDiscountReservationComment(field);
      requestAnimationFrame(()=>autoResizeDiscountReservationComment(field));
    });
    autoSizeDiscountReservationFields(card);
    requestAnimationFrame(()=>autoSizeDiscountReservationFields(card));
    if(editable){
      card.querySelectorAll('[data-discount-reservation-field]').forEach(field=>{
        const name=field.dataset.discountReservationField;
        field.addEventListener('input',()=>{
          updateDiscountReservation(id,name,field.value,{deferred:true});
          autoSizeDiscountReservationField(field);
        });
        field.addEventListener('change',()=>{
          updateDiscountReservation(id,name,field.value);
          autoSizeDiscountReservationField(field);
        });
        field.addEventListener('blur',()=>flushScheduledSilentStateSave());
      });
      card.querySelectorAll('[data-discount-reservation-clock-index]').forEach(field=>{
        const index=Number(field.dataset.discountReservationClockIndex)||0;
        field.addEventListener('input',()=>{
          updateDiscountReservationClock(id,index,field.value,{deferred:true});
          autoSizeDiscountReservationField(field);
        });
        field.addEventListener('change',()=>{
          updateDiscountReservationClock(id,index,field.value);
          autoSizeDiscountReservationField(field);
        });
        field.addEventListener('blur',()=>flushScheduledSilentStateSave());
      });
      card.querySelectorAll('[data-discount-reservation-clock-add]').forEach(btn=>{
        btn.addEventListener('click',()=>addDiscountReservationClock(id));
      });
      card.querySelectorAll('[data-discount-reservation-clock-remove]').forEach(btn=>{
        btn.addEventListener('click',()=>removeDiscountReservationClock(id,Number(btn.dataset.discountReservationClockRemove)||0));
      });
      card.querySelectorAll('[data-discount-reservation-custom-field]').forEach(field=>{
        const name=field.dataset.discountReservationCustomField;
        field.addEventListener('input',()=>{
          updateDiscountReservationCustomField(id,name,field.value,{deferred:true});
          autoSizeDiscountReservationField(field);
        });
        field.addEventListener('change',()=>{
          updateDiscountReservationCustomField(id,name,field.value);
          autoSizeDiscountReservationField(field);
        });
        field.addEventListener('blur',()=>flushScheduledSilentStateSave());
      });
      const rangeTrigger=card.querySelector('[data-discount-reservation-range]');
      if(rangeTrigger){
        rangeTrigger.addEventListener('rangechange',event=>updateDiscountReservationRange(id,event.detail.from,event.detail.to));
        rangeTrigger.addEventListener('focus',()=>{});
      }
      card.querySelectorAll('[data-open-discount-reservation-range]').forEach(input=>{
        input.addEventListener('click',event=>{
          event.stopPropagation();
          const trigger=card.querySelector('[data-discount-reservation-range]');
          if(trigger&&!trigger.disabled)openDateRangePicker(trigger);
        });
        input.addEventListener('focus',event=>{
          const trigger=card.querySelector('[data-discount-reservation-range]');
          if(trigger&&!trigger.disabled)openDateRangePicker(trigger);
        });
      });
    }
    const edit=card.querySelector('[data-dr-edit]');
    if(edit)edit.addEventListener('click',()=>setDiscountReservationEditing(id,true));
    const save=card.querySelector('[data-dr-save]');
    if(save)save.addEventListener('click',()=>setDiscountReservationEditing(id,false));
    const del=card.querySelector('.discount-reservation-delete');
    if(del)del.addEventListener('click',()=>deleteDiscountReservation(id));
  });
  ensureCancelButtons();
}

function normalizeState(input){
  return {weeks:(input.weeks||[]).map(week=>{
    const w={id:week.id||uid(),startDate:week.startDate||toISODate(new Date()),endDate:week.endDate||toISODate(addDays(new Date(),6)),customTitle:week.customTitle||'',cancellationCheckInDate:week.cancellationCheckInDate||week.startDate||toISODate(new Date()),priceCalculator:normalizePriceCalculator(week.priceCalculator||{},week),selectedHotelId:week.selectedHotelId||null,selectedChecklistHotelId:week.selectedChecklistHotelId||week.selectedHotelId||null,selectedContractsHotelId:week.selectedContractsHotelId||week.selectedHotelId||null,createdAt:week.createdAt||new Date().toISOString(),updatedAt:week.updatedAt||new Date().toISOString()};
    w.hotels=normalizeHotels(week.hotels||[],w);
    if(!w.selectedHotelId&&w.hotels[0])w.selectedHotelId=w.hotels[0].id;
    if(!w.selectedChecklistHotelId&&w.hotels[0])w.selectedChecklistHotelId=w.hotels[0].id;
    if(!w.selectedContractsHotelId&&w.hotels[0])w.selectedContractsHotelId=w.hotels[0].id;
    w.hotels.forEach(h=>{if(!h.selectedSubsectionId&&h.subsections[0])h.selectedSubsectionId=h.subsections[0].id});
    return w;
  }),activeWeekId:input.activeWeekId||null,uiSettings:normalizeUiSettings(input.uiSettings||{}),ultraAllInclusive:normalizeUltraAllInclusive(input.ultraAllInclusive||{}),emailTxt:normalizeEmailTxt(input.emailTxt||{}),toMappingsLocked:normalizeToMappingsLocked(input),toMappingHotels:normalizeToMappingHotels(input.toMappingHotels||input.roomTypeToMappingHotels||[],input),cancellationPolicies:normalizeCancellationPolicies(input.cancellationPolicies||input.cancellations||{}),tasksByDate:normalizeDailyTasks(input.tasksByDate||input.dailyTasks||{}),taskNotesByDate:normalizeDailyTaskNotes(input.taskNotesByDate||input.dailyTaskNotes||input.tasksNotesByDate||{}),tasksUi:normalizeTasksUi(input.tasksUi||{}),discountReservations:normalizeDiscountReservations(input.discountReservations||input.reservationsWithDiscounts||input.discountedReservations||[]),sectionThemes:normalizeSectionThemes(input.sectionThemes||input.sectionColors||getStoredSectionThemes()||{}),attendanceFormV14:normalizeAttendanceFormV14(input.attendanceFormV14||input.workFormV14||{})};
}
function normalizeHotels(hotels,week){
  const normalized=hotels.map((hotel,index)=>{
    const h={id:hotel.id||uid()+'_h'+index,name:hotel.name||'',operationFrom:hotel.operationFrom||'',operationTo:hotel.operationTo||'',roomCount:hotel.roomCount||hotel.roomsCount||hotel.totalRooms||'',roomTypesLocked:!!hotel.roomTypesLocked,toMappingsLocked:!!hotel.toMappingsLocked,toMappingGroups:normalizeToMappingGroups(hotel.toMappingGroups||hotel.toMappingsGroups||hotel.operatorGroups||hotel.tourOperatorGroups||[],hotel.toMappings||hotel.toTypeMappings||hotel.operatorMappings||hotel.tourOperatorMappings||[]),roomServiceCatalog:normalizeRoomServiceCatalog(hotel.roomServiceCatalog||hotel.serviceCatalog||hotel.roomServices||[]),roomTypes:normalizeRoomTypes(hotel.roomTypes||[]),selectedSubsectionId:hotel.selectedSubsectionId||null,subsections:[],checklist:normalizeChecklistItems(hotel.checklist||[]),emailTableHtml:hotel.emailTableHtml||'',contracts:normalizeContracts(hotel.contracts||[]),selectedContractId:hotel.selectedContractId||null,nightsByMonth:normalizeHotelNights(hotel.nightsByMonth||hotel.hotelNights||hotel.nights||{}),roomNightsByMonth:normalizeHotelNights(hotel.roomNightsByMonth||hotel.roomHotelNights||hotel.roomNights||{}),roomNightsTargetsByMonth:normalizeHotelNights(hotel.roomNightsTargetsByMonth||hotel.roomNightTargets||hotel.roomNightsTargets||{}),revenueTargetsByMonth:normalizeHotelNights(hotel.revenueTargetsByMonth||hotel.revenueTargetByMonth||{}),revenueByMonth:normalizeHotelNights(hotel.revenueByMonth||hotel.revenuesByMonth||{}),guestNightsDaily:normalizeHotelDailyMetric(hotel.guestNightsDaily||{}),roomNightsDaily:normalizeHotelDailyMetric(hotel.roomNightsDaily||{}),revenueDaily:normalizeHotelDailyMetric(hotel.revenueDaily||{})};
    if(Array.isArray(hotel.subsections)){
      h.subsections=hotel.subsections.map((s,i)=>({id:s.id||uid()+'_s'+i,name:s.name||`Канал ${i+1}`,locked:!!s.locked,periods:normalizePeriods(s.periods||[],week)}));
    } else if(Array.isArray(hotel.periods)) {
      h.subsections=[{id:uid()+'_direct',name:'Direct',locked:false,periods:normalizePeriods(hotel.periods,week)},{id:uid()+'_booking',name:'Booking',locked:false,periods:[]},{id:uid()+'_other',name:'Other',locked:false,periods:[]}];
    } else h.subsections=defaultSubsections();
    if(!h.subsections.length)h.subsections=defaultSubsections();
    if(!h.selectedSubsectionId&&h.subsections[0])h.selectedSubsectionId=h.subsections[0].id;
    if(!h.selectedContractId&&h.contracts[0])h.selectedContractId=h.contracts[0].id;
    return h;
  });
  while(normalized.length<5)normalized.push({id:uid(),name:'',operationFrom:'',operationTo:'',roomCount:'',roomTypesLocked:false,toMappingsLocked:false,toMappingGroups:[],roomServiceCatalog:[],roomTypes:[],selectedSubsectionId:null,subsections:defaultSubsections(),checklist:[],emailTableHtml:'',contracts:[],selectedContractId:null,nightsByMonth:{},roomNightsByMonth:{},roomNightsTargetsByMonth:{}});
  normalized.forEach(h=>{if(!h.selectedSubsectionId&&h.subsections[0])h.selectedSubsectionId=h.subsections[0].id});
  return normalized;
}
function normalizePeriods(periods,week){return periods.map(p=>({id:p.id||uid(),fromDate:p.fromDate||week.startDate||toISODate(new Date()),toDate:p.toDate||week.endDate||toISODate(addDays(new Date(),6)),discount:p.discount||'',note:p.note||''}))}
function normalizeChecklistItems(items){return (items||[]).map((item,index)=>({id:item.id||uid()+'_c'+index,text:item.text||'',done:!!item.done}))}



function normalizeToMappings(items){
  return (items||[]).map((item,index)=>{
    if(Array.isArray(item)){
      return {id:uid()+'_tomap_'+index,from:String(item[0]||''),to:String(item[1]||'')};
    }
    if(typeof item==='string'){
      const parts=item.split(/\s*(?:->|→|=|:)\s*/);
      return {id:uid()+'_tomap_'+index,from:String(parts[0]||''),to:String(parts[1]||'')};
    }
    return {
      id:item.id||uid()+'_tomap_'+index,
      from:String(item.from||item.source||item.base||item.local||item.roomType||''),
      to:String(item.to||item.target||item.operator||item.toCode||item.mappedTo||'')
    };
  });
}
function cloneToMappings(items){
  return normalizeToMappings(items).map((mapping,index)=>({
    id:mapping.id||uid()+'_tomap_'+index,
    from:String(mapping.from||''),
    to:String(mapping.to||'')
  }));
}
function normalizeToMappingReleasePeriods(periods){
  return (periods||[]).map((item,index)=>({
    id:(item&&item.id)||uid()+'_torel_'+index,
    from:String((item&&(item.from||item.fromDate||item.start||item.startDate))||''),
    to:String((item&&(item.to||item.toDate||item.end||item.endDate))||''),
    days:String((item&&(item.days||item.releaseDays||item.value||item.release))||'')
  }));
}
function cloneToMappingReleasePeriods(periods){
  return normalizeToMappingReleasePeriods(periods).map((item,index)=>({
    id:item.id||uid()+'_torel_'+index,
    from:String(item.from||''),
    to:String(item.to||''),
    days:String(item.days||'')
  }));
}
function normalizeToMappingGroups(groups,legacyMappings){
  const result=[];
  const addGroup=(group,index)=>{
    if(!group)return;
    if(Array.isArray(group)||typeof group==='string'||group.from||group.to||group.source||group.target){
      result.push({
        id:uid()+'_togroup_'+index,
        name:'ТО група '+(index+1),
        mappings:cloneToMappings([group]),
        releasePeriods:[]
      });
      return;
    }
    const mappings=cloneToMappings(group.mappings||group.items||group.rows||group.toMappings||[]);
    const releasePeriods=cloneToMappingReleasePeriods(group.releasePeriods||group.releases||group.releasePeriod||group.releaseRows||[]);
    result.push({
      id:group.id||uid()+'_togroup_'+index,
      name:String(group.name||group.title||group.operator||group.tourOperator||('ТО група '+(index+1))).slice(0,80),
      mappings,
      releasePeriods
    });
  };
  if(Array.isArray(groups))groups.forEach(addGroup);
  if(!result.length&&legacyMappings&&legacyMappings.length){
    result.push({id:uid()+'_togroup_legacy',name:'ТО група 1',mappings:cloneToMappings(legacyMappings),releasePeriods:[]});
  }
  return result.map((group,index)=>({
    id:group.id||uid()+'_togroup_'+index,
    name:String(group.name||('ТО група '+(index+1))).slice(0,80),
    mappings:cloneToMappings(group.mappings||[]),
    releasePeriods:cloneToMappingReleasePeriods(group.releasePeriods||[])
  }));
}
function cloneToMappingGroups(groups,legacyMappings){
  return normalizeToMappingGroups(groups,legacyMappings).map((group,index)=>({
    id:group.id||uid()+'_togroup_'+index,
    name:String(group.name||('ТО група '+(index+1))).slice(0,80),
    mappings:cloneToMappings(group.mappings||[]),
    releasePeriods:cloneToMappingReleasePeriods(group.releasePeriods||[])
  }));
}

function defaultToMappingHotels(){
  return [
    {id:uid()+'_tohotel_algara',name:'Алгара Бийч',operatorGroups:[]},
    {id:uid()+'_tohotel_grandvictoria',name:'Гранд Виктория',operatorGroups:[defaultGrandVictoriaMappingGroup()]}
  ];
}
const GRAND_VICTORIA_DEFAULT_MAPPINGS=[
  ['STP park','STP'],
  ['AM 1bedroom','APP SMALL'],
  ['ACD 2bedroom','ACD DBL, ST'],
  ['AP lux','APP LUX'],
  ['AF family','APP FAM'],
  ['DBL sea','DBL'],
  ['STS side sea','STS']
];
function defaultGrandVictoriaMappingGroup(){
  return {
    id:uid()+'_togroup_grvv',
    name:'GRVV',
    mappings:[
      ['STP park','STP'],
      ['AM 1bedroom','APP SMALL'],
      ['ACD 2bedroom','ACD DBL, ST'],
      ['AP lux','APP LUX'],
      ['AF family','APP FAM'],
      ['DBL sea','DBL'],
      ['STS side sea','STS']
    ].map((pair,index)=>({id:uid()+'_tomap_grvv_'+index,from:pair[0],to:pair[1]})),
    releasePeriods:[]
  };
}
function ensureGrandVictoriaDefaultMappings(hotels){
  const gv=(hotels||[]).find(h=>String(h&&h.name||'').trim().toLowerCase()==='гранд виктория');
  if(!gv)return hotels;
  if(!Array.isArray(gv.operatorGroups))gv.operatorGroups=[];
  const hasAnyMappings=gv.operatorGroups.some(group=>Array.isArray(group.mappings)&&group.mappings.some(mapping=>String(mapping.from||'').trim()||String(mapping.to||'').trim()));
  if(!hasAnyMappings){
    gv.operatorGroups.push(defaultGrandVictoriaMappingGroup());
  }
  return hotels;
}
function normalizeToMappingsLocked(input){
  if(typeof input.toMappingsLocked==='boolean')return input.toMappingsLocked;
  const weeks=Array.isArray(input.weeks)?input.weeks:[];
  for(const week of weeks){
    for(const hotel of (week.hotels||[])){
      if(typeof hotel.toMappingsLocked==='boolean')return !!hotel.toMappingsLocked;
    }
  }
  return false;
}
function collectLegacyToMappingHotelGroups(input){
  const result=[];
  const weeks=Array.isArray(input.weeks)?input.weeks:[];
  const seen=new Set();
  weeks.forEach(week=>{
    (week.hotels||[]).forEach((hotel,index)=>{
      const groups=cloneToMappingGroups(hotel.toMappingGroups||hotel.toMappingsGroups||hotel.operatorGroups||hotel.tourOperatorGroups||[],hotel.toMappings||hotel.toTypeMappings||hotel.operatorMappings||hotel.tourOperatorMappings||[])
        .filter(group=>String(group.name||'').trim()||(group.mappings||[]).some(m=>String(m.from||'').trim()||String(m.to||'').trim()));
      if(!groups.length)return;
      const rawName=String(hotel.name||'').trim()||'Алгара Бийч';
      const key=rawName.toLowerCase();
      if(seen.has(key))return;
      seen.add(key);
      result.push({id:uid()+'_tohotel_legacy_'+index,name:rawName,operatorGroups:groups});
    });
  });
  return result;
}
function normalizeToMappingHotels(items,inputForLegacy){
  const result=[];
  const addHotel=(hotel,index)=>{
    if(!hotel)return;
    const operatorGroups=cloneToMappingGroups(hotel.operatorGroups||hotel.groups||hotel.toMappingGroups||hotel.tourOperatorGroups||hotel.operators||[],hotel.toMappings||hotel.legacyMappings||[]);
    result.push({
      id:hotel.id||uid()+'_tohotel_'+index,
      name:String(hotel.name||hotel.hotelName||hotel.title||('Хотел '+(index+1))).slice(0,40),
      operatorGroups
    });
  };
  if(Array.isArray(items))items.forEach(addHotel);
  if(!result.length&&inputForLegacy)collectLegacyToMappingHotelGroups(inputForLegacy).forEach(addHotel);
  const normalized=result.map((hotel,index)=>({
    id:hotel.id||uid()+'_tohotel_'+index,
    name:String(hotel.name||('Хотел '+(index+1))).slice(0,40),
    operatorGroups:cloneToMappingGroups(hotel.operatorGroups||hotel.groups||hotel.toMappingGroups||[])
  }));
  const ensureDefault=(name)=>{
    const exists=normalized.some(h=>String(h.name||'').trim().toLowerCase()===name.toLowerCase());
    if(!exists)normalized.push({id:uid()+'_tohotel_'+name.toLowerCase().replace(/\s+/g,'_'),name,operatorGroups:[]});
  };
  ensureDefault('Алгара Бийч');
  ensureDefault('Гранд Виктория');
  ensureGrandVictoriaDefaultMappings(normalized);
  return normalized;
}
function cloneToMappingHotels(items){
  return normalizeToMappingHotels(items||[]).map((hotel,index)=>({
    id:hotel.id||uid()+'_tohotel_'+index,
    name:String(hotel.name||('Хотел '+(index+1))).slice(0,40),
    operatorGroups:cloneToMappingGroups(hotel.operatorGroups||hotel.groups||hotel.toMappingGroups||[])
  }));
}
function toMappingHotelsSearchText(items){
  return cloneToMappingHotels(items||[])
    .map(hotel=>`${hotel.name||''} ${(hotel.operatorGroups||[]).map(group=>`${group.name||''} ${(group.mappings||[]).map(m=>`${m.from||''} ${m.to||''}`).join(' ')} ${(group.releasePeriods||[]).map(p=>`${p.from||''} ${p.to||''} ${p.days||''}`).join(' ')}`).join(' ')}`)
    .join(' ');
}
function toMappingGroupsSearchText(hotel){
  return cloneToMappingGroups(hotel.toMappingGroups||[],hotel.toMappings||[])
    .map(group=>`${group.name||''} ${(group.mappings||[]).map(m=>`${m.from||''} ${m.to||''}`).join(' ')}`)
    .join(' ');
}

function normalizeRoomServiceCatalog(items){
  return (items||[]).map((item,index)=>{
    if(typeof item==='string'){
      return {id:uid()+'_svc_'+index,name:item,details:''};
    }
    return {
      id:item.id||uid()+'_svc_'+index,
      name:item.name||item.title||'',
      details:item.details||item.description||item.text||''
    };
  });
}
function cloneRoomServiceCatalog(items){
  return normalizeRoomServiceCatalog(items).map((service,index)=>({
    id:service.id||uid()+'_svc_'+index,
    name:service.name||'',
    details:service.details||''
  }));
}
function normalizeRoomTypes(items){return (items||[]).map((item,index)=>{
  let services=[];
  if(Array.isArray(item.services))services=item.services.filter(Boolean).map(String);
  else if(item.service)services=[String(item.service)];

  return {
    id:item.id||uid()+'_r'+index,
    name:item.name||'',
    typeLabel:item.typeLabel||item.kind||item.type||'',
    squareMeters:item.squareMeters||item.sqm||item.areaM2||'',
    priceCapacity:item.priceCapacity||item.pricingCapacity||'',
    capacities:normalizeRoomCapacities(item),
    services
  };
})}
function defaultSubsections(){return[{id:uid()+'_direct',name:'Direct',locked:false,periods:[]},{id:uid()+'_booking',name:'Booking',locked:false,periods:[]},{id:uid()+'_other',name:'Other',locked:false,periods:[]}]}
function cleanupOldHistoryKeys(){
  try{
    const keys=[];
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(key&&key!==STORAGE_KEY&&(OLD_KEYS.includes(key)||/^hotel_discount_history_v\d+$/.test(key)))keys.push(key);
    }
    keys.forEach(key=>localStorage.removeItem(key));
  }catch(e){}
}
const LARGE_STATE_DB_NAME='hotel_discount_history_large_state_v203';
const LARGE_STATE_STORE_NAME='state';
const LARGE_STATE_RECORD_KEY='latest';
const LARGE_STATE_MARKER_KEY='hotel_discount_history_large_state_marker_v203';
function openLargeStateDb(){
  return new Promise((resolve,reject)=>{
    if(!window.indexedDB){reject(new Error('IndexedDB is not available'));return;}
    const request=indexedDB.open(LARGE_STATE_DB_NAME,1);
    request.onupgradeneeded=()=>request.result.createObjectStore(LARGE_STATE_STORE_NAME);
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('IndexedDB open failed'));
  });
}
async function writeLargeStateFallback(payload){
  const db=await openLargeStateDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction(LARGE_STATE_STORE_NAME,'readwrite');
    tx.objectStore(LARGE_STATE_STORE_NAME).put({payload,updatedAt:new Date().toISOString()},LARGE_STATE_RECORD_KEY);
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error||new Error('IndexedDB write failed'));
  });
  db.close();
  try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
  try{localStorage.setItem(LARGE_STATE_MARKER_KEY,JSON.stringify({updatedAt:new Date().toISOString()}));}catch(e){}
}
async function readLargeStateFallback(){
  const db=await openLargeStateDb();
  const record=await new Promise((resolve,reject)=>{
    const tx=db.transaction(LARGE_STATE_STORE_NAME,'readonly');
    const request=tx.objectStore(LARGE_STATE_STORE_NAME).get(LARGE_STATE_RECORD_KEY);
    request.onsuccess=()=>resolve(request.result||null);
    request.onerror=()=>reject(request.error||new Error('IndexedDB read failed'));
  });
  db.close();
  return record&&record.payload?String(record.payload):'';
}
async function restoreLargeStateFallbackIfNeeded(){
  if(state.weeks&&state.weeks.length)return false;
  let hasMarker=false;
  try{hasMarker=!!localStorage.getItem(LARGE_STATE_MARKER_KEY);}catch(e){}
  if(!hasMarker)return false;
  try{
    const payload=await readLargeStateFallback();
    if(!payload)return false;
    const parsed=JSON.parse(payload);
    if(!parsed||!Array.isArray(parsed.weeks))return false;
    state=normalizeState(parsed);
    activeWeekId=state.activeWeekId||(state.weeks[0]&&state.weeks[0].id)||null;
    return true;
  }catch(error){
    console.warn('Large local fallback restore failed:',error);
    return false;
  }
}
async function bootstrapInitialState(){
  await restoreLargeStateFallbackIfNeeded();
  if(!state.weeks.length)createNewWeek(false);
  captureAcceptedStateSnapshot({skipEditorSync:true});
  render();
}
function hasLargeStateFallbackMarker(){
  try{return !!localStorage.getItem(LARGE_STATE_MARKER_KEY);}catch(e){return false;}
}
function saveState(options={}){
  const silent=!!(options&&options.silent);
  if(!options.skipWorkFormSync)syncWorkFormStateFromFrame();
  state.activeWeekId=activeWeekId;
  const payload=JSON.stringify(state);

  if(hasLargeStateFallbackMarker()){
    writeLargeStateFallback(payload).catch(error=>console.warn('Large local fallback save failed:',error));
    return;
  }
  try{
    cleanupOldHistoryKeys();
    localStorage.setItem(STORAGE_KEY,payload);
  }catch(error){
    try{
      cleanupOldHistoryKeys();
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY,payload);
    }catch(secondError){
      console.warn('localStorage is full; using IndexedDB fallback:',secondError);
      writeLargeStateFallback(payload).catch(error=>console.warn('Large local fallback save failed:',error));
    }
  }
}
function saveStateSafe(options={}){
  try{saveState({silent:true,...options});return true;}
  catch(error){console.warn('Local save skipped:',error);return false;}
}
let scheduledSilentSaveTimer=null;
function scheduleSilentStateSave(delay=350){
  if(scheduledSilentSaveTimer)clearTimeout(scheduledSilentSaveTimer);
  scheduledSilentSaveTimer=setTimeout(()=>{
    scheduledSilentSaveTimer=null;
    saveStateSafe();
  },delay);
}
function flushScheduledSilentStateSave(){
  if(!scheduledSilentSaveTimer)return;
  clearTimeout(scheduledSilentSaveTimer);
  scheduledSilentSaveTimer=null;
  saveStateSafe();
}
window.addEventListener('beforeunload',flushScheduledSilentStateSave);
function readCancelExtraStorageSnapshot(){
  const snapshot={};
  CANCEL_EXTRA_STORAGE_KEYS.forEach(key=>{
    try{snapshot[key]=localStorage.getItem(key);}
    catch(error){snapshot[key]=null;}
  });
  return snapshot;
}
function restoreCancelExtraStorageSnapshot(snapshot){
  CANCEL_EXTRA_STORAGE_KEYS.forEach(key=>{
    try{
      const value=snapshot&&Object.prototype.hasOwnProperty.call(snapshot,key)?snapshot[key]:null;
      if(value===null||value===undefined)localStorage.removeItem(key);
      else localStorage.setItem(key,value);
    }catch(error){}
  });
}
function captureAcceptedStateSnapshot(options={}){
  if(!options.skipEditorSync&&typeof syncVisibleEditorsBeforeGoogleSave==='function')syncVisibleEditorsBeforeGoogleSave();
  state.activeWeekId=activeWeekId;
  lastAcceptedStateSnapshot=JSON.stringify(state);
  lastAcceptedExtraStorageSnapshot=readCancelExtraStorageSnapshot();
}
function cancelPendingChanges(){
  if(!lastAcceptedStateSnapshot){
    captureAcceptedStateSnapshot({skipEditorSync:true});
    return;
  }
  if(!confirm('Да откажа ли незапазените промени и да върна последната запазена версия?'))return;
  try{
    restoreCancelExtraStorageSnapshot(lastAcceptedExtraStorageSnapshot);
    state=normalizeState(JSON.parse(lastAcceptedStateSnapshot));
    activeWeekId=state.activeWeekId||(state.weeks[0]&&state.weeks[0].id)||null;
    cleanupOldHistoryKeys();
    saveStateSafe();
    applyRoomInfoDisplaySettings();
    render();
    setGoogleSyncStatus('Отказано. Върната е последната запазена версия.', 'warn');
  }catch(error){
    console.error(error);
    alert('Не успях да върна последната запазена версия.');
  }
}
function createCancelChangesButton(){
  const button=document.createElement('button');
  button.type='button';
  button.className='small cancel-changes-btn';
  button.dataset.cancelChanges='true';
  button.textContent='Откажи';
  button.title='Върни последната запазена версия';
  return button;
}
function addCancelButtonToContainer(container){
  if(!container||container.querySelector('.cancel-changes-btn'))return;
  container.appendChild(createCancelChangesButton());
}
function addCancelButtonAfter(reference){
  if(!reference||!reference.parentElement||reference.parentElement.querySelector('.cancel-changes-btn'))return;
  reference.insertAdjacentElement('afterend',createCancelChangesButton());
}
function ensureCancelButtons(){
  document.querySelectorAll('.section-save-actions').forEach(addCancelButtonToContainer);
  [
    'saveGoogleSyncBtn',
    'saveWeekOptionsBtn',
    'saveContractBtn',
    'saveUltraInfoBtn',
    'lockRoomTypesBtn',
    'saveBtnPeriods',
    'lockDiscountsBtn',
    'lockToMappingsBtn',
    'lockUltraInfoBtn',
    'lockEmailTxtBtn',
    'toggleCancellationLockBtn',
    'saveBtn'
  ].forEach(id=>addCancelButtonAfter(document.getElementById(id)));
  document.querySelectorAll('[data-dr-layout-lock]').forEach(addCancelButtonAfter);
}
function uid(){return 'id_'+Date.now()+'_'+Math.random().toString(16).slice(2)}
function toISODate(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
function parseISODate(value){const [y,m,d]=String(value||'').split('-').map(Number);return new Date(y||new Date().getFullYear(),(m||1)-1,d||1)}
function addDays(date,days){const copy=new Date(date);copy.setDate(copy.getDate()+days);return copy}
function formatShortDate(iso){if(!iso)return'';const d=parseISODate(iso);return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`}
function formatDayMonthSlash(iso){
  if(!iso)return'';
  const d=parseISODate(iso);
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;
}
function operationRangeLabel(hotel){
  if(!hotel)return '';
  const parts=[];
  if(hotel.operationFrom&&hotel.operationTo){
    parts.push(`${formatDayMonthSlash(hotel.operationFrom)} - ${formatDayMonthSlash(hotel.operationTo)}`);
  }
  const rooms=String(hotel.roomCount||hotel.roomsCount||hotel.totalRooms||'').trim();
  if(rooms)parts.push(`${rooms} стаи`);
  return parts.join(' · ');
}
function normalizeRoomCapacities(room){
  const raw=Array.isArray(room&&room.capacities)?room.capacities:[];
  let capacities=raw.map(cap=>({
    adults:cap&&cap.adults!==undefined?cap.adults:'',
    children:cap&&cap.children!==undefined?cap.children:''
  }));

  if(!capacities.length && room && (room.adults!==undefined || room.children!==undefined)){
    capacities=[{adults:room.adults||'',children:room.children||''}];
  }

  while(capacities.length<4)capacities.push({adults:'',children:''});
  return capacities.slice(0,4);
}
function roomTypeCapacityLabels(room){
  return normalizeRoomCapacities(room)
    .filter(cap=>String(cap.adults||'').trim()!=='' || String(cap.children||'').trim()!=='')
    .map(cap=>`${cap.adults||0}+${cap.children||0}`);
}
function roomTypeCapacityText(room){
  return roomTypeCapacityLabels(room).join(' · ');
}
function roomTypeMaxLabel(room){
  const labels=roomTypeCapacityLabels(room);
  return labels[0]||'';
}
function roomTypeDisplayLabel(room,index){
  return `${room.name||'Стая '+(index+1)}`;
}
function roomTypeKindLabel(room){
  return room&&(room.typeLabel||room.kind||room.type) ? String(room.typeLabel||room.kind||room.type).trim() : '';
}
function roomTypeSquareMeters(room){
  return room&&(room.squareMeters||room.sqm||room.areaM2) ? String(room.squareMeters||room.sqm||room.areaM2).trim() : '';
}
function roomTypeSquareMetersLabel(room){
  const value=roomTypeSquareMeters(room);
  if(!value)return '';
  if(/[mм][²2]?|кв/i.test(value))return value;
  return value+' м²';
}
function roomTypePriceCapacity(room){
  return room&&room.priceCapacity ? String(room.priceCapacity).trim() : '';
}
function getRoomServiceCatalog(hotel){
  if(!hotel)return [];
  if(!Array.isArray(hotel.roomServiceCatalog))hotel.roomServiceCatalog=normalizeRoomServiceCatalog(hotel.roomServiceCatalog||[]);
  return hotel.roomServiceCatalog;
}
function normalizeRoomServiceValues(room){
  if(!room)return [];
  if(Array.isArray(room.services))return room.services.map(item=>{
    if(item&&typeof item==='object')return String(item.id||item.name||'').trim();
    return String(item||'').trim();
  }).filter(Boolean);
  if(room.service)return [String(room.service).trim()].filter(Boolean);
  return [];
}
function roomTypeServiceItems(room,hotel){
  const catalog=getRoomServiceCatalog(hotel);
  return normalizeRoomServiceValues(room).map(value=>{
    const found=catalog.find(service=>service.id===value || service.name===value);
    return {value,label:found?(found.name||value):value,details:found?(found.details||''):''};
  }).filter(item=>String(item.label||'').trim()!=='');
}
function roomTypeServices(room,hotel){
  return roomTypeServiceItems(room,hotel).map(item=>item.label);
}
function roomTypeServicesText(room,hotel){
  return roomTypeServices(room,hotel).join(' · ');
}
function renderRoomInfoButtons(container,hotel){
  if(!container)return;
  container.innerHTML='';
  if(!hotel||!hotel.roomTypes||!hotel.roomTypes.length)return;

  hotel.roomTypes.forEach((room,index)=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='room-info-button';
    btn.draggable=true;
    btn.dataset.roomTypeId=room.id;
    btn.dataset.hotelId=hotel.id;
    const services=roomTypeServices(room,hotel);
    const capacities=roomTypeCapacityLabels(room);
    const kind=roomTypeKindLabel(room);
    const squareMeters=roomTypeSquareMetersLabel(room);
    const priceCapacity=roomTypePriceCapacity(room);
    const kindHtml=kind?`<span class="room-kind-badge">${escapeHtml(kind)}</span>`:'';
    const squareMetersHtml=squareMeters?`<span class="room-square-meters-badge">${escapeHtml(squareMeters)}</span>`:'';
    const priceCapacityHtml=priceCapacity?`<span class="room-price-capacity-badge"><span class="room-price-capacity-prefix">min</span><span class="room-price-capacity-value">${escapeHtml(priceCapacity)}</span></span>`:'';
    const serviceBadgesHtml=services.map(service=>`<span class="room-service-badge">${escapeHtml(service)}</span>`).join('');
    const extraHtml=priceCapacityHtml+capacities.map(label=>`<span class="room-max-badge">${escapeHtml(label)}</span>`).join('')+serviceBadgesHtml;
    btn.innerHTML=`<span class="room-info-line"><span class="room-info-index">${index+1}.</span><span class="room-info-name">${escapeHtml(roomTypeDisplayLabel(room,index))}</span><span class="room-info-square-slot">${squareMetersHtml}</span><span class="room-info-kind-slot">${kindHtml}</span><span class="room-info-extra-slot">${extraHtml}</span></span>`;

    btn.addEventListener('dragstart',e=>{
      draggedRoomTypeId=room.id;
      draggedRoomHotelId=hotel.id;
      btn.classList.add('dragging');
      e.dataTransfer.effectAllowed='move';
      e.dataTransfer.setData('text/plain',room.id);
    });

    btn.addEventListener('dragover',e=>{
      e.preventDefault();
      if(btn.dataset.roomTypeId!==draggedRoomTypeId)btn.classList.add('drag-over');
    });

    btn.addEventListener('dragleave',()=>btn.classList.remove('drag-over'));

    btn.addEventListener('drop',e=>{
      e.preventDefault();
      btn.classList.remove('drag-over');
      reorderRoomType(draggedRoomHotelId,draggedRoomTypeId,room.id);
    });

    btn.addEventListener('dragend',()=>{
      btn.classList.remove('dragging');
      document.querySelectorAll('.room-info-button.drag-over').forEach(item=>item.classList.remove('drag-over'));
      draggedRoomTypeId=null;
      draggedRoomHotelId=null;
    });

    container.appendChild(btn);
  });
}
function operationDays(hotel){
  if(!hotel||!hotel.operationFrom||!hotel.operationTo)return '';
  const start=parseISODate(hotel.operationFrom);
  const end=parseISODate(hotel.operationTo);
  const startUTC=Date.UTC(start.getFullYear(),start.getMonth(),start.getDate());
  const endUTC=Date.UTC(end.getFullYear(),end.getMonth(),end.getDate());
  const days=Math.round((endUTC-startUTC)/86400000)+1;
  return days>0?days:'';
}
function makeTitle(start,end,customTitle){return(customTitle&&customTitle.trim())||`${formatShortDate(start)} - ${formatShortDate(end)}`}
function getWeekGroupKey(week){
  const d=parseISODate(week.startDate);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}
function getWeekGroupLabel(week){
  const d=parseISODate(week.startDate);
  return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}
function getWeekYear(week){
  return parseISODate(week.startDate).getFullYear();
}
function isoToDisplay(iso){
  if(!iso)return'';
  const d=parseISODate(iso);
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;
}
function displayToISO(value,yearFallback){
  const raw=String(value||'').trim();
  if(!raw)return null;
  const clean=raw.replace(/[.\-]/g,'/');
  let match=clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  let year,day,month;
  if(match){
    day=Number(match[1]);month=Number(match[2]);year=Number(match[3]);
  }else{
    match=clean.match(/^(\d{1,2})\/(\d{1,2})$/);
    if(!match)return null;
    day=Number(match[1]);month=Number(match[2]);year=Number(yearFallback||new Date().getFullYear());
  }
  const d=new Date(year,month-1,day);
  if(d.getFullYear()!==year||d.getMonth()!==month-1||d.getDate()!==day)return null;
  return toISODate(d);
}
function normalizeDateInput(input){
  const stored=input&&input.dataset?input.dataset.dateIso:'';
  let iso=(stored&&String(input.value||'').trim()===isoToDisplay(stored))?stored:displayToISO(input.value,stored?parseISODate(stored).getFullYear():undefined);
  if(!iso){input.classList.add('invalid-date');return null}
  input.classList.remove('invalid-date');
  input.dataset.dateIso=iso;
  input.value=isoToDisplay(iso);
  return iso;
}
function defaultHotels(){return Array.from({length:5},(_,i)=>({id:uid()+'_h'+i,name:'',operationFrom:'',operationTo:'',roomCount:'',roomTypesLocked:false,toMappingsLocked:false,toMappingGroups:[],roomServiceCatalog:[],roomTypes:[],selectedSubsectionId:null,subsections:defaultSubsections(),checklist:[],emailTableHtml:'',contracts:[],selectedContractId:null,nightsByMonth:{},roomNightsByMonth:{},roomNightsTargetsByMonth:{}})).map(h=>({...h,selectedSubsectionId:h.subsections[0].id}))}
function createNewWeek(shouldRender=true){
  const today=new Date(), start=toISODate(today), end=toISODate(addDays(today,6)), hotels=createHotelsFromTemplate();
  const week={id:uid(),startDate:start,endDate:end,customTitle:'',cancellationCheckInDate:start,priceCalculator:normalizePriceCalculator({checkIn:start,checkOut:end,adults:'2',children:'0'}, {startDate:start,endDate:end}),selectedHotelId:hotels[0].id,selectedChecklistHotelId:hotels[0].id,selectedContractsHotelId:hotels[0].id,hotels,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  state.weeks.unshift(week);activeWeekId=week.id;saveState();if(shouldRender)render();
}
function createHotelsFromTemplate(){
  const templateWeek=getActiveWeek()||state.weeks[0];
  if(!templateWeek||!templateWeek.hotels||!templateWeek.hotels.length)return defaultHotels();
  const hotels=templateWeek.hotels.map((hotel,index)=>{
    const source=hotel.subsections&&hotel.subsections.length?hotel.subsections:defaultSubsections();
    const subsections=source.map((s,i)=>({id:uid()+'_s'+i,name:s.name||`Канал ${i+1}`,locked:false,periods:[]}));
    return{id:uid()+'_h'+index,name:hotel.name||'',operationFrom:hotel.operationFrom||'',operationTo:hotel.operationTo||'',roomCount:hotel.roomCount||hotel.roomsCount||hotel.totalRooms||'',roomTypesLocked:!!hotel.roomTypesLocked,toMappingsLocked:!!hotel.toMappingsLocked,toMappingGroups:cloneToMappingGroups(hotel.toMappingGroups||[],hotel.toMappings||[]),roomServiceCatalog:cloneRoomServiceCatalog(hotel.roomServiceCatalog||[]),roomTypes:(hotel.roomTypes||[]).map((item,i)=>({id:uid()+'_r'+i,name:item.name||'',typeLabel:item.typeLabel||item.kind||item.type||'',squareMeters:item.squareMeters||item.sqm||item.areaM2||'',priceCapacity:item.priceCapacity||item.pricingCapacity||'',capacities:normalizeRoomCapacities(item),services:Array.isArray(item.services)?item.services.slice():(item.service?[item.service]:[])})),nightsByMonth:normalizeHotelNights(hotel.nightsByMonth||hotel.hotelNights||hotel.nights||{}),roomNightsByMonth:normalizeHotelNights(hotel.roomNightsByMonth||hotel.roomHotelNights||hotel.roomNights||{}),roomNightsTargetsByMonth:normalizeHotelNights(hotel.roomNightsTargetsByMonth||hotel.roomNightTargets||hotel.roomNightsTargets||{}),revenueTargetsByMonth:normalizeHotelNights(hotel.revenueTargetsByMonth||hotel.revenueTargetByMonth||{}),revenueByMonth:normalizeHotelNights(hotel.revenueByMonth||hotel.revenuesByMonth||{}),guestNightsDaily:normalizeHotelDailyMetric(hotel.guestNightsDaily||{}),roomNightsDaily:normalizeHotelDailyMetric(hotel.roomNightsDaily||{}),revenueDaily:normalizeHotelDailyMetric(hotel.revenueDaily||{}),selectedSubsectionId:subsections[0]?subsections[0].id:null,subsections,checklist:(hotel.checklist||[]).map((item,i)=>({id:uid()+'_c'+i,text:item.text||'',done:false})),emailTableHtml:'',contracts:cloneContracts(hotel.contracts||[]),selectedContractId:hotel.selectedContractId||null};
  });
  while(hotels.length<5){const subsections=defaultSubsections();hotels.push({id:uid(),name:'',operationFrom:'',operationTo:'',roomCount:'',roomTypesLocked:false,toMappingsLocked:false,toMappingGroups:[],roomServiceCatalog:[],roomTypes:[],selectedSubsectionId:subsections[0].id,subsections,checklist:[],emailTableHtml:'',contracts:[],selectedContractId:null,nightsByMonth:{},roomNightsByMonth:{},roomNightsTargetsByMonth:{}})}
  return hotels;
}
function duplicateWeek(){
  const current=getActiveWeek(); if(!current)return;
  const nextStart=addDays(parseISODate(current.endDate),1), nextEnd=addDays(nextStart,6);
  const currentSelectedHotelIndex=current.hotels.findIndex(h=>h.id===current.selectedHotelId);

  const hotels=current.hotels.map((hotel,index)=>{
    const currentSelectedSubsection=hotel.subsections.find(s=>s.id===hotel.selectedSubsectionId);
    const subsections=hotel.subsections.map((s,i)=>({
      id:uid()+'_s'+i,
      name:s.name,
      locked:!!s.locked,
      periods:s.periods.map((p,pi)=>({
        id:uid()+'_p'+pi,
        fromDate:p.fromDate,
        toDate:p.toDate,
        discount:p.discount,
        note:p.note
      }))
    }));

    const selectedSubsectionIndex=currentSelectedSubsection
      ? hotel.subsections.findIndex(s=>s.id===currentSelectedSubsection.id)
      : 0;

    return{
      id:uid()+'_copy_'+index,
      name:hotel.name,
      operationFrom:hotel.operationFrom||'',
      operationTo:hotel.operationTo||'',
      roomCount:hotel.roomCount||hotel.roomsCount||hotel.totalRooms||'',
      roomTypesLocked:!!hotel.roomTypesLocked,
      roomServiceCatalog:cloneRoomServiceCatalog(hotel.roomServiceCatalog||[]),
      roomTypes:(hotel.roomTypes||[]).map((item,i)=>({id:uid()+'_r'+i,name:item.name||'',typeLabel:item.typeLabel||item.kind||item.type||'',squareMeters:item.squareMeters||item.sqm||item.areaM2||'',priceCapacity:item.priceCapacity||item.pricingCapacity||'',capacities:normalizeRoomCapacities(item),services:Array.isArray(item.services)?item.services.slice():(item.service?[item.service]:[])})),
      nightsByMonth:normalizeHotelNights(hotel.nightsByMonth||hotel.hotelNights||hotel.nights||{}),roomNightsByMonth:normalizeHotelNights(hotel.roomNightsByMonth||hotel.roomHotelNights||hotel.roomNights||{}),roomNightsTargetsByMonth:normalizeHotelNights(hotel.roomNightsTargetsByMonth||hotel.roomNightTargets||hotel.roomNightsTargets||{}),revenueTargetsByMonth:normalizeHotelNights(hotel.revenueTargetsByMonth||hotel.revenueTargetByMonth||{}),revenueByMonth:normalizeHotelNights(hotel.revenueByMonth||hotel.revenuesByMonth||{}),guestNightsDaily:normalizeHotelDailyMetric(hotel.guestNightsDaily||{}),roomNightsDaily:normalizeHotelDailyMetric(hotel.roomNightsDaily||{}),revenueDaily:normalizeHotelDailyMetric(hotel.revenueDaily||{}),
      selectedSubsectionId:subsections[selectedSubsectionIndex] ? subsections[selectedSubsectionIndex].id : (subsections[0]?subsections[0].id:null),
      subsections,
      checklist:(hotel.checklist||[]).map((item,i)=>({id:uid()+'_c'+i,text:item.text||'',done:false})),
      emailTableHtml:'',
      contracts:cloneContracts(hotel.contracts||[]),
      selectedContractId:hotel.selectedContractId||null
    };
  });

  const copied={id:uid(),startDate:toISODate(nextStart),endDate:toISODate(nextEnd),customTitle:'',cancellationCheckInDate:toISODate(nextStart),priceCalculator:normalizePriceCalculator({checkIn:toISODate(nextStart),checkOut:toISODate(nextEnd),adults:(current.priceCalculator&&current.priceCalculator.adults)||'2',children:(current.priceCalculator&&current.priceCalculator.children)||'0',selectedRoom:(current.priceCalculator&&current.priceCalculator.selectedRoom)||'',reservationDate:(current.priceCalculator&&current.priceCalculator.reservationDate)||toISODate(new Date())},{startDate:toISODate(nextStart),endDate:toISODate(nextEnd)}),selectedHotelId:hotels[currentSelectedHotelIndex] ? hotels[currentSelectedHotelIndex].id : (hotels[0]?hotels[0].id:null),selectedChecklistHotelId:hotels[currentSelectedHotelIndex] ? hotels[currentSelectedHotelIndex].id : (hotels[0]?hotels[0].id:null),hotels,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  state.weeks.unshift(copied);activeWeekId=copied.id;saveState();render();
}
function deleteWeek(){
  const current=getActiveWeek(); if(!current)return;
  if(!confirm(`Да изтрия ли страницата „${makeTitle(current.startDate,current.endDate,current.customTitle)}“?`))return;
  state.weeks=state.weeks.filter(w=>w.id!==current.id);activeWeekId=state.weeks[0]?state.weeks[0].id:null;if(!state.weeks.length)createNewWeek(false);saveState();render();
}
function getActiveWeek(){return state.weeks.find(w=>w.id===activeWeekId)||state.weeks[0]||null}
function getSelectedHotel(week){if(!week||!week.hotels.length)return null;let h=week.hotels.find(x=>x.id===week.selectedHotelId);if(!h){h=week.hotels[0];week.selectedHotelId=h.id;saveState()}return h}
function getSelectedSubsection(hotel){if(!hotel||!hotel.subsections.length)return null;let s=hotel.subsections.find(x=>x.id===hotel.selectedSubsectionId);if(!s){s=hotel.subsections[0];hotel.selectedSubsectionId=s.id;saveState()}return s}
function cloneRoomTypes(roomTypes){
  return (roomTypes||[]).map((room,index)=>({
    id:room.id||uid()+'_r'+index,
    name:room.name||'',
    typeLabel:room.typeLabel||room.kind||room.type||'',
    squareMeters:room.squareMeters||room.sqm||room.areaM2||'',
    priceCapacity:room.priceCapacity||room.pricingCapacity||'',
    capacities:normalizeRoomCapacities(room),
    services:Array.isArray(room.services)?room.services.slice():(room.service?[room.service]:[])
  }));
}
function cloneHotelConstants(hotel){
  return {
    name:hotel.name||'',
    operationFrom:hotel.operationFrom||'',
    operationTo:hotel.operationTo||'',
    roomCount:hotel.roomCount||hotel.roomsCount||hotel.totalRooms||'',
    roomTypesLocked:!!hotel.roomTypesLocked,
    toMappingsLocked:!!hotel.toMappingsLocked,
    toMappingGroups:cloneToMappingGroups(hotel.toMappingGroups||[],hotel.toMappings||[]),
    roomServiceCatalog:cloneRoomServiceCatalog(hotel.roomServiceCatalog||[]),
    roomTypes:cloneRoomTypes(hotel.roomTypes||[]),
    contracts:cloneContracts(hotel.contracts||[]),
    selectedContractId:hotel.selectedContractId||null,
    nightsByMonth:normalizeHotelNights(hotel.nightsByMonth||hotel.hotelNights||hotel.nights||{}),roomNightsByMonth:normalizeHotelNights(hotel.roomNightsByMonth||hotel.roomHotelNights||hotel.roomNights||{}),roomNightsTargetsByMonth:normalizeHotelNights(hotel.roomNightsTargetsByMonth||hotel.roomNightTargets||hotel.roomNightsTargets||{}),revenueTargetsByMonth:normalizeHotelNights(hotel.revenueTargetsByMonth||hotel.revenueTargetByMonth||{}),revenueByMonth:normalizeHotelNights(hotel.revenueByMonth||hotel.revenuesByMonth||{}),guestNightsDaily:normalizeHotelDailyMetric(hotel.guestNightsDaily||{}),roomNightsDaily:normalizeHotelDailyMetric(hotel.roomNightsDaily||{}),revenueDaily:normalizeHotelDailyMetric(hotel.revenueDaily||{})
  };
}
function applyHotelConstants(hotel,constants){
  hotel.name=constants.name||'';
  hotel.operationFrom=constants.operationFrom||'';
  hotel.operationTo=constants.operationTo||'';
  hotel.roomCount=constants.roomCount||'';
  hotel.roomTypesLocked=!!constants.roomTypesLocked;
  hotel.toMappingsLocked=!!constants.toMappingsLocked;
  hotel.toMappingGroups=cloneToMappingGroups(constants.toMappingGroups||[],constants.toMappings||[]);delete hotel.toMappings;
  hotel.roomServiceCatalog=cloneRoomServiceCatalog(constants.roomServiceCatalog||[]);
  hotel.roomTypes=cloneRoomTypes(constants.roomTypes||[]);
  hotel.contracts=cloneContracts(constants.contracts||[]);
  hotel.selectedContractId=constants.selectedContractId||((hotel.contracts&&hotel.contracts[0])?hotel.contracts[0].id:null);
  hotel.nightsByMonth=normalizeHotelNights(constants.nightsByMonth||{});
  hotel.roomNightsByMonth=normalizeHotelNights(constants.roomNightsByMonth||{});
  hotel.roomNightsTargetsByMonth=normalizeHotelNights(constants.roomNightsTargetsByMonth||{});
  hotel.revenueTargetsByMonth=normalizeHotelNights(constants.revenueTargetsByMonth||{});
  hotel.revenueByMonth=normalizeHotelNights(constants.revenueByMonth||{});
  hotel.guestNightsDaily=normalizeHotelDailyMetric(constants.guestNightsDaily||{});
  hotel.roomNightsDaily=normalizeHotelDailyMetric(constants.roomNightsDaily||{});
  hotel.revenueDaily=normalizeHotelDailyMetric(constants.revenueDaily||{});
}
function createWeeklyHotelFromConstants(constants){
  const subs=defaultSubsections();
  return {
    id:uid(),
    name:constants.name||'',
    operationFrom:constants.operationFrom||'',
    operationTo:constants.operationTo||'',
    roomCount:constants.roomCount||'',
    roomTypesLocked:!!constants.roomTypesLocked,
    toMappingsLocked:!!constants.toMappingsLocked,
    toMappingGroups:cloneToMappingGroups(constants.toMappingGroups||[],constants.toMappings||[]),
    roomServiceCatalog:cloneRoomServiceCatalog(constants.roomServiceCatalog||[]),
    roomTypes:cloneRoomTypes(constants.roomTypes||[]),
    contracts:cloneContracts(constants.contracts||[]),
    selectedContractId:constants.selectedContractId||null,
    nightsByMonth:normalizeHotelNights(constants.nightsByMonth||{}),roomNightsByMonth:normalizeHotelNights(constants.roomNightsByMonth||{}),roomNightsTargetsByMonth:normalizeHotelNights(constants.roomNightsTargetsByMonth||{}),revenueTargetsByMonth:normalizeHotelNights(constants.revenueTargetsByMonth||{}),revenueByMonth:normalizeHotelNights(constants.revenueByMonth||{}),guestNightsDaily:normalizeHotelDailyMetric(constants.guestNightsDaily||{}),roomNightsDaily:normalizeHotelDailyMetric(constants.roomNightsDaily||{}),revenueDaily:normalizeHotelDailyMetric(constants.revenueDaily||{}),
    selectedSubsectionId:subs[0].id,
    subsections:subs,
    checklist:[],
    emailTableHtml:'',
    contracts:cloneContracts(constants.contracts||[]),
    selectedContractId:constants.selectedContractId||null
  };
}
function syncHotelConstantsAcrossWeeks(sourceWeek){
  if(!sourceWeek||!Array.isArray(sourceWeek.hotels))return;
  const constants=sourceWeek.hotels.map(cloneHotelConstants);
  const now=new Date().toISOString();

  state.weeks.forEach(week=>{
    if(!Array.isArray(week.hotels))week.hotels=[];
    for(let i=0;i<constants.length;i++){
      if(!week.hotels[i]){
        week.hotels[i]=createWeeklyHotelFromConstants(constants[i]);
      }else{
        applyHotelConstants(week.hotels[i],constants[i]);
      }
    }
    if(week.hotels.length>constants.length){
      week.hotels=week.hotels.slice(0,constants.length);
    }
    if(!week.hotels.length){
      week.hotels=defaultHotels();
    }
    if(!week.hotels.find(h=>h.id===week.selectedHotelId)){
      week.selectedHotelId=week.hotels[0].id;
    }
    if(!week.hotels.find(h=>h.id===week.selectedChecklistHotelId)){
      week.selectedChecklistHotelId=week.hotels[0].id;
    }
    if(!week.hotels.find(h=>h.id===week.selectedContractsHotelId)){
      week.selectedContractsHotelId=week.hotels[0].id;
    }
    week.updatedAt=now;
  });

  saveState();
}

function render(){applySectionTheme(getSectionTheme());applyRoomInfoDisplaySettings();renderWeekList();renderMain();applyQuickAccessOrder();renderTodayTasksPreview();window.setTimeout(applyAllSectionThemes,0)}

function renderWeekList(){
  const term=searchInput.value.trim().toLowerCase();weekList.innerHTML='';
  const globalToMappingsText=toMappingHotelsSearchText(state.toMappingHotels||[]).toLowerCase();
  const globalDiscountReservationsText=ensureDiscountReservations().map(r=>`${r.hotel||''} ${discountReservationClockText(r)} ${r.guestName||''} ${r.checkIn||''} ${r.checkOut||''} ${r.roomType||''} ${r.price||''} ${r.discount||''} ${r.comment||''}`).join(' ').toLowerCase();
  const filtered=state.weeks.filter(w=>{
    const title=makeTitle(w.startDate,w.endDate,w.customTitle).toLowerCase();
    const text=w.hotels.map(h=>`${h.name} ${(h.roomTypes||[]).map(r=>`${r.name} ${r.typeLabel||r.kind||r.type||''} ${r.squareMeters||r.sqm||r.areaM2||''} ${r.priceCapacity||r.pricingCapacity||''} ${(Array.isArray(r.capacities)?r.capacities.map(c=>`${c.adults||''}+${c.children||''}`).join(' '):`${r.adults||''}+${r.children||''}`)} ${(Array.isArray(r.services)?r.services.join(' '):(r.service||''))}`).join(' ')} ${(h.roomServiceCatalog||[]).map(s=>`${s.name||''} ${s.details||''}`).join(' ')} ${toMappingGroupsSearchText(h)} ${h.emailTableHtml||''} ${(h.contracts||[]).map(c=>`${c.name||''} ${c.url||''}`).join(' ')} ${(h.checklist||[]).map(c=>c.text).join(' ')} ${h.subsections.map(s=>`${s.name} ${s.periods.map(p=>`${p.fromDate} ${p.toDate} ${p.discount} ${p.note}`).join(' ')}`).join(' ')}`).join(' ').toLowerCase();
    return !term||title.includes(term)||text.includes(term)||globalToMappingsText.includes(term)||globalDiscountReservationsText.includes(term);
  });

  if(!filtered.length){weekList.innerHTML='<div class="empty">Няма намерени седмици.</div>';return}

  const years=new Map();
  filtered.forEach(week=>{
    const year=getWeekYear(week);
    const monthKey=getWeekGroupKey(week);
    if(!years.has(year))years.set(year,new Map());
    if(!years.get(year).has(monthKey))years.get(year).set(monthKey,[]);
    years.get(year).get(monthKey).push(week);
  });

  if(!term && !weekMonthsInitialized){
    const now=new Date();
    const activeWeek=getActiveWeek&&getActiveWeek();
    const fallbackKey=activeWeek?getWeekGroupKey(activeWeek):`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const currentKey=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const openKey=Array.from(years.values()).some(months=>months.has(currentKey))?currentKey:fallbackKey;
    Array.from(years.values()).forEach(months=>Array.from(months.keys()).forEach(key=>{if(key!==openKey)collapsedMonths.add(key);}));
    weekMonthsInitialized=true;
  }

  Array.from(years.keys()).sort((a,b)=>b-a).forEach(year=>{
    const yearWrap=document.createElement('div');
    yearWrap.className='year-group';
    yearWrap.innerHTML=`<div class="year-title">${year}</div>`;

    const months=years.get(year);
    Array.from(months.keys()).sort((a,b)=>b.localeCompare(a)).forEach(monthKey=>{
      const weeks=months.get(monthKey);
      const monthLabel=getWeekGroupLabel(weeks[0]);
      const isCollapsed=!term && collapsedMonths.has(monthKey);

      const monthBtn=document.createElement('button');
      monthBtn.className='month-toggle';
      monthBtn.innerHTML=`<span class="month-name">${isCollapsed?'▶':'▼'} ${escapeHtml(monthLabel.replace(' '+year,''))}</span><span class="month-count">${weeks.length} седмици</span>`;
      monthBtn.addEventListener('click',()=>{
        if(collapsedMonths.has(monthKey))collapsedMonths.delete(monthKey);
        else collapsedMonths.add(monthKey);
        renderWeekList();
      });
      yearWrap.appendChild(monthBtn);

      if(!isCollapsed){
        const monthWeeks=document.createElement('div');
        monthWeeks.className='month-weeks';

        weeks.forEach(week=>{
          const btn=document.createElement('button');
          btn.className='week-item'+(week.id===activeWeekId?' active':'');
          btn.draggable=true;btn.dataset.weekId=week.id;
          btn.innerHTML=`<span class="title">${escapeHtml(formatShortDate(week.startDate)+' - '+formatShortDate(week.endDate))}</span>
            <span class="week-actions no-print"><span class="small icon-btn" data-move-week="${week.id}" data-direction="up" title="Нагоре">↑</span><span class="small icon-btn" data-move-week="${week.id}" data-direction="down" title="Надолу">↓</span></span>`;
          btn.addEventListener('click',e=>{if(e.target.dataset.moveWeek)return;activeWeekId=week.id;saveState();render()});
          btn.querySelectorAll('[data-move-week]').forEach(c=>c.addEventListener('click',e=>{e.stopPropagation();moveWeek(e.target.dataset.moveWeek,e.target.dataset.direction)}));
          btn.addEventListener('dragstart',e=>{draggedWeekId=week.id;btn.classList.add('dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',week.id)});
          btn.addEventListener('dragover',e=>{e.preventDefault();if(btn.dataset.weekId!==draggedWeekId)btn.classList.add('drag-over')});
          btn.addEventListener('dragleave',()=>btn.classList.remove('drag-over'));
          btn.addEventListener('drop',e=>{e.preventDefault();btn.classList.remove('drag-over');reorderWeek(draggedWeekId,week.id)});
          btn.addEventListener('dragend',()=>{btn.classList.remove('dragging');weekList.querySelectorAll('.drag-over').forEach(i=>i.classList.remove('drag-over'));draggedWeekId=null});
          monthWeeks.appendChild(btn);
        });

        yearWrap.appendChild(monthWeeks);
      }
    });

    weekList.appendChild(yearWrap);
  });
}


function openQuickSection(section){
  if(section==='nights'){
    setSectionOpen('hotels',true);
    hotelNightsOpen=true;
    renderHotels();
    const nightsTarget=document.getElementById('hotelNightsSection');
    if(nightsTarget&&nightsTarget.scrollIntoView)nightsTarget.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  if(section==='mapping'){
    setSectionOpen('roomTypes',true);
    toMappingsOpen=true;
    renderRoomTypes();
    const mappingTarget=document.getElementById('toMappingsPanel');
    if(mappingTarget&&mappingTarget.scrollIntoView)mappingTarget.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  if(section==='email'){
    setSectionOpen('discounts',true);
    renderSelectorsAndPeriods();
    setSectionOpen('email',true);
    renderEmailTable();
    const emailTarget=document.getElementById('emailSection');
    if(emailTarget&&emailTarget.scrollIntoView)emailTarget.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  setSectionOpen(section,true);
  if(section==='roomTypes')renderRoomTypes();
  if(section==='contracts')renderContracts();
  if(section==='tasks')renderTasks();
  if(section==='prices')renderPrices();
  if(section==='ultra')renderUltraAllInclusive();
  if(section==='discounts')renderSelectorsAndPeriods();
  if(section==='discountReservations')renderDiscountReservations();
  if(section==='form')renderWorkForm();
  if(section==='email')renderEmailTable();
  if(section==='emailTxt')renderEmailTxt();
  if(section==='cancellations')renderCancellationPolicy();
  const targetId={roomTypes:'roomTypesSection',mapping:'toMappingsPanel',contracts:'contractsSection',tasks:'tasksSection',prices:'pricesSection',ultra:'ultraSection',discounts:'discountsSection',discountReservations:'discountReservationsSection',form:'workFormSection',email:'emailSection',emailTxt:'emailTxtSection',cancellations:'cancellationsSection'}[section];
  const target=targetId?document.getElementById(targetId):null;
  if(target&&target.scrollIntoView)target.scrollIntoView({behavior:'smooth',block:'start'});
}
function diffDays(fromISO,toISO){
  const from=parseISODate(fromISO), to=parseISODate(toISO);
  const fromUTC=Date.UTC(from.getFullYear(),from.getMonth(),from.getDate());
  const toUTC=Date.UTC(to.getFullYear(),to.getMonth(),to.getDate());
  return Math.round((toUTC-fromUTC)/86400000);
}
function todayISO(){return toISODate(new Date())}
function formatFullDisplayDate(iso){return isoToDisplay(iso)}
function cancellationPeriodCard(title,range,note,isActive){
  return `<div class="cancellation-period${isActive?' active':''}"><div class="cancellation-period-title">${escapeHtml(title)}</div><div class="cancellation-period-range">${escapeHtml(range)}</div><div class="cancellation-period-note">${escapeHtml(note)}</div></div>`;
}




function normalizeHotelNights(nights){
  const result={};
  if(Array.isArray(nights)){
    nights.forEach(item=>{
      if(!item)return;
      const key=item.key||item.monthKey||((item.year&&item.month)?`${item.year}-${String(item.month).padStart(2,'0')}`:'');
      const val=String(item.value!==undefined?item.value:(item.nights!==undefined?item.nights:'' )).replace(',', '.').replace(/[^0-9.]/g,'');
      if(/^\d{4}-\d{2}$/.test(key)&&val!=='')result[key]=val;
    });
    return result;
  }
  if(nights&&typeof nights==='object'){
    Object.keys(nights).forEach(key=>{
      if(!/^\d{4}-\d{2}$/.test(key))return;
      const val=String(nights[key]===undefined?'':nights[key]).replace(',', '.').replace(/[^0-9.]/g,'');
      if(val!=='')result[key]=val;
    });
  }
  return result;
}
function normalizeHotelDailyMetric(values){
  const result={};
  if(!values||typeof values!=='object')return result;
  const entries=Array.isArray(values)
    ? values.map(item=>[item&&(item.date||item.key),item&&(item.value!==undefined?item.value:item.amount)])
    : Object.entries(values);
  entries.forEach(([key,value])=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(key||'')))return;
    const cleaned=String(value===undefined?'':value).replace(/\s/g,'').replace(',', '.').replace(/[^0-9.]/g,'');
    if(cleaned!=='')result[key]=cleaned;
  });
  return result;
}
function ensureHotelNights(hotel){
  if(!hotel)return {};
  hotel.nightsByMonth=normalizeHotelNights(hotel.nightsByMonth||hotel.hotelNights||hotel.nights||{});
  delete hotel.hotelNights;
  delete hotel.nights;
  return hotel.nightsByMonth;
}

function ensureHotelRoomNights(hotel){
  if(!hotel)return {};
  hotel.roomNightsByMonth=normalizeHotelNights(hotel.roomNightsByMonth||hotel.roomHotelNights||hotel.roomNights||{});
  delete hotel.roomHotelNights;
  delete hotel.roomNights;
  return hotel.roomNightsByMonth;
}
function ensureHotelRoomNightsTargets(hotel){
  if(!hotel)return {};
  hotel.roomNightsTargetsByMonth=normalizeHotelNights(hotel.roomNightsTargetsByMonth||hotel.roomNightTargets||hotel.roomNightsTargets||{});
  delete hotel.roomNightTargets;
  delete hotel.roomNightsTargets;
  return hotel.roomNightsTargetsByMonth;
}
function ensureHotelRevenueTargets(hotel){
  if(!hotel)return {};
  hotel.revenueTargetsByMonth=normalizeHotelNights(hotel.revenueTargetsByMonth||hotel.revenueTargetByMonth||{});
  delete hotel.revenueTargetByMonth;
  return hotel.revenueTargetsByMonth;
}
function ensureHotelNightsAnalytics(hotel){
  if(!hotel)return;
  ensureHotelNights(hotel);
  ensureHotelRoomNights(hotel);
  ensureHotelRoomNightsTargets(hotel);
  ensureHotelRevenueTargets(hotel);
  hotel.revenueByMonth=normalizeHotelNights(hotel.revenueByMonth||hotel.revenuesByMonth||{});
  hotel.guestNightsDaily=normalizeHotelDailyMetric(hotel.guestNightsDaily||{});
  hotel.roomNightsDaily=normalizeHotelDailyMetric(hotel.roomNightsDaily||{});
  hotel.revenueDaily=normalizeHotelDailyMetric(hotel.revenueDaily||{});
  delete hotel.revenuesByMonth;
}
function hotelMetricMonthlyData(hotel,metric){
  ensureHotelNightsAnalytics(hotel);
  if(metric==='room')return hotel.roomNightsByMonth;
  if(metric==='revenue')return hotel.revenueByMonth;
  return hotel.nightsByMonth;
}
function hotelMetricDailyData(hotel,metric){
  ensureHotelNightsAnalytics(hotel);
  if(metric==='room')return hotel.roomNightsDaily;
  if(metric==='revenue')return hotel.revenueDaily;
  return hotel.guestNightsDaily;
}
function hotelMetricMonthValue(hotel,metric,year,month){
  const prefix=`${year}-${String(month).padStart(2,'0')}-`;
  const dailyValues=Object.entries(hotelMetricDailyData(hotel,metric))
    .filter(([key])=>key.startsWith(prefix))
    .map(([,value])=>Number(String(value).replace(',','.')))
    .filter(Number.isFinite);
  if(dailyValues.length)return Math.max(...dailyValues);
  const fallback=Number(hotelMetricMonthlyData(hotel,metric)[`${year}-${String(month).padStart(2,'0')}`]);
  return Number.isFinite(fallback)?fallback:0;
}
function hotelSeasonMonths(year){
  return Number(year)===2025?[4,5,6,7,8,9,10]:[5,6,7,8,9,10];
}
function hotelMetricYearTotal(hotel,metric,year){
  let total=0;
  hotelSeasonMonths(year).forEach(month=>{total+=hotelMetricMonthValue(hotel,metric,year,month);});
  return total;
}
function hotelNightsTotal(hotel,year){return hotelMetricYearTotal(hotel,'guest',Number(year)||hotelNightsYear)}
function hotelRoomNightsTotal(hotel,year){return hotelMetricYearTotal(hotel,'room',Number(year)||hotelNightsYear)}
function hotelRevenueTotal(hotel,year){return hotelMetricYearTotal(hotel,'revenue',Number(year)||hotelNightsYear)}
function hotelRoomNightsTargetsTotal(hotel,year){
  const data=ensureHotelRoomNightsTargets(hotel);
  const selectedYear=Number(year)||hotelNightsYear;
  const months=hotelSeasonMonths(selectedYear);
  return Object.entries(data).reduce((sum,[key,val])=>{
    if(String(key).slice(0,4)!==String(selectedYear)||!months.includes(Number(String(key).slice(5,7))))return sum;
    const n=Number(String(val).replace(',','.'));
    return sum+(Number.isFinite(n)?n:0);
  },0);
}
function hotelRevenueTargetsTotal(hotel,year){
  const data=ensureHotelRevenueTargets(hotel);
  const selectedYear=Number(year)||hotelNightsYear;
  const months=hotelSeasonMonths(selectedYear);
  return Object.entries(data).reduce((sum,[key,val])=>{
    if(String(key).slice(0,4)!==String(selectedYear)||!months.includes(Number(String(key).slice(5,7))))return sum;
    const n=Number(String(val).replace(',','.'));
    return sum+(Number.isFinite(n)?n:0);
  },0);
}
function formatHotelNightsNumber(value){
  const n=parseFloat(String(value||0).replace(',','.'));
  if(!Number.isFinite(n))return '0';
  return (Math.round(n*100)/100).toLocaleString('bg-BG',{maximumFractionDigits:2});
}
function formatHotelRevenue(value){
  const n=Number(String(value||0).replace(/\s/g,'').replace(',','.'));
  return Number.isFinite(n)?Math.round(n).toLocaleString('bg-BG'):'0';
}
function formatHotelAdr(revenue,roomNights){
  const rooms=Number(roomNights)||0;
  return rooms>0?(Number(revenue||0)/rooms).toLocaleString('bg-BG',{minimumFractionDigits:2,maximumFractionDigits:2}):'0,00';
}
function selectHotelNightsHotel(id){
  const w=getActiveWeek();
  if(!w||!w.hotels.find(h=>h.id===id))return;
  w.selectedHotelId=id;
  touchWeek(w);
  saveState();
  renderHotels();
}
function changeHotelNightsYear(delta){
  hotelNightsYear+=delta;
  hotelNightsDialog=null;
  hotelNightsTargetsOpen=false;
  renderHotels();
}
function syncHotelNightsAnalyticsAcrossWeeks(sourceWeek,hotelId){
  if(!sourceWeek||!Array.isArray(sourceWeek.hotels))return;
  const index=sourceWeek.hotels.findIndex(h=>h.id===hotelId);
  if(index<0)return;
  const source=sourceWeek.hotels[index];
  ensureHotelNightsAnalytics(source);
  const snapshot={
    nightsByMonth:normalizeHotelNights(source.nightsByMonth),
    roomNightsByMonth:normalizeHotelNights(source.roomNightsByMonth),
    roomNightsTargetsByMonth:normalizeHotelNights(source.roomNightsTargetsByMonth),
    revenueTargetsByMonth:normalizeHotelNights(source.revenueTargetsByMonth),
    revenueByMonth:normalizeHotelNights(source.revenueByMonth),
    guestNightsDaily:normalizeHotelDailyMetric(source.guestNightsDaily),
    roomNightsDaily:normalizeHotelDailyMetric(source.roomNightsDaily),
    revenueDaily:normalizeHotelDailyMetric(source.revenueDaily)
  };
  const now=new Date().toISOString();
  state.weeks.forEach(week=>{
    const hotel=week&&Array.isArray(week.hotels)?week.hotels[index]:null;
    if(!hotel||hotel===source)return;
    hotel.nightsByMonth=normalizeHotelNights(snapshot.nightsByMonth);
    hotel.roomNightsByMonth=normalizeHotelNights(snapshot.roomNightsByMonth);
    hotel.roomNightsTargetsByMonth=normalizeHotelNights(snapshot.roomNightsTargetsByMonth);
    hotel.revenueTargetsByMonth=normalizeHotelNights(snapshot.revenueTargetsByMonth);
    hotel.revenueByMonth=normalizeHotelNights(snapshot.revenueByMonth);
    hotel.guestNightsDaily=normalizeHotelDailyMetric(snapshot.guestNightsDaily);
    hotel.roomNightsDaily=normalizeHotelDailyMetric(snapshot.roomNightsDaily);
    hotel.revenueDaily=normalizeHotelDailyMetric(snapshot.revenueDaily);
    week.updatedAt=now;
  });
}
function updateHotelNightsValue(hotelId,year,month,value,metric){
  const w=getActiveWeek();
  if(!w)return;
  const hotel=w.hotels.find(h=>h.id===hotelId);
  if(!hotel)return;
  const data=metric==='target'?ensureHotelRoomNightsTargets(hotel):(metric==='revenueTarget'?ensureHotelRevenueTargets(hotel):hotelMetricMonthlyData(hotel,metric));
  const key=`${year}-${String(month).padStart(2,'0')}`;
  const cleaned=String(value||'').replace(/\s/g,'').replace(',', '.').replace(/[^0-9.]/g,'');
  if(cleaned==='')delete data[key];
  else data[key]=cleaned;
  touchWeek(w);
  syncHotelNightsAnalyticsAcrossWeeks(w,hotelId);
  updateHotelNightsTotalsUI(hotelId);
  if(metric==='target'){
    document.querySelectorAll(`[data-hotel-room-target-value="${year}:${month}"]`).forEach(el=>el.textContent=formatHotelNightsNumber(cleaned||0));
  }else if(metric==='revenueTarget'){
    document.querySelectorAll(`[data-hotel-revenue-target-value="${year}:${month}"]`).forEach(el=>el.textContent=formatHotelRevenue(cleaned||0));
  }
  scheduleSilentStateSave();
}
function updateHotelDailyMetric(hotelId,date,value,metric){
  const w=getActiveWeek();
  if(!w)return;
  const hotel=w.hotels.find(h=>h.id===hotelId);
  if(!hotel)return;
  const daily=hotelMetricDailyData(hotel,metric);
  const cleaned=String(value||'').replace(/\s/g,'').replace(',', '.').replace(/[^0-9.]/g,'');
  if(cleaned==='')delete daily[date];
  else daily[date]=cleaned;
  const year=Number(date.slice(0,4)),month=Number(date.slice(5,7));
  const monthKey=date.slice(0,7);
  const hasDaily=Object.keys(daily).some(key=>key.startsWith(monthKey+'-'));
  if(hasDaily){
    const monthValue=hotelMetricMonthValue(hotel,metric,year,month);
    hotelMetricMonthlyData(hotel,metric)[monthKey]=String(monthValue);
  }else{
    delete hotelMetricMonthlyData(hotel,metric)[monthKey];
  }
  touchWeek(w);
  syncHotelNightsAnalyticsAcrossWeeks(w,hotelId);
  updateHotelNightsTotalsUI(hotelId);
  updateHotelNightsMonthUI(hotel,year,month);
  scheduleSilentStateSave();
}
function updateHotelNightsTotalsUI(hotelId){
  const w=getActiveWeek();
  if(!w)return;
  const hotel=w.hotels.find(h=>h.id===hotelId);
  if(!hotel)return;
  document.querySelectorAll(`[data-hotel-nights-total="${hotelId}"]`).forEach(el=>{
    const year=el.dataset.year;
    el.textContent=formatHotelNightsNumber(hotelNightsTotal(hotel,year||undefined));
  });
  document.querySelectorAll(`[data-hotel-room-nights-total="${hotelId}"]`).forEach(el=>{
    const year=el.dataset.year;
    el.textContent=formatHotelNightsNumber(hotelRoomNightsTotal(hotel,year||undefined));
  });
  document.querySelectorAll(`[data-hotel-room-target-total="${hotelId}"]`).forEach(el=>{
    const year=el.dataset.year;
    el.textContent=formatHotelNightsNumber(hotelRoomNightsTargetsTotal(hotel,year||undefined));
  });
  document.querySelectorAll(`[data-hotel-revenue-target-total="${hotelId}"]`).forEach(el=>{
    el.textContent=formatHotelRevenue(hotelRevenueTargetsTotal(hotel,el.dataset.year||hotelNightsYear));
  });
  document.querySelectorAll(`[data-hotel-revenue-total="${hotelId}"]`).forEach(el=>{
    el.textContent=formatHotelRevenue(hotelRevenueTotal(hotel,el.dataset.year||hotelNightsYear));
  });
  document.querySelectorAll(`[data-hotel-person-adr-total="${hotelId}"]`).forEach(el=>{
    const year=Number(el.dataset.year)||hotelNightsYear;
    el.textContent=formatHotelAdr(hotelRevenueTotal(hotel,year),hotelNightsTotal(hotel,year));
  });
  document.querySelectorAll(`[data-hotel-room-adr-total="${hotelId}"]`).forEach(el=>{
    const year=Number(el.dataset.year)||hotelNightsYear;
    el.textContent=formatHotelAdr(hotelRevenueTotal(hotel,year),hotelRoomNightsTotal(hotel,year));
  });
}
function updateHotelNightsMonthUI(hotel,year,month){
  ['guest','room','revenue'].forEach(metric=>{
    const value=hotelMetricMonthValue(hotel,metric,year,month);
    document.querySelectorAll(`[data-hotel-month-value="${metric}:${year}:${month}"]`).forEach(el=>{
      el.textContent=metric==='revenue'?formatHotelRevenue(value):formatHotelNightsNumber(value);
    });
  });
  const guest=hotelMetricMonthValue(hotel,'guest',year,month);
  const revenue=hotelMetricMonthValue(hotel,'revenue',year,month);
  const rooms=hotelMetricMonthValue(hotel,'room',year,month);
  document.querySelectorAll(`[data-hotel-month-person-adr="${year}:${month}"]`).forEach(el=>el.textContent=formatHotelAdr(revenue,guest));
  document.querySelectorAll(`[data-hotel-month-room-adr="${year}:${month}"]`).forEach(el=>el.textContent=formatHotelAdr(revenue,rooms));
  const summary=document.querySelector('[data-hotel-nights-dialog-summary]');
  if(summary&&hotelNightsDialog&&hotelNightsDialog.hotelId===hotel.id&&hotelNightsDialog.year===year&&hotelNightsDialog.month===month){
    summary.innerHTML=`Гости: <strong>${formatHotelNightsNumber(guest)}</strong> · Стаи: <strong>${formatHotelNightsNumber(rooms)}</strong> · Приходи: <strong>${formatHotelRevenue(revenue)}</strong> · ADR човек: <strong>${formatHotelAdr(revenue,guest)}</strong> · ADR стая: <strong>${formatHotelAdr(revenue,rooms)}</strong>`;
  }
}
function hotelNightsMonthCard(hotel,month,label){
  const year=hotelNightsYear,previousYear=year-1;
  const guest=hotelMetricMonthValue(hotel,'guest',year,month);
  const guestPrevious=hotelMetricMonthValue(hotel,'guest',previousYear,month);
  const room=hotelMetricMonthValue(hotel,'room',year,month);
  const roomPrevious=hotelMetricMonthValue(hotel,'room',previousYear,month);
  const revenue=hotelMetricMonthValue(hotel,'revenue',year,month);
  const revenuePrevious=hotelMetricMonthValue(hotel,'revenue',previousYear,month);
  const targets=ensureHotelRoomNightsTargets(hotel);
  const revenueTargets=ensureHotelRevenueTargets(hotel);
  const targetKey=`${year}-${String(month).padStart(2,'0')}`;
  const previousTargetKey=`${previousYear}-${String(month).padStart(2,'0')}`;
  return `<div class="hotel-nights-month metric-card combined" role="button" tabindex="0" data-open-hotel-nights-month="${month}">
    <div class="hotel-nights-month-name">${escapeHtml(label)}</div>
    <div class="hotel-nights-comparison-head"><span>Показател</span><strong>${year}</strong><strong>${previousYear}</strong></div>
    <div class="hotel-nights-comparison-row"><span>Нощувки гости</span><strong data-hotel-month-value="guest:${year}:${month}">${formatHotelNightsNumber(guest)}</strong><strong data-hotel-month-value="guest:${previousYear}:${month}">${formatHotelNightsNumber(guestPrevious)}</strong></div>
    <div class="hotel-nights-comparison-row"><span>Нощувки стаи</span><strong data-hotel-month-value="room:${year}:${month}">${formatHotelNightsNumber(room)}</strong><strong data-hotel-month-value="room:${previousYear}:${month}">${formatHotelNightsNumber(roomPrevious)}</strong></div>
    <div class="hotel-nights-comparison-row target"><span>Таргет нощувки</span><strong data-hotel-room-target-value="${year}:${month}">${formatHotelNightsNumber(targets[targetKey]||0)}</strong><strong>${formatHotelNightsNumber(targets[previousTargetKey]||0)}</strong></div>
    <div class="hotel-nights-comparison-row target"><span>Таргет приходи</span><strong data-hotel-revenue-target-value="${year}:${month}">${formatHotelRevenue(revenueTargets[targetKey]||0)}</strong><strong>${formatHotelRevenue(revenueTargets[previousTargetKey]||0)}</strong></div>
    <div class="hotel-nights-comparison-row"><span>Приходи</span><strong data-hotel-month-value="revenue:${year}:${month}">${formatHotelRevenue(revenue)}</strong><strong data-hotel-month-value="revenue:${previousYear}:${month}">${formatHotelRevenue(revenuePrevious)}</strong></div>
    <div class="hotel-nights-comparison-row adr"><span>ADR на човек</span><strong data-hotel-month-person-adr="${year}:${month}">${formatHotelAdr(revenue,guest)}</strong><strong data-hotel-month-person-adr="${previousYear}:${month}">${formatHotelAdr(revenuePrevious,guestPrevious)}</strong></div>
    <div class="hotel-nights-comparison-row adr"><span>ADR на стая</span><strong data-hotel-month-room-adr="${year}:${month}">${formatHotelAdr(revenue,room)}</strong><strong data-hotel-month-room-adr="${previousYear}:${month}">${formatHotelAdr(revenuePrevious,roomPrevious)}</strong></div>
  </div>`;
}
function renderHotelNightsDialog(hotel,year,month){
  const days=new Date(year,month,0).getDate();
  const rows=Array.from({length:days},(_,index)=>{
    const day=index+1;
    const date=`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const weekday=new Date(year,month-1,day).toLocaleDateString('bg-BG',{weekday:'short'});
    return `<div class="hotel-nights-day-row">
      <div class="hotel-nights-day-date"><strong>${day}</strong><span>${escapeHtml(weekday)}</span></div>
      <input type="text" inputmode="numeric" value="${escapeAttr(hotel.guestNightsDaily[date]||'')}" data-hotel-daily-metric="guest" data-date="${date}" placeholder="0" />
      <input type="text" inputmode="numeric" value="${escapeAttr(hotel.roomNightsDaily[date]||'')}" data-hotel-daily-metric="room" data-date="${date}" placeholder="0" />
      <input class="revenue" type="text" inputmode="numeric" value="${escapeAttr(hotel.revenueDaily[date]?formatHotelRevenue(hotel.revenueDaily[date]):'')}" data-hotel-daily-metric="revenue" data-date="${date}" placeholder="0" />
    </div>`;
  }).join('');
  return `<div class="hotel-nights-dialog-backdrop" data-close-hotel-nights-dialog>
    <div class="hotel-nights-dialog" role="dialog" aria-modal="true" aria-label="${escapeAttr(monthNames[month-1]+' '+year)}" onclick="event.stopPropagation()">
      <div class="hotel-nights-dialog-head"><div><strong>${escapeHtml(monthNames[month-1])} ${year}</strong><span>Въвеждай натрупаното към съответната дата. Използва се най-голямата стойност.</span></div><button type="button" class="icon-btn" data-close-hotel-nights-dialog aria-label="Затвори">×</button></div>
      <div class="hotel-nights-dialog-summary" data-hotel-nights-dialog-summary></div>
      <div class="hotel-nights-day-head"><span>Дата</span><span>Гости</span><span>Стаи</span><span>Приходи</span></div>
      <div class="hotel-nights-day-list">${rows}</div>
    </div>
  </div>`;
}
function openHotelNightsMonth(hotelId,month){
  hotelNightsDialog={hotelId,year:hotelNightsYear,month:Number(month)};
  renderHotelNights();
}
function closeHotelNightsDialog(){
  hotelNightsDialog=null;
  const dialog=document.querySelector('.hotel-nights-dialog-backdrop');
  if(dialog)dialog.remove();
  flushScheduledSilentStateSave();
}
function renderHotelNightsTargetsDialog(hotel,year){
  const roomTargets=ensureHotelRoomNightsTargets(hotel);
  const revenueTargets=ensureHotelRevenueTargets(hotel);
  const rows=hotelSeasonMonths(year).map(month=>{
    const key=`${year}-${String(month).padStart(2,'0')}`;
    return `<div class="hotel-targets-row">
      <strong>${escapeHtml(monthNames[month-1])}</strong>
      <label><span>Таргет нощувки</span><input type="number" min="0" step="1" inputmode="numeric" value="${escapeAttr(roomTargets[key]||'')}" data-hotel-target-editor="target" data-year="${year}" data-month="${month}" placeholder="0" /></label>
      <label><span>Таргет приходи</span><input type="text" inputmode="numeric" value="${escapeAttr(revenueTargets[key]?formatHotelRevenue(revenueTargets[key]):'')}" data-hotel-target-editor="revenueTarget" data-year="${year}" data-month="${month}" placeholder="0" /></label>
    </div>`;
  }).join('');
  return `<div class="hotel-nights-dialog-backdrop" data-close-hotel-targets>
    <div class="hotel-nights-dialog hotel-targets-dialog" role="dialog" aria-modal="true" aria-label="Таргети ${year}" onclick="event.stopPropagation()">
      <div class="hotel-nights-dialog-head"><div><strong>Таргети ${year}</strong><span>Въведи месечните таргети. Стойностите се показват автоматично в основната таблица.</span></div><button type="button" class="icon-btn" data-close-hotel-targets aria-label="Затвори">×</button></div>
      <div class="hotel-targets-list">${rows}</div>
      <div class="hotel-targets-actions"><button type="button" class="primary small" data-close-hotel-targets>Готово</button></div>
    </div>
  </div>`;
}
function toggleHotelNightsTargets(){
  hotelNightsTargetsOpen=!hotelNightsTargetsOpen;
  hotelNightsDialog=null;
  renderHotelNights();
}
function closeHotelNightsTargets(){
  hotelNightsTargetsOpen=false;
  flushScheduledSilentStateSave();
  renderHotelNights();
}
function renderHotelNights(){
  const w=getActiveWeek();
  const wrap=document.getElementById('hotelNightsPanel');
  if(!w||!wrap)return;
  if(!Array.isArray(w.hotels)||!w.hotels.length){
    wrap.innerHTML='<div class="empty">Няма хотели.</div>';
    return;
  }
  let selected=getSelectedHotel(w)||w.hotels[0];
  if(!selected){wrap.innerHTML='<div class="empty">Няма избран хотел.</div>';return;}
  ensureHotelNightsAnalytics(selected);
  const tabs=w.hotels.map((hotel,index)=>{
    ensureHotelNightsAnalytics(hotel);
    const name=(hotel.name&&hotel.name.trim())?hotel.name.trim():`Хотел ${index+1}`;
    const guestTotal=formatHotelNightsNumber(hotelNightsTotal(hotel,hotelNightsYear));
    const roomTotal=formatHotelNightsNumber(hotelRoomNightsTotal(hotel,hotelNightsYear));
    return `<button class="hotel-nights-tab small${hotel.id===selected.id?' active':''}" type="button" data-select-hotel-nights="${escapeAttr(hotel.id)}"><span class="hotel-nights-tab-name">${escapeHtml(name)}</span><span class="hotel-nights-tab-total">Нощувки гости: <span data-hotel-nights-total="${escapeAttr(hotel.id)}">${guestTotal}</span></span><span class="hotel-nights-tab-total">Нощувки стаи: <span data-hotel-room-nights-total="${escapeAttr(hotel.id)}">${roomTotal}</span></span></button>`;
  }).join('');
  const monthCards=hotelSeasonMonths(hotelNightsYear).map(month=>hotelNightsMonthCard(selected,month,monthNames[month-1])).join('');
  const guestYearTotal=formatHotelNightsNumber(hotelNightsTotal(selected,hotelNightsYear));
  const roomYearTotal=formatHotelNightsNumber(hotelRoomNightsTotal(selected,hotelNightsYear));
  const targetYearTotal=formatHotelNightsNumber(hotelRoomNightsTargetsTotal(selected,hotelNightsYear));
  const revenueTargetYearTotal=formatHotelRevenue(hotelRevenueTargetsTotal(selected,hotelNightsYear));
  const revenueYearTotal=formatHotelRevenue(hotelRevenueTotal(selected,hotelNightsYear));
  const personAdrYear=formatHotelAdr(hotelRevenueTotal(selected,hotelNightsYear),hotelNightsTotal(selected,hotelNightsYear));
  const roomAdrYear=formatHotelAdr(hotelRevenueTotal(selected,hotelNightsYear),hotelRoomNightsTotal(selected,hotelNightsYear));
  const dialog=hotelNightsDialog&&hotelNightsDialog.hotelId===selected.id?renderHotelNightsDialog(selected,hotelNightsDialog.year,hotelNightsDialog.month):'';
  const targetsDialog=hotelNightsTargetsOpen?renderHotelNightsTargetsDialog(selected,hotelNightsYear):'';
  wrap.innerHTML=`
    <div class="hotel-nights-tabs">${tabs}</div>
    <div class="hotel-nights-yearbar">
      <div><strong>Нощувки по месеци</strong><div class="muted">Попълва се ръчно и не е обвързано с други раздели.</div></div>
      <div class="hotel-nights-year-actions">
        <button class="small" type="button" data-nights-year-prev>‹</button>
        <strong>${hotelNightsYear}</strong>
        <button class="small" type="button" data-nights-year-next>›</button>
        <button class="small hotel-targets-open-btn" type="button" data-open-hotel-targets>Таргети</button>
      </div>
      <div class="hotel-nights-summary">
        <span class="hotel-nights-pill">Нощувки гости: <span data-hotel-nights-total="${escapeAttr(selected.id)}" data-year="${hotelNightsYear}">${guestYearTotal}</span></span>
        <span class="hotel-nights-pill">Нощувки стаи: <span data-hotel-room-nights-total="${escapeAttr(selected.id)}" data-year="${hotelNightsYear}">${roomYearTotal}</span></span>
        <span class="hotel-nights-pill">Таргет нощувки: <span data-hotel-room-target-total="${escapeAttr(selected.id)}" data-year="${hotelNightsYear}">${targetYearTotal}</span></span>
        <span class="hotel-nights-pill">Таргет приходи: <span data-hotel-revenue-target-total="${escapeAttr(selected.id)}" data-year="${hotelNightsYear}">${revenueTargetYearTotal}</span></span>
        <span class="hotel-nights-pill">Приходи: <span data-hotel-revenue-total="${escapeAttr(selected.id)}" data-year="${hotelNightsYear}">${revenueYearTotal}</span></span>
        <span class="hotel-nights-pill">ADR на човек: <span data-hotel-person-adr-total="${escapeAttr(selected.id)}" data-year="${hotelNightsYear}">${personAdrYear}</span></span>
        <span class="hotel-nights-pill">ADR на стая: <span data-hotel-room-adr-total="${escapeAttr(selected.id)}" data-year="${hotelNightsYear}">${roomAdrYear}</span></span>
      </div>
    </div>
    <div class="hotel-nights-table">
      <div class="hotel-nights-table-head"><div><div class="hotel-nights-table-title">Месечно сравнение</div><div class="hotel-nights-table-note">Всички показатели са събрани по месеци. Натисни месец, за да попълниш стойностите към дата.</div></div></div>
      <div class="hotel-nights-grid combined-grid">${monthCards}</div>
    </div>
    <div class="hotel-nights-help">За месечен резултат се използва най-голямата въведена натрупана стойност към дата, а не сборът на дневните записи.</div>
    ${dialog}
    ${targetsDialog}
  `;
  wrap.querySelectorAll('[data-select-hotel-nights]').forEach(btn=>btn.addEventListener('click',()=>selectHotelNightsHotel(btn.dataset.selectHotelNights)));
  const prev=wrap.querySelector('[data-nights-year-prev]');
  const next=wrap.querySelector('[data-nights-year-next]');
  if(prev)prev.addEventListener('click',()=>changeHotelNightsYear(-1));
  if(next)next.addEventListener('click',()=>changeHotelNightsYear(1));
  wrap.querySelectorAll('[data-open-hotel-nights-month]').forEach(card=>{
    card.addEventListener('click',()=>openHotelNightsMonth(selected.id,Number(card.dataset.openHotelNightsMonth)));
    card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openHotelNightsMonth(selected.id,Number(card.dataset.openHotelNightsMonth));}});
  });
  const targetsButton=wrap.querySelector('[data-open-hotel-targets]');
  if(targetsButton)targetsButton.addEventListener('click',toggleHotelNightsTargets);
  wrap.querySelectorAll('[data-close-hotel-targets]').forEach(button=>button.addEventListener('click',closeHotelNightsTargets));
  wrap.querySelectorAll('[data-hotel-target-editor]').forEach(input=>{
    input.addEventListener('focus',()=>{if(input.dataset.hotelTargetEditor==='revenueTarget')input.value=input.value.replace(/\s/g,'');});
    input.addEventListener('input',()=>updateHotelNightsValue(selected.id,Number(input.dataset.year),Number(input.dataset.month),input.value,input.dataset.hotelTargetEditor));
    input.addEventListener('blur',()=>{if(input.dataset.hotelTargetEditor==='revenueTarget'&&input.value)input.value=formatHotelRevenue(input.value);flushScheduledSilentStateSave();});
    input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();input.blur();}});
  });
  wrap.querySelectorAll('[data-close-hotel-nights-dialog]').forEach(button=>button.addEventListener('click',closeHotelNightsDialog));
  wrap.querySelectorAll('[data-hotel-daily-metric]').forEach(input=>{
    input.addEventListener('focus',()=>{if(input.dataset.hotelDailyMetric==='revenue')input.value=input.value.replace(/\s/g,'');});
    input.addEventListener('input',()=>updateHotelDailyMetric(selected.id,input.dataset.date,input.value,input.dataset.hotelDailyMetric));
    input.addEventListener('blur',()=>{if(input.dataset.hotelDailyMetric==='revenue'&&input.value)input.value=formatHotelRevenue(input.value);flushScheduledSilentStateSave();});
    input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();updateHotelDailyMetric(selected.id,input.dataset.date,input.value,input.dataset.hotelDailyMetric);closeHotelNightsDialog();}});
  });
  if(hotelNightsDialog&&hotelNightsDialog.hotelId===selected.id)updateHotelNightsMonthUI(selected,hotelNightsDialog.year,hotelNightsDialog.month);
  applyAllSectionThemes();
}

function normalizeContracts(contracts){
  return (Array.isArray(contracts)?contracts:[]).map((item,index)=>({
    id:(item&&item.id)||uid()+'_contract_'+index,
    name:(item&&item.name)||'Договор '+(index+1),
    url:(item&&item.url)||'',
    updatedAt:(item&&item.updatedAt)||''
  }));
}
function cloneContracts(contracts){
  return normalizeContracts(contracts).map(item=>({id:item.id,name:item.name,url:item.url,updatedAt:item.updatedAt||''}));
}
function getContractsHotel(week){
  if(!week||!Array.isArray(week.hotels)||!week.hotels.length)return null;
  if(!week.selectedContractsHotelId||!week.hotels.find(h=>h.id===week.selectedContractsHotelId)){
    week.selectedContractsHotelId=week.selectedHotelId&&week.hotels.find(h=>h.id===week.selectedHotelId)?week.selectedHotelId:week.hotels[0].id;
  }
  return week.hotels.find(h=>h.id===week.selectedContractsHotelId)||week.hotels[0];
}
function ensureHotelContracts(hotel){
  if(!hotel)return [];
  if(!Array.isArray(hotel.contracts))hotel.contracts=[];
  hotel.contracts=normalizeContracts(hotel.contracts);
  if(hotel.contracts.length&&!hotel.selectedContractId)hotel.selectedContractId=hotel.contracts[0].id;
  if(hotel.selectedContractId&&!hotel.contracts.find(c=>c.id===hotel.selectedContractId))hotel.selectedContractId=hotel.contracts[0]?hotel.contracts[0].id:null;
  return hotel.contracts;
}
function getSelectedContract(hotel){
  const contracts=ensureHotelContracts(hotel);
  if(!contracts.length)return null;
  let contract=contracts.find(c=>c.id===hotel.selectedContractId);
  if(!contract){contract=contracts[0];hotel.selectedContractId=contract.id;}
  return contract;
}
function selectContractsHotel(id){
  const week=getActiveWeek();
  if(!week)return;
  week.selectedContractsHotelId=id;
  const hotel=getContractsHotel(week);
  if(hotel)ensureHotelContracts(hotel);
  touchWeek(week);
  renderContracts();
}
function selectContract(id){
  const week=getActiveWeek(), hotel=getContractsHotel(week);
  if(!week||!hotel)return;
  hotel.selectedContractId=id;
  touchWeek(week);
  renderContracts();
}
function addContract(){
  const week=getActiveWeek(), hotel=getContractsHotel(week);
  if(!week||!hotel)return;
  const contracts=ensureHotelContracts(hotel);
  const contract={id:uid()+'_contract',name:`Договор ${contracts.length+1}`,url:'',updatedAt:new Date().toISOString()};
  contracts.push(contract);
  hotel.selectedContractId=contract.id;
  syncHotelConstantsAcrossWeeks(week);
  renderContracts();
}
function deleteSelectedContract(){
  const week=getActiveWeek(), hotel=getContractsHotel(week), contract=getSelectedContract(hotel);
  if(!week||!hotel||!contract)return;
  if(!confirm(`Да изтрия ли договора „${contract.name||'Договор'}“?`))return;
  hotel.contracts=ensureHotelContracts(hotel).filter(c=>c.id!==contract.id);
  hotel.selectedContractId=hotel.contracts[0]?hotel.contracts[0].id:null;
  syncHotelConstantsAcrossWeeks(week);
  renderContracts();
}
function extractDriveFileId(url){
  const value=String(url||'').trim();
  if(!value)return '';
  const patterns=[/\/file\/d\/([^/?#]+)/i,/[?&]id=([^&#]+)/i,/\/d\/([^/?#]+)/i];
  for(const pattern of patterns){
    const match=value.match(pattern);
    if(match&&match[1])return decodeURIComponent(match[1]);
  }
  return '';
}
function contractPreviewUrl(url){
  const value=String(url||'').trim();
  if(!value)return '';
  const driveId=extractDriveFileId(value);
  if(driveId)return `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview`;
  return value;
}
function refreshContractPreview(){
  const frame=document.getElementById('contractPreviewFrame');
  const empty=document.getElementById('contractPreviewEmpty');
  const week=getActiveWeek(), hotel=getContractsHotel(week), contract=getSelectedContract(hotel);
  const preview=contract?contractPreviewUrl(contract.url):'';
  if(!frame||!empty)return;
  if(preview){
    frame.src=preview;
    frame.classList.remove('hidden');
    empty.classList.add('hidden');
  }else{
    frame.removeAttribute('src');
    frame.classList.add('hidden');
    empty.classList.remove('hidden');
    empty.textContent='Постави Google Drive PDF линк и натисни Preview.';
  }
}
function openSelectedContractLink(){
  const week=getActiveWeek(), hotel=getContractsHotel(week), contract=getSelectedContract(hotel);
  const url=contract&&contract.url?contract.url:'';
  if(!url){alert('Първо постави линк към договора.');return;}
  window.open(url,'_blank','noopener');
}
function updateSelectedContractFromEditor(options={}){
  const week=getActiveWeek(), hotel=getContractsHotel(week), contract=getSelectedContract(hotel);
  if(!week||!hotel||!contract)return;
  const nameInput=document.getElementById('contractNameInput');
  const urlInput=document.getElementById('contractUrlInput');
  if(nameInput)contract.name=nameInput.value.trim()||'Договор';
  if(urlInput)contract.url=urlInput.value.trim();
  contract.updatedAt=new Date().toISOString();
  if(options.save){
    touchWeek(week);
    syncHotelConstantsAcrossWeeks(week);
  }else{
    saveStateSafe();
  }
}
function saveSelectedContract(){
  updateSelectedContractFromEditor({save:true});
  renderContracts();
}

function renderContracts(){
  const week=getActiveWeek();
  const hotelTabs=document.getElementById('contractsHotelTabs');
  const contractButtons=document.getElementById('contractButtons');
  const title=document.getElementById('contractsHotelTitle');
  const summary=document.getElementById('contractsSummary');
  const empty=document.getElementById('contractsEmpty');
  const panel=document.getElementById('contractEditorPanel');
  if(!week||!hotelTabs||!contractButtons||!title||!summary||!empty||!panel)return;

  hotelTabs.innerHTML='';
  week.hotels.forEach((hotel,index)=>{
    ensureHotelContracts(hotel);
    const btn=document.createElement('button');
    btn.className='hotel-tab small'+(hotel.id===week.selectedContractsHotelId?' active':'');
    btn.innerHTML=`<span class="hotel-name">${escapeHtml(hotel.name||'Хотел '+(index+1))}</span><span class="hotel-operation">${hotel.contracts.length} договора</span>`;
    btn.addEventListener('click',()=>selectContractsHotel(hotel.id));
    hotelTabs.appendChild(btn);
  });

  const hotel=getContractsHotel(week);
  if(!hotel){
    title.textContent='Договори';
    summary.textContent='Няма избран хотел.';
    contractButtons.innerHTML='';
    empty.classList.remove('hidden');
    panel.classList.add('hidden');
    return;
  }
  const contracts=ensureHotelContracts(hotel);
  const selected=getSelectedContract(hotel);
  title.textContent=hotel.name?`Договори · ${hotel.name}`:'Договори';
  summary.textContent=contracts.length===1?'1 договор':`${contracts.length} договора`;
  contractButtons.innerHTML='';
  contracts.forEach((contract,index)=>{
    const btn=document.createElement('button');
    btn.className='contract-button'+(selected&&contract.id===selected.id?' active':'');
    const hasPreview=contract.url?'PDF линк':'без линк';
    btn.innerHTML=`<span class="contract-button-name">${escapeHtml(contract.name||'Договор '+(index+1))}</span><span class="contract-button-meta">${hasPreview}</span>`;
    btn.addEventListener('click',()=>selectContract(contract.id));
    contractButtons.appendChild(btn);
  });

  empty.classList.toggle('hidden',!!selected);
  panel.classList.toggle('hidden',!selected);
  const deleteBtn=document.getElementById('deleteContractBtn');
  const saveBtn=document.getElementById('saveContractBtn');
  if(deleteBtn)deleteBtn.disabled=!selected;
  if(saveBtn)saveBtn.disabled=!selected;
  if(!selected)return;

  const nameInput=document.getElementById('contractNameInput');
  const urlInput=document.getElementById('contractUrlInput');
  if(nameInput){nameInput.value=selected.name||'';nameInput.oninput=()=>{updateSelectedContractFromEditor();const active=contractButtons.querySelector('.contract-button.active .contract-button-name');if(active)active.textContent=nameInput.value.trim()||'Договор';};}
  if(urlInput){urlInput.value=selected.url||'';urlInput.oninput=()=>updateSelectedContractFromEditor();urlInput.onchange=()=>{updateSelectedContractFromEditor();refreshContractPreview();};}
  refreshContractPreview();
}



function makeCancellationPresetCriterion(name,fromDays,toDays,action,percent,note){
  return {id:uid()+'_preset_cancrit',name,fromDays:String(fromDays),toDays:String(toDays),action,percent:action==='percent'?String(percent||''):(action==='nonrefundable'?'100':''),note:String(note||'')};
}
function standardCancellationCriteriaA(){
  return [
    makeCancellationPresetCriterion('100-31 дни · Безплатно анулиране',100,31,'free','','Безплатно анулиране'),
    makeCancellationPresetCriterion('30-14 дни · 20% санкция',30,14,'percent','20','20% от стойността на резервацията'),
    makeCancellationPresetCriterion('13-1 ден · 50% санкция',13,1,'percent','50','50% от стойността на резервацията'),
    makeCancellationPresetCriterion('0д · Невъзвращаема стойност',0,0,'nonrefundable','100','100% санкция / невъзвращаема стойност')
  ];
}
function bookingCancellationCriteriaA(){
  return [
    makeCancellationPresetCriterion('100-31 дни · Безплатно анулиране',100,31,'free','','Безплатно анулиране'),
    makeCancellationPresetCriterion('30-1 дни · 50% санкция',30,1,'percent','50','50% от стойността на резервацията'),
    makeCancellationPresetCriterion('0д · Невъзвращаема стойност',0,0,'nonrefundable','100','100% санкция / невъзвращаема стойност')
  ];
}
function villaMinaCancellationCriteria(){
  return [
    makeCancellationPresetCriterion('100-14 дни · Безплатно анулиране',100,14,'free','','Безплатно анулиране'),
    makeCancellationPresetCriterion('13-1 дни · 50% санкция',13,1,'percent','50','50% от стойността на резервацията'),
    makeCancellationPresetCriterion('0д · Невъзвращаема стойност',0,0,'nonrefundable','100','100% санкция / невъзвращаема стойност')
  ];
}
function malinaCancellationCriteria(){
  return [
    makeCancellationPresetCriterion('Анулация след резервация · 0%',100,8,'free','','Безплатно анулиране след резервация'),
    makeCancellationPresetCriterion('7 дни преди Check In · 50%',7,0,'percent','50','50% от стойността на резервацията')
  ];
}
function cancellationPresetKindForHotelName(name){
  const n=String(name||'').toLowerCase();
  if(n.includes('алгара')||n.includes('algara'))return'algara';
  if(n.includes('виктория')||n.includes('victoria')||n.includes('grand'))return'grand';
  if(n.includes('азура')||n.includes('azura'))return'azura';
  if(n.includes('мина')||n.includes('mina'))return'mina';
  if(n.includes('малина')||n.includes('malina'))return'malina';
  return'';
}
function cancellationPresetChannelsForHotel(kind){
  if(kind==='algara'||kind==='grand')return [
    {name:'Website',criteria:standardCancellationCriteriaA()},
    {name:'Booking.Com',criteria:bookingCancellationCriteriaA()},
    {name:'TO B2B',criteria:standardCancellationCriteriaA()}
  ];
  if(kind==='azura'||kind==='mina')return [
    {name:'Website',criteria:villaMinaCancellationCriteria()},
    {name:'Booking.com',criteria:villaMinaCancellationCriteria()}
  ];
  if(kind==='malina')return [
    {name:'Website',criteria:malinaCancellationCriteria()}
  ];
  return null;
}
function applyCancellationPresetMigration(){
  if(typeof state==='undefined'||!state)return;
  const root=getCancellationStateRoot();
  const presetVersion='v188_cancellations_deposits_defaults';
  if(root.presetVersion===presetVersion)return;
  const seen={};
  (state.weeks||[]).forEach(week=>{
    (week.hotels||[]).forEach(hotel=>{
      if(!hotel||!String(hotel.name||'').trim())return;
      const key=hotelCancellationKey(hotel);
      if(seen[key])return;
      seen[key]=true;
      const kind=cancellationPresetKindForHotelName(hotel.name);
      const presets=cancellationPresetChannelsForHotel(kind);
      if(!presets)return;
      const oldEntry=root.hotels&&root.hotels[key]?normalizeCancellationHotelEntry(root.hotels[key]):normalizeCancellationHotelEntry({});
      const checkInDate=oldEntry.checkInDate||todayISO();
      const entry={selectedChannelKey:'',customChannels:[],channels:{},checkInDate};
      presets.forEach((preset,index)=>{
        const channelId=cancellationChannelKey({name:preset.name});
        entry.customChannels.push({id:channelId,name:preset.name});
        const oldPolicy=oldEntry.channels&&oldEntry.channels[channelId]?oldEntry.channels[channelId]:null;
        entry.channels[channelId]=normalizeCancellationPolicy({
          locked:oldPolicy?!!oldPolicy.locked:false,
          checkInDate,
          periodModeEnabled:false,
          cancellationPeriods:[],
          criteria:preset.criteria
        });
        if(index===0)entry.selectedChannelKey=channelId;
      });
      root.hotels[key]=entry;
    });
  });
  root.presetVersion=presetVersion;
}
function getCancellationInnerMode(){
  return window.__cancellationInnerMode==='deposits'?'deposits':'cancellations';
}
function setCancellationInnerMode(mode){
  window.__cancellationInnerMode=mode==='deposits'?'deposits':'cancellations';
  renderCancellationPolicy();
}
function renderCancellationInnerTabs(activeMode){
  const mode=activeMode==='deposits'?'deposits':'cancellations';
  return `<div class="cancellation-inner-tabs no-print"><button type="button" class="cancellation-inner-tab ${mode==='cancellations'?'active':''}" data-cancellation-inner="cancellations">Анулации</button><button type="button" class="cancellation-inner-tab ${mode==='deposits'?'active':''}" data-cancellation-inner="deposits">Депозити</button></div>`;
}
function bindCancellationInnerTabs(){
  document.querySelectorAll('[data-cancellation-inner]').forEach(btn=>btn.addEventListener('click',()=>setCancellationInnerMode(btn.dataset.cancellationInner)));
}
function renderCancellationDepositsPanel(hotel){
  return `${renderCancellationInnerTabs('deposits')}<div class="deposit-placeholder-card"><h3>Депозити · ${escapeHtml(hotel&&hotel.name?hotel.name:'Хотел')}</h3><p>Този подраздел е отделен от анулациите. Тук ще добавим депозитните правила, когато подадеш точните критерии.</p><div class="deposit-note">Към момента не съм добавял депозитни стойности, за да не объркам анулационните политики.</div></div>`;
}

function currentCancellationHotels(){
  const week=getActiveWeek();
  return week&&Array.isArray(week.hotels)?week.hotels.filter(h=>h&&String(h.name||'').trim()):[];
}
function currentCancellationChannels(hotel){
  if(!hotel)return[];
  const entry=getCancellationHotelEntry(hotel);
  if(!Array.isArray(entry.customChannels)||!entry.customChannels.length){
    entry.customChannels=defaultCancellationChannels();
  }
  entry.customChannels=entry.customChannels.map(normalizeCancellationChannel);
  entry.customChannels.forEach(ch=>{if(!entry.channels[ch.id])entry.channels[ch.id]=normalizeCancellationPolicy({});});
  return entry.customChannels.filter(ch=>ch&&String(ch.name||'').trim());
}
function getCancellationStateRoot(){
  if(!state.cancellationPolicies)state.cancellationPolicies=normalizeCancellationPolicies({});
  if(!state.cancellationPolicies.hotels)state.cancellationPolicies.hotels={};
  return state.cancellationPolicies;
}
function getSelectedCancellationHotel(){
  const hotels=currentCancellationHotels();
  if(!hotels.length)return null;
  const root=getCancellationStateRoot();
  let selected=hotels.find(h=>hotelCancellationKey(h)===root.selectedHotelKey);
  if(!selected)selected=hotels[0];
  root.selectedHotelKey=hotelCancellationKey(selected);
  return selected;
}
function getCancellationHotelEntry(hotel){
  const root=getCancellationStateRoot();
  const key=hotelCancellationKey(hotel);
  if(!root.hotels[key]||root.hotels[key].criteria||!Array.isArray(root.hotels[key].customChannels)){
    root.hotels[key]=normalizeCancellationHotelEntry(root.hotels[key]||{});
  }
  if(!root.hotels[key].channels)root.hotels[key].channels={};
  if(!Array.isArray(root.hotels[key].customChannels)||!root.hotels[key].customChannels.length)root.hotels[key].customChannels=defaultCancellationChannels();
  root.hotels[key].customChannels=root.hotels[key].customChannels.map(normalizeCancellationChannel);
  root.hotels[key].customChannels.forEach(ch=>{if(!root.hotels[key].channels[ch.id])root.hotels[key].channels[ch.id]=normalizeCancellationPolicy({});});
  if(!root.hotels[key].customChannels.some(ch=>ch.id===root.hotels[key].selectedChannelKey))root.hotels[key].selectedChannelKey=root.hotels[key].customChannels[0].id;
  return root.hotels[key];
}
function getSelectedCancellationChannel(hotel){
  const channels=currentCancellationChannels(hotel);
  if(!channels.length)return null;
  const entry=getCancellationHotelEntry(hotel);
  let selected=channels.find(ch=>ch.id===entry.selectedChannelKey);
  if(!selected)selected=channels[0];
  entry.selectedChannelKey=selected.id;
  return selected;
}
function getCancellationPolicyForHotelChannel(hotel,channel){
  const entry=getCancellationHotelEntry(hotel);
  const key=channel&&channel.id?channel.id:cancellationChannelKey(channel);
  if(!entry.channels[key])entry.channels[key]=normalizeCancellationPolicy({checkInDate:(getActiveWeek()&&getActiveWeek().startDate)||toISODate(new Date()),bookingDate:todayISO()});
  const policy=entry.channels[key];
  if(!policy.bookingDate)policy.bookingDate=todayISO();
  if(!policy.checkInDate)policy.checkInDate=(getActiveWeek()&&getActiveWeek().startDate)||toISODate(new Date());
  if(!Array.isArray(policy.criteria)||!policy.criteria.length)policy.criteria=defaultCancellationCriteria();
  policy.criteria=policy.criteria.map(normalizeCancellationCriterion);
  if(typeof policy.periodModeEnabled!=='boolean')policy.periodModeEnabled=!!policy.periodModeEnabled;
  if(!Array.isArray(policy.cancellationPeriods))policy.cancellationPeriods=[];
  policy.cancellationPeriods=normalizeCancellationPeriods(policy.cancellationPeriods);
  return policy;
}
function saveCancellationPolicies(){
  saveState();
}
function selectCancellationHotel(key){
  const root=getCancellationStateRoot();
  root.selectedHotelKey=key;
  saveCancellationPolicies();
  renderCancellationPolicy();
  applyAllSectionThemes();
}

function selectCancellationChannel(key){
  const hotel=getSelectedCancellationHotel();
  if(!hotel)return;
  const entry=getCancellationHotelEntry(hotel);
  if(entry.customChannels.some(ch=>ch.id===key))entry.selectedChannelKey=key;
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function getActiveCancellationContext(){
  const hotel=getSelectedCancellationHotel();
  const channel=hotel?getSelectedCancellationChannel(hotel):null;
  const policy=(hotel&&channel)?getCancellationPolicyForHotelChannel(hotel,channel):null;
  return {hotel,channel,policy};
}
function addCancellationChannel(){
  const hotel=getSelectedCancellationHotel();
  if(!hotel)return;
  const entry=getCancellationHotelEntry(hotel);
  let base='Нов канал';
  let index=entry.customChannels.length+1;
  let name=base+' '+index;
  while(entry.customChannels.some(ch=>String(ch.name||'').trim().toLowerCase()===name.toLowerCase())){index++;name=base+' '+index;}
  const channel={id:uid()+'_canch_'+index,name};
  entry.customChannels.push(channel);
  entry.channels[channel.id]=normalizeCancellationPolicy({checkInDate:(getActiveWeek()&&getActiveWeek().startDate)||todayISO(),bookingDate:todayISO()});
  entry.selectedChannelKey=channel.id;
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function renameCancellationChannel(value){
  const hotel=getSelectedCancellationHotel();
  if(!hotel)return;
  const entry=getCancellationHotelEntry(hotel);
  const channel=entry.customChannels.find(ch=>ch.id===entry.selectedChannelKey);
  if(!channel)return;
  channel.name=String(value||'').trim()||'Канал';
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function deleteCancellationChannel(){
  const hotel=getSelectedCancellationHotel();
  if(!hotel)return;
  const entry=getCancellationHotelEntry(hotel);
  if(entry.customChannels.length<=1)return;
  const key=entry.selectedChannelKey;
  entry.customChannels=entry.customChannels.filter(ch=>ch.id!==key);
  delete entry.channels[key];
  entry.selectedChannelKey=entry.customChannels[0]?entry.customChannels[0].id:'';
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function addCancellationCriterion(){
  const {policy}=getActiveCancellationContext();
  if(!policy||policy.locked)return;
  policy.criteria.push({id:uid()+'_cancrit_new',name:'Нов критерий',fromDays:'0',toDays:'7',action:'percent',percent:'50',note:''});
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function deleteCancellationCriterion(id){
  const {policy}=getActiveCancellationContext();
  if(!policy||policy.locked)return;
  policy.criteria=policy.criteria.filter(c=>c.id!==id);
  if(!policy.criteria.length)policy.criteria=defaultCancellationCriteria();
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function updateCancellationCriterion(id,field,value){
  const {policy}=getActiveCancellationContext();
  if(!policy||policy.locked)return;
  const criterion=policy.criteria.find(c=>c.id===id);
  if(!criterion)return;
  criterion[field]=value;
  if(field==='action'){
    criterion.action=normalizeCancellationAction(value);
    if(criterion.action==='free')criterion.percent='';
    if(criterion.action==='nonrefundable')criterion.percent='100';
  }
  if(field==='fromDays'||field==='toDays')criterion[field]=normalizeCancellationDays(value,field==='fromDays'?0:30);
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function updateCancellationPolicyField(field,value){
  const {policy}=getActiveCancellationContext();
  if(!policy)return;
  policy[field]=value;
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function updateCancellationEntryField(field,value){
  const hotel=getSelectedCancellationHotel();
  if(!hotel)return;
  const entry=getCancellationHotelEntry(hotel);
  entry[field]=value;
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function toggleCancellationPolicyLock(){
  const {policy}=getActiveCancellationContext();
  if(!policy)return;
  policy.locked=!policy.locked;
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function cancellationRangeLabel(criterion){
  const from=normalizeCriterionDays(criterion.fromDays);
  const to=normalizeCriterionDays(criterion.toDays);
  if(from===to)return from===0?'0д':`${from} дни преди настаняване`;
  return `${from}-${to} дни преди настаняване`;
}
function cancellationActionLabel(criterion){
  const action=normalizeCancellationAction(criterion.action);
  if(action==='free')return '0% (Безплатно анулиране)';
  if(action==='nonrefundable')return '100% санкция / Невъзвращаема стойност';
  const pct=Number(String(criterion.percent||'').replace(',','.'))||0;
  return `${pct}% от стойността на резервацията`;
}
function normalizeCriterionDays(value){
  const n=parseInt(String(value||'').replace(/[^0-9]/g,''),10);
  return Number.isFinite(n)?Math.max(0,n):0;
}
function sortedCancellationCriteria(policy){
  return (policy.criteria||[]).slice().sort((a,b)=>{
    const aFrom=normalizeCriterionDays(a.fromDays), bFrom=normalizeCriterionDays(b.fromDays);
    const aTo=normalizeCriterionDays(a.toDays), bTo=normalizeCriterionDays(b.toDays);
    return bFrom-aFrom || bTo-aTo;
  });
}
function findActiveCancellationCriterion(policy,daysLeft){
  if(daysLeft<0)return {type:'past',text:'Настаняването вече е минало.',statusClass:'warn'};
  const match=sortedCancellationCriteria(policy).find(c=>{
    const from=normalizeCriterionDays(c.fromDays);
    const to=normalizeCriterionDays(c.toDays);
    const min=Math.min(from,to), max=Math.max(from,to);
    return daysLeft>=min&&daysLeft<=max;
  });
  if(match){
    const action=normalizeCancellationAction(match.action);
    return {type:'criterion',criterion:match,statusClass:action==='free'?'':(action==='nonrefundable'?'danger':'warn')};
  }
  return {type:'none',text:'Няма създаден критерий, който да покрива тези дни до настаняването.',statusClass:'warn'};
}
function cancellationActiveText(active){
  if(active&&active.type==='criterion'){
    const c=active.criterion;
    return `${cancellationRangeLabel(c)}: ${cancellationActionLabel(c)}.`;
  }
  return (active&&active.text)||'';
}
function renderCancellationSummary(policy,daysLeft,active){
  const lines=[];
  sortedCancellationCriteria(policy).forEach(c=>{
    lines.push(`${cancellationRangeLabel(c)}: ${cancellationActionLabel(c)}${c.note?` — ${c.note}`:''}.`);
  });
  if(daysLeft>=0)lines.push(`От днешната дата до датата на настаняване има ${daysLeft} дни. Активен критерий: ${cancellationActiveText(active)}`);
  else lines.push('Датата на настаняване вече е минала спрямо днешната дата.');
  return `<div class="booking-summary-box"><div class="booking-summary-icon">↺</div><div><h4>Cancellation summary</h4><ul>${lines.map(line=>`<li>${escapeHtml(line)}</li>`).join('')}</ul></div></div>`;
}
function renderCancellationHotelTabs(selectedKey){
  const tabs=document.getElementById('cancellationHotelTabs');
  if(!tabs)return;
  const hotels=currentCancellationHotels();
  const root=getCancellationStateRoot();
  tabs.innerHTML='';
  hotels.forEach(hotel=>{
    const key=hotelCancellationKey(hotel);
    const entry=root.hotels&&root.hotels[key]?normalizeCancellationHotelEntry(root.hotels[key]):null;
    if(entry&&root.hotels)root.hotels[key]=entry;
    const lockedCount=entry&&entry.channels?Object.values(entry.channels).filter(p=>p&&p.locked).length:0;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='cancellation-hotel-btn'+(key===selectedKey?' active':'');
    btn.innerHTML=`<span>${escapeHtml(hotel.name||'Хотел')}</span><span class="policy-state">${lockedCount?lockedCount+' заключ.':'канали'}</span>`;
    btn.addEventListener('click',()=>selectCancellationHotel(key));
    tabs.appendChild(btn);
  });
  if(!hotels.length)tabs.innerHTML='<div class="empty">Няма въведени хотели.</div>';
}
function renderCancellationChannelTabs(hotel,selectedChannelKey){
  const channels=currentCancellationChannels(hotel);
  if(!channels.length)return '<div class="empty">Създай канал за този хотел.</div>';
  return `<div class="cancellation-channel-tabs no-print">${channels.map(ch=>{
    const key=ch.id;
    return `<button type="button" class="cancellation-channel-btn${key===selectedChannelKey?' active':''}" data-cancel-channel="${escapeAttr(key)}">${escapeHtml(ch.name||'Канал')}</button>`;
  }).join('')}</div>`;
}
function renderCancellationCriterionCard(criterion,index,locked,activeId){
  const from=normalizeCriterionDays(criterion.fromDays);
  const to=normalizeCriterionDays(criterion.toDays);
  const action=normalizeCancellationAction(criterion.action);
  const isActive=activeId&&criterion.id===activeId;
  const critName=String(criterion.name||('Критерий '+(index+1))).trim()||('Критерий '+(index+1));
  if(locked){
    return `<div class="cancellation-criterion-card${isActive?' active':''}"><div class="cancellation-criterion-top"><strong>${escapeHtml(critName)}</strong></div><div class="cancellation-locked-criterion"><strong>${escapeHtml(cancellationRangeLabel(criterion))}</strong><span>${escapeHtml(cancellationActionLabel(criterion))}</span>${criterion.note?`<small>${escapeHtml(criterion.note)}</small>`:''}</div></div>`;
  }
  return `<div class="cancellation-criterion-card${isActive?' active':''}" data-cancel-criterion="${escapeAttr(criterion.id)}">
    <div class="cancellation-criterion-top"><strong>${escapeHtml(critName)}</strong><button class="danger small" type="button" data-cancel-delete="${escapeAttr(criterion.id)}">Изтрий</button></div>
    <div class="cancellation-criterion-grid cancellation-criterion-grid-v150">
      <div class="full"><label>Име на критерий</label><input type="text" data-cancel-field="name" value="${escapeAttr(critName)}" placeholder="Напр. Безплатна анулация, 50% санкция, Невъзвращаема" /></div>
      <div><label>От колко дни преди настаняване</label><input type="number" min="0" step="1" data-cancel-field="fromDays" value="${escapeAttr(from)}" /></div>
      <div><label>До колко дни преди настаняване</label><input type="number" min="0" step="1" data-cancel-field="toDays" value="${escapeAttr(to)}" /></div>
      <div><label>Какъв е критерият</label><select data-cancel-field="action">
        <option value="free" ${action==='free'?'selected':''}>Безплатно анулиране</option>
        <option value="percent" ${action==='percent'?'selected':''}>Процент санкция</option>
        <option value="nonrefundable" ${action==='nonrefundable'?'selected':''}>Невъзвращаема стойност</option>
      </select></div>
      <div class="cancellation-percent-field ${action==='free'||action==='nonrefundable'?'hidden-percent':''}"><label>Процент санкция</label><input type="number" min="0" max="100" step="1" data-cancel-field="percent" value="${escapeAttr(criterion.percent||'')}" ${action==='free'||action==='nonrefundable'?'disabled':''} /></div>
      <div class="full"><label>Описание / бележка към критерия</label><input type="text" data-cancel-field="note" value="${escapeAttr(criterion.note||'')}" placeholder="Напр. 50% от стойността на резервацията, безплатно анулиране, невъзвращаема стойност..." /></div>
    </div>
  </div>`;
}
function isCancellationPeriodChannel(channel){
  const raw=String((channel&&channel.name)||'')+' '+String((channel&&channel.id)||'');
  const normalized=raw.trim().toLowerCase();
  if(!normalized)return true;
  if(normalized.includes('direct'))return false;
  if(normalized.includes('booking')||normalized.includes('букинг'))return false;
  return true;
}
function cancellationDateMonthDayNumber(iso){
  const d=parseISODate(iso||todayISO());
  return (d.getMonth()+1)*100+d.getDate();
}
function cancellationPeriodContainsDate(period,iso){
  if(!period||!iso)return false;
  const target=cancellationDateMonthDayNumber(iso);
  const from=cancellationDateMonthDayNumber(period.fromDate);
  const to=cancellationDateMonthDayNumber(period.toDate);
  if(from<=to)return target>=from&&target<=to;
  return target>=from||target<=to;
}
function cancellationPeriodDateLabel(period){
  if(!period)return'';
  return `${isoToDisplay(period.fromDate)} – ${isoToDisplay(period.toDate)}`;
}
function cancellationPeriodActionLabel(period){
  const action=normalizeCancellationAction(period.action);
  if(action==='free')return 'Безплатно анулиране';
  if(action==='nonrefundable')return 'Невъзвращаема стойност / 100% санкция';
  const pct=Number(String(period.percent||'').replace(',','.'))||0;
  return `${pct}% санкция`;
}
function findActiveCancellationPeriod(policy,checkInDate,daysLeft){
  if(daysLeft<0)return {type:'past',text:'Настаняването вече е минало.',statusClass:'warn'};
  const periods=normalizeCancellationPeriods(policy.cancellationPeriods||[]);
  if(!periods.length)return {type:'none',text:'Няма създадени анулационни периоди за този канал.',statusClass:'warn'};
  const match=periods.find(p=>cancellationPeriodContainsDate(p,checkInDate));
  if(!match)return {type:'none',text:'Датата на настаняване не попада в нито един анулационен период за този канал.',statusClass:'warn'};
  const cancelDays=normalizeCriterionDays(match.days);
  const action=normalizeCancellationAction(match.action);
  if(daysLeft>cancelDays){
    return {type:'period-free',period:match,statusClass:'',text:`Датата попада в период ${cancellationPeriodDateLabel(match)}. Към момента анулацията е без санкция, защото остават ${daysLeft} дни, а санкцията започва в последните ${cancelDays} дни преди настаняване.`};
  }
  return {type:'period-penalty',period:match,statusClass:action==='free'?'':(action==='nonrefundable'?'danger':'warn')};
}
function cancellationPeriodActiveText(active,daysLeft){
  if(!active)return'';
  if(active.type==='period-penalty'){
    const p=active.period;
    return `Датата попада в период ${cancellationPeriodDateLabel(p)}. Остават ${daysLeft} дни до настаняване и важи: ${cancellationPeriodActionLabel(p)}.`;
  }
  return active.text||'';
}
function renderCancellationPeriodCard(period,index,locked,activeId){
  const action=normalizeCancellationAction(period.action);
  const isActive=activeId&&period.id===activeId;
  const name=String(period.name||('Период '+(index+1))).trim()||('Период '+(index+1));
  if(locked){
    return `<div class="cancellation-period-row${isActive?' active':''}"><div class="cancellation-period-locked"><strong>${escapeHtml(name)}</strong><span class="cancellation-period-badge">${escapeHtml(cancellationPeriodDateLabel(period))}</span><span>${escapeHtml(period.days)} дни период</span><span>${escapeHtml(cancellationPeriodActionLabel(period))}</span>${period.note?`<small>${escapeHtml(period.note)}</small>`:''}</div></div>`;
  }
  return `<div class="cancellation-period-row${isActive?' active':''}" data-cancel-period="${escapeAttr(period.id)}">
    <div class="cancellation-period-grid">
      <div><label>Име на период</label><input type="text" data-cancel-period-field="name" value="${escapeAttr(name)}" placeholder="Напр. Нисък сезон, Май, Юни..." /></div>
      <div><label>От дата на настаняване</label><input type="text" inputmode="numeric" data-calendar="true" readonly data-cancel-period-field="fromDate" data-date-iso="${escapeAttr(period.fromDate)}" value="${escapeAttr(isoToDisplay(period.fromDate))}" /></div>
      <div><label>До дата на настаняване</label><input type="text" inputmode="numeric" data-calendar="true" readonly data-cancel-period-field="toDate" data-date-iso="${escapeAttr(period.toDate)}" value="${escapeAttr(isoToDisplay(period.toDate))}" /></div>
      <div><label>Анулационен период</label><input type="number" min="0" step="1" data-cancel-period-field="days" value="${escapeAttr(period.days)}" /></div>
      <div><label>Какво се дължи</label><select data-cancel-period-field="action">
        <option value="percent" ${action==='percent'?'selected':''}>Процент санкция</option>
        <option value="nonrefundable" ${action==='nonrefundable'?'selected':''}>Невъзвращаема стойност</option>
        <option value="free" ${action==='free'?'selected':''}>Безплатно</option>
      </select></div>
      <div><label>Процент</label><input type="number" min="0" max="100" step="1" data-cancel-period-field="percent" value="${escapeAttr(period.percent||'')}" ${action==='free'||action==='nonrefundable'?'disabled':''} /></div>
      <button class="danger small" type="button" data-cancel-period-delete="${escapeAttr(period.id)}">Изтрий</button>
      <div class="full"><label>Бележка</label><input type="text" data-cancel-period-field="note" value="${escapeAttr(period.note||'')}" placeholder="Напр. 50% от стойността, 100% санкция, невъзвращаема..." /></div>
    </div>
  </div>`;
}
function addCancellationPeriod(){
  const {policy,channel}=getActiveCancellationContext();
  if(!policy||policy.locked||!isCancellationPeriodChannel(channel))return;
  const year=parseISODate(policy.checkInDate||todayISO()).getFullYear();
  policy.periodModeEnabled=true;
  if(!Array.isArray(policy.cancellationPeriods))policy.cancellationPeriods=[];
  policy.cancellationPeriods.push({id:uid()+'_canperiod_new',name:'Нов анулационен период',fromDate:`${year}-05-01`,toDate:`${year}-05-15`,days:'3',action:'percent',percent:'50',note:''});
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function deleteCancellationPeriod(id){
  const {policy}=getActiveCancellationContext();
  if(!policy||policy.locked)return;
  policy.cancellationPeriods=(policy.cancellationPeriods||[]).filter(p=>p.id!==id);
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function updateCancellationPeriod(id,field,value){
  const {policy}=getActiveCancellationContext();
  if(!policy||policy.locked)return;
  const period=(policy.cancellationPeriods||[]).find(p=>p.id===id);
  if(!period)return;
  if(field==='fromDate'||field==='toDate')period[field]=value;
  else if(field==='days')period.days=normalizeCancellationDays(value,3);
  else if(field==='action'){
    period.action=normalizeCancellationAction(value);
    if(period.action==='free')period.percent='';
    if(period.action==='nonrefundable')period.percent='100';
  }else period[field]=value;
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function toggleCancellationPeriodMode(){
  const {policy,channel}=getActiveCancellationContext();
  if(!policy||policy.locked||!isCancellationPeriodChannel(channel))return;
  policy.periodModeEnabled=!policy.periodModeEnabled;
  if(policy.periodModeEnabled&&(!Array.isArray(policy.cancellationPeriods)||!policy.cancellationPeriods.length)){
    const year=parseISODate(policy.checkInDate||todayISO()).getFullYear();
    policy.cancellationPeriods=[{id:uid()+'_canperiod_default',name:'Период 1',fromDate:`${year}-05-01`,toDate:`${year}-05-15`,days:'3',action:'percent',percent:'50',note:''}];
  }
  saveCancellationPolicies();
  renderCancellationPolicy();
}
function renderCancellationPeriodSummary(policy,daysLeft,active){
  const lines=[];
  normalizeCancellationPeriods(policy.cancellationPeriods||[]).forEach(p=>{
    lines.push(`${p.name||'Период'}: ${cancellationPeriodDateLabel(p)} — анулационен период ${p.days} дни, ${cancellationPeriodActionLabel(p)}${p.note?` — ${p.note}`:''}.`);
  });
  if(daysLeft>=0)lines.push(`От днешната дата до датата на настаняване има ${daysLeft} дни. ${cancellationPeriodActiveText(active,daysLeft)}`);
  else lines.push('Датата на настаняване вече е минала спрямо днешната дата.');
  return `<div class="booking-summary-box"><div class="booking-summary-icon">↺</div><div><h4>Cancellation period summary</h4><ul>${lines.map(line=>`<li>${escapeHtml(line)}</li>`).join('')}</ul></div></div>`;
}
function renderCancellationPolicy(){
  const result=document.getElementById('cancellationPolicyResult');
  if(!result)return;
  const hotel=getSelectedCancellationHotel();
  const selectedKey=hotel?hotelCancellationKey(hotel):'';
  renderCancellationHotelTabs(selectedKey);
  if(!hotel){result.innerHTML='<div class="empty">Добави хотел, за да настроиш анулационна политика.</div>';return;}
  const innerMode=getCancellationInnerMode();
  if(innerMode==='deposits'){
    result.innerHTML=renderCancellationDepositsPanel(hotel);
    bindCancellationInnerTabs();
    return;
  }
  const innerTabsHtml=renderCancellationInnerTabs('cancellations');
  const channel=getSelectedCancellationChannel(hotel);
  if(!channel){result.innerHTML='<div class="empty">Създай канал за този хотел, за да настроиш анулационна политика.</div>';return;}
  const entry=getCancellationHotelEntry(hotel);
  const selectedChannelKey=channel.id;
  const policy=getCancellationPolicyForHotelChannel(hotel,channel);
  const checkInDate=entry.checkInDate||policy.checkInDate||todayISO();
  if(!entry.checkInDate)entry.checkInDate=checkInDate;
  policy.checkInDate=checkInDate;
  const daysLeft=diffDays(todayISO(),checkInDate);
  const canUsePeriods=isCancellationPeriodChannel(channel);
  const usePeriods=canUsePeriods&&!!policy.periodModeEnabled;
  const active=usePeriods?findActiveCancellationPeriod(policy,checkInDate,daysLeft):findActiveCancellationCriterion(policy,daysLeft);
  const activeId=active&&(active.criterion?active.criterion.id:(active.period?active.period.id:''));
  const locked=!!policy.locked;
  const criteria=sortedCancellationCriteria(policy);
  const criteriaHtml=criteria.map((criterion,index)=>renderCancellationCriterionCard(criterion,index,locked,activeId)).join('')||'<div class="empty">Няма критерии.</div>';
  const periods=normalizeCancellationPeriods(policy.cancellationPeriods||[]);
  const periodsHtml=periods.map((period,index)=>renderCancellationPeriodCard(period,index,locked,activeId)).join('')||'<div class="empty">Няма анулационни периоди. Добави първи период.</div>';
  const statusText=usePeriods?cancellationPeriodActiveText(active,daysLeft):cancellationActiveText(active);
  const activeName=active&&active.criterion?String(active.criterion.name||'Активен критерий'):(active&&active.period?String(active.period.name||'Активен период'):'Резултат');
  const activeNote=active&&active.criterion&&active.criterion.note?String(active.criterion.note):(active&&active.period&&active.period.note?String(active.period.note):'');
  const periodNotice=canUsePeriods
    ? `<div class="cancellation-period-notice">За този канал можеш да включиш анулационни периоди по дати на настаняване. Direct и Booking остават по стандартните критерии.</div>`
    : `<div class="cancellation-period-notice">За канал „${escapeHtml(channel.name||'Канал')}“ анулационни периоди не се прилагат. Тук се използват стандартните критерии.</div>`;
  result.innerHTML=`
    ${innerTabsHtml}
    <div class="cancellation-lock-toolbar">
      <div><h4 style="margin:0">Анулации и Депозити · ${escapeHtml(hotel.name||'Хотел')}</h4><div class="muted">Каналите тук са отделни само за анулации и не са свързани с мапинги или ценообразуване.</div>${locked?'<span class="cancellation-locked-note">Настройките са заключени</span>':''}</div>
      <div class="button-row no-print"><button id="toggleCancellationLockBtn" class="${locked?'small':'success small'}" type="button">${locked?'Редактирай настройки':'🔒 Заключи настройки'}</button></div>
    </div>

    <div class="booking-cancellation-card cancellation-always-visible">
      <h3>Проверка на анулационна политика</h3>
      <div class="cancellation-evaluation-box">
        <div class="booking-controls-grid cancellation-eval-grid">
          <div><label for="cancellationCheckInDate">Дата на настаняване</label><input id="cancellationCheckInDate" type="text" inputmode="numeric" placeholder="дд.мм" data-calendar="true" readonly data-date-iso="${escapeAttr(checkInDate)}" value="${escapeAttr(isoToDisplay(checkInDate))}" /></div>
          <div><label>Избран канал</label><input type="text" readonly value="${escapeAttr(channel.name||'Канал')}" /></div>
          <div><label>Оставащи дни до настаняване</label><input type="text" readonly value="${daysLeft>=0?daysLeft+' дни':'датата е минала'}" /></div>
        </div>
        <div class="cancellation-channel-manager cancellation-channel-selector-outside">
          <div class="cancellation-channel-head">
            <div><h4>Избери канал за анулационна политика</h4><div class="muted">Този избор остава активен и когато настройките са заключени.</div></div>
          </div>
          ${renderCancellationChannelTabs(hotel,selectedChannelKey)}
        </div>
        <div class="cancellation-active-case ${active.statusClass||''}"><strong>${escapeHtml(activeName||'Резултат')}</strong>${escapeHtml(statusText||'Няма активен критерий.')} ${activeNote?`<small>${escapeHtml(activeNote)}</small>`:''}</div>
      </div>
    </div>

    <div class="booking-cancellation-card ${locked?'cancellation-locked-view':''}">
      <h3>Настройки на канал „${escapeHtml(channel.name||'Канал')}“</h3>
      <div class="cancellation-top-tools no-print-edit">
        <div class="cancellation-channel-manager">
          <div class="cancellation-channel-head">
            <div><h4>Управление на канали</h4><div class="muted">Създавай, изтривай и преименувай каналите само за този раздел.</div></div>
            <button id="addCancellationChannelBtn" class="success small" type="button">+ Добави канал</button>
          </div>
          <div class="cancellation-channel-edit-row">
            <div><label for="cancellationChannelNameInput">Име на избрания канал</label><input id="cancellationChannelNameInput" type="text" value="${escapeAttr(channel.name||'Канал')}" placeholder="Напр. Direct, Booking, Partner..." /></div>
            <button id="renameCancellationChannelBtn" class="small" type="button">Запази име</button>
            <button id="deleteCancellationChannelBtn" class="danger small" type="button" ${entry.customChannels.length<=1?'disabled':''}>Изтрий канал</button>
          </div>
        </div>
      </div>
      ${periodNotice}
      ${canUsePeriods?`<div class="cancellation-period-mode-box">
        <div class="cancellation-period-mode-head">
          <div><h4>Анулационни периоди по дата на настаняване</h4><div class="muted">Включи за канали, при които политиката зависи от периода на престой — например 01.05–15.05 = 3 дни анулационен период и избран процент.</div></div>
          <button id="toggleCancellationPeriodModeBtn" class="cancellation-period-toggle small ${usePeriods?'active':''} no-print-edit" type="button">${usePeriods?'✓ Периодите са включени':'Включи периоди'}</button>
        </div>
        ${usePeriods?`<div class="cancellation-criteria-header"><h4>Периоди за канал „${escapeHtml(channel.name||'Канал')}“</h4><button id="addCancellationPeriodBtn" class="success small no-print-edit" type="button">+ Добави анулационен период</button></div><div class="cancellation-period-rows">${periodsHtml}</div>`:''}
      </div>`:''}
      ${!usePeriods?`<div class="cancellation-criteria-header">
        <h4>Критерии за канал „${escapeHtml(channel.name||'Канал')}“</h4>
        <button id="addCancellationCriterionBtn" class="success small no-print-edit" type="button">+ Добави критерий</button>
      </div>
      <div class="cancellation-criteria-list">${criteriaHtml}</div>
      ${renderCancellationSummary(policy,daysLeft,active)}`:`${renderCancellationPeriodSummary(policy,daysLeft,active)}`}
    </div>`;
  bindCancellationInnerTabs();
  const lockBtn=document.getElementById('toggleCancellationLockBtn');
  if(lockBtn)lockBtn.addEventListener('click',toggleCancellationPolicyLock);
  const addChannelBtn=document.getElementById('addCancellationChannelBtn');
  if(addChannelBtn)addChannelBtn.addEventListener('click',addCancellationChannel);
  const channelNameInput=document.getElementById('cancellationChannelNameInput');
  const renameBtn=document.getElementById('renameCancellationChannelBtn');
  if(renameBtn&&channelNameInput)renameBtn.addEventListener('click',()=>renameCancellationChannel(channelNameInput.value));
  if(channelNameInput)channelNameInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();renameCancellationChannel(channelNameInput.value);}});
  const deleteChannelBtn=document.getElementById('deleteCancellationChannelBtn');
  if(deleteChannelBtn)deleteChannelBtn.addEventListener('click',deleteCancellationChannel);
  document.querySelectorAll('[data-cancel-channel]').forEach(btn=>btn.addEventListener('click',()=>selectCancellationChannel(btn.dataset.cancelChannel)));
  const checkIn=document.getElementById('cancellationCheckInDate');
  if(checkIn)checkIn.addEventListener('change',()=>{const iso=normalizeDateInput(checkIn);if(iso)updateCancellationEntryField('checkInDate',iso);});
  const periodModeBtn=document.getElementById('toggleCancellationPeriodModeBtn');
  if(periodModeBtn)periodModeBtn.addEventListener('click',toggleCancellationPeriodMode);
  const addPeriodBtn=document.getElementById('addCancellationPeriodBtn');
  if(addPeriodBtn)addPeriodBtn.addEventListener('click',addCancellationPeriod);
  document.querySelectorAll('[data-cancel-period-delete]').forEach(btn=>btn.addEventListener('click',()=>deleteCancellationPeriod(btn.dataset.cancelPeriodDelete)));
  document.querySelectorAll('[data-cancel-period]').forEach(card=>{
    const id=card.dataset.cancelPeriod;
    card.querySelectorAll('[data-cancel-period-field]').forEach(input=>{
      input.addEventListener('change',()=>{
        let value=input.value;
        if(input.dataset.calendar==='true'||input.getAttribute('data-calendar')==='true'){
          value=normalizeDateInput(input)||input.dataset.dateIso||value;
        }
        updateCancellationPeriod(id,input.dataset.cancelPeriodField,value);
      });
    });
  });
  const addBtn=document.getElementById('addCancellationCriterionBtn');
  if(addBtn)addBtn.addEventListener('click',addCancellationCriterion);
  document.querySelectorAll('[data-cancel-delete]').forEach(btn=>btn.addEventListener('click',()=>deleteCancellationCriterion(btn.dataset.cancelDelete)));
  document.querySelectorAll('[data-cancel-criterion]').forEach(card=>{
    const id=card.dataset.cancelCriterion;
    card.querySelectorAll('[data-cancel-field]').forEach(input=>{
      input.addEventListener('change',()=>updateCancellationCriterion(id,input.dataset.cancelField,input.value));
    });
  });
  ensureCancelButtons();
}






function normalizeTaskReminder(value){
  if(value===undefined||value===null||value===''||value==='none')return'none';
  const n=parseInt(String(value),10);
  return [0,1,2,3,7].includes(n)?String(n):'none';
}
function taskReminderLabel(value){
  const normalized=normalizeTaskReminder(value);
  const option=TASK_REMINDER_OPTIONS.find(item=>item.value===normalized);
  return option?option.label:'Без напомняне';
}
function taskReminderShortLabel(value){
  const normalized=normalizeTaskReminder(value);
  if(normalized==='none')return'';
  if(normalized==='0')return'деня';
  if(normalized==='7')return'7д';
  return normalized+'д';
}
let taskReminderMenuEl=null;
function closeTaskReminderMenu(){
  if(taskReminderMenuEl){taskReminderMenuEl.remove();taskReminderMenuEl=null;}
}
function positionTaskReminderMenu(anchor,menu){
  const rect=anchor.getBoundingClientRect();
  const width=Math.min(220,Math.max(190,rect.width));
  menu.style.width=width+'px';
  let left=Math.min(Math.max(8,rect.left),window.innerWidth-width-8);
  let top=rect.bottom+6;
  if(top+menu.offsetHeight>window.innerHeight-8)top=Math.max(8,rect.top-menu.offsetHeight-6);
  menu.style.left=left+'px';
  menu.style.top=top+'px';
}
function openTaskReminderMenu(anchor,currentValue,onSelect){
  if(!anchor)return;
  closeTaskReminderMenu();
  const current=normalizeTaskReminder(currentValue);
  const menu=document.createElement('div');
  menu.className='task-reminder-menu no-print';
  TASK_REMINDER_OPTIONS.forEach(option=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className=option.value===current?'active':'';
    btn.textContent='🔔 '+option.label;
    btn.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      if(typeof onSelect==='function')onSelect(option.value);
      closeTaskReminderMenu();
    });
    menu.appendChild(btn);
  });
  document.body.appendChild(menu);
  taskReminderMenuEl=menu;
  positionTaskReminderMenu(anchor,menu);
  setTimeout(()=>{
    const outside=e=>{
      if(taskReminderMenuEl&&e.target!==anchor&&!taskReminderMenuEl.contains(e.target)){
        closeTaskReminderMenu();document.removeEventListener('click',outside,true);
      }
    };
    document.addEventListener('click',outside,true);
  },0);
}
function updateNewTaskReminderButton(){
  const input=document.getElementById('newTaskReminder');
  const btn=document.getElementById('newTaskReminderButton');
  const label=document.getElementById('newTaskReminderLabel');
  const value=normalizeTaskReminder(input?input.value:'none');
  const full=taskReminderLabel(value);
  if(input)input.value=value;
  if(label)label.textContent=value==='none'?'Без':taskReminderShortLabel(value);
  if(btn){btn.title=full;btn.setAttribute('aria-label','Напомни: '+full);btn.classList.toggle('active',value!=='none');}
}
function taskReminderDate(dueDate,value){
  const normalized=normalizeTaskReminder(value);
  if(normalized==='none'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dueDate||''))return null;
  return toISODate(addDays(parseISODate(dueDate),-parseInt(normalized,10)));
}
function normalizeDailyTasks(input){
  const out={};
  const source=(input&&typeof input==='object')?input:{};
  Object.keys(source).forEach(date=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return;
    const items=Array.isArray(source[date])?source[date]:[];
    const normalized=items.map((item,index)=>({
      id:item&&item.id?item.id:uid()+'_task'+index,
      text:item&&item.text!==undefined?String(item.text):'',
      done:!!(item&&item.done),
      reminderOffsetDays:normalizeTaskReminder(item&&(item.reminderOffsetDays!==undefined?item.reminderOffsetDays:item.reminderDays)),
      createdAt:item&&item.createdAt?item.createdAt:new Date().toISOString(),
      updatedAt:item&&item.updatedAt?item.updatedAt:new Date().toISOString(),
      carriedFromDate:item&&/^\d{4}-\d{2}-\d{2}$/.test(item.carriedFromDate||'')?item.carriedFromDate:null,
      carriedFromId:item&&item.carriedFromId?String(item.carriedFromId):null,
      carriedAt:item&&item.carriedAt?item.carriedAt:null
    })).filter(item=>item.text.trim()!=='' || item.done);
    if(normalized.length)out[date]=normalized;
  });
  return out;
}

function sanitizeTaskNoteHtml(html){
  const raw=String(html||'').trim();
  if(!raw)return'';
  const wrap=document.createElement('div');
  wrap.innerHTML=raw;
  wrap.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(el=>el.remove());
  wrap.querySelectorAll('*').forEach(el=>{
    Array.from(el.attributes).forEach(attr=>{
      const name=attr.name.toLowerCase();
      const value=String(attr.value||'');
      if(name.startsWith('on'))el.removeAttribute(attr.name);
      if((name==='href'||name==='src')&&/^\s*javascript:/i.test(value))el.removeAttribute(attr.name);
      if(name==='style'&&/expression\s*\(|url\s*\(\s*javascript:/i.test(value))el.removeAttribute(attr.name);
    });
  });
  return wrap.innerHTML.trim();
}
function normalizeDailyTaskNotes(input){
  const out={};
  const source=(input&&typeof input==='object')?input:{};
  Object.keys(source).forEach(date=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return;
    const html=sanitizeTaskNoteHtml(source[date]);
    if(html)out[date]=html;
  });
  return out;
}
function getTaskNotesForDate(iso){
  if(!state.taskNotesByDate||typeof state.taskNotesByDate!=='object')state.taskNotesByDate={};
  if(!/^\d{4}-\d{2}-\d{2}$/.test(iso||''))iso=todayISO();
  const html=sanitizeTaskNoteHtml(state.taskNotesByDate[iso]||'');
  if(html)state.taskNotesByDate[iso]=html;
  else delete state.taskNotesByDate[iso];
  return html;
}
function syncTaskNoteCheckboxes(box){
  if(!box)return;
  box.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
    if(cb.checked)cb.setAttribute('checked','checked');
    else cb.removeAttribute('checked');
  });
}
function saveTaskNotesFromBox(options={}){
  const box=document.getElementById('taskNotesBox');
  if(!box)return;
  ensureTasksState();
  const selected=state.tasksUi.selectedDate||todayISO();
  const hadNotes=!!(state.taskNotesByDate&&sanitizeTaskNoteHtml(state.taskNotesByDate[selected]||''));
  syncTaskNoteCheckboxes(box);
  const html=sanitizeTaskNoteHtml(box.innerHTML||'');
  if(html)state.taskNotesByDate[selected]=html;
  else delete state.taskNotesByDate[selected];
  if(options.deferred){
    scheduleSilentStateSave();
  }else{
    if(scheduledSilentSaveTimer){
      clearTimeout(scheduledSilentSaveTimer);
      scheduledSilentSaveTimer=null;
    }
    saveState({silent:options.silent!==false});
  }
  const hasNotes=!!html;
  if(!options.deferred&&(options.renderCalendar!==false||hadNotes!==hasNotes)){
    try{renderTasksCalendar();}catch(_){ }
  }
}
function focusTaskNotesBox(){
  const box=document.getElementById('taskNotesBox');
  if(!box)return null;
  box.focus();
  return box;
}
function applyTaskNoteCommand(cmd){
  const box=focusTaskNotesBox();
  if(!box)return;
  if(cmd==='insertCheckbox'){
    document.execCommand('insertHTML',false,'<div><label><input type="checkbox"> <span>Нова отметка</span></label></div>');
  }else if(cmd==='foreRed'){
    document.execCommand('foreColor',false,'#dc2626');
  }else if(cmd==='foreBlue'){
    document.execCommand('foreColor',false,'#2563eb');
  }else if(cmd==='foreGreen'){
    document.execCommand('foreColor',false,'#047857');
  }else if(cmd==='bgYellow'){
    document.execCommand('hiliteColor',false,'#fef08a');
  }else if(cmd==='bgGreen'){
    document.execCommand('hiliteColor',false,'#bbf7d0');
  }else if(cmd==='bgBlue'){
    document.execCommand('hiliteColor',false,'#bfdbfe');
  }else if(cmd==='heading'){
    document.execCommand('formatBlock',false,'H4');
  }else if(cmd==='paragraph'){
    document.execCommand('formatBlock',false,'P');
  }else if(cmd==='removeFormat'){
    document.execCommand('removeFormat',false,null);
  }else{
    document.execCommand(cmd,false,null);
  }
  saveTaskNotesFromBox({silent:true});
}
function renderTaskNotes(date){
  const box=document.getElementById('taskNotesBox');
  if(!box)return;
  const html=getTaskNotesForDate(date);
  if(document.activeElement!==box)box.innerHTML=html;
  box.oninput=()=>saveTaskNotesFromBox({silent:true,deferred:true,renderCalendar:false});
  box.onchange=()=>saveTaskNotesFromBox({silent:true,deferred:true,renderCalendar:false});
  box.onblur=()=>saveTaskNotesFromBox({silent:false});
  box.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
    cb.addEventListener('change',()=>saveTaskNotesFromBox({silent:true,deferred:true,renderCalendar:false}));
  });
  document.querySelectorAll('[data-task-note-cmd]').forEach(btn=>{
    btn.onmousedown=(event)=>event.preventDefault();
    btn.onclick=()=>applyTaskNoteCommand(btn.dataset.taskNoteCmd||'');
  });
  const toolbar=document.getElementById('taskNotesToolbar');
  const toggleBtn=document.getElementById('toggleTaskNotesToolbarBtn');
  if(toolbar&&toggleBtn){
    toggleBtn.onclick=()=>{
      const willOpen=toolbar.classList.contains('hidden');
      toolbar.classList.toggle('hidden',!willOpen);
      toggleBtn.classList.toggle('active',willOpen);
      toggleBtn.setAttribute('aria-expanded',willOpen?'true':'false');
      toggleBtn.textContent=willOpen?'Скрий формат':'Aa Формат';
    };
    toggleBtn.classList.toggle('active',!toolbar.classList.contains('hidden'));
    toggleBtn.setAttribute('aria-expanded',toolbar.classList.contains('hidden')?'false':'true');
  }
}

function normalizeTasksUi(input){
  const today=toISODate(new Date());
  const selected=input&&/^\d{4}-\d{2}-\d{2}$/.test(input.selectedDate||'')?input.selectedDate:today;
  const month=input&&/^\d{4}-\d{2}$/.test(input.calendarMonth||'')?input.calendarMonth:selected.slice(0,7);
  const lastCarryForwardDate=input&&/^\d{4}-\d{2}-\d{2}$/.test(input.lastCarryForwardDate||'')?input.lastCarryForwardDate:today;
  return {selectedDate:selected,calendarMonth:month,lastCarryForwardDate};
}
function ensureTasksState(){
  if(!state.tasksByDate||typeof state.tasksByDate!=='object')state.tasksByDate={};
  if(!state.taskNotesByDate||typeof state.taskNotesByDate!=='object')state.taskNotesByDate={};
  if(!state.tasksUi)state.tasksUi=normalizeTasksUi({});
  if(!state.tasksUi.selectedDate)state.tasksUi.selectedDate=todayISO();
  if(!state.tasksUi.calendarMonth)state.tasksUi.calendarMonth=state.tasksUi.selectedDate.slice(0,7);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(state.tasksUi.lastCarryForwardDate||''))state.tasksUi.lastCarryForwardDate=todayISO();
  autoCarryUnfinishedTasksToToday();
  return state;
}
function normalizeTaskItemForUse(item,index){
  if(item===undefined||item===null)return null;
  if(typeof item==='string')item={text:item};
  if(typeof item!=='object')item={text:String(item)};
  const rawText=item.text!==undefined?item.text:(item.title!==undefined?item.title:(item.name!==undefined?item.name:''));
  const text=String(rawText||'').trim();
  const done=!!item.done;
  if(!text&&!done)return null;
  return {
    id:item.id?String(item.id):(uid()+'_task_'+(index||0)),
    text,
    done,
    reminderOffsetDays:normalizeTaskReminder(item.reminderOffsetDays!==undefined?item.reminderOffsetDays:item.reminderDays),
    createdAt:item.createdAt?String(item.createdAt):new Date().toISOString(),
    updatedAt:item.updatedAt?String(item.updatedAt):new Date().toISOString(),
    carriedFromDate:/^\d{4}-\d{2}-\d{2}$/.test(item.carriedFromDate||'')?item.carriedFromDate:null,
    carriedFromId:item.carriedFromId?String(item.carriedFromId):null,
    carriedAt:item.carriedAt?String(item.carriedAt):null
  };
}
function sanitizeTasksForDate(iso){
  if(!state.tasksByDate||typeof state.tasksByDate!=='object')state.tasksByDate={};
  const source=Array.isArray(state.tasksByDate[iso])?state.tasksByDate[iso]:[];
  const normalized=source.map((item,index)=>normalizeTaskItemForUse(item,index)).filter(Boolean);
  state.tasksByDate[iso]=normalized;
  return normalized;
}
function taskDateLongLabel(iso){
  if(!iso)return'';
  const d=parseISODate(iso);
  const today=todayISO();
  if(iso===today)return `Днес · ${formatFullDisplayDate(iso)}`;
  return d.toLocaleDateString('bg-BG',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'});
}
function getTasksForDate(iso){
  ensureTasksState();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(iso||''))iso=todayISO();
  return sanitizeTasksForDate(iso);
}
function cleanupEmptyTaskDate(iso){
  if(state.tasksByDate&&Array.isArray(state.tasksByDate[iso])&&!state.tasksByDate[iso].length)delete state.tasksByDate[iso];
}
function autoCarryUnfinishedTasksToToday(){
  if(!state.tasksByDate||!state.tasksUi)return;
  const today=todayISO();
  const last=state.tasksUi.lastCarryForwardDate;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(last||'')){
    state.tasksUi.lastCarryForwardDate=today;
    return;
  }
  if(last>=today){
    if(last>today)state.tasksUi.lastCarryForwardDate=today;
    return;
  }
  const sourceDate=last;
  const sourceTasks=Array.isArray(state.tasksByDate[sourceDate])?state.tasksByDate[sourceDate]:[];
  const unfinished=sourceTasks.filter(task=>task&&!task.done&&String(task.text||'').trim()!=='');
  let changed=false;
  if(unfinished.length){
    const targetTasks=Array.isArray(state.tasksByDate[today])?state.tasksByDate[today]:(state.tasksByDate[today]=[]);
    unfinished.forEach(task=>{
      const already=targetTasks.some(existing=>existing&&existing.carriedFromId===task.id&&existing.carriedFromDate===sourceDate);
      if(already)return;
      const now=new Date().toISOString();
      targetTasks.push({
        id:uid(),
        text:String(task.text||'').trim(),
        done:false,
        reminderOffsetDays:normalizeTaskReminder(task.reminderOffsetDays),
        createdAt:now,
        updatedAt:now,
        carriedFromDate:sourceDate,
        carriedFromId:task.id,
        carriedAt:now
      });
      changed=true;
    });
  }
  state.tasksUi.lastCarryForwardDate=today;
  state.tasksUi.selectedDate=today;
  state.tasksUi.calendarMonth=today.slice(0,7);
  try{saveState({silent:true});}catch(e){}
  if(changed&&typeof console!=='undefined')console.info('Незавършените задачи са прехвърлени към днешната дата.');
}
function setTasksSelectedDate(iso){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(iso||''))return;
  ensureTasksState();
  state.tasksUi.selectedDate=iso;
  state.tasksUi.calendarMonth=iso.slice(0,7);
  saveState();
  renderTasks();
}
function changeTasksMonth(delta){
  ensureTasksState();
  const parts=String(state.tasksUi.calendarMonth||todayISO().slice(0,7)).split('-').map(Number);
  const d=new Date(parts[0]||new Date().getFullYear(),(parts[1]||1)-1,1);
  d.setMonth(d.getMonth()+delta);
  state.tasksUi.calendarMonth=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  saveState();
  renderTasks();
}
function autoGrowTaskTextarea(el){
  if(!el)return;
  el.style.height='auto';
  const min=el.id==='newTaskInput'?44:38;
  const max=el.id==='newTaskInput'?240:280;
  const next=Math.max(min,Math.min(el.scrollHeight+2,max));
  el.style.height=next+'px';
  el.style.overflowY=el.scrollHeight+2>max?'auto':'hidden';
}
function addTaskFromInput(){
  const input=document.getElementById('newTaskInput');
  if(!input)return;
  const text=String(input.value||'').trim();
  if(!text)return;
  ensureTasksState();
  const dateInput=document.getElementById('newTaskDate');
  const reminderInput=document.getElementById('newTaskReminder');
  const selected=state.tasksUi.selectedDate||todayISO();
  const iso=dateInput&&/^\d{4}-\d{2}-\d{2}$/.test(dateInput.value||'')?dateInput.value:selected;
  const reminderOffsetDays=normalizeTaskReminder(reminderInput?reminderInput.value:'none');
  getTasksForDate(iso).push({id:uid(),text,done:false,reminderOffsetDays,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
  state.tasksUi.selectedDate=iso;
  state.tasksUi.calendarMonth=iso.slice(0,7);
  input.value='';
  autoGrowTaskTextarea(input);
  if(dateInput)dateInput.value=iso;
  saveState();
  renderTasks();
  const next=document.getElementById('newTaskInput');
  if(next)next.focus();
}
function renderTodayTasksPreview(){
  const box=document.getElementById('todayTasksPreview');
  if(!box)return;
  ensureTasksState();
  const today=todayISO();
  const active=getTasksForDate(today).filter(task=>task&&!task.done&&String(task.text||'').trim());
  if(!active.length){
    box.classList.add('hidden');
    box.innerHTML='';
    return;
  }
  const items=active.map(task=>`
    <label class="today-task-chip">
      <input type="checkbox" data-today-task-done="${escapeAttr(task.id)}" />
      <span>${escapeHtml(task.text)}</span>
    </label>
  `).join('');
  box.classList.remove('hidden');
  box.innerHTML=`
    <div class="today-tasks-head"><span>Задачи днес</span><span class="today-tasks-badge">${active.length}</span></div>
    <div class="today-tasks-list">${items}</div>
    <button class="small today-tasks-open" type="button" data-open-today-tasks>Отвори</button>
  `;
  box.querySelectorAll('[data-today-task-done]').forEach(check=>{
    check.addEventListener('change',()=>toggleTaskDone(today,check.dataset.todayTaskDone,true));
  });
  const openBtn=box.querySelector('[data-open-today-tasks]');
  if(openBtn)openBtn.addEventListener('click',()=>{openQuickSection('tasks');setTasksSelectedDate(today);});
}
function toggleTaskDone(date,id,done){
  const tasks=getTasksForDate(date);
  const task=tasks.find(item=>item.id===id);
  if(!task)return;
  task.done=!!done;
  task.updatedAt=new Date().toISOString();
  saveState();
  renderTasks();
}
function updateTaskText(date,id,text,options={}){
  ensureTasksState();
  const tasks=Array.isArray(state.tasksByDate[date])?state.tasksByDate[date]:(state.tasksByDate[date]=[]);
  const task=tasks.find(item=>item.id===id);
  if(!task)return;
  task.text=String(text||'');
  task.updatedAt=new Date().toISOString();
  if(options&&options.deferred)scheduleSilentStateSave();
  else saveStateSafe();
}
function updateTaskReminder(date,id,value){
  const tasks=getTasksForDate(date);
  const task=tasks.find(item=>item.id===id);
  if(!task)return;
  task.reminderOffsetDays=normalizeTaskReminder(value);
  task.updatedAt=new Date().toISOString();
  saveState();
  renderTasks();
}
function deleteTask(date,id){
  const tasks=getTasksForDate(date);
  const index=tasks.findIndex(item=>item.id===id);
  if(index<0)return;
  tasks.splice(index,1);
  cleanupEmptyTaskDate(date);
  saveState();
  renderTasks();
}
function getTaskReminderTriggersForDate(iso){
  ensureTasksState();
  const out=[];
  Object.keys(state.tasksByDate||{}).forEach(dueDate=>{
    const tasks=Array.isArray(state.tasksByDate[dueDate])?state.tasksByDate[dueDate]:[];
    tasks.forEach(task=>{
      if(!task||task.done||!String(task.text||'').trim())return;
      const reminderDate=taskReminderDate(dueDate,task.reminderOffsetDays);
      if(reminderDate===iso)out.push({dueDate,task,reminderDate});
    });
  });
  return out;
}
function getActiveTaskReminders(iso){
  ensureTasksState();
  const out=[];
  Object.keys(state.tasksByDate||{}).forEach(dueDate=>{
    const tasks=Array.isArray(state.tasksByDate[dueDate])?state.tasksByDate[dueDate]:[];
    tasks.forEach(task=>{
      if(!task||task.done||!String(task.text||'').trim())return;
      const reminderDate=taskReminderDate(dueDate,task.reminderOffsetDays);
      if(!reminderDate)return;
      if(iso>=reminderDate&&iso<=dueDate)out.push({dueDate,task,reminderDate});
    });
  });
  out.sort((a,b)=>a.dueDate.localeCompare(b.dueDate)||String(a.task.text||'').localeCompare(String(b.task.text||'')));
  return out;
}
function renderTaskReminders(){
  const box=document.getElementById('tasksDueReminders');
  if(!box)return;
  const today=todayISO();
  const reminders=getActiveTaskReminders(today);
  if(!reminders.length){
    box.classList.add('hidden');
    box.innerHTML='';
    return;
  }
  box.classList.remove('hidden');
  const cards=reminders.map(item=>{
    const days=diffDays(today,item.dueDate);
    const when=item.dueDate===today?'Днес':(days===1?'Утре':formatFullDisplayDate(item.dueDate));
    const started=item.reminderDate===today?'Напомнянето започва днес':`Напомня от ${escapeHtml(formatFullDisplayDate(item.reminderDate))}`;
    return `<button class="task-reminder-card" type="button" data-task-jump-date="${escapeHtml(item.dueDate)}"><strong>${escapeHtml(when)}</strong>${escapeHtml(item.task.text||'')}<span class="task-reminder-meta">${started} · ${escapeHtml(taskReminderLabel(item.task.reminderOffsetDays))}</span></button>`;
  }).join('');
  box.innerHTML=`<div class="task-reminders-title"><span>🔔 Напомняния за днес</span><span>${reminders.length}</span></div><div class="task-reminder-cards">${cards}</div>`;
  box.querySelectorAll('[data-task-jump-date]').forEach(btn=>btn.addEventListener('click',()=>setTasksSelectedDate(btn.dataset.taskJumpDate)));
}

function escapeRegExp(text){
  return String(text||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
}
function normalizeTaskSearchText(text){
  return String(text||'').replace(/\s+/g,' ').trim();
}
function taskSearchSnippet(text,query){
  const source=normalizeTaskSearchText(text);
  if(!source)return'';
  const needle=String(query||'').trim();
  const lower=source.toLocaleLowerCase('bg-BG');
  const q=needle.toLocaleLowerCase('bg-BG');
  let index=lower.indexOf(q);
  if(index<0)index=0;
  const start=Math.max(0,index-55);
  const end=Math.min(source.length,index+needle.length+85);
  const prefix=start>0?'…':'';
  const suffix=end<source.length?'…':'';
  const snippet=prefix+source.slice(start,end)+suffix;
  if(!needle)return escapeHtml(snippet);
  try{
    const re=new RegExp(escapeRegExp(needle),'gi');
    return escapeHtml(snippet).replace(re,match=>`<mark>${match}</mark>`);
  }catch(_){
    return escapeHtml(snippet);
  }
}
function collectTaskSearchResults(query){
  ensureTasksState();
  const q=String(query||'').trim();
  if(q.length<2)return[];
  const needle=q.toLocaleLowerCase('bg-BG');
  const results=[];
  Object.keys(state.tasksByDate||{}).forEach(date=>{
    const tasks=Array.isArray(state.tasksByDate[date])?sanitizeTasksForDate(date):[];
    tasks.forEach((task,index)=>{
      const text=normalizeTaskSearchText(task&&task.text);
      if(!text)return;
      if(text.toLocaleLowerCase('bg-BG').includes(needle)){
        results.push({date,type:'Задача',text,done:!!task.done,meta:task.done?'Изпълнена задача':'Активна задача',rank:0,index});
      }
    });
  });
  Object.keys(state.taskNotesByDate||{}).forEach(date=>{
    const text=normalizeTaskSearchText(plainTextFromHtml(sanitizeTaskNoteHtml(state.taskNotesByDate[date]||'')));
    if(!text)return;
    if(text.toLocaleLowerCase('bg-BG').includes(needle)){
      results.push({date,type:'Бележка',text,done:false,meta:'Бележки за деня',rank:1,index:0});
    }
  });
  const today=todayISO();
  results.sort((a,b)=>{
    const aFuture=a.date>=today?0:1;
    const bFuture=b.date>=today?0:1;
    if(aFuture!==bFuture)return aFuture-bFuture;
    if(aFuture===0)return a.date.localeCompare(b.date)||a.rank-b.rank||a.index-b.index;
    return b.date.localeCompare(a.date)||a.rank-b.rank||a.index-b.index;
  });
  return results;
}
function renderTaskSearch(){
  const input=document.getElementById('taskSearchInput');
  const box=document.getElementById('taskSearchResults');
  const count=document.getElementById('taskSearchCount');
  if(!input||!box)return;
  const query=String(input.value||'').trim();
  if(!query){
    box.classList.add('hidden');
    box.innerHTML='';
    if(count)count.textContent='';
    return;
  }
  box.classList.remove('hidden');
  if(query.length<2){
    box.innerHTML='<div class="tasks-empty">Въведи поне 2 символа, за да търся в задачите и бележките.</div>';
    if(count)count.textContent='';
    return;
  }
  const results=collectTaskSearchResults(query);
  if(count)count.textContent=results.length?`${results.length} резултата`:'Няма резултат';
  if(!results.length){
    box.innerHTML='<div class="tasks-empty">Няма намерени задачи или бележки с това търсене.</div>';
    return;
  }
  const limited=results.slice(0,60);
  box.innerHTML=limited.map(item=>{
    const dateLabel=escapeHtml(formatFullDisplayDate(item.date));
    const type=escapeHtml(item.type);
    const meta=escapeHtml(item.meta||'');
    const more=results.length>limited.length&&item===limited[limited.length-1]?`<em>Показани са първите ${limited.length} от ${results.length} резултата.</em>`:'';
    return `<button class="task-search-result" type="button" data-task-search-date="${escapeHtml(item.date)}"><strong>${dateLabel} · ${type}</strong><span>${taskSearchSnippet(item.text,query)}</span><em>${meta} · натисни, за да отвориш датата</em>${more}</button>`;
  }).join('');
  box.querySelectorAll('[data-task-search-date]').forEach(btn=>{
    btn.addEventListener('click',()=>setTasksSelectedDate(btn.dataset.taskSearchDate));
  });
}

function renderTaskList(date){
  const list=document.getElementById('tasksList');
  if(!list)return;
  let tasks=[];
  let reminderTasks=[];
  try{tasks=getTasksForDate(date);}catch(error){console.error('Tasks list error:',error);tasks=[];}
  try{reminderTasks=getTaskReminderTriggersForDate(date).filter(item=>item&&item.dueDate!==date);}catch(error){console.error('Task reminder list error:',error);reminderTasks=[];}
  list.innerHTML='';

  reminderTasks.forEach(item=>{
    if(!item||!item.task||!String(item.task.text||'').trim())return;
    const task=item.task;
    const row=document.createElement('div');
    row.className='task-item task-item-reminder';
    const check=document.createElement('input');
    check.type='checkbox';
    check.checked=!!task.done;
    check.setAttribute('aria-label','Маркирай напомнената задача като изпълнена');
    check.addEventListener('change',()=>toggleTaskDone(item.dueDate,task.id,check.checked));
    const input=document.createElement('textarea');
    input.rows=1;
    input.className='task-text-input';
    input.value=task.text||'';
    input.placeholder='Напомняне за бъдеща задача...';
    input.title='Това е напомняне за задача от '+isoToDisplay(item.dueDate);
    input.addEventListener('input',()=>{autoGrowTaskTextarea(input);updateTaskText(item.dueDate,task.id,input.value,{deferred:true});});
    input.addEventListener('blur',()=>{task.text=String(input.value||'').trim();task.updatedAt=new Date().toISOString();flushScheduledSilentStateSave();saveStateSafe();renderTasks();});
    const jump=document.createElement('button');
    jump.type='button';
    jump.className='small task-reminder-jump';
    jump.innerHTML='🔔 '+isoToDisplay(item.dueDate);
    jump.title='Отвори датата, за която е задачата';
    jump.addEventListener('click',()=>setTasksSelectedDate(item.dueDate));
    const del=document.createElement('button');
    del.type='button';
    del.className='danger small';
    del.textContent='×';
    del.title='Изтрий оригиналната задача';
    del.addEventListener('click',()=>deleteTask(item.dueDate,task.id));
    row.appendChild(check);
    row.appendChild(input);
    row.appendChild(jump);
    row.appendChild(del);
    list.appendChild(row);
    autoGrowTaskTextarea(input);
  });

  tasks.forEach(task=>{
    if(!task||typeof task!=='object')return;
    const row=document.createElement('div');
    row.className='task-item'+(task.done?' done':'');
    const check=document.createElement('input');
    check.type='checkbox';
    check.checked=!!task.done;
    check.setAttribute('aria-label','Завършена задача');
    check.addEventListener('change',()=>toggleTaskDone(date,task.id,check.checked));
    const input=document.createElement('textarea');
    input.rows=1;
    input.className='task-text-input';
    input.value=task.text||'';
    input.placeholder='Описание на задачата...';
    if(task.carriedFromDate)input.title='Прехвърлена от '+isoToDisplay(task.carriedFromDate);
    input.addEventListener('input',()=>{autoGrowTaskTextarea(input);updateTaskText(date,task.id,input.value,{deferred:true});});
    input.addEventListener('blur',()=>{task.text=String(input.value||'').trim();task.updatedAt=new Date().toISOString();flushScheduledSilentStateSave();saveStateSafe();renderTasks();});
    const reminder=document.createElement('select');
    reminder.className='task-reminder-select';
    reminder.title='Кога да напомни';
    TASK_REMINDER_OPTIONS.forEach(option=>{
      const opt=document.createElement('option');
      opt.value=option.value;
      opt.textContent=option.label;
      reminder.appendChild(opt);
    });
    reminder.value=normalizeTaskReminder(task.reminderOffsetDays);
    reminder.addEventListener('change',()=>updateTaskReminder(date,task.id,reminder.value));
    const del=document.createElement('button');
    del.type='button';
    del.className='danger small';
    del.textContent='×';
    del.title='Изтрий задачата';
    del.addEventListener('click',()=>deleteTask(date,task.id));
    row.appendChild(check);
    row.appendChild(input);
    row.appendChild(reminder);
    row.appendChild(del);
    list.appendChild(row);
    autoGrowTaskTextarea(input);
  });
  if(!list.children.length){
    list.innerHTML='<div class="tasks-empty">Няма задачи за тази дата. Добави reminder, за да не го забравиш.</div>';
  }
}
function renderTasksCalendar(){
  const grid=document.getElementById('tasksCalendarGrid');
  const title=document.getElementById('tasksCalendarTitle');
  const card=document.getElementById('tasksCalendarCard');
  const mini=document.getElementById('tasksCalendarMiniInfo');
  if(card){
    card.classList.remove('hidden');
    card.style.display='block';
    card.style.visibility='visible';
    card.style.opacity='1';
  }
  if(!grid||!title)return;
  try{
    ensureTasksState();
    let [year,month]=String(state.tasksUi.calendarMonth||todayISO().slice(0,7)).split('-').map(Number);
    if(!Number.isFinite(year)||!Number.isFinite(month)||month<1||month>12){
      const today=todayISO();
      year=Number(today.slice(0,4));
      month=Number(today.slice(5,7));
      state.tasksUi.calendarMonth=today.slice(0,7);
    }
    const base=new Date(year,month-1,1);
    title.textContent=`${monthNames[base.getMonth()]} ${base.getFullYear()}`;
    if(mini)mini.textContent='отделен';
    const fragment=document.createDocumentFragment();
    ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].forEach(day=>{
      const el=document.createElement('div');
      el.className='task-calendar-day-name';
      el.textContent=day;
      fragment.appendChild(el);
    });
    const firstWeekDay=(base.getDay()+6)%7;
    const start=new Date(base);
    start.setDate(1-firstWeekDay);
    const selected=state.tasksUi.selectedDate||todayISO();
    const today=todayISO();
    for(let i=0;i<42;i++){
      const d=new Date(start);
      d.setDate(start.getDate()+i);
      const iso=toISODate(d);
      const tasks=state.tasksByDate&&Array.isArray(state.tasksByDate[iso])?sanitizeTasksForDate(iso):[];
      const hasNotes=!!(state.taskNotesByDate&&sanitizeTaskNoteHtml(state.taskNotesByDate[iso]||''));
      const done=tasks.filter(t=>t&&t.done).length;
      let reminderCount=0;
      try{reminderCount=getTaskReminderTriggersForDate(iso).length;}catch(_){reminderCount=0;}
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='task-calendar-day';
      if(d.getMonth()!==base.getMonth())btn.classList.add('other-month');
      if(iso===today)btn.classList.add('today');
      if(iso===selected)btn.classList.add('selected');
      if(tasks.length)btn.classList.add('has-tasks');
      if(hasNotes)btn.classList.add('has-notes');
      if(reminderCount)btn.classList.add('has-reminders');
      btn.dataset.taskDate=iso;
      btn.innerHTML=`<span>${d.getDate()}</span><span class="task-calendar-count">${tasks.length?`${done}/${tasks.length}`:(hasNotes?'📝':'')}</span><span class="task-calendar-bell">${reminderCount?`🔔 ${reminderCount}`:''}</span>`;
      btn.addEventListener('click',()=>setTasksSelectedDate(iso));
      fragment.appendChild(btn);
    }
    grid.innerHTML='';
    grid.appendChild(fragment);
  }catch(error){
    console.error('Tasks calendar error:',error);
    const today=todayISO();
    title.textContent='Календар';
    if(mini)mini.textContent='';
    grid.innerHTML='<div class="tasks-empty">Календарът не можа да се зареди автоматично. Натисни „Днес“ или презареди файла.</div>';
    if(state&&state.tasksUi){state.tasksUi.calendarMonth=today.slice(0,7);state.tasksUi.selectedDate=today;}
  }
}
function renderTasks(){
  const editor=document.getElementById('tasksEditor');
  if(!editor)return;
  ensureTasksState();
  const selected=state.tasksUi.selectedDate||todayISO();
  const tasks=getTasksForDate(selected);
  const done=tasks.filter(t=>t&&t.done).length;
  const title=document.getElementById('tasksSelectedTitle');
  const badge=document.getElementById('tasksSelectedBadge');
  const summary=document.getElementById('tasksSummary');
  if(title)title.textContent='Задачи';
  if(badge)badge.textContent=taskDateLongLabel(selected);
  if(summary)summary.textContent=tasks.length?`${done} от ${tasks.length} изпълнени`:'Няма задачи за избраната дата';
  const calendarCard=document.getElementById('tasksCalendarCard');
  if(calendarCard){
    calendarCard.classList.remove('hidden');
    calendarCard.style.display='block';
    calendarCard.style.visibility='visible';
    calendarCard.style.opacity='1';
  }
  renderTasksCalendar();
  try{renderTaskNotes(selected);}catch(error){console.error('Task notes error:',error);}
  try{renderTaskReminders();}catch(error){console.error('Tasks reminders error:',error);}
  try{renderTaskSearch();}catch(error){console.error('Task search error:',error);}
  try{renderTaskList(selected);}catch(error){console.error('Tasks list error:',error);const list=document.getElementById('tasksList');if(list)list.innerHTML='<div class="tasks-empty">Списъкът със задачи не можа да се зареди. Опитай да презаредиш файла.</div>';}
  const addBtn=document.getElementById('addTaskBtn');
  const input=document.getElementById('newTaskInput');
  const dateInput=document.getElementById('newTaskDate');
  const reminderInput=document.getElementById('newTaskReminder');
  if(dateInput)dateInput.value=selected;
  if(reminderInput&&!reminderInput.value)reminderInput.value='none';
  updateNewTaskReminderButton();
  const reminderBtn=document.getElementById('newTaskReminderButton');
  if(reminderBtn)reminderBtn.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    openTaskReminderMenu(reminderBtn,reminderInput?reminderInput.value:'none',value=>{if(reminderInput)reminderInput.value=value;updateNewTaskReminderButton();});
  };
  const todayBtn=document.getElementById('tasksTodayBtn');
  const prev=document.getElementById('tasksPrevMonthBtn');
  const next=document.getElementById('tasksNextMonthBtn');
  const searchInput=document.getElementById('taskSearchInput');
  const clearSearchBtn=document.getElementById('clearTaskSearchBtn');
  if(addBtn)addBtn.onclick=addTaskFromInput;
  if(searchInput)searchInput.oninput=renderTaskSearch;
  if(clearSearchBtn)clearSearchBtn.onclick=()=>{if(searchInput)searchInput.value='';renderTaskSearch();};
  if(input){
    input.oninput=()=>autoGrowTaskTextarea(input);
    input.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();addTaskFromInput();}};
    autoGrowTaskTextarea(input);
  }
  if(todayBtn)todayBtn.onclick=()=>setTasksSelectedDate(todayISO());
  if(prev)prev.onclick=()=>changeTasksMonth(-1);
  if(next)next.onclick=()=>changeTasksMonth(1);
  renderTodayTasksPreview();
  window.setTimeout(()=>{if(document.getElementById('tasksCalendarGrid')&&sectionOpen.tasks)renderTasksCalendar();},0);
}
function renderMain(){
  const week=getActiveWeek(); if(!week){mainPanel.innerHTML='<div class="empty">Няма създадени седмици.</div>';return}
  mainPanel.innerHTML='';mainPanel.appendChild(document.getElementById('weekTemplate').content.cloneNode(true));
  document.getElementById('weekTitle').textContent=makeTitle(week.startDate,week.endDate,week.customTitle);
  document.getElementById('updatedInfo').textContent='Последна промяна: '+new Date(week.updatedAt).toLocaleString('bg-BG');
  const startDate=document.getElementById('startDate'), endDate=document.getElementById('endDate'), customTitle=document.getElementById('customTitle');
  startDate.dataset.dateIso=week.startDate;
  endDate.dataset.dateIso=week.endDate;
  startDate.value=isoToDisplay(week.startDate);endDate.value=isoToDisplay(week.endDate);customTitle.value=week.customTitle||'';
  startDate.addEventListener('change',()=>{const iso=normalizeDateInput(startDate);if(iso)updateWeekField('startDate',iso)});
  endDate.addEventListener('change',()=>{const iso=normalizeDateInput(endDate);if(iso)updateWeekField('endDate',iso)});
  customTitle.addEventListener('input',()=>updateWeekField('customTitle',customTitle.value));
  const weekOptionsBtn=document.getElementById('weekOptionsBtn');
  const weekOptionsMenu=document.getElementById('weekOptionsMenu');
  if(weekOptionsBtn&&weekOptionsMenu){
    weekOptionsBtn.addEventListener('click',e=>{e.stopPropagation();weekOptionsMenu.classList.toggle('hidden')});
  }
  document.getElementById('duplicateWeekBtn').addEventListener('click',()=>{if(weekOptionsMenu)weekOptionsMenu.classList.add('hidden');duplicateWeek()});
  document.getElementById('printBtn').addEventListener('click',()=>{if(weekOptionsMenu)weekOptionsMenu.classList.add('hidden');window.print()});
  const saveWeekOptionsBtn=document.getElementById('saveWeekOptionsBtn');
  if(saveWeekOptionsBtn)saveWeekOptionsBtn.addEventListener('click',()=>{if(weekOptionsMenu)weekOptionsMenu.classList.add('hidden');saveJsonFromButton(saveWeekOptionsBtn)});
  document.getElementById('deleteWeekBtn').addEventListener('click',()=>{if(weekOptionsMenu)weekOptionsMenu.classList.add('hidden');deleteWeek()});

  document.querySelectorAll('[data-section-save]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(btn.dataset.sectionSave==='contracts')updateSelectedContractFromEditor({save:true});
      if(btn.dataset.sectionSave==='workForm')saveWorkFormState();
      saveJsonFromButton(btn);
    });
  });
  document.querySelectorAll('[data-quick-section]').forEach(btn=>{
    btn.addEventListener('click',e=>{
      if(window.__quickAccessWasDragged){e.preventDefault();window.__quickAccessWasDragged=false;return;}
      openQuickSection(btn.dataset.quickSection);
    });
  });
  initQuickAccessSorting();
  initSectionThemeControls();
  document.getElementById('toggleHotelsBtn').addEventListener('click',()=>toggleSection('hotels'));
  document.getElementById('addHotelBtn').addEventListener('click',addHotel);
  document.getElementById('toggleRoomTypesSectionBtn').addEventListener('click',()=>toggleSection('roomTypes'));
  document.getElementById('toggleContractsBtn').addEventListener('click',()=>{toggleSection('contracts');if(sectionOpen.contracts)renderContracts();});
  document.getElementById('toggleTasksBtn').addEventListener('click',()=>{toggleSection('tasks');if(sectionOpen.tasks){renderTasks();window.setTimeout(renderTasksCalendar,30);}});
  document.getElementById('addContractBtn').addEventListener('click',addContract);
  document.getElementById('saveContractBtn').addEventListener('click',saveSelectedContract);
  document.getElementById('deleteContractBtn').addEventListener('click',deleteSelectedContract);
  document.getElementById('refreshContractPreviewBtn').addEventListener('click',()=>{updateSelectedContractFromEditor();refreshContractPreview();});
  document.getElementById('openContractLinkBtn').addEventListener('click',openSelectedContractLink);
  document.getElementById('togglePricesBtn').addEventListener('click',()=>toggleSection('prices'));
  document.getElementById('toggleUltraBtn').addEventListener('click',()=>toggleSection('ultra'));

  document.getElementById('toggleDiscountsBtn').addEventListener('click',()=>toggleSection('discounts'));
  document.getElementById('toggleDiscountReservationsBtn').addEventListener('click',()=>toggleSection('discountReservations'));
  document.getElementById('toggleWorkFormBtn').addEventListener('click',()=>{toggleSection('form');if(sectionOpen.form)renderWorkForm();});
  document.getElementById('addDiscountReservationBtn').addEventListener('click',addDiscountReservation);
  document.getElementById('exportDiscountReservationsPdfBtn').addEventListener('click',exportDiscountReservationsPDF);
  document.getElementById('exportDiscountReservationsExcelBtn').addEventListener('click',exportDiscountReservationsExcel);
  document.getElementById('toggleEmailTableBtn').addEventListener('click',()=>toggleSection('email'));
  document.getElementById('toggleEmailTxtBtn').addEventListener('click',()=>toggleSection('emailTxt'));
  document.getElementById('pinEmailTableBtn').addEventListener('click',()=>togglePinnedEmailTable());
  document.getElementById('unpinEmailFloatingBtn').addEventListener('click',()=>togglePinnedEmailTable(false));
  document.getElementById('pinnedEmailCloseBtn').addEventListener('click',()=>togglePinnedEmailTable(false));

  document.getElementById('addPeriodBtn').addEventListener('click',addPeriod);
  document.getElementById('addSubsectionBtn').addEventListener('click',addSubsection);
  document.getElementById('copySubsectionBtn').addEventListener('click',copySubsectionFrom);
  const copySubsectionDataBtn=document.getElementById('copySubsectionDataBtn');
  if(copySubsectionDataBtn)copySubsectionDataBtn.addEventListener('click',copySubsectionDataFrom);
  const clearSubsectionDataBtn=document.getElementById('clearSubsectionDataBtn');
  if(clearSubsectionDataBtn)clearSubsectionDataBtn.addEventListener('click',clearSubsectionData);
  const importWorkFormBackupBtn=document.getElementById('importWorkFormBackupBtn');
  const workFormBackupInput=document.getElementById('workFormBackupInput');
  if(importWorkFormBackupBtn&&workFormBackupInput){
    importWorkFormBackupBtn.addEventListener('click',()=>workFormBackupInput.click());
    workFormBackupInput.addEventListener('change',importWorkFormBackupFile);
  }
  const copyDiscountTextBtn=document.getElementById('copyDiscountTextBtn');
  if(copyDiscountTextBtn)copyDiscountTextBtn.addEventListener('click',copyDiscountText);
  document.getElementById('deleteSubsectionBtn').addEventListener('click',deleteSubsection);

  document.getElementById('toggleChecklistBtn').addEventListener('click',()=>toggleSection('checklist'));
  document.getElementById('toggleCancellationsBtn').addEventListener('click',()=>{toggleSection('cancellations');if(sectionOpen.cancellations)renderCancellationPolicy();});

  document.getElementById('saveBtnPeriods').addEventListener('click',e=>saveJsonFromButton(e.currentTarget));
  document.getElementById('lockDiscountsBtn').addEventListener('click',()=>toggleDiscountLock(true));
  const lockDiscountsTopBtn=document.getElementById('lockDiscountsTopBtn');
  if(lockDiscountsTopBtn)lockDiscountsTopBtn.addEventListener('click',()=>toggleDiscountLock(true));
  document.getElementById('saveBtn').addEventListener('click',e=>saveJsonFromButton(e.currentTarget));
  applySectionStates();
  renderHotels();renderContracts();renderTasks();renderRoomTypes();renderPrices();renderUltraAllInclusive();renderSelectorsAndPeriods();
  renderDiscountReservations();
  if(sectionOpen.email||emailTablePinned)renderEmailTable();
  renderEmailTxt();
  renderChecklist();
  renderCancellationPolicy();
  ensureCancelButtons();
}
function renderHotels(){
  const week=getActiveWeek();
  const tabs=document.getElementById('hotelManageTabs');
  const panel=document.getElementById('hotelDetailsPanel');
  if(!week||!tabs||!panel)return;

  tabs.innerHTML='';
  week.hotels.forEach((hotel,index)=>{
    const name=hotel.name.trim()||`Хотел ${index+1}`;
    const tab=document.createElement('button');
    tab.className='hotel-tab small'+(hotel.id===week.selectedHotelId?' active':'');
    tab.innerHTML=`<span class="hotel-name">${escapeHtml(name)}</span>${operationRangeLabel(hotel)?`<span class="hotel-operation">${escapeHtml(operationRangeLabel(hotel))}</span>`:''}`;
    tab.addEventListener('click',()=>selectHotel(hotel.id));
    tabs.appendChild(tab);
  });

  const hotel=getSelectedHotel(week);
  if(!hotel){
    panel.innerHTML='<div class="empty">Няма избран хотел.</div>';
    return;
  }

  const hotelIndex=week.hotels.findIndex(h=>h.id===hotel.id);
  const operationValue=hotel.operationFrom&&hotel.operationTo
    ? isoToDisplay(hotel.operationFrom)+' - '+isoToDisplay(hotel.operationTo)
    : '';

  panel.innerHTML=`<div class="hotel-detail-grid">
      <div>
        <label>Име на хотел</label>
        <input type="text" value="${escapeAttr(hotel.name)}" placeholder="Напиши име на хотел" data-hotel-name="${hotel.id}" />
      </div>
      <div>
        <label>Оперативни дати</label>
        <input class="hotel-operation-input" type="text" inputmode="numeric" placeholder="дд.мм - дд.мм" data-date-range="true" readonly value="${escapeAttr(operationValue)}" data-from="${escapeAttr(hotel.operationFrom||'')}" data-to="${escapeAttr(hotel.operationTo||'')}" data-hotel-operation="${hotel.id}" />
      </div>
      <div>
        <label>Дни</label>
        <input type="text" readonly value="${escapeAttr(operationDays(hotel)||'')}" />
      </div>
      <div>
        <label>Брой стаи</label>
        <input type="number" min="0" step="1" inputmode="numeric" value="${escapeAttr(hotel.roomCount||'')}" placeholder="напр. 120" data-hotel-room-count="${hotel.id}" />
      </div>
      <div class="muted">
        <label>Канали / записи</label>
        ${hotel.subsections.length} канали · ${countHotelPeriods(hotel)} периода
      </div>
      <div>
        <button class="danger small" data-delete-hotel="${hotel.id}" title="Изтрий">🗑️</button>
      </div>
    </div>
`;

  panel.querySelector('[data-hotel-name]').addEventListener('input',e=>updateHotelName(e.target.dataset.hotelName,e.target.value));
  panel.querySelector('[data-hotel-operation]').addEventListener('rangechange',e=>updateHotelOperation(e.target.dataset.hotelOperation,e.detail.from,e.detail.to));
  panel.querySelector('[data-hotel-room-count]').addEventListener('input',e=>updateHotelRoomCount(e.target.dataset.hotelRoomCount,e.target.value));
  panel.querySelector('[data-delete-hotel]').addEventListener('click',e=>removeHotel(e.target.dataset.deleteHotel));

  const nightsToggle=document.getElementById('toggleHotelNightsBtn');
  const nightsPanel=document.getElementById('hotelNightsPanel');
  if(nightsToggle&&nightsPanel){
    nightsToggle.textContent=(hotelNightsOpen?'▼ ':'▶ ')+'Нощувки';
    nightsToggle.onclick=()=>{hotelNightsOpen=!hotelNightsOpen;renderHotels();};
    nightsPanel.classList.toggle('hidden',!hotelNightsOpen);
    if(hotelNightsOpen)renderHotelNights();
    window.setTimeout(applyAllSectionThemes,0);
  }

}
function renderRoomTypes(){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  const hotelTabs=document.getElementById('roomManageHotelTabs');
  const infoButtons=document.getElementById('roomManageInfoButtons');
  const list=document.getElementById('roomTypeList');
  const addBtn=document.getElementById('addRoomTypeBtn');
  const settingsBtn=document.getElementById('toggleRoomTypeSettingsBtn');
  const displayControlsBtn=document.getElementById('toggleRoomDisplayControlsBtn');
  const displayControlsPanel=document.getElementById('roomDisplayControlsPanel');
  const servicesBtn=document.getElementById('toggleRoomServicesBtn');
  const servicesPanel=document.getElementById('roomServicesPanel');
  const toMappingsBtn=document.getElementById('toggleToMappingsBtn');
  const toMappingsPanel=document.getElementById('toMappingsPanel');
  const settingsEditor=document.getElementById('roomTypeSettingsEditor');
  if(!week||!hotelTabs||!infoButtons||!list||!addBtn||!settingsBtn||!displayControlsBtn||!displayControlsPanel||!servicesBtn||!servicesPanel||!toMappingsBtn||!toMappingsPanel||!settingsEditor)return;

  settingsEditor.classList.toggle('hidden',!roomSettingsOpen);
  settingsBtn.textContent=(roomSettingsOpen?'▼ ':'▶ ')+'Настройки на типове стаи';
  settingsBtn.onclick=()=>{
    roomSettingsOpen=!roomSettingsOpen;
    renderRoomTypes();
  };

  displayControlsPanel.classList.toggle('hidden',!roomDisplayControlsOpen);
  displayControlsBtn.textContent=(roomDisplayControlsOpen?'▼ ':'▶ ')+'Подравняване и шрифт';
  displayControlsBtn.onclick=()=>{
    roomDisplayControlsOpen=!roomDisplayControlsOpen;
    renderRoomTypes();
  };
  setupRoomDisplayControls();

  servicesPanel.classList.toggle('hidden',!roomServicesOpen);
  servicesBtn.textContent=(roomServicesOpen?'▼ ':'▶ ')+'Услуги';
  servicesBtn.onclick=()=>{
    roomServicesOpen=!roomServicesOpen;
    renderRoomTypes();
  };

  toMappingsPanel.classList.toggle('hidden',!toMappingsOpen);
  toMappingsBtn.textContent=(toMappingsOpen?'▼ ':'▶ ')+'Мапинги ТО';
  toMappingsBtn.onclick=()=>{
    toMappingsOpen=!toMappingsOpen;
    renderRoomTypes();
  };

  hotelTabs.innerHTML='';
  week.hotels.forEach((item,index)=>{
    const name=item.name.trim()||`Хотел ${index+1}`;
    const tab=document.createElement('button');
    tab.className='hotel-tab small'+(item.id===week.selectedHotelId?' active':'');
    tab.innerHTML=`<span class="hotel-name">${escapeHtml(name)}</span>${operationRangeLabel(item)?`<span class="hotel-operation">${escapeHtml(operationRangeLabel(item))}</span>`:''}`;
    tab.addEventListener('click',()=>selectHotel(item.id));
    hotelTabs.appendChild(tab);
  });

  renderRoomInfoButtons(infoButtons,hotel);

  if(!hotel){
    list.innerHTML='<div class="empty">Няма избран хотел.</div>';
    renderRoomServicesCatalog(null);
    renderToMappings(null);
    return;
  }

  if(!Array.isArray(hotel.roomServiceCatalog))hotel.roomServiceCatalog=normalizeRoomServiceCatalog(hotel.roomServiceCatalog||[]);
  hotel.toMappingGroups=cloneToMappingGroups(hotel.toMappingGroups||[],hotel.toMappings||[]);
  delete hotel.toMappings;
  if(typeof hotel.toMappingsLocked!=='boolean')hotel.toMappingsLocked=false;
  renderRoomServicesCatalog(hotel);
  renderToMappings(hotel);

  if(!Array.isArray(hotel.roomTypes))hotel.roomTypes=[];
  if(typeof hotel.roomTypesLocked!=='boolean')hotel.roomTypesLocked=false;

  addBtn.textContent=hotel.roomTypesLocked?'🔒 Заключено':'+ Добави стая';
  addBtn.disabled=hotel.roomTypesLocked;
  addBtn.onclick=addRoomType;

  let lockBtn=document.getElementById('lockRoomTypesBtn');
  if(!lockBtn){
    lockBtn=document.createElement('button');
    lockBtn.id='lockRoomTypesBtn';
    lockBtn.type='button';
    addBtn.parentElement.appendChild(lockBtn);
  }
  lockBtn.textContent=hotel.roomTypesLocked?'🔒 Типовете стаи са заключени':'🔓 Заключи типовете стаи';
  lockBtn.onclick=toggleRoomTypesLock;

  list.innerHTML='';
  if(!hotel.roomTypes.length){
    list.innerHTML='<div class="empty">Няма добавени типове стаи за този хотел.</div>';
    return;
  }

  hotel.roomTypes.forEach((room,index)=>{
    if(!Array.isArray(room.services)){
      room.services=room.service?[room.service]:[];
      delete room.service;
    }
    room.squareMeters=room.squareMeters||room.sqm||room.areaM2||'';
    delete room.sqm;
    delete room.areaM2;
    room.priceCapacity=room.priceCapacity||room.pricingCapacity||'';
    delete room.pricingCapacity;
    room.capacities=normalizeRoomCapacities(room);
    delete room.adults;
    delete room.children;

    const capacityInputs=room.capacities.map((cap,capIndex)=>`
        <div class="room-capacity-field">
          <label>Възрастни</label>
          <input type="number" ${hotel.roomTypesLocked?'disabled':''} min="0" step="1" value="${escapeAttr(cap.adults)}" placeholder="2" data-room-capacity="${room.id}" data-capacity-index="${capIndex}" data-capacity-field="adults" />
        </div>
        <div class="room-capacity-field">
          <label>Деца</label>
          <input type="number" ${hotel.roomTypesLocked?'disabled':''} min="0" step="1" value="${escapeAttr(cap.children)}" placeholder="2" data-room-capacity="${room.id}" data-capacity-index="${capIndex}" data-capacity-field="children" />
        </div>
      `).join('');

    const capacityText=roomTypeCapacityText(room);
    const servicesText=roomTypeServicesText(room,hotel);
    const kindText=roomTypeKindLabel(room);
    const squareMetersText=roomTypeSquareMetersLabel(room);
    const priceCapacityText=roomTypePriceCapacity(room);
    const serviceCatalog=getRoomServiceCatalog(hotel);
    const serviceOptions=serviceCatalog.map(service=>`<option value="${escapeAttr(service.id)}">${escapeHtml(service.name||'Услуга')}</option>`).join('');
    const selectedServices=roomTypeServiceItems(room,hotel);
    const card=document.createElement('div');
    card.className='room-type-card'+(hotel.roomTypesLocked?' locked':'');
    card.dataset.roomCard=room.id;
    card.innerHTML=`<button type="button" class="room-type-preview" data-room-preview="${room.id}">${index+1}. ${escapeHtml(roomTypeDisplayLabel(room,index))}${squareMetersText?' - '+escapeHtml(squareMetersText):''}${kindText?' - '+escapeHtml(kindText):''}${priceCapacityText?' - '+escapeHtml(priceCapacityText):''}${capacityText?' - '+escapeHtml(capacityText):''}${servicesText?' - '+escapeHtml(servicesText):''}</button>
      <div class="room-type-fields room-type-fields-mobile-friendly">
        <div class="room-name-field">
          <label>Име на стая</label>
          <input type="text" ${hotel.roomTypesLocked?'disabled':''} value="${escapeAttr(room.name)}" placeholder="Напр. Двойна стая" data-room-name="${room.id}" />
        </div>
        <div class="room-square-field">
          <label>Квадратура</label>
          <input type="text" ${hotel.roomTypesLocked?'disabled':''} value="${escapeAttr(roomTypeSquareMeters(room))}" placeholder="28" data-room-square-meters="${room.id}" />
        </div>
        <div class="room-kind-field">
          <label>Тип стая</label>
          <input type="text" ${hotel.roomTypesLocked?'disabled':''} value="${escapeAttr(roomTypeKindLabel(room))}" placeholder="Напр. Standard" data-room-kind="${room.id}" />
        </div>
        <button class="danger small room-delete-btn" ${hotel.roomTypesLocked?'disabled':''} title="Изтрий" data-delete-room="${room.id}">🗑️</button>
        <div class="room-price-field">
          <label>Цена база</label>
          <input type="text" ${hotel.roomTypesLocked?'disabled':''} value="${escapeAttr(roomTypePriceCapacity(room))}" placeholder="2+0" data-room-price-capacity="${room.id}" />
        </div>
        <div class="room-capacity-row">
          ${capacityInputs}
        </div>
      </div>
      <div class="room-service-select-row">
        <select ${hotel.roomTypesLocked||!serviceCatalog.length?'disabled':''} data-room-service-select="${room.id}">
          ${serviceCatalog.length?serviceOptions:'<option value="">Първо добави услуга от меню „Услуги“</option>'}
        </select>
        <button class="success small" ${hotel.roomTypesLocked||!serviceCatalog.length?'disabled':''} type="button" data-add-room-service="${room.id}">+ Добави услуга</button>
      </div>
      <div class="room-services-row room-service-selected-list" data-room-services="${room.id}">
        ${selectedServices.map((service,serviceIndex)=>`<span class="room-service-selected-chip" title="${escapeAttr(service.details||service.label)}"><span>${escapeHtml(service.label)}</span><button class="danger small" ${hotel.roomTypesLocked?'disabled':''} title="Премахни услуга" data-delete-room-service="${room.id}" data-service-index="${serviceIndex}">×</button></span>`).join('')}
      </div>`;
    list.appendChild(card);
  });

  list.querySelectorAll('[data-room-name]').forEach(input=>{
    input.addEventListener('input',e=>{
      updateRoomType(e.target.dataset.roomName,'name',e.target.value,false);
      updateRoomCardPreview(e.target.closest('.room-type-card'));
    });
    input.addEventListener('change',refreshRoomTypeDependentViewsKeepEditor);
  });

  list.querySelectorAll('[data-room-kind]').forEach(input=>{
    input.addEventListener('input',e=>{
      updateRoomType(e.target.dataset.roomKind,'typeLabel',e.target.value,false);
      updateRoomCardPreview(e.target.closest('.room-type-card'));
    });
    input.addEventListener('change',refreshRoomTypeDependentViewsKeepEditor);
  });

  list.querySelectorAll('[data-room-square-meters]').forEach(input=>{
    input.addEventListener('input',e=>{
      updateRoomType(e.target.dataset.roomSquareMeters,'squareMeters',e.target.value,false);
      updateRoomCardPreview(e.target.closest('.room-type-card'));
    });
    input.addEventListener('change',refreshRoomTypeDependentViewsKeepEditor);
  });

  list.querySelectorAll('[data-room-price-capacity]').forEach(input=>{
    input.addEventListener('input',e=>{
      updateRoomType(e.target.dataset.roomPriceCapacity,'priceCapacity',e.target.value,false);
      updateRoomCardPreview(e.target.closest('.room-type-card'));
    });
    input.addEventListener('change',refreshRoomTypeDependentViewsKeepEditor);
  });

  list.querySelectorAll('[data-room-capacity]').forEach(input=>{
    input.addEventListener('wheel',e=>{e.preventDefault();input.blur();},{passive:false});
    input.addEventListener('input',e=>{
      updateRoomCapacity(e.target.dataset.roomCapacity,Number(e.target.dataset.capacityIndex),e.target.dataset.capacityField,e.target.value,false);
      updateRoomCardPreview(e.target.closest('.room-type-card'));
    });
    input.addEventListener('change',refreshRoomTypeDependentViewsKeepEditor);
  });

  list.querySelectorAll('[data-add-room-service]').forEach(btn=>{
    btn.addEventListener('click',e=>{
      const card=e.target.closest('.room-type-card');
      const select=card?card.querySelector('[data-room-service-select]'):null;
      addRoomService(e.target.dataset.addRoomService,select?select.value:'');
    });
  });

  list.querySelectorAll('[data-delete-room-service]').forEach(btn=>{
    btn.addEventListener('click',e=>removeRoomService(e.target.dataset.deleteRoomService,Number(e.target.dataset.serviceIndex)));
  });

  list.querySelectorAll('[data-delete-room]').forEach(btn=>{
    btn.addEventListener('click',e=>removeRoomType(e.target.dataset.deleteRoom));
  });
}





function parseReleasePeriodDate(value,yearFallback){
  const raw=String(value||'').trim();
  if(!raw)return null;
  const full=displayToISO(raw);
  if(full)return full;
  const isoMatch=raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(isoMatch){
    const year=Number(isoMatch[1]), month=Number(isoMatch[2]), day=Number(isoMatch[3]);
    const d=new Date(year,month-1,day);
    if(d.getFullYear()===year&&d.getMonth()===month-1&&d.getDate()===day)return toISODate(d);
  }
  const clean=raw.replace(/[\/\-]/g,'.');
  const shortMatch=clean.match(/^(\d{1,2})\.(\d{1,2})(?:\.(\d{2}|\d{4}))?$/);
  if(!shortMatch)return null;
  const day=Number(shortMatch[1]);
  const month=Number(shortMatch[2]);
  let year=shortMatch[3]?Number(shortMatch[3]):(yearFallback||new Date().getFullYear());
  if(year<100)year+=2000;
  const d=new Date(year,month-1,day);
  if(d.getFullYear()!==year||d.getMonth()!==month-1||d.getDate()!==day)return null;
  return toISODate(d);
}
function releasePeriodDateUTC(iso){
  if(!iso)return NaN;
  const d=parseISODate(iso);
  return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate());
}
function releasePeriodBounds(period){
  const today=parseISODate(todayISO());
  const fallbackYear=today.getFullYear();
  let fromISO=parseReleasePeriodDate(period&&period.from,fallbackYear);
  let toISO=parseReleasePeriodDate(period&&period.to,fallbackYear);
  if(!fromISO||!toISO)return null;
  let from=parseISODate(fromISO);
  let to=parseISODate(toISO);
  if(to<from){
    to=new Date(to);
    to.setFullYear(to.getFullYear()+1);
    toISO=toISODate(to);
  }
  return {fromISO,toISO,fromUTC:releasePeriodDateUTC(fromISO),toUTC:releasePeriodDateUTC(toISO)};
}
function formatReleaseDays(days){
  const clean=String(days||'').trim();
  if(!clean)return '';
  if(/days?|дни/i.test(clean))return clean;
  return clean+' Days';
}
function findActiveReleasePeriod(group){
  const today=releasePeriodDateUTC(todayISO());
  return ((group&&group.releasePeriods)||[]).find(period=>{
    const bounds=releasePeriodBounds(period);
    return bounds&&today>=bounds.fromUTC&&today<=bounds.toUTC&&String(period.days||'').trim();
  })||null;
}
function releaseCurrentHtml(group){
  const todayLabel=isoToDisplay(todayISO());
  const active=findActiveReleasePeriod(group);
  if(active){
    return `<div class="to-release-current active"><span>Днес (${escapeHtml(todayLabel)}) сме в:</span><span class="to-release-days-badge">${escapeHtml(formatReleaseDays(active.days))}</span></div>`;
  }
  const hasAny=((group&&group.releasePeriods)||[]).some(period=>String(period.from||'').trim()||String(period.to||'').trim()||String(period.days||'').trim());
  return `<div class="to-release-current ${hasAny?'warn':''}"><span>Днес (${escapeHtml(todayLabel)}):</span><span>${hasAny?'Няма активен Release Period':'Няма въведени Release Period периоди.'}</span></div>`;
}
function renderReleasePeriodsEdit(group,hotelId,groupId){
  if(!group)return '';
  if(!Array.isArray(group.releasePeriods))group.releasePeriods=[];
  const rows=group.releasePeriods.length?group.releasePeriods.map(period=>{
    const fromISO=parseReleasePeriodDate(period.from)||'';
    const toISO=parseReleasePeriodDate(period.to)||fromISO;
    const rangeValue=(period.from||period.to)?`${period.from||''}${period.from||period.to?' - ':''}${period.to||''}`:'';
    return `
    <div class="to-release-card">
      <div class="to-release-fields">
        <div><label>Период</label><input class="to-release-range-input" type="text" inputmode="numeric" placeholder="От - До" data-date-range="true" readonly value="${escapeAttr(rangeValue)}" data-from="${escapeAttr(fromISO||todayISO())}" data-to="${escapeAttr(toISO||fromISO||todayISO())}" data-to-release-range="${escapeAttr(hotelId)}" data-group-id="${escapeAttr(groupId)}" data-release-id="${escapeAttr(period.id)}" /></div>
        <div><label>Days</label><input type="text" value="${escapeAttr(period.days||'')}" placeholder="5" data-to-release-days="${escapeAttr(hotelId)}" data-group-id="${escapeAttr(groupId)}" data-release-id="${escapeAttr(period.id)}" /></div>
        <button class="danger small" type="button" title="Изтрий Release Period" data-delete-to-release-period="${escapeAttr(hotelId)}" data-group-id="${escapeAttr(groupId)}" data-release-id="${escapeAttr(period.id)}">×</button>
      </div>
    </div>`;
  }).join(''):'<div class="empty">Няма въведени Release Period периоди.</div>';
  return `
    <div class="to-release-section">
      <div class="to-release-head">
        <div>
          <strong>Release Period</strong>
          <div class="muted">Избери период от календара: първи клик е „от“, втори клик е „до“. Системата сравнява с днешна дата и показва активния release.</div>
        </div>
        <button class="success small" type="button" data-add-to-release-period="${escapeAttr(hotelId)}" data-group-id="${escapeAttr(groupId)}">+ Release Period</button>
      </div>
      ${releaseCurrentHtml(group)}
      <div class="to-release-rows">${rows}</div>
    </div>`;
}
function renderReleasePeriodsLocked(group){
  const periods=((group&&group.releasePeriods)||[]).filter(period=>String(period.from||'').trim()||String(period.to||'').trim()||String(period.days||'').trim());
  const rows=periods.length?`<div class="to-release-locked-list">${periods.map(period=>`
    <div class="to-release-locked-item">
      <span class="to-release-pill to-release-pill-period">${escapeHtml((period.from||'—')+' - '+(period.to||'—'))}</span>
      <span class="to-mapping-locked-arrow">→</span>
      <span class="to-release-pill to-release-pill-days">${escapeHtml(formatReleaseDays(period.days)||'—')}</span>
    </div>`).join('')}</div>`:'<div class="empty">Няма въведени Release Period периоди.</div>';
  return `<div class="to-release-section"><div class="to-release-head"><div><strong>Release Period</strong><div class="muted">Активният release се отчита по днешна дата.</div></div></div>${releaseCurrentHtml(group)}${rows}</div>`;
}

function renderToMappings(hotel){
  const panel=document.getElementById('toMappingsPanel');
  const list=document.getElementById('toMappingHotelsList')||document.getElementById('toMappingGroupsList');
  const addHotelBtn=document.getElementById('addToMappingHotelBtn');
  const lockBtn=document.getElementById('lockToMappingsBtn');
  if(!panel||!list||!lockBtn)return;

  state.toMappingHotels=cloneToMappingHotels(state.toMappingHotels||[]);
  state.toMappingsLocked=!!state.toMappingsLocked;

  if(addHotelBtn){
    addHotelBtn.disabled=!!state.toMappingsLocked;
    addHotelBtn.onclick=addToMappingHotel;
  }
  lockBtn.disabled=false;
  lockBtn.className=state.toMappingsLocked?'success small':'small';
  lockBtn.textContent=state.toMappingsLocked?'🔒 Заключено':'🔓 Заключи';
  lockBtn.onclick=toggleToMappingsLock;

  list.innerHTML='';
  if(!state.toMappingHotels.length){
    activeToMappingHotelId=null;
    activeToMappingGroupId=null;
    list.innerHTML='<div class="empty">Няма създадени хотели. Натисни „+ Хотел“.</div>';
    return;
  }

  ensureActiveToMappingSelection();
  const activeHotel=findToMappingHotel(activeToMappingHotelId)||state.toMappingHotels[0];
  if(activeHotel&&!Array.isArray(activeHotel.operatorGroups))activeHotel.operatorGroups=[];
  const activeGroup=activeHotel?findToMappingGroup(activeHotel.id,activeToMappingGroupId):null;

  const hotelTabs=document.createElement('div');
  hotelTabs.className='to-mapping-hotel-tabs';
  hotelTabs.innerHTML='<span class="to-mapping-tab-label">Хотели:</span>';
  state.toMappingHotels.forEach((mappingHotel,hotelIndex)=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='to-mapping-hotel-tab'+(mappingHotel.id===activeToMappingHotelId?' active':'');
    btn.dataset.selectToMappingHotel=mappingHotel.id;
    btn.textContent=mappingHotel.name||('Хотел '+(hotelIndex+1));
    btn.title=btn.textContent;
    hotelTabs.appendChild(btn);
  });
  list.appendChild(hotelTabs);

  if(!activeHotel){
    list.innerHTML+='<div class="empty">Няма избран хотел.</div>';
    return;
  }

  const hotelPanel=document.createElement('div');
  hotelPanel.className='to-mapping-active-panel';
  if(state.toMappingsLocked){
    hotelPanel.innerHTML=`<div class="to-mapping-locked-hint">Заключено: редакцията е спряна, но можеш да превключваш хотели и тур оператори.</div>`;
  }else{
    hotelPanel.innerHTML=`
      <div class="to-mapping-panel-head">
        <div class="to-mapping-panel-fields">
          <div class="to-mapping-field-block">
            <label>Име на хотел</label>
            <span class="to-mapping-resize-box hotel-name"><input type="text" maxlength="80" value="${escapeAttr(activeHotel.name||'')}" placeholder="Напр. Алгара Бийч" data-to-mapping-hotel-name="${activeHotel.id}" /></span>
          </div>
        </div>
        <div class="to-mapping-panel-actions">
          <button class="success small" type="button" data-add-to-mapping-operator="${activeHotel.id}">+ Тур оператор</button>
          <button class="danger small" type="button" title="Изтрий хотел" data-delete-to-mapping-hotel="${activeHotel.id}">🗑️ хотел</button>
        </div>
      </div>`;
  }

  const operatorTabs=document.createElement('div');
  operatorTabs.className='to-mapping-operator-tabs';
  operatorTabs.innerHTML='<span class="to-mapping-tab-label">Тур оператори:</span>';
  if(!activeHotel.operatorGroups.length){
    operatorTabs.innerHTML+='<div class="empty">Няма тур оператори към този хотел.</div>';
  }else{
    activeHotel.operatorGroups.forEach((group,index)=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='to-mapping-operator-tab'+(group.id===activeToMappingGroupId?' active':'');
      btn.dataset.selectToMappingGroup=group.id;
      btn.dataset.hotelId=activeHotel.id;
      btn.textContent=group.name||('Тур оператор '+(index+1));
      btn.title=btn.textContent;
      operatorTabs.appendChild(btn);
    });
  }
  hotelPanel.appendChild(operatorTabs);

  if(activeGroup){
    if(!Array.isArray(activeGroup.mappings))activeGroup.mappings=[];
    if(!Array.isArray(activeGroup.releasePeriods))activeGroup.releasePeriods=[];
    const groupPanel=document.createElement('div');
    groupPanel.className='to-mapping-operator-panel';
    if(state.toMappingsLocked){
      const visible=(activeGroup.mappings||[]).filter(mapping=>String(mapping.from||'').trim()||String(mapping.to||'').trim());
      const operatorLabel=activeGroup.name||'Тур оператор';
      const hotelLabel=activeHotel.name||'Хотел';
      groupPanel.innerHTML=`<div class="to-mapping-locked-title">${escapeHtml(operatorLabel)} → ${escapeHtml(hotelLabel)}</div>`+
        (visible.length?`<div class="to-mappings-locked-grid">${visible.map(mapping=>`<div class="to-mapping-locked-item" title="${escapeAttr((mapping.from||'')+' → '+(mapping.to||''))}"><span class="to-mapping-locked-code to-mapping-locked-operator" title="${escapeAttr(operatorLabel)}">${escapeHtml(mapping.from||'—')}</span><span class="to-mapping-locked-arrow">→</span><span class="to-mapping-locked-code to-mapping-locked-hotel" title="${escapeAttr(hotelLabel)}">${escapeHtml(mapping.to||'—')}</span></div>`).join('')}</div>`:'<div class="empty">Няма попълнени мапинги за този тур оператор.</div>')+
        renderReleasePeriodsLocked(activeGroup);
    }else{
      groupPanel.innerHTML=`
        <div class="to-mapping-group-head">
          <div class="to-mapping-panel-fields">
            <div class="to-mapping-field-block">
              <label>Име на тур оператор</label>
              <span class="to-mapping-resize-box operator-name"><input type="text" maxlength="80" value="${escapeAttr(activeGroup.name||'')}" placeholder="Напр. DERTOUR" data-to-mapping-group-name="${activeHotel.id}" data-group-id="${activeGroup.id}" /></span>
            </div>
          </div>
          <div class="to-mapping-group-actions">
            <button class="success small" type="button" data-add-to-mapping="${activeHotel.id}" data-group-id="${activeGroup.id}">+ Мапинг</button>
            <button class="danger small" type="button" title="Изтрий оператор" data-delete-to-mapping-group="${activeHotel.id}" data-group-id="${activeGroup.id}">🗑️ ТО</button>
          </div>
        </div>
        <div class="to-mapping-rows" data-to-mapping-rows="${activeGroup.id}"></div>
        ${renderReleasePeriodsEdit(activeGroup,activeHotel.id,activeGroup.id)}`;
      const rows=groupPanel.querySelector('[data-to-mapping-rows]');
      if(!activeGroup.mappings.length){
        rows.innerHTML='<div class="empty">Няма мапинги за този тур оператор.</div>';
      }else{
        activeGroup.mappings.forEach(mapping=>{
          const card=document.createElement('div');
          card.className='to-mapping-card';
          card.dataset.toMappingCard=mapping.id;
          card.innerHTML=`
            <div class="to-mapping-fields">
              <div class="to-mapping-field-block">
                <label>${escapeHtml(activeGroup.name||'Тур оператор')}</label>
                <span class="to-mapping-resize-box room-code"><textarea rows="1" spellcheck="false" placeholder="DBL" data-to-mapping-from="${activeHotel.id}" data-group-id="${activeGroup.id}" data-mapping-id="${mapping.id}">${escapeHtml(mapping.from||'')}</textarea></span>
              </div>
              <div class="to-mapping-arrow">→</div>
              <div class="to-mapping-field-block">
                <label>${escapeHtml(activeHotel.name||'Хотел')}</label>
                <span class="to-mapping-resize-box room-code"><textarea rows="1" spellcheck="false" placeholder="D2S" data-to-mapping-to="${activeHotel.id}" data-group-id="${activeGroup.id}" data-mapping-id="${mapping.id}">${escapeHtml(mapping.to||'')}</textarea></span>
              </div>
              <button class="danger small" type="button" title="Изтрий" data-delete-to-mapping="${activeHotel.id}" data-group-id="${activeGroup.id}" data-mapping-id="${mapping.id}">×</button>
            </div>`;
          rows.appendChild(card);
        });
      }
    }
    hotelPanel.appendChild(groupPanel);
  }
  list.appendChild(hotelPanel);

  list.querySelectorAll('[data-select-to-mapping-hotel]').forEach(btn=>{
    btn.addEventListener('click',e=>selectToMappingHotel(e.currentTarget.dataset.selectToMappingHotel));
  });
  list.querySelectorAll('[data-select-to-mapping-group]').forEach(btn=>{
    btn.addEventListener('click',e=>selectToMappingGroup(e.currentTarget.dataset.hotelId,e.currentTarget.dataset.selectToMappingGroup));
  });
  list.querySelectorAll('[data-to-mapping-hotel-name]').forEach(input=>{
    input.addEventListener('input',e=>updateToMappingHotelName(e.target.dataset.toMappingHotelName,e.target.value,false));
    input.addEventListener('change',()=>renderToMappings(getSelectedHotel(getActiveWeek())));
  });
  list.querySelectorAll('[data-add-to-mapping-operator]').forEach(btn=>{
    btn.addEventListener('click',e=>addToMappingGroup(e.currentTarget.dataset.addToMappingOperator));
  });
  list.querySelectorAll('[data-delete-to-mapping-hotel]').forEach(btn=>{
    btn.addEventListener('click',e=>removeToMappingHotel(e.currentTarget.dataset.deleteToMappingHotel));
  });
  list.querySelectorAll('[data-to-mapping-group-name]').forEach(input=>{
    input.addEventListener('input',e=>updateToMappingGroupName(e.target.dataset.toMappingGroupName,e.target.dataset.groupId,e.target.value,false));
    input.addEventListener('change',()=>renderToMappings(getSelectedHotel(getActiveWeek())));
  });
  list.querySelectorAll('[data-add-to-mapping]').forEach(btn=>{
    btn.addEventListener('click',e=>addToMapping(e.currentTarget.dataset.addToMapping,e.currentTarget.dataset.groupId));
  });
  list.querySelectorAll('[data-delete-to-mapping-group]').forEach(btn=>{
    btn.addEventListener('click',e=>removeToMappingGroup(e.currentTarget.dataset.deleteToMappingGroup,e.currentTarget.dataset.groupId));
  });
  list.querySelectorAll('[data-to-mapping-from]').forEach(input=>{
    input.addEventListener('input',e=>updateToMapping(e.target.dataset.toMappingFrom,e.target.dataset.groupId,e.target.dataset.mappingId,'from',e.target.value,false));
    input.addEventListener('change',()=>renderToMappings(getSelectedHotel(getActiveWeek())));
  });
  list.querySelectorAll('[data-to-mapping-to]').forEach(input=>{
    input.addEventListener('input',e=>updateToMapping(e.target.dataset.toMappingTo,e.target.dataset.groupId,e.target.dataset.mappingId,'to',e.target.value,false));
    input.addEventListener('change',()=>renderToMappings(getSelectedHotel(getActiveWeek())));
  });
  list.querySelectorAll('[data-delete-to-mapping]').forEach(btn=>{
    btn.addEventListener('click',e=>removeToMapping(e.currentTarget.dataset.deleteToMapping,e.currentTarget.dataset.groupId,e.currentTarget.dataset.mappingId));
  });
  list.querySelectorAll('[data-add-to-release-period]').forEach(btn=>{
    btn.addEventListener('click',e=>addToMappingReleasePeriod(e.currentTarget.dataset.addToReleasePeriod,e.currentTarget.dataset.groupId));
  });
  list.querySelectorAll('[data-to-release-range]').forEach(input=>{
    input.addEventListener('rangechange',e=>updateToMappingReleaseRange(e.target.dataset.toReleaseRange,e.target.dataset.groupId,e.target.dataset.releaseId,e.detail.from,e.detail.to));
  });
  list.querySelectorAll('[data-to-release-from]').forEach(input=>{
    input.addEventListener('input',e=>updateToMappingReleasePeriod(e.target.dataset.toReleaseFrom,e.target.dataset.groupId,e.target.dataset.releaseId,'from',e.target.value,false));
    input.addEventListener('change',()=>renderToMappings(getSelectedHotel(getActiveWeek())));
  });
  list.querySelectorAll('[data-to-release-to]').forEach(input=>{
    input.addEventListener('input',e=>updateToMappingReleasePeriod(e.target.dataset.toReleaseTo,e.target.dataset.groupId,e.target.dataset.releaseId,'to',e.target.value,false));
    input.addEventListener('change',()=>renderToMappings(getSelectedHotel(getActiveWeek())));
  });
  list.querySelectorAll('[data-to-release-days]').forEach(input=>{
    input.addEventListener('input',e=>updateToMappingReleasePeriod(e.target.dataset.toReleaseDays,e.target.dataset.groupId,e.target.dataset.releaseId,'days',e.target.value,false));
    input.addEventListener('change',()=>renderToMappings(getSelectedHotel(getActiveWeek())));
  });
  list.querySelectorAll('[data-delete-to-release-period]').forEach(btn=>{
    btn.addEventListener('click',e=>removeToMappingReleasePeriod(e.currentTarget.dataset.deleteToReleasePeriod,e.currentTarget.dataset.groupId,e.currentTarget.dataset.releaseId));
  });
}

function ensureActiveToMappingSelection(){
  const hotels=ensureToMappingHotels();
  if(!hotels.length){
    activeToMappingHotelId=null;
    activeToMappingGroupId=null;
    return;
  }
  let activeHotel=hotels.find(item=>item.id===activeToMappingHotelId);
  if(!activeHotel){
    activeHotel=hotels[0];
    activeToMappingHotelId=activeHotel.id;
  }
  if(!Array.isArray(activeHotel.operatorGroups))activeHotel.operatorGroups=[];
  let activeGroup=activeHotel.operatorGroups.find(group=>group.id===activeToMappingGroupId);
  if(!activeGroup){
    activeGroup=activeHotel.operatorGroups[0]||null;
    activeToMappingGroupId=activeGroup?activeGroup.id:null;
  }
}
function selectToMappingHotel(hotelId){
  activeToMappingHotelId=hotelId;
  const mappingHotel=findToMappingHotel(hotelId);
  activeToMappingGroupId=mappingHotel&&Array.isArray(mappingHotel.operatorGroups)&&mappingHotel.operatorGroups[0]?mappingHotel.operatorGroups[0].id:null;
  toMappingsOpen=true;
  renderToMappings(getSelectedHotel(getActiveWeek()));
}
function selectToMappingGroup(hotelId,groupId){
  activeToMappingHotelId=hotelId;
  activeToMappingGroupId=groupId;
  toMappingsOpen=true;
  renderToMappings(getSelectedHotel(getActiveWeek()));
}
function ensureToMappingHotels(){
  state.toMappingHotels=cloneToMappingHotels(state.toMappingHotels||[]);
  return state.toMappingHotels;
}
function findToMappingHotel(hotelId){
  return ensureToMappingHotels().find(item=>item.id===hotelId);
}
function findToMappingGroup(hotelId,groupId){
  const mappingHotel=findToMappingHotel(hotelId);
  if(!mappingHotel)return null;
  if(!Array.isArray(mappingHotel.operatorGroups))mappingHotel.operatorGroups=[];
  return mappingHotel.operatorGroups.find(group=>group.id===groupId);
}
function afterToMappingsChanged(shouldRender=true){
  const week=getActiveWeek();
  if(week)touchWeek(week);else saveState();
  if(shouldRender)renderRoomTypes();
}
function addToMappingHotel(){
  if(state.toMappingsLocked)return;
  const hotels=ensureToMappingHotels();
  const newHotel={id:uid()+'_tohotel',name:'Нов хотел '+(hotels.length+1),operatorGroups:[]};
  hotels.push(newHotel);
  activeToMappingHotelId=newHotel.id;
  activeToMappingGroupId=null;
  toMappingsOpen=true;
  afterToMappingsChanged(true);
}
function updateToMappingHotelName(hotelId,value,shouldRefresh=true){
  if(state.toMappingsLocked)return;
  const mappingHotel=findToMappingHotel(hotelId);
  if(!mappingHotel)return;
  mappingHotel.name=String(value||'').slice(0,80);
  afterToMappingsChanged(false);
  if(shouldRefresh)renderToMappings(getSelectedHotel(getActiveWeek()));
}
function removeToMappingHotel(hotelId){
  if(state.toMappingsLocked)return;
  state.toMappingHotels=ensureToMappingHotels().filter(item=>item.id!==hotelId);
  if(activeToMappingHotelId===hotelId){
    const first=state.toMappingHotels[0]||null;
    activeToMappingHotelId=first?first.id:null;
    activeToMappingGroupId=first&&Array.isArray(first.operatorGroups)&&first.operatorGroups[0]?first.operatorGroups[0].id:null;
  }
  toMappingsOpen=true;
  afterToMappingsChanged(true);
}
function addToMappingGroup(hotelId){
  if(state.toMappingsLocked)return;
  const mappingHotel=findToMappingHotel(hotelId);
  if(!mappingHotel)return;
  if(!Array.isArray(mappingHotel.operatorGroups))mappingHotel.operatorGroups=[];
  const newGroup={id:uid()+'_togroup',name:'Тур оператор '+(mappingHotel.operatorGroups.length+1),mappings:[],releasePeriods:[]};
  mappingHotel.operatorGroups.push(newGroup);
  activeToMappingHotelId=hotelId;
  activeToMappingGroupId=newGroup.id;
  toMappingsOpen=true;
  afterToMappingsChanged(true);
}
function updateToMappingGroupName(hotelId,groupId,value,shouldRefresh=true){
  if(state.toMappingsLocked)return;
  const group=findToMappingGroup(hotelId,groupId);
  if(!group)return;
  group.name=String(value||'').slice(0,80);
  afterToMappingsChanged(false);
  if(shouldRefresh)renderToMappings(getSelectedHotel(getActiveWeek()));
}
function removeToMappingGroup(hotelId,groupId){
  if(state.toMappingsLocked)return;
  const mappingHotel=findToMappingHotel(hotelId);
  if(!mappingHotel||!Array.isArray(mappingHotel.operatorGroups))return;
  mappingHotel.operatorGroups=mappingHotel.operatorGroups.filter(group=>group.id!==groupId);
  if(activeToMappingHotelId===hotelId&&activeToMappingGroupId===groupId){
    activeToMappingGroupId=mappingHotel.operatorGroups[0]?mappingHotel.operatorGroups[0].id:null;
  }
  toMappingsOpen=true;
  afterToMappingsChanged(true);
}
function addToMapping(hotelId,groupId){
  if(state.toMappingsLocked)return;
  const group=findToMappingGroup(hotelId,groupId);
  if(!group)return;
  if(!Array.isArray(group.mappings))group.mappings=[];
  group.mappings.push({id:uid()+'_tomap',from:'',to:''});
  activeToMappingHotelId=hotelId;
  activeToMappingGroupId=groupId;
  toMappingsOpen=true;
  afterToMappingsChanged(true);
}
function updateToMapping(hotelId,groupId,mappingId,field,value,shouldRefresh=true){
  if(state.toMappingsLocked)return;
  const group=findToMappingGroup(hotelId,groupId);
  if(!group||!Array.isArray(group.mappings))return;
  const mapping=group.mappings.find(item=>item.id===mappingId);
  if(!mapping)return;
  mapping[field]=String(value||'');
  afterToMappingsChanged(false);
  if(shouldRefresh)renderToMappings(getSelectedHotel(getActiveWeek()));
}
function removeToMapping(hotelId,groupId,mappingId){
  if(state.toMappingsLocked)return;
  const group=findToMappingGroup(hotelId,groupId);
  if(!group||!Array.isArray(group.mappings))return;
  group.mappings=group.mappings.filter(item=>item.id!==mappingId);
  toMappingsOpen=true;
  afterToMappingsChanged(true);
}
function addToMappingReleasePeriod(hotelId,groupId){
  if(state.toMappingsLocked)return;
  const group=findToMappingGroup(hotelId,groupId);
  if(!group)return;
  if(!Array.isArray(group.releasePeriods))group.releasePeriods=[];
  group.releasePeriods.push({id:uid()+'_torel',from:'',to:'',days:''});
  activeToMappingHotelId=hotelId;
  activeToMappingGroupId=groupId;
  toMappingsOpen=true;
  afterToMappingsChanged(true);
}
function updateToMappingReleaseRange(hotelId,groupId,releaseId,fromISO,toISO){
  const group=findToMappingGroup(hotelId,groupId);
  if(!group||state.toMappingsLocked)return;
  if(!Array.isArray(group.releasePeriods))group.releasePeriods=[];
  const period=group.releasePeriods.find(item=>item.id===releaseId);
  if(!period)return;
  period.from=isoToDisplay(fromISO);
  period.to=isoToDisplay(toISO);
  syncToMappingsToActiveHotel();
  touchWeek(getActiveWeek());
  renderToMappings(getSelectedHotel(getActiveWeek()));
}
function updateToMappingReleasePeriod(hotelId,groupId,releaseId,field,value,shouldRefresh=true){
  if(state.toMappingsLocked)return;
  const group=findToMappingGroup(hotelId,groupId);
  if(!group)return;
  if(!Array.isArray(group.releasePeriods))group.releasePeriods=[];
  const period=group.releasePeriods.find(item=>item.id===releaseId);
  if(!period)return;
  period[field]=String(value||'');
  afterToMappingsChanged(false);
  if(shouldRefresh)renderToMappings(getSelectedHotel(getActiveWeek()));
}
function removeToMappingReleasePeriod(hotelId,groupId,releaseId){
  if(state.toMappingsLocked)return;
  const group=findToMappingGroup(hotelId,groupId);
  if(!group||!Array.isArray(group.releasePeriods))return;
  group.releasePeriods=group.releasePeriods.filter(item=>item.id!==releaseId);
  toMappingsOpen=true;
  afterToMappingsChanged(true);
}

function toggleToMappingsLock(){
  state.toMappingsLocked=!state.toMappingsLocked;
  toMappingsOpen=true;
  afterToMappingsChanged(true);
}



function renderRoomServicesCatalog(hotel){
  const list=document.getElementById('roomServicesCatalogList');
  const addBtn=document.getElementById('addRoomCatalogServiceBtn');
  if(!list||!addBtn)return;

  if(!hotel){
    list.innerHTML='<div class="empty">Няма избран хотел.</div>';
    addBtn.disabled=true;
    return;
  }

  if(!Array.isArray(hotel.roomServiceCatalog))hotel.roomServiceCatalog=normalizeRoomServiceCatalog(hotel.roomServiceCatalog||[]);
  addBtn.disabled=!!hotel.roomTypesLocked;
  addBtn.onclick=addRoomCatalogService;

  list.innerHTML='';
  if(!hotel.roomServiceCatalog.length){
    list.innerHTML='<div class="empty">Няма добавени услуги. Натисни „+ Добави услуга“.</div>';
    return;
  }

  hotel.roomServiceCatalog.forEach((service,index)=>{
    const card=document.createElement('div');
    card.className='room-service-catalog-card';
    card.dataset.roomServiceCatalogCard=service.id;
    card.innerHTML=`
      <div>
        <label>Име на услуга</label>
        <input type="text" ${hotel.roomTypesLocked?'disabled':''} value="${escapeAttr(service.name||'')}" placeholder="Напр. Паркинг" data-room-catalog-service-name="${service.id}" />
      </div>
      <div>
        <label>Какво включва</label>
        <textarea ${hotel.roomTypesLocked?'disabled':''} placeholder="Свободен текст..." data-room-catalog-service-details="${service.id}">${escapeHtml(service.details||'')}</textarea>
      </div>
      <button class="danger small" ${hotel.roomTypesLocked?'disabled':''} title="Изтрий услуга" data-delete-room-catalog-service="${service.id}">🗑️</button>`;
    list.appendChild(card);
  });

  list.querySelectorAll('[data-room-catalog-service-name]').forEach(input=>{
    input.addEventListener('input',e=>updateRoomCatalogService(e.target.dataset.roomCatalogServiceName,'name',e.target.value,false));
    input.addEventListener('change',refreshRoomTypeDependentViewsKeepEditor);
  });
  list.querySelectorAll('[data-room-catalog-service-details]').forEach(textarea=>{
    textarea.addEventListener('input',e=>updateRoomCatalogService(e.target.dataset.roomCatalogServiceDetails,'details',e.target.value,false));
    textarea.addEventListener('change',refreshRoomTypeDependentViewsKeepEditor);
  });
  list.querySelectorAll('[data-delete-room-catalog-service]').forEach(btn=>{
    btn.addEventListener('click',e=>removeRoomCatalogService(e.target.dataset.deleteRoomCatalogService));
  });
}
function addRoomCatalogService(){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||hotel.roomTypesLocked)return;
  if(!Array.isArray(hotel.roomServiceCatalog))hotel.roomServiceCatalog=[];
  hotel.roomServiceCatalog.push({id:uid()+'_svc',name:'',details:''});
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  roomServicesOpen=true;
  renderRoomTypes();
}
function updateRoomCatalogService(serviceId,field,value,shouldRefresh=true){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||hotel.roomTypesLocked)return;
  const service=getRoomServiceCatalog(hotel).find(item=>item.id===serviceId);
  if(!service)return;
  service[field]=value;
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  if(shouldRefresh)refreshRoomTypeDependentViewsKeepEditor();
}
function removeRoomCatalogService(serviceId){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||hotel.roomTypesLocked||!Array.isArray(hotel.roomServiceCatalog))return;
  const service=hotel.roomServiceCatalog.find(item=>item.id===serviceId);
  const label=service&&service.name?service.name:'тази услуга';
  if(!confirm('Да изтрия ли '+label+' от списъка с услуги? Тя ще бъде премахната и от типовете стаи.'))return;
  hotel.roomServiceCatalog=hotel.roomServiceCatalog.filter(item=>item.id!==serviceId);
  if(Array.isArray(hotel.roomTypes)){
    hotel.roomTypes.forEach(room=>{
      if(Array.isArray(room.services)){
        room.services=room.services.filter(value=>value!==serviceId && value!==(service&&service.name));
      }
    });
  }
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  renderRoomTypes();
  refreshRoomTypeDependentViewsKeepEditor();
}
function updateRoomCardPreview(card){
  if(!card)return;
  const roomId=card.dataset.roomCard;
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  const room=hotel&&hotel.roomTypes?hotel.roomTypes.find(r=>r.id===roomId):null;
  const index=hotel&&hotel.roomTypes?hotel.roomTypes.findIndex(r=>r.id===roomId):0;
  const preview=card.querySelector('[data-room-preview]');
  if(preview&&room){
    const capacityText=roomTypeCapacityText(room);
    const kindText=roomTypeKindLabel(room);
    const squareMetersText=roomTypeSquareMetersLabel(room);
    const priceCapacityText=roomTypePriceCapacity(room);
    preview.textContent=(index+1)+'. '+roomTypeDisplayLabel(room,index)+(squareMetersText?' - '+squareMetersText:'')+(kindText?' - '+kindText:'')+(priceCapacityText?' - '+priceCapacityText:'')+(capacityText?' - '+capacityText:'')+(roomTypeServicesText(room,hotel)?' - '+roomTypeServicesText(room,hotel):'');
  }
}
function reorderRoomType(hotelId,sourceId,targetId){
  if(!hotelId||!sourceId||!targetId||sourceId===targetId)return;
  const week=getActiveWeek();
  if(!week)return;
  const hotel=week.hotels.find(h=>h.id===hotelId);
  if(!hotel||hotel.roomTypesLocked||!Array.isArray(hotel.roomTypes))return;

  const sourceIndex=hotel.roomTypes.findIndex(room=>room.id===sourceId);
  const targetIndex=hotel.roomTypes.findIndex(room=>room.id===targetId);
  if(sourceIndex<0||targetIndex<0)return;

  const [moved]=hotel.roomTypes.splice(sourceIndex,1);
  hotel.roomTypes.splice(targetIndex,0,moved);
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  refreshRoomTypeDependentViews();
}

function toggleRoomTypesLock(){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel)return;
  hotel.roomTypesLocked=!hotel.roomTypesLocked;
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  renderRoomTypes();
}
function getSelectedRoom(roomId){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||!Array.isArray(hotel.roomTypes))return null;
  return hotel.roomTypes.find(room=>room.id===roomId)||null;
}
function addRoomService(roomId,serviceValue){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||hotel.roomTypesLocked)return;
  const room=getSelectedRoom(roomId);
  if(!room)return;
  if(!Array.isArray(room.services))room.services=[];
  const value=String(serviceValue||'').trim();
  if(!value){alert('Първо избери услуга от падащото меню.');return;}
  if(room.services.includes(value)){alert('Тази услуга вече е добавена към този тип стая.');return;}
  room.services.push(value);
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  renderRoomTypes();
  refreshRoomTypeDependentViewsKeepEditor();
}
function updateRoomService(roomId,index,value,shouldRefresh=true){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||hotel.roomTypesLocked)return;
  const room=getSelectedRoom(roomId);
  if(!room)return;
  if(!Array.isArray(room.services))room.services=[];
  room.services[index]=value;
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  if(shouldRefresh)refreshRoomTypeDependentViews();
}
function removeRoomService(roomId,index){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||hotel.roomTypesLocked)return;
  const room=getSelectedRoom(roomId);
  if(!room||!Array.isArray(room.services))return;
  room.services.splice(index,1);
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  renderRoomTypes();
  refreshRoomTypeDependentViewsKeepEditor();
}
function addRoomType(){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||hotel.roomTypesLocked)return;
  if(!Array.isArray(hotel.roomTypes))hotel.roomTypes=[];
  hotel.roomTypes.push({id:uid(),name:'',typeLabel:'',squareMeters:'',priceCapacity:'',capacities:[{adults:'',children:''},{adults:'',children:''},{adults:'',children:''},{adults:'',children:''}],services:[]});
  syncHotelConstantsAcrossWeeks(week);
  sectionOpen.roomTypes=true;
  roomSettingsOpen=true;
  touchWeek(week);
  renderRoomTypes();
  refreshRoomTypeDependentViews();
}
function updateRoomCapacity(roomId,index,field,value,shouldRefresh=true){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||hotel.roomTypesLocked)return;
  const room=getSelectedRoom(roomId);
  if(!room)return;
  room.capacities=normalizeRoomCapacities(room);
  if(!room.capacities[index])room.capacities[index]={adults:'',children:''};
  room.capacities[index][field]=value;
  delete room.adults;
  delete room.children;
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  if(shouldRefresh)refreshRoomTypeDependentViews();
}
function updateRoomType(roomId,field,value,shouldRefresh=true){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||hotel.roomTypesLocked||!Array.isArray(hotel.roomTypes))return;
  const room=hotel.roomTypes.find(r=>r.id===roomId);
  if(!room)return;
  room[field]=value;
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  if(shouldRefresh)refreshRoomTypeDependentViews();
}
function removeRoomType(roomId){
  const week=getActiveWeek();
  const hotel=getSelectedHotel(week);
  if(!hotel||hotel.roomTypesLocked||!Array.isArray(hotel.roomTypes))return;
  hotel.roomTypes=hotel.roomTypes.filter(room=>room.id!==roomId);
  touchWeek(week);
  syncHotelConstantsAcrossWeeks(week);
  renderRoomTypes();
  refreshRoomTypeDependentViews();
}
function refreshRoomTypeDependentViews(shouldRenderRoomTypes=true){
  if(shouldRenderRoomTypes){
    renderRoomTypes();
  }else{
    const week=getActiveWeek();
    const hotel=getSelectedHotel(week);
    renderRoomInfoButtons(document.getElementById('roomManageInfoButtons'),hotel);
  }
  renderSelectorsAndPeriods();
  renderDiscountReservations();
  if(sectionOpen.email||emailTablePinned)renderEmailTable();
  renderWeekList();
}
function refreshRoomTypeDependentViewsKeepEditor(){
  refreshRoomTypeDependentViews(false);
}
function renderSelectorsAndPeriods(){
  const week=getActiveWeek(), hotelSelect=document.getElementById('hotelSelect'), subsectionSelect=document.getElementById('subsectionSelect'), hotelTabs=document.getElementById('hotelTabs'), roomInfoButtons=document.getElementById('roomInfoButtons'), subsectionTabs=document.getElementById('subsectionTabs'), summaryInfo=document.getElementById('summaryInfo'), subsectionNameInput=document.getElementById('subsectionNameInput');
  if(!week||!hotelSelect||!subsectionSelect||!hotelTabs||!subsectionTabs||!summaryInfo||!subsectionNameInput)return;
  hotelSelect.innerHTML='';subsectionSelect.innerHTML='';hotelTabs.innerHTML='';subsectionTabs.innerHTML='';
  week.hotels.forEach((hotel,index)=>{
    const name=hotel.name.trim()||`Хотел ${index+1}`;
    const opt=document.createElement('option');opt.value=hotel.id;opt.textContent=name;if(hotel.id===week.selectedHotelId)opt.selected=true;hotelSelect.appendChild(opt);
    const tab=document.createElement('button');tab.className='hotel-tab small'+(hotel.id===week.selectedHotelId?' active':'');tab.innerHTML=`<span class="hotel-name">${escapeHtml(name)}</span>${operationRangeLabel(hotel)?`<span class="hotel-operation">${escapeHtml(operationRangeLabel(hotel))}</span>`:''}`;tab.addEventListener('click',()=>selectHotel(hotel.id));hotelTabs.appendChild(tab);
  });
  hotelSelect.addEventListener('change',e=>selectHotel(e.target.value));
  const selectedHotel=getSelectedHotel(week);
  if(roomInfoButtons)roomInfoButtons.innerHTML='';
  if(selectedHotel)selectedHotel.subsections.forEach((sub,i)=>{
    const opt=document.createElement('option');opt.value=sub.id;opt.textContent=sub.name||`Канал ${i+1}`;if(sub.id===selectedHotel.selectedSubsectionId)opt.selected=true;subsectionSelect.appendChild(opt);
    const tab=document.createElement('button');
    tab.className='subsection-tab small'+(sub.id===selectedHotel.selectedSubsectionId?' active':'');
    tab.draggable=true;
    tab.dataset.subsectionId=sub.id;
    tab.innerHTML=`<span class="drag-mark">↕</span>${escapeHtml(sub.name||`Канал ${i+1}`)}`;
    tab.addEventListener('click',()=>selectSubsection(sub.id));
    tab.addEventListener('dragstart',e=>{
      draggedSubsectionId=sub.id;
      tab.classList.add('dragging');
      e.dataTransfer.effectAllowed='move';
      e.dataTransfer.setData('text/plain',sub.id);
    });
    tab.addEventListener('dragover',e=>{
      e.preventDefault();
      if(tab.dataset.subsectionId!==draggedSubsectionId)tab.classList.add('drag-over');
    });
    tab.addEventListener('dragleave',()=>tab.classList.remove('drag-over'));
    tab.addEventListener('drop',e=>{
      e.preventDefault();
      tab.classList.remove('drag-over');
      reorderSubsection(draggedSubsectionId,sub.id);
    });
    tab.addEventListener('dragend',()=>{
      tab.classList.remove('dragging');
      subsectionTabs.querySelectorAll('.drag-over').forEach(item=>item.classList.remove('drag-over'));
      draggedSubsectionId=null;
    });
    subsectionTabs.appendChild(tab);
  });
  subsectionSelect.addEventListener('change',e=>selectSubsection(e.target.value));
  const selectedSubsection=getSelectedSubsection(selectedHotel);
  subsectionNameInput.value=selectedSubsection?selectedSubsection.name:'';
  subsectionNameInput.addEventListener('input',e=>renameSubsection(e.target.value));
  summaryInfo.textContent=selectedHotel&&selectedSubsection?`${selectedHotel.name||'Избран хотел'} / ${selectedSubsection.name}: ${selectedSubsection.periods.length} периода`:'Няма избран хотел или канал';
  renderPeriods();
}

function discountTextLine(period){
  const from=isoToDisplay(period.fromDate);
  const to=isoToDisplay(period.toDate);
  const rawDiscount=String(period.discount===undefined||period.discount===null?'':period.discount).trim();
  const discountText=rawDiscount ? rawDiscount+'%' : 'без %';
  return `${from} – ${to} → ${discountText}`;
}
function buildDiscountCopyText(sub){
  const periods=(sub&&Array.isArray(sub.periods))?sub.periods:[];
  return periods
    .filter(period=>period&&period.fromDate&&period.toDate)
    .map(period=>discountTextLine(period))
    .join('\n');
}
function renderDiscountTextExport(sub){
  const box=document.getElementById('discountTextExport');
  const output=document.getElementById('discountTextOutput');
  const copyBtn=document.getElementById('copyDiscountTextBtn');
  if(!box||!output)return;

  const activeSub=sub||getSelectedSubsection(getSelectedHotel(getActiveWeek()));
  const text=buildDiscountCopyText(activeSub);
  output.value=text;
  output.placeholder='Тук ще се появи текстът във формат: 01.05.2026 – 02.05.2026 → 10%';
  box.classList.toggle('discount-text-export-empty',!text.trim());
  if(copyBtn)copyBtn.disabled=!text.trim();
}
function copyDiscountText(){
  const output=document.getElementById('discountTextOutput');
  if(!output)return;
  const text=output.value.trim();
  if(!text){
    alert('Няма текст за копиране. Първо добави периоди и проценти в избрания канал.');
    return;
  }

  const onSuccess=()=>alert('Текстът е копиран.');
  const onFallback=()=>{
    try{
      output.focus();
      output.select();
      const ok=document.execCommand&&document.execCommand('copy');
      window.getSelection&&window.getSelection().removeAllRanges();
      if(ok)onSuccess();
      else alert('Не успях да копирам автоматично. Маркирай текста и го копирай ръчно.');
    }catch(error){
      console.error(error);
      alert('Не успях да копирам автоматично. Маркирай текста и го копирай ръчно.');
    }
  };

  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(onSuccess).catch(onFallback);
  }else{
    onFallback();
  }
}

function renderPeriods(){
  const week=getActiveWeek(), hotel=getSelectedHotel(week), sub=getSelectedSubsection(hotel), body=document.getElementById('periodsBody'), editArea=document.getElementById('discountEditArea'), lockView=document.getElementById('lockedDiscountsView'), lockedCopyLayout=document.getElementById('discountLockedCopyLayout');
  if(!body)return;
  body.innerHTML='';
  if(lockView)lockView.classList.add('hidden');
  if(editArea)editArea.classList.remove('hidden');
  if(lockedCopyLayout)lockedCopyLayout.classList.remove('locked');

  if(!hotel){renderDiscountTextExport(null);body.innerHTML='<tr><td colspan="6" class="empty">Първо добави хотел.</td></tr>';return}
  if(!sub){renderDiscountTextExport(null);body.innerHTML='<tr><td colspan="6" class="empty">Първо добави канал към избрания хотел.</td></tr>';return}

  renderDiscountTextExport(sub);

  if(sub.locked){
    if(editArea)editArea.classList.add('hidden');
    if(lockedCopyLayout)lockedCopyLayout.classList.add('locked');
    if(lockView){
      lockView.classList.remove('hidden');
      renderLockedDiscounts(lockView,sub);
    }
    return;
  }

  if(!sub.periods.length){body.innerHTML='<tr><td colspan="6" class="empty">Няма записани отстъпки за този канал. Натисни „+ Добави период“.</td></tr>';return}
  sub.periods.forEach((p,index)=>{
    const tr=document.createElement('tr');tr.draggable=true;tr.dataset.periodRow=p.id;
    tr.innerHTML=`<td class="no-print"><span class="drag-handle" title="Хвани и премести реда">↕</span></td>
      <td><input class="date-range-input" type="text" inputmode="numeric" placeholder="дд.мм - дд.мм" data-date-range="true" readonly value="${escapeAttr(isoToDisplay(p.fromDate)+' - '+isoToDisplay(p.toDate))}" data-from="${escapeAttr(p.fromDate)}" data-to="${escapeAttr(p.toDate)}" data-period="${p.id}" /></td>
      <td><div class="discount-cell"><input type="number" step="1" min="0" value="${escapeAttr(p.discount)}" placeholder="0" data-period="${p.id}" data-field="discount" /><strong>%</strong></div></td>
      <td><textarea class="compact-note" rows="1" placeholder="Кратка бележка..." data-period="${p.id}" data-field="note">${escapeHtml(p.note)}</textarea></td>
      <td class="no-print"><div class="move-buttons"><button class="small icon-btn" title="Нагоре" data-move-period="${p.id}" data-direction="up" ${index===0?'disabled':''}>↑</button><button class="small icon-btn" title="Надолу" data-move-period="${p.id}" data-direction="down" ${index===sub.periods.length-1?'disabled':''}>↓</button></div></td>
      <td class="no-print"><button class="danger small" data-delete-period="${p.id}" title="Изтрий">🗑️</button></td>`;
    body.appendChild(tr);
  });
  body.querySelectorAll('[data-date-range="true"]').forEach(input=>{
    input.addEventListener('rangechange',e=>{
      updatePeriodRange(input.dataset.period,e.detail.from,e.detail.to);
    });
  });

  body.querySelectorAll('input,textarea').forEach(i=>{
    if(i.dataset.dateRange==='true')return;

    if(i.dataset.field==='discount'){
      i.addEventListener('wheel',e=>{
        e.preventDefault();
        i.blur();
      },{passive:false});

      i.addEventListener('keydown',e=>{
        if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;

        e.preventDefault();

        const discountInputs=Array.from(body.querySelectorAll('input[data-field="discount"]'));
        const currentIndex=discountInputs.indexOf(i);
        const nextIndex=e.key==='ArrowDown' ? currentIndex+1 : currentIndex-1;
        const nextInput=discountInputs[nextIndex];

        if(nextInput){
          nextInput.focus();
          nextInput.select();
        }
      });
    }

    i.addEventListener('change',e=>{
      updatePeriod(e.target.dataset.period,e.target.dataset.field,e.target.value);
    });

    i.addEventListener('input',e=>{
      updatePeriod(e.target.dataset.period,e.target.dataset.field,e.target.value);
    });
  });
  body.querySelectorAll('[data-delete-period]').forEach(b=>b.addEventListener('click',e=>removePeriod(e.target.dataset.deletePeriod)));
  body.querySelectorAll('[data-move-period]').forEach(b=>b.addEventListener('click',e=>movePeriod(e.target.dataset.movePeriod,e.target.dataset.direction)));
  body.querySelectorAll('[data-period-row]').forEach(row=>{
    row.addEventListener('dragstart',e=>{draggedPeriodId=row.dataset.periodRow;row.classList.add('dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',draggedPeriodId)});
    row.addEventListener('dragover',e=>{e.preventDefault();if(row.dataset.periodRow!==draggedPeriodId)row.classList.add('drag-over')});
    row.addEventListener('dragleave',()=>row.classList.remove('drag-over'));
    row.addEventListener('drop',e=>{e.preventDefault();row.classList.remove('drag-over');reorderPeriod(draggedPeriodId,row.dataset.periodRow)});
    row.addEventListener('dragend',()=>{row.classList.remove('dragging');body.querySelectorAll('.drag-over').forEach(i=>i.classList.remove('drag-over'));draggedPeriodId=null});
  });
}
function updateWeekField(field,value){const w=getActiveWeek();if(!w)return;w[field]=value;if(field==='startDate'&&!w.cancellationCheckInDate)w.cancellationCheckInDate=value;touchWeek(w);renderWeekList();const title=document.getElementById('weekTitle');if(title)title.textContent=makeTitle(w.startDate,w.endDate,w.customTitle)}
function updateHotelName(id,value){const w=getActiveWeek(),h=w.hotels.find(x=>x.id===id);if(!h)return;h.name=value;touchWeek(w);syncHotelConstantsAcrossWeeks(w);renderWeekList();renderHotels();renderContracts();renderRoomTypes();renderSelectorsAndPeriods();renderPrices();if(sectionOpen.email||emailTablePinned)renderEmailTable();renderChecklist()}
function updateHotelOperation(id,from,to){const w=getActiveWeek(),h=w.hotels.find(x=>x.id===id);if(!h)return;h.operationFrom=from;h.operationTo=to;touchWeek(w);syncHotelConstantsAcrossWeeks(w);renderHotels();renderContracts();renderRoomTypes();renderSelectorsAndPeriods();renderPrices();if(sectionOpen.email||emailTablePinned)renderEmailTable();renderWeekList()}
function updateHotelRoomCount(id,value){const w=getActiveWeek(),h=w&&w.hotels.find(x=>x.id===id);if(!h)return;h.roomCount=String(value||'').replace(/[^0-9]/g,'');touchWeek(w);syncHotelConstantsAcrossWeeks(w);renderHotels();renderContracts();renderRoomTypes();renderSelectorsAndPeriods();renderPrices();if(sectionOpen.email||emailTablePinned)renderEmailTable();renderChecklist();renderWeekList()}
function selectHotel(id){const w=getActiveWeek();if(!w)return;w.selectedHotelId=id;w.selectedChecklistHotelId=id;w.selectedContractsHotelId=id;const h=getSelectedHotel(w);if(h&&!h.selectedSubsectionId&&h.subsections[0])h.selectedSubsectionId=h.subsections[0].id;touchWeek(w);renderHotels();renderRoomTypes();renderSelectorsAndPeriods();renderPrices();if(sectionOpen.email||emailTablePinned)renderEmailTable();renderChecklist();renderWeekList()}
function addHotel(){const w=getActiveWeek(),ed=document.getElementById('hotelsEditor'),tg=document.getElementById('toggleHotelsBtn');sectionOpen.hotels=true;if(ed)ed.classList.remove('hidden');if(tg)tg.textContent='▼ Хотели';if(!w)return;const subs=defaultSubsections(),h={id:uid(),name:'',operationFrom:'',operationTo:'',roomCount:'',roomTypesLocked:false,toMappingsLocked:false,toMappingGroups:[],roomServiceCatalog:[],roomTypes:[],selectedSubsectionId:subs[0].id,subsections:subs,checklist:[],emailTableHtml:'',contracts:[],selectedContractId:null,nightsByMonth:{},roomNightsByMonth:{},roomNightsTargetsByMonth:{}};w.hotels.push(h);w.selectedHotelId=h.id;w.selectedContractsHotelId=h.id;touchWeek(w);syncHotelConstantsAcrossWeeks(w);render()}
function removeHotel(id){const w=getActiveWeek();if(!w)return;const h=w.hotels.find(x=>x.id===id);if(!confirm(`Да изтрия ли ${h&&h.name?'„'+h.name+'“':'този хотел'} от всички седмици?`))return;w.hotels=w.hotels.filter(x=>x.id!==id);if(!w.hotels.length)w.hotels.push(defaultHotels()[0]);w.selectedHotelId=w.hotels[0].id;if(!w.hotels.find(h=>h.id===w.selectedChecklistHotelId))w.selectedChecklistHotelId=w.hotels[0].id;if(!w.hotels.find(h=>h.id===w.selectedContractsHotelId))w.selectedContractsHotelId=w.hotels[0].id;touchWeek(w);syncHotelConstantsAcrossWeeks(w);render()}
function selectSubsection(id){const w=getActiveWeek(),h=getSelectedHotel(w);if(!h)return;h.selectedSubsectionId=id;touchWeek(w);renderSelectorsAndPeriods();renderPrices();renderChecklist();renderWeekList()}
function addSubsection(){
  const w=getActiveWeek(),h=getSelectedHotel(w);if(!h)return;
  const source=getSelectedSubsection(h);
  const defaultName=source ? source.name : 'Нов канал';
  const name=prompt('Име на новия канал:',defaultName);if(name===null)return;
  const copiedPeriods=source ? source.periods.map((p,i)=>({
    id:uid()+'_p'+i,
    fromDate:p.fromDate,
    toDate:p.toDate,
    discount:p.discount,
    note:p.note
  })) : [];
  const s={id:uid(),name:name.trim()||defaultName||'Нов канал',locked:false,periods:copiedPeriods};
  h.subsections.push(s);
  h.selectedSubsectionId=s.id;
  sectionOpen.discounts=true;
  touchWeek(w);
  render();
}
function copySubsectionFrom(){
  const w=getActiveWeek();
  const sourceHotel=getSelectedHotel(w);
  const sourceSection=getSelectedSubsection(sourceHotel);
  if(!w||!sourceHotel||!sourceSection)return;

  const sourceHotelIndex=w.hotels.findIndex(h=>h.id===sourceHotel.id);
  const hotelList=w.hotels.map((hotel,index)=>`${index+1}. ${hotel.name||'Хотел '+(index+1)}`).join('\n');
  const hotelChoice=prompt(`Копира се активният канал:\n${sourceHotel.name||'Хотел '+(sourceHotelIndex+1)} / ${sourceSection.name||'Канал'}\n\nВ кой хотел да го добавя?\n\n${hotelList}\n\nНапиши номер на хотел:`, String(sourceHotelIndex+1));
  if(hotelChoice===null)return;

  const targetHotelIndex=Number(String(hotelChoice).trim())-1;
  if(!Number.isInteger(targetHotelIndex)||targetHotelIndex<0||targetHotelIndex>=w.hotels.length){
    alert('Невалиден номер на хотел.');
    return;
  }

  const targetHotel=w.hotels[targetHotelIndex];
  const newName=prompt('Име на копирания канал:', sourceSection.name || 'Копиран канал');
  if(newName===null)return;

  const copiedSection={
    id:uid(),
    name:newName.trim() || sourceSection.name || 'Копиран канал',
    locked:!!sourceSection.locked,
    periods:sourceSection.periods.map((p,i)=>({
      id:uid()+'_p'+i,
      fromDate:p.fromDate,
      toDate:p.toDate,
      discount:p.discount,
      note:p.note
    }))
  };

  targetHotel.subsections.push(copiedSection);
  targetHotel.selectedSubsectionId=copiedSection.id;
  w.selectedHotelId=targetHotel.id;
  w.selectedChecklistHotelId=targetHotel.id;
  sectionOpen.discounts=true;
  touchWeek(w);
  render();
}
function copySubsectionDataFrom(){
  try{
    const w=getActiveWeek();
    const h=getSelectedHotel(w);
    const target=getSelectedSubsection(h);

    if(!w||!h||!target){
      alert('Няма избран хотел или канал.');
      return;
    }

    const sourceChannels=(h.subsections||[]).filter(section=>section&&section.id!==target.id);

    if(!sourceChannels.length){
      alert('Няма друг канал, от който да копирам данни.');
      return;
    }

    const list=sourceChannels
      .map((section,index)=>`${index+1}. ${section.name||'Канал '+(index+1)} — ${(section.periods||[]).length} периода`)
      .join('\n');

    const answer=prompt(
      `Активен канал: ${target.name||'Канал'}\n\nОт кой канал да копирам данните?\nНапиши номер от списъка:\n\n${list}`,
      '1'
    );

    if(answer===null)return;

    const sourceIndex=Number(String(answer).trim())-1;

    if(!Number.isInteger(sourceIndex)||sourceIndex<0||sourceIndex>=sourceChannels.length){
      alert('Невалиден номер на канал.');
      return;
    }

    const source=sourceChannels[sourceIndex];

    if((target.periods||[]).length){
      const ok=confirm(
        `Каналът „${target.name||'Канал'}“ вече има ${(target.periods||[]).length} периода.\n\n`+
        `Да ги заменя ли с данните от „${source.name||'Канал'}“?`
      );
      if(!ok)return;
    }

    target.periods=(source.periods||[]).map((period,index)=>({
      id:uid()+'_p'+index,
      fromDate:period.fromDate,
      toDate:period.toDate,
      discount:period.discount,
      note:period.note
    }));

    h.selectedSubsectionId=target.id;
    touchWeek(w);
    renderSelectorsAndPeriods();
    renderChecklist();
    renderWeekList();

    alert(`Готово. Копирани са ${target.periods.length} периода от „${source.name||'Канал'}“.`);
  }catch(error){
    console.error(error);
    alert('Възникна грешка при копиране на данните.');
  }
}
function clearSubsectionData(){
  const w=getActiveWeek(),h=getSelectedHotel(w),s=getSelectedSubsection(h);
  if(!h||!s)return;
  const channelName=s.name||'Канал';
  const count=Array.isArray(s.periods)?s.periods.length:0;

  if(!count){
    alert(`В канала „${channelName}“ няма данни за изтриване.`);
    return;
  }

  if(!confirm(`Да изтрия ли всички данни от избрания канал „${channelName}“?\n\nКаналът ще остане, но периодите и отстъпките в него ще бъдат изтрити.`))return;

  s.periods=[];
  touchWeek(w);
  renderSelectorsAndPeriods();
  renderChecklist();
  renderWeekList();
}
function deleteSubsection(){const w=getActiveWeek(),h=getSelectedHotel(w),s=getSelectedSubsection(h);if(!h||!s)return;if(!confirm(`Да изтрия ли канала „${s.name}“ и всички периоди в нея?`))return;h.subsections=h.subsections.filter(x=>x.id!==s.id);if(!h.subsections.length)h.subsections.push({id:uid(),name:'Нов канал',locked:false,periods:[]});h.selectedSubsectionId=h.subsections[0].id;touchWeek(w);render()}
function renameSubsection(value){const w=getActiveWeek(),h=getSelectedHotel(w),s=getSelectedSubsection(h);if(!s)return;s.name=value;touchWeek(w);renderHotels();renderWeekList();const sel=document.getElementById('subsectionSelect'),tabs=document.getElementById('subsectionTabs');if(sel&&tabs){Array.from(sel.options).forEach(o=>{if(o.value===s.id)o.textContent=value||'Канал'});Array.from(tabs.children).forEach(t=>{if(t.classList.contains('active'))t.innerHTML=`<span class="drag-mark">↕</span>${escapeHtml(value||'Канал')}`})}}
function reorderSubsection(sourceId,targetId){
  if(!sourceId||!targetId||sourceId===targetId)return;
  const w=getActiveWeek(),h=getSelectedHotel(w);if(!h)return;
  const sourceIndex=h.subsections.findIndex(s=>s.id===sourceId);
  const targetIndex=h.subsections.findIndex(s=>s.id===targetId);
  if(sourceIndex<0||targetIndex<0)return;
  const [moved]=h.subsections.splice(sourceIndex,1);
  h.subsections.splice(targetIndex,0,moved);
  h.selectedSubsectionId=sourceId;
  touchWeek(w);
  renderSelectorsAndPeriods();
  renderHotels();
  renderWeekList();
}
function lockedDiscountLabel(period,index){
  const periodText=isoToDisplay(period.fromDate)+' - '+isoToDisplay(period.toDate);
  const discount=period.discount!=='' ? `${period.discount}%` : 'без %';
  return `${index+1}. ${periodText} · ${discount}`;
}
function renderLockedDiscounts(container,sub){
  const rows=sub.periods||[];
  container.innerHTML=`<div class="button-row no-print">
      <button type="button" id="unlockDiscountsBtn">🔓 Отключи за редакция</button>
    </div>
    <div class="locked-discount-list" id="lockedDiscountList"></div>`;

  const list=container.querySelector('#lockedDiscountList');

  if(!rows.length){
    list.innerHTML='<div class="empty">Няма записани отстъпки.</div>';
  }else{
    rows.forEach((period,index)=>{
      const row=document.createElement('div');
      row.className='locked-discount-row';
      row.innerHTML=`<span class="discount-badge discount-badge-number">${index+1}</span>
        <span class="discount-badge discount-badge-date">${escapeHtml(isoToDisplay(period.fromDate)+' - '+isoToDisplay(period.toDate))}</span>
        <span class="discount-badge discount-badge-percent">${escapeHtml((period.discount!==''?period.discount:'0')+'%')}</span>
        ${period.note?`<span class="discount-badge discount-badge-note">${escapeHtml(period.note)}</span>`:''}`;
      list.appendChild(row);
    });
  }

  container.querySelector('#unlockDiscountsBtn').addEventListener('click',()=>toggleDiscountLock(false));
}
function toggleDiscountLock(locked){
  const w=getActiveWeek(), h=getSelectedHotel(w), s=getSelectedSubsection(h);
  if(!s)return;
  s.locked=!!locked;
  touchWeek(w);
  renderSelectorsAndPeriods();
  renderChecklist();
  renderWeekList();
}
function addPeriod(){const w=getActiveWeek(),h=getSelectedHotel(w),s=getSelectedSubsection(h);if(!s||s.locked)return;s.periods.push({id:uid(),fromDate:w.startDate,toDate:w.endDate,discount:'',note:''});touchWeek(w);renderSelectorsAndPeriods();renderPrices();renderChecklist();renderWeekList()}
function updatePeriod(id,field,value){const w=getActiveWeek(),h=getSelectedHotel(w),s=getSelectedSubsection(h);if(!s)return;const p=s.periods.find(x=>x.id===id);if(!p)return;p[field]=value;touchWeek(w);renderDiscountTextExport(s);renderPrices();renderWeekList()}
function updatePeriodRange(id,from,to){const w=getActiveWeek(),h=getSelectedHotel(w),s=getSelectedSubsection(h);if(!s)return;const p=s.periods.find(x=>x.id===id);if(!p)return;p.fromDate=from;p.toDate=to;touchWeek(w);renderDiscountTextExport(s);renderPrices();renderWeekList()}
function removePeriod(id){const w=getActiveWeek(),h=getSelectedHotel(w),s=getSelectedSubsection(h);if(!s)return;s.periods=s.periods.filter(x=>x.id!==id);touchWeek(w);renderSelectorsAndPeriods();renderPrices();renderChecklist();renderWeekList()}
function movePeriod(id,direction){const w=getActiveWeek(),h=getSelectedHotel(w),s=getSelectedSubsection(h);if(!s)return;const i=s.periods.findIndex(x=>x.id===id),ni=direction==='up'?i-1:i+1;if(i<0||ni<0||ni>=s.periods.length)return;const [item]=s.periods.splice(i,1);s.periods.splice(ni,0,item);touchWeek(w);renderSelectorsAndPeriods();renderPrices();renderChecklist();renderWeekList()}
function reorderPeriod(sourceId,targetId){if(!sourceId||!targetId||sourceId===targetId)return;const w=getActiveWeek(),h=getSelectedHotel(w),s=getSelectedSubsection(h);if(!s)return;const si=s.periods.findIndex(x=>x.id===sourceId),ti=s.periods.findIndex(x=>x.id===targetId);if(si<0||ti<0)return;const [moved]=s.periods.splice(si,1);s.periods.splice(ti,0,moved);touchWeek(w);renderSelectorsAndPeriods();renderPrices();renderChecklist();renderWeekList()}
function insertHtmlAtCursor(html){
  const selection=window.getSelection();
  if(!selection||!selection.rangeCount)return;
  const range=selection.getRangeAt(0);
  range.deleteContents();

  const wrapper=document.createElement('div');
  wrapper.innerHTML=html;
  const fragment=document.createDocumentFragment();
  let node,lastNode;
  while((node=wrapper.firstChild)){
    lastNode=fragment.appendChild(node);
  }
  range.insertNode(fragment);

  if(lastNode){
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
function plainTextTableToHtml(text){
  const rows=String(text||'').trim().split(/\r?\n/).map(row=>row.split('\t'));
  if(!rows.length)return escapeHtml(text);
  const looksLikeTable=rows.some(row=>row.length>1);
  if(!looksLikeTable)return escapeHtml(text).replace(/\r?\n/g,'<br>');
  return '<table><tbody>'+rows.map(row=>'<tr>'+row.map(cell=>'<td>'+escapeHtml(cell)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
}
function saveEmailTableContent(box,hotel,week){
  hotel.emailTableHtml=box.innerHTML;
  touchWeek(week);
  renderWeekList();
  renderPinnedEmailTable();
}
function togglePinnedEmailTable(force){
  emailTablePinned=typeof force==='boolean'?force:!emailTablePinned;

  if(emailTablePinned){
    sectionOpen.email=true;
    setSectionOpen('discounts',true);
    setSectionOpen('email',true);
    renderEmailTable();
  }else{
    renderPinnedEmailTable();
  }
}
function renderPinnedEmailTable(){
  const box=document.getElementById('emailTableBox');
  const editor=document.getElementById('emailTableEditor');
  const toggleBtn=document.getElementById('toggleEmailTableBtn');
  const pinBtn=document.getElementById('pinEmailTableBtn');
  const oldPanel=document.getElementById('pinnedEmailPanel');
  const floatingUnpin=document.getElementById('unpinEmailFloatingBtn');

  if(oldPanel)oldPanel.classList.add('hidden');
  if(floatingUnpin)floatingUnpin.classList.toggle('hidden',!emailTablePinned);

  if(pinBtn){
    pinBtn.textContent=emailTablePinned?'📌 Откачи полето':'📌 Закачи полето';
    pinBtn.classList.toggle('active',emailTablePinned);
  }

  if(!box)return;

  box.classList.toggle('email-box-pinned',emailTablePinned);

  if(emailTablePinned){
    if(editor)editor.classList.remove('hidden');
    if(toggleBtn)toggleBtn.textContent='▼ Таблица с имейли';
  }
}
function renderEmailTable(){
  const week=getActiveWeek();
  const box=document.getElementById('emailTableBox');
  const title=document.getElementById('emailTableHotelTitle');
  const clearBtn=document.getElementById('clearEmailTableBtn');
  const pinBtn=document.getElementById('pinEmailTableBtn');
  const emailHotelTabs=document.getElementById('emailHotelTabs');
  const emailRoomInfoButtons=document.getElementById('emailRoomInfoButtons');
  const emailEditor=document.getElementById('emailTableEditor');
  if(!week||!box||!title||!clearBtn||!pinBtn||!emailHotelTabs||!emailRoomInfoButtons)return;

  pinBtn.textContent=emailTablePinned?'📌 Откачи полето':'📌 Закачи полето';
  pinBtn.classList.toggle('active',emailTablePinned);

  if(emailEditor&&emailEditor.classList.contains('hidden')&&!emailTablePinned){
    return;
  }

  emailHotelTabs.innerHTML='';
  week.hotels.forEach((hotel,index)=>{
    const name=hotel.name.trim()||`Хотел ${index+1}`;
    const tab=document.createElement('button');
    tab.className='hotel-tab small'+(hotel.id===week.selectedHotelId?' active':'');
    tab.innerHTML=`<span class="hotel-name">${escapeHtml(name)}</span>${operationRangeLabel(hotel)?`<span class="hotel-operation">${escapeHtml(operationRangeLabel(hotel))}</span>`:''}`;
    tab.addEventListener('click',()=>selectHotel(hotel.id));
    emailHotelTabs.appendChild(tab);
  });

  const hotel=getSelectedHotel(week);
  if(!hotel){
    title.textContent='Таблица';
    box.dataset.renderedHotelId='';
    box.innerHTML='';
    renderPinnedEmailTable();
    return;
  }

  const hotelIndex=week.hotels.findIndex(h=>h.id===hotel.id);
  title.textContent='Таблица за ' + (hotel.name||`Хотел ${hotelIndex+1}`);
  box.dataset.renderedHotelId=hotel.id;
  box.innerHTML=hotel.emailTableHtml||'';

  box.oninput=()=>{
    hotel.emailTableHtml=box.innerHTML;
    touchWeek(week);
    renderPinnedEmailTable();
  };

  box.onpaste=e=>{
    e.preventDefault();
    const clipboard=e.clipboardData||window.clipboardData;
    const html=clipboard ? clipboard.getData('text/html') : '';
    const plain=clipboard ? clipboard.getData('text/plain') : '';

    if(html){
      insertHtmlAtCursor(html);
    }else if(plain){
      insertHtmlAtCursor(plainTextTableToHtml(plain));
    }

    saveEmailTableContent(box,hotel,week);
  };

  clearBtn.onclick=()=>{
    if(!confirm('Да изчистя ли таблицата за този хотел?'))return;
    hotel.emailTableHtml='';
    box.innerHTML='';
    touchWeek(week);
    renderWeekList();
    renderPinnedEmailTable();
  };

  renderPinnedEmailTable();
}
function getSelectedChecklistHotel(week){
  if(!week||!week.hotels.length)return null;
  let hotel=week.hotels.find(h=>h.id===week.selectedChecklistHotelId);
  if(!hotel){
    hotel=week.hotels[0];
    week.selectedChecklistHotelId=hotel.id;
    saveState();
  }
  if(!Array.isArray(hotel.checklist))hotel.checklist=[];
  return hotel;
}
function renderChecklist(){
  const week=getActiveWeek();
  const list=document.getElementById('checklistHotelList');
  const title=document.getElementById('checklistHotelTitle');
  const summary=document.getElementById('checklistSummary');
  const itemsWrap=document.getElementById('checklistItems');
  const input=document.getElementById('newChecklistItemInput');
  const addBtn=document.getElementById('addChecklistItemBtn');
  if(!week||!list||!title||!summary||!itemsWrap||!input||!addBtn)return;

  list.innerHTML='';
  week.hotels.forEach((hotel,index)=>{
    if(!Array.isArray(hotel.checklist))hotel.checklist=[];
    const total=hotel.checklist.length;
    const done=hotel.checklist.filter(item=>item.done).length;
    const btn=document.createElement('button');
    btn.className='checklist-hotel-btn small'+(hotel.id===week.selectedChecklistHotelId?' active':'');
    btn.innerHTML=`<span>${escapeHtml(hotel.name||'Хотел '+(index+1))}</span><span class="checklist-count">${done}/${total}</span>`;
    btn.addEventListener('click',()=>{
      week.selectedChecklistHotelId=hotel.id;
      week.selectedHotelId=hotel.id;
      touchWeek(week);
      renderSelectorsAndPeriods();
      if(sectionOpen.email||emailTablePinned)renderEmailTable();
      renderChecklist();
      renderWeekList();
    });
    list.appendChild(btn);
  });

  const selected=getSelectedChecklistHotel(week);
  if(!selected){
    title.textContent='Чек лист';
    summary.textContent='Няма хотел';
    itemsWrap.innerHTML='<div class="empty">Първо добави хотел.</div>';
    return;
  }

  const hotelIndex=week.hotels.findIndex(h=>h.id===selected.id);
  title.textContent=selected.name||`Хотел ${hotelIndex+1}`;
  const total=selected.checklist.length;
  const done=selected.checklist.filter(item=>item.done).length;
  summary.textContent=`${done}/${total} готови`;

  itemsWrap.innerHTML='';
  if(!selected.checklist.length){
    itemsWrap.innerHTML='<div class="empty">Няма задачи за този хотел. Добави първата задача отдолу.</div>';
  }else{
    selected.checklist.forEach((item,index)=>{
      const row=document.createElement('div');
      row.className='check-item'+(item.done?' done':'');
      row.draggable=true;
      row.dataset.checkRow=item.id;
      row.innerHTML=`<span class="drag-handle no-print" title="Хвани и премести задачата">↕</span>
        <input type="text" value="${escapeAttr(item.text)}" placeholder="Описание на задача..." data-check-text="${item.id}" />
        <input type="checkbox" title="Готово" ${item.done?'checked':''} data-check-done="${item.id}" />
        <div class="move-buttons no-print">
          <button class="small icon-btn" title="Нагоре" data-move-check="${item.id}" data-direction="up" ${index===0?'disabled':''}>↑</button>
          <button class="small icon-btn" title="Надолу" data-move-check="${item.id}" data-direction="down" ${index===selected.checklist.length-1?'disabled':''}>↓</button>
        </div>
        <button class="danger small no-print" data-delete-check="${item.id}" title="Изтрий">🗑️</button>`;
      itemsWrap.appendChild(row);
    });
  }

  itemsWrap.querySelectorAll('[data-check-done]').forEach(box=>{
    box.addEventListener('change',e=>updateChecklistItem(e.target.dataset.checkDone,'done',e.target.checked,true));
  });
  itemsWrap.querySelectorAll('[data-check-text]').forEach(field=>{
    field.addEventListener('input',e=>updateChecklistItem(e.target.dataset.checkText,'text',e.target.value,false));
    field.addEventListener('change',()=>{renderChecklist();renderWeekList()});
  });
  itemsWrap.querySelectorAll('[data-delete-check]').forEach(btn=>{
    btn.addEventListener('click',e=>deleteChecklistItem(e.target.dataset.deleteCheck));
  });
  itemsWrap.querySelectorAll('[data-move-check]').forEach(btn=>{
    btn.addEventListener('click',e=>moveChecklistItem(e.target.dataset.moveCheck,e.target.dataset.direction));
  });

  itemsWrap.querySelectorAll('[data-check-row]').forEach(row=>{
    row.addEventListener('dragstart',e=>{
      draggedChecklistItemId=row.dataset.checkRow;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed='move';
      e.dataTransfer.setData('text/plain',draggedChecklistItemId);
    });
    row.addEventListener('dragover',e=>{
      e.preventDefault();
      if(row.dataset.checkRow!==draggedChecklistItemId)row.classList.add('drag-over');
    });
    row.addEventListener('dragleave',()=>row.classList.remove('drag-over'));
    row.addEventListener('drop',e=>{
      e.preventDefault();
      row.classList.remove('drag-over');
      reorderChecklistItem(draggedChecklistItemId,row.dataset.checkRow);
    });
    row.addEventListener('dragend',()=>{
      row.classList.remove('dragging');
      itemsWrap.querySelectorAll('.drag-over').forEach(item=>item.classList.remove('drag-over'));
      draggedChecklistItemId=null;
    });
  });

  addBtn.onclick=()=>{
    const text=input.value.trim();
    if(!text){
      alert('Напиши задача за чек листа.');
      return;
    }
    selected.checklist.push({id:uid(),text,done:false});
    input.value='';
    touchWeek(week);
    renderChecklist();
    renderWeekList();
  };
  input.onkeydown=e=>{
    if(e.key==='Enter'){
      e.preventDefault();
      addBtn.click();
    }
  };
}
function updateChecklistItem(itemId,field,value,shouldRender=true){
  const week=getActiveWeek();
  const hotel=getSelectedChecklistHotel(week);
  if(!hotel)return;
  const item=hotel.checklist.find(i=>i.id===itemId);
  if(!item)return;
  item[field]=value;
  touchWeek(week);
  if(shouldRender){
    renderChecklist();
    renderWeekList();
  }
}
function deleteChecklistItem(itemId){
  const week=getActiveWeek();
  const hotel=getSelectedChecklistHotel(week);
  if(!hotel)return;
  hotel.checklist=hotel.checklist.filter(item=>item.id!==itemId);
  touchWeek(week);
  renderChecklist();
  renderWeekList();
}
function moveChecklistItem(itemId,direction){
  const week=getActiveWeek();
  const hotel=getSelectedChecklistHotel(week);
  if(!hotel)return;
  const index=hotel.checklist.findIndex(item=>item.id===itemId);
  const newIndex=direction==='up'?index-1:index+1;
  if(index<0||newIndex<0||newIndex>=hotel.checklist.length)return;
  const [item]=hotel.checklist.splice(index,1);
  hotel.checklist.splice(newIndex,0,item);
  touchWeek(week);
  renderChecklist();
  renderWeekList();
}
function reorderChecklistItem(sourceId,targetId){
  if(!sourceId||!targetId||sourceId===targetId)return;
  const week=getActiveWeek();
  const hotel=getSelectedChecklistHotel(week);
  if(!hotel)return;
  const sourceIndex=hotel.checklist.findIndex(item=>item.id===sourceId);
  const targetIndex=hotel.checklist.findIndex(item=>item.id===targetId);
  if(sourceIndex<0||targetIndex<0)return;
  const [moved]=hotel.checklist.splice(sourceIndex,1);
  hotel.checklist.splice(targetIndex,0,moved);
  touchWeek(week);
  renderChecklist();
  renderWeekList();
}
function moveWeek(id,direction){const i=state.weeks.findIndex(w=>w.id===id),ni=direction==='up'?i-1:i+1;if(i<0||ni<0||ni>=state.weeks.length)return;const [item]=state.weeks.splice(i,1);state.weeks.splice(ni,0,item);activeWeekId=id;saveState();renderWeekList()}
function reorderWeek(sourceId,targetId){if(!sourceId||!targetId||sourceId===targetId)return;const si=state.weeks.findIndex(w=>w.id===sourceId),ti=state.weeks.findIndex(w=>w.id===targetId);if(si<0||ti<0)return;const [moved]=state.weeks.splice(si,1);state.weeks.splice(ti,0,moved);activeWeekId=sourceId;saveState();renderWeekList()}
function touchWeek(w){w.updatedAt=new Date().toISOString();saveState();const u=document.getElementById('updatedInfo');if(u)u.textContent='Последна промяна: '+new Date(w.updatedAt).toLocaleString('bg-BG')}
function countHotelPeriods(h){return h.subsections.reduce((sum,s)=>sum+s.periods.length,0)}
function countPeriods(w){return w.hotels.reduce((sum,h)=>sum+countHotelPeriods(h),0)}
function countSubsections(w){return w.hotels.reduce((sum,h)=>sum+h.subsections.length,0)}

function setGoogleUrlSettingsOpen(isOpen){
  const panel=document.getElementById('googleUrlSettings');
  const button=document.getElementById('toggleGoogleUrlBtn');
  if(!panel||!button)return;
  panel.classList.toggle('hidden',!isOpen);
  button.classList.toggle('active',isOpen);
}
function toggleGoogleUrlSettings(){
  const panel=document.getElementById('googleUrlSettings');
  if(!panel)return;
  setGoogleUrlSettingsOpen(panel.classList.contains('hidden'));
}

function saveGoogleScriptUrl(){
  const input=document.getElementById('googleScriptUrlInput');
  if(!input)return '';
  const url=input.value.trim();
  if(url)localStorage.setItem(GOOGLE_SYNC_URL_KEY,url);
  else localStorage.removeItem(GOOGLE_SYNC_URL_KEY);
  return url;
}
function getGoogleScriptUrl(){
  const url=saveGoogleScriptUrl();
  if(!url){
    setGoogleUrlSettingsOpen(true);
    setGoogleSyncStatus('Постави Apps Script Web App URL, преди да използваш Google Drive JSON backup.', 'warn');
    return '';
  }
  if(!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/.test(url)){
    setGoogleUrlSettingsOpen(true);
    setGoogleSyncStatus('URL адресът не изглежда като Apps Script Web App URL. Трябва да завършва на /exec.', 'warn');
  }
  return url;
}
function setGoogleSyncStatus(message,type){
  const status=document.getElementById('googleSyncStatus');
  if(!status)return;
  status.className='cloud-status'+(type?' '+type:'');
  status.textContent=message;
}
function setGoogleSyncBusy(isBusy){
  ['testGoogleSyncBtn','saveGoogleSyncBtn','loadGoogleSyncBtn','googleBackupsBtn','refreshGoogleBackupsBtn'].forEach(id=>{
    const btn=document.getElementById(id);
    if(btn)btn.disabled=!!isBusy;
  });
}
function googleJsonpRequest(url,params={},attempt=0){
  return new Promise((resolve,reject)=>{
    const callbackName='googleSheetsSyncCallback_'+Date.now()+'_'+Math.random().toString(16).slice(2);
    const script=document.createElement('script');
    const timer=setTimeout(()=>{
      cleanup();
      const error=new Error('Няма отговор от Google Apps Script.');
      error.googleJsonpTimeout=true;
      reject(error);
    },60000);
    function cleanup(){
      clearTimeout(timer);
      if(script.parentNode)script.parentNode.removeChild(script);
      try{delete window[callbackName]}catch(e){window[callbackName]=undefined}
    }
    window[callbackName]=data=>{
      cleanup();
      resolve(data);
    };
    const finalUrl=new URL(url);
    Object.entries(params).forEach(([key,value])=>finalUrl.searchParams.set(key,value));
    finalUrl.searchParams.set('callback',callbackName);
    finalUrl.searchParams.set('_',Date.now());
    script.onerror=()=>{
      cleanup();
      const error=new Error('Неуспешно зареждане от Apps Script. Провери URL адреса и дали web app е публикуван с достъп.');
      error.googleJsonpNetwork=true;
      reject(error);
    };
    script.src=finalUrl.toString();
    document.body.appendChild(script);
  }).catch(error=>{
    if(error&&(error.googleJsonpTimeout||error.googleJsonpNetwork)&&attempt<1){
      setGoogleSyncStatus('Google Apps Script отговаря бавно. Опитвам отново...', 'warn');
      return new Promise(resolve=>window.setTimeout(resolve,1500)).then(()=>googleJsonpRequest(url,params,attempt+1));
    }
    if(error&&error.googleJsonpTimeout){
      throw new Error('Няма отговор от Google Apps Script след два опита. Провери интернет връзката и Apps Script URL адреса.');
    }
    if(error&&error.googleJsonpNetwork){
      throw new Error('Google Apps Script не се зареди след два опита. Провери интернет връзката и Apps Script URL адреса.');
    }
    throw error;
  });
}
async function testGoogleSheetsSync(){
  const url=getGoogleScriptUrl();
  if(!url)return;
  setGoogleSyncBusy(true);
  setGoogleSyncStatus('Тествам връзката с Google Drive JSON backup...', '');
  try{
    const response=await googleJsonpRequest(url,{action:'test'});
    if(!response||!response.ok)throw new Error(response&&response.error?response.error:'Невалиден отговор от Apps Script.');
    const details=[];
    if(response.updatedAt)details.push('последен запис: '+new Date(response.updatedAt).toLocaleString('bg-BG'));
    if(response.fileName)details.push('файл: '+response.fileName);
    if(response.backups!==undefined)details.push('backup: '+response.backups);
    if(response.chunks!==undefined)details.push('части: '+response.chunks);
    if(response.characters!==undefined)details.push('символи: '+response.characters);
    setGoogleSyncStatus('Връзката работи.'+(details.length?' '+details.join(' · '):''), 'ok');
  }catch(error){
    console.error(error);
    setGoogleSyncStatus('Грешка при теста: '+error.message, 'error');
  }finally{
    setGoogleSyncBusy(false);
  }
}

function syncVisibleEditorsBeforeGoogleSave(){
  syncWorkFormStateFromFrame();
  const week=getActiveWeek&&getActiveWeek();

  const ultraBox=document.getElementById('ultraInfoBox');
  if(ultraBox&&state&&state.ultraAllInclusive){
    state.ultraAllInclusive=normalizeUltraAllInclusive(state.ultraAllInclusive||{});
    const selected=getSelectedUltraHotel();
    if(selected&&!selected.locked){
      selected.html=ultraBox.innerHTML;
      state.ultraAllInclusive.hotels[selected.id]=selected;
    }
  }



  const emailTxtBox=document.getElementById('emailTxtBox');
  const emailTxtEditor=document.getElementById('emailTxtEditor');
  const shouldSyncEmailTxt=!!(
    emailTxtBox &&
    (sectionOpen.emailTxt || (emailTxtEditor&&!emailTxtEditor.classList.contains('hidden')) || emailTxtBox.contains(document.activeElement))
  );
  if(shouldSyncEmailTxt){
    saveEmailTxtFromBox();
  }

  const emailBox=document.getElementById('emailTableBox');
  const emailEditor=document.getElementById('emailTableEditor');
  const shouldSyncEmail=!!(
    week &&
    emailBox &&
    (emailTablePinned || sectionOpen.email || (emailEditor&&!emailEditor.classList.contains('hidden')) || emailBox.contains(document.activeElement))
  );

  if(shouldSyncEmail){
    const hotel=getSelectedHotel(week);
    const renderedHotelId=emailBox.dataset.renderedHotelId||'';

    // Important: when the email section is closed, the template still contains an empty
    // contenteditable box. In older versions, pressing any “Запази” button could copy
    // that empty box into the selected hotel and erase the saved Outlook table. Only
    // sync the box when it has actually been rendered for the current hotel.
    if(hotel && renderedHotelId===hotel.id){
      hotel.emailTableHtml=emailBox.innerHTML;
      touchWeek(week);
    }
  }
}

async function saveJsonFromButton(button){
  const originalText=button?button.textContent:'';
  if(button){
    button.disabled=true;
    button.classList.add('saving');
    button.textContent='Записвам...';
  }
  try{
    await saveToGoogleSheets();
    captureAcceptedStateSnapshot({skipEditorSync:true});
    if(button){
      button.textContent='Запазено';
      setTimeout(()=>{
        button.textContent=originalText||'Запази';
        button.disabled=false;
        button.classList.remove('saving');
      },900);
    }
  }catch(error){
    console.error(error);
    if(button){
      button.textContent='Грешка';
      setTimeout(()=>{
        button.textContent=originalText||'Запази';
        button.disabled=false;
        button.classList.remove('saving');
      },1200);
    }
  }
}

async function saveToGoogleSheets(){
  const url=getGoogleScriptUrl();
  if(!url)return;
  syncVisibleEditorsBeforeGoogleSave();
  saveState();
  const payload={action:'save',app:'hotel_discount_history',version:GOOGLE_SYNC_APP_VERSION,savedAt:new Date().toISOString(),state};
  const body=JSON.stringify(payload);
  setGoogleSyncBusy(true);
  setGoogleSyncStatus('Записвам JSON файл в Google Drive...', '');
  try{
    const response=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body,redirect:'follow'});
    const text=await response.text();
    let data=null;
    try{data=JSON.parse(text)}catch(e){}
    if(!response.ok)throw new Error('HTTP '+response.status+(text?': '+text.slice(0,160):''));
    if(data&&!data.ok)throw new Error(data.error||'Apps Script върна грешка.');
    googleAutosaveLastSnapshot=JSON.stringify(state); googleAutosaveDirty=false;
    captureAcceptedStateSnapshot({skipEditorSync:true});
    setGoogleSyncStatus('ОК', 'ok');
  }catch(error){
    console.warn('Пробвам резервен no-cors запис:',error);
    try{
      await fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body});
      captureAcceptedStateSnapshot({skipEditorSync:true});
      setGoogleSyncStatus('Изпратено към Google Drive, но браузърът не позволи потвърждение. Натисни „Тест“ или „Зареди JSON“, за да провериш.', 'warn');
    }catch(secondError){
      console.error(secondError);
      setGoogleSyncStatus('Грешка при запис: '+secondError.message, 'error');
    }
  }finally{
    setGoogleSyncBusy(false);
  }
}
let googleBackups=[];
function formatGoogleBackupSize(bytes){
  const size=Number(bytes)||0;
  if(size>=1024*1024)return (size/(1024*1024)).toLocaleString('bg-BG',{maximumFractionDigits:1})+' MB';
  return Math.max(1,Math.round(size/1024)).toLocaleString('bg-BG')+' KB';
}
function toggleGoogleBackups(){
  const panel=document.getElementById('googleBackupsPanel');
  if(!panel)return;
  const willOpen=panel.classList.contains('hidden');
  panel.classList.toggle('hidden',!willOpen);
  if(willOpen)loadGoogleBackups();
}
function renderGoogleBackups(){
  const list=document.getElementById('googleBackupsList');
  if(!list)return;
  if(!googleBackups.length){
    list.innerHTML='<div class="google-backups-empty">Няма намерени backup-и.</div>';
    return;
  }
  list.innerHTML=googleBackups.map((backup,index)=>{
    const size=Number(backup.size)||0;
    const full=size>=500000;
    const date=backup.created?new Date(backup.created).toLocaleString('bg-BG'):'Без дата';
    return `<div class="google-backup-row">
      <div class="google-backup-info">
        <strong>${escapeHtml(date)}</strong>
        <span>${escapeHtml(formatGoogleBackupSize(size))}</span>
        <em class="${full?'full':'small'}">${full?'Пълен':'Малък'}</em>
      </div>
      <button class="small" type="button" data-google-backup-index="${index}">Възстанови</button>
    </div>`;
  }).join('');
  list.querySelectorAll('[data-google-backup-index]').forEach(button=>{
    button.addEventListener('click',()=>restoreGoogleBackup(Number(button.dataset.googleBackupIndex)));
  });
}
async function loadGoogleBackups(){
  const url=getGoogleScriptUrl();
  if(!url)return;
  setGoogleSyncBusy(true);
  setGoogleSyncStatus('Търся наличните Google backup-и...', '');
  try{
    const response=await googleJsonpRequest(url,{action:'backups'});
    if(!response||!response.ok||!Array.isArray(response.backups))throw new Error(response&&response.error?response.error:'Не получих списък с backup-и.');
    googleBackups=response.backups.slice().sort((a,b)=>new Date(b.created||0)-new Date(a.created||0));
    renderGoogleBackups();
    setGoogleSyncStatus('Намерени backup-и: '+googleBackups.length+'. Избери дата за възстановяване.', 'ok');
  }catch(error){
    console.error(error);
    setGoogleSyncStatus('Грешка при зареждане на backup-и: '+error.message, 'error');
  }finally{
    setGoogleSyncBusy(false);
  }
}
function extractGoogleBackupState(payload){
  const candidate=payload&&payload.state?payload.state:payload;
  if(!candidate||!Array.isArray(candidate.weeks))throw new Error('Избраният файл не съдържа валиден архив.');
  if(candidate.weeks.length===0)throw new Error('Избраният backup е празен (0 седмици) и няма да бъде зареден.');
  return candidate;
}
function applyGoogleBackupPayload(payload,label){
  const loaded=normalizeGoogleLoadedStatePreservingLocalForm(extractGoogleBackupState(payload));
  state=loaded.state;
  activeWeekId=state.activeWeekId||(state.weeks[0]&&state.weeks[0].id)||null;
  cleanupOldHistoryKeys();
  const localSaved=saveStateSafe({skipWorkFormSync:true});
  applyRoomInfoDisplaySettings();
  captureAcceptedStateSnapshot({skipEditorSync:true});
  render();
  setGoogleSyncStatus('Възстановен backup: '+label+(localSaved?'':' · Локалният fallback не се обнови.'),localSaved?'ok':'warn');
}
function googleBackupDownloadUrl(backup){
  return 'https://drive.google.com/uc?export=download&id='+encodeURIComponent(backup.id);
}
function downloadGoogleBackup(backup){
  const link=document.createElement('a');
  link.href=googleBackupDownloadUrl(backup);
  link.target='_blank';
  link.rel='noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}
async function restoreGoogleBackup(index){
  const backup=googleBackups[index];
  if(!backup)return;
  const date=backup.created?new Date(backup.created).toLocaleString('bg-BG'):backup.name;
  if(!confirm('Backup от '+date+' ще замени текущите данни в този браузър. Продължаваме ли?'))return;
  setGoogleSyncBusy(true);
  setGoogleSyncStatus('Възстановявам backup от '+date+'...', '');
  try{
    const response=await fetch('/__google_drive_backup?id='+encodeURIComponent(backup.id),{cache:'no-store'});
    if(!response.ok)throw new Error('Автоматичното изтегляне не е достъпно в този режим.');
    applyGoogleBackupPayload(await response.json(),date);
  }catch(error){
    console.warn(error);
    downloadGoogleBackup(backup);
    setGoogleSyncStatus('Backup-ът се изтегля. Натисни „Избери backup файл“ и посочи изтегления JSON.', 'warn');
  }finally{
    setGoogleSyncBusy(false);
  }
}
function importGoogleBackupFile(event){
  const file=event.target.files&&event.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const payload=JSON.parse(reader.result);
      const candidate=extractGoogleBackupState(payload);
      if(!confirm('Файлът „'+file.name+'“ съдържа '+candidate.weeks.length+' седмици и ще замени текущите данни. Продължаваме ли?'))return;
      applyGoogleBackupPayload(payload,file.name);
    }catch(error){
      console.error(error);
      setGoogleSyncStatus('Неуспешно възстановяване: '+error.message,'error');
    }finally{
      event.target.value='';
    }
  };
  reader.onerror=()=>{
    setGoogleSyncStatus('Не успях да прочета избрания backup файл.','error');
    event.target.value='';
  };
  reader.readAsText(file);
}
async function loadFromGoogleSheets(){
  const url=getGoogleScriptUrl();
  if(!url)return;
  if(!confirm('Зареждането от Google Drive JSON ще замени текущите данни в този браузър. Продължаваме ли?'))return;
  setGoogleSyncBusy(true);
  setGoogleSyncStatus('Зареждам JSON от Google Drive...', '');
  try{
    const response=await googleJsonpRequest(url,{action:'load'});
    if(!response||!response.ok)throw new Error(response&&response.error?response.error:'Невалиден отговор от Apps Script.');
    if(!response.state||!Array.isArray(response.state.weeks))throw new Error('В Google Drive JSON файла няма валидна база за този файл.');
    if(response.state.weeks.length===0&&state&&Array.isArray(state.weeks)&&state.weeks.length>0){
      throw new Error('Google Drive JSON е празен (0 седмици). Локалните данни са запазени и няма да бъдат заменени.');
    }
    const loaded=normalizeGoogleLoadedStatePreservingLocalForm(response.state);
    state=loaded.state;
    activeWeekId=state.activeWeekId||(state.weeks[0]&&state.weeks[0].id)||null;
    cleanupOldHistoryKeys();
    const localSaved=saveStateSafe({skipWorkFormSync:true});
    applyRoomInfoDisplaySettings();
    captureAcceptedStateSnapshot({skipEditorSync:true});
    render();
    setGoogleSyncStatus('Заредено от Google Drive JSON. Последен запис: '+(response.updatedAt?new Date(response.updatedAt).toLocaleString('bg-BG'):'няма дата')+(response.fileName?' · файл: '+response.fileName:'')+(localSaved?'':' · Данните са заредени, но локалният fallback не се обнови.'), 'ok');
  }catch(error){
    console.error(error);
    setGoogleSyncStatus('Грешка при зареждане: '+error.message, 'error');
  }finally{
    setGoogleSyncBusy(false);
  }
}


let googleAutosaveDirty=false;
let googleAutosaveInProgress=false;
let googleAutosaveLastSnapshot='';
function markGoogleAutosaveDirty(){googleAutosaveDirty=true;}
document.addEventListener('input',markGoogleAutosaveDirty,true);
document.addEventListener('change',markGoogleAutosaveDirty,true);
async function googleDriveAutosaveTick(){
  if(googleAutosaveInProgress||!googleAutosaveDirty)return;
  const url=(document.getElementById('googleScriptUrlInput')||{}).value||localStorage.getItem(GOOGLE_SYNC_URL_KEY)||DEFAULT_GOOGLE_SCRIPT_URL;
  if(!url||!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/.test(url))return;
  syncVisibleEditorsBeforeGoogleSave();
  saveState();
  if(!state||!Array.isArray(state.weeks)||state.weeks.length===0){
    googleAutosaveDirty=false;
    setGoogleSyncStatus('Autosave е пропуснат: локалната база няма седмици.', 'warn');
    return;
  }
  const snapshot=JSON.stringify(state);
  if(snapshot===googleAutosaveLastSnapshot){googleAutosaveDirty=false;return;}
  googleAutosaveInProgress=true;
  googleAutosaveDirty=false;
  const payload={action:'autosave',autosave:true,app:'hotel_discount_history',version:GOOGLE_SYNC_APP_VERSION,savedAt:new Date().toISOString(),state};
  try{
    await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow'});
    googleAutosaveLastSnapshot=snapshot;
    setGoogleSyncStatus('ОК', 'ok');
  }catch(err){
    googleAutosaveDirty=true;
    setGoogleSyncStatus('Autosave не успя: '+(err&&err.message?err.message:err), 'warn');
  }finally{googleAutosaveInProgress=false;}
}
window.setInterval(googleDriveAutosaveTick,60000);


const AUTO_LOAD_GOOGLE_ON_STARTUP=true;
let googleDriveStartupLoadDone=false;
function showGoogleDriveStartupOverlay(message,type){
  let overlay=document.getElementById('googleDriveStartupOverlay');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='googleDriveStartupOverlay';
    overlay.setAttribute('role','status');
    overlay.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(245,247,251,.92);display:flex;align-items:center;justify-content:center;padding:22px;backdrop-filter:blur(2px);';
    const box=document.createElement('div');
    box.className='google-drive-startup-box';
    box.style.cssText='width:min(520px,100%);background:#fff;border:1px solid #bfdbfe;border-radius:18px;box-shadow:0 20px 45px rgba(15,23,42,.18);padding:18px;text-align:center;color:#1e3a8a;font-family:Arial,Helvetica,sans-serif;';
    const title=document.createElement('div');
    title.className='google-drive-startup-title';
    title.style.cssText='font-size:17px;font-weight:900;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:8px;';
    title.textContent='Google Drive JSON';
    const text=document.createElement('div');
    text.className='google-drive-startup-text';
    text.style.cssText='font-size:13px;line-height:1.45;color:#475569;font-weight:700;';
    box.appendChild(title);
    box.appendChild(text);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
  const text=overlay.querySelector('.google-drive-startup-text');
  if(text)text.textContent=message||'';
  const box=overlay.querySelector('.google-drive-startup-box');
  if(box){
    box.style.borderColor=type==='error'?'#fecaca':type==='warn'?'#fde68a':'#bfdbfe';
    box.style.background=type==='error'?'#fef2f2':type==='warn'?'#fffbeb':'#fff';
  }
  overlay.style.display='flex';
  return overlay;
}
function hideGoogleDriveStartupOverlay(delay){
  const overlay=document.getElementById('googleDriveStartupOverlay');
  if(!overlay)return;
  window.setTimeout(()=>{if(overlay&&overlay.parentNode)overlay.parentNode.removeChild(overlay);},Number(delay)||0);
}
async function autoLoadLatestJsonFromGoogleDriveOnStartup(){
  if(googleDriveStartupLoadDone||!AUTO_LOAD_GOOGLE_ON_STARTUP)return;
  googleDriveStartupLoadDone=true;
  const input=document.getElementById('googleScriptUrlInput');
  const storedUrl=(()=>{try{return localStorage.getItem(GOOGLE_SYNC_URL_KEY)||'';}catch(e){return '';}})();
  const url=String((input&&input.value)||storedUrl||DEFAULT_GOOGLE_SCRIPT_URL||'').trim();
  if(input&&!input.value)input.value=url;
  if(!url||!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/.test(url)){
    setGoogleSyncStatus('Автоматичното зареждане от Google Drive е пропуснато: липсва валиден Apps Script URL.', 'warn');
    return;
  }
  setGoogleSyncBusy(true);
  setGoogleSyncStatus('Google Drive: зареждам JSON...', '');
  try{
    const response=await googleJsonpRequest(url,{action:'load',autoload:'1'});
    if(!response||!response.ok)throw new Error(response&&response.error?response.error:'Невалиден отговор от Apps Script.');
    if(response.state&&Array.isArray(response.state.weeks)){
      if(response.state.weeks.length===0&&state&&Array.isArray(state.weeks)&&state.weeks.length>0){
        setGoogleSyncStatus('Google Drive JSON е празен (0 седмици). Локалните данни остават заредени.', 'warn');
        return;
      }
      const loaded=normalizeGoogleLoadedStatePreservingLocalForm(response.state);
      state=loaded.state;
      activeWeekId=state.activeWeekId||(state.weeks[0]&&state.weeks[0].id)||null;
      cleanupOldHistoryKeys();
      const localSaved=saveStateSafe({skipWorkFormSync:true});
      applyRoomInfoDisplaySettings();
      captureAcceptedStateSnapshot({skipEditorSync:true});
      render();
      googleAutosaveLastSnapshot=JSON.stringify(state);
      googleAutosaveDirty=false;
      const details=[];
      if(response.updatedAt)details.push('последен запис: '+new Date(response.updatedAt).toLocaleString('bg-BG'));
      if(response.fileName)details.push('файл: '+response.fileName);
      setGoogleSyncStatus('Google Drive: зареден JSON.'+(details.length?' '+details.join(' · '):'')+(localSaved?'':' · Данните са заредени, но локалният fallback не се обнови.'), 'ok');
    }else{
      setGoogleSyncStatus('Google Drive: няма JSON. Остават локалните данни.', 'warn');
    }
  }catch(error){
    console.error(error);
    setGoogleSyncStatus('Google Drive: автоматичното зареждане не успя. Локалните данни остават заредени. '+error.message, 'warn');
  }finally{
    setGoogleSyncBusy(false);
  }
}
window.setTimeout(autoLoadLatestJsonFromGoogleDriveOnStartup,60);



const DISCOUNT_RESERVATION_EXPORT_COLUMNS_FIXED=[
  {key:'number',label:'Номер'},
  {key:'reservationDate',label:'Дата'},
  {key:'hotel',label:'Хотел'},
  {key:'roomType',label:'Тип стая'},
  {key:'checkIn',label:'ChIN'},
  {key:'checkOut',label:'ChOUT'},
  {key:'nights',label:'Нощ.'},
  {key:'guestName',label:'Име на госта'},
  {key:'price',label:'Цена'},
  {key:'realPrice',label:'Реална цена'},
  {key:'discount',label:'%'},
  {key:'clockNumber',label:'Clock'},
  {key:'quendooNumber',label:'Quendoo'},
  {key:'comment',label:'Коментар'},
  {key:'contact',label:'Телефон и имейл'}
];
function discountReservationCustomFieldValueByMatchers(item,matchers){
  const layout=ensureDiscountReservationLayout();
  const fields=(layout.fields||[]).filter(field=>field&&field.custom);
  const field=fields.find(field=>{
    const text=String((field.label||'')+' '+(field.key||''));
    return matchers.some(pattern=>pattern.test(text));
  });
  if(!field||!item||!item.customFields||typeof item.customFields!=='object')return '';
  const value=item.customFields[field.key];
  return value===undefined||value===null?'':String(value).trim();
}
function discountReservationRealPriceText(item){
  if(!item)return '';
  const direct=item.realPrice!==undefined?item.realPrice:(item.actualPrice!==undefined?item.actualPrice:(item.netPrice!==undefined?item.netPrice:item.priceReal));
  if(direct!==undefined&&direct!==null&&String(direct).trim())return String(direct).trim();
  return discountReservationCustomFieldValueByMatchers(item,[/реална/i,/real/i,/actual/i]);
}
function discountReservationContactExportRole(field){
  const existing=discountReservationContactRole(field);
  if(existing)return existing;
  const text=String((field&&field.label||'')+' '+(field&&field.key||'')).toLowerCase();
  if(/имейл|мейл|e-?mail|mail/.test(text))return 'email';
  if(/телефон|тел\.|phone|tel|gsm|мобилен/.test(text))return 'phone';
  return '';
}
function discountReservationContactExportText(item){
  const layout=ensureDiscountReservationLayout();
  const fields=(layout.fields||[]).filter(field=>field&&field.custom);
  const phoneField=fields.find(field=>discountReservationContactExportRole(field)==='phone')||null;
  const emailField=fields.find(field=>discountReservationContactExportRole(field)==='email')||null;
  const custom=item&&item.customFields&&typeof item.customFields==='object'?item.customFields:{};
  const phone=phoneField&&custom[phoneField.key]!==undefined?String(custom[phoneField.key]).trim():'';
  const email=emailField&&custom[emailField.key]!==undefined?String(custom[emailField.key]).trim():'';
  return [phone,email].filter(Boolean).join('\n');
}
function discountReservationFixedExportValue(item,column,index){
  const key=column&&column.key;
  if(key==='number')return String(item.autoNumber||index+1);
  if(key==='reservationDate')return shortDisplayDate(item.reservationDate||'');
  if(key==='hotel')return item.hotel||'';
  if(key==='roomType')return item.roomType||'';
  if(key==='checkIn')return item.checkIn||'';
  if(key==='checkOut')return item.checkOut||'';
  if(key==='nights')return discountReservationNights(item)||'';
  if(key==='guestName')return item.guestName||'';
  if(key==='price')return item.price||'';
  if(key==='realPrice')return discountReservationRealPriceText(item);
  if(key==='discount')return item.discount||'';
  if(key==='clockNumber')return discountReservationClockText(item);
  if(key==='quendooNumber')return item.quendooNumber||'';
  if(key==='comment')return item.comment||'';
  if(key==='contact')return discountReservationContactExportText(item);
  return '';
}
function buildDiscountReservationExportTable(){
  const headers=DISCOUNT_RESERVATION_EXPORT_COLUMNS_FIXED.map(column=>column.label);
  const exportItems=[...ensureDiscountReservations()].sort((a,b)=>{
    const an=Number(a.autoNumber)||0;
    const bn=Number(b.autoNumber)||0;
    if(an!==bn)return an-bn;
    return new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime();
  });
  const rows=exportItems.map((item,index)=>DISCOUNT_RESERVATION_EXPORT_COLUMNS_FIXED.map(column=>discountReservationFixedExportValue(item,column,index)));
  return {headers,rows};
}
function discountReservationExportFileName(ext){
  const d=new Date();
  const stamp=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  return `rezervacii-s-otstapki-${stamp}.${ext}`;
}
function discountReservationExportCellHTML(value){
  return escapeHtml(value).replace(/\r?\n/g,'<br>');
}
function discountReservationExportStyles(){
  return `<style>
    @page{size:A4 landscape;margin:8mm}
    body{font-family:Arial,"Segoe UI",sans-serif;color:#0f172a;margin:16px;background:#fff}
    h1{font-size:18px;margin:0 0 6px}
    .meta{font-size:11px;color:#64748b;margin-bottom:10px}
    table.discount-reservations-export-table{width:100%;border-collapse:collapse;table-layout:auto;font-size:9px}
    table.discount-reservations-export-table th,
    table.discount-reservations-export-table td{border:1px solid #cbd5e1;padding:4px 5px;vertical-align:top;line-height:1.25;word-break:break-word}
    table.discount-reservations-export-table th{background:#eff6ff;color:#1e3a8a;font-weight:900;text-align:left}
    table.discount-reservations-export-table td:nth-child(1),
    table.discount-reservations-export-table td:nth-child(7),
    table.discount-reservations-export-table td:nth-child(11){text-align:center}
    @media print{body{margin:0} table.discount-reservations-export-table{font-size:8px}}
  </style>`;
}
function discountReservationTableHTML(title){
  const table=buildDiscountReservationExportTable();
  const thead='<tr>'+table.headers.map(h=>`<th>${escapeHtml(h)}</th>`).join('')+'</tr>';
  const tbody=table.rows.length?table.rows.map(row=>'<tr>'+row.map(cell=>`<td>${discountReservationExportCellHTML(cell)}</td>`).join('')+'</tr>').join(''):`<tr><td colspan="${Math.max(1,table.headers.length)}">Няма добавени резервации.</td></tr>`;
  return `<table class="discount-reservations-export-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
}
function exportDiscountReservationsExcel(){
  const html=`<!doctype html><html><head><meta charset="utf-8">${discountReservationExportStyles()}</head><body>${discountReservationTableHTML('Резервации с отстъпки')}</body></html>`;
  const blob=new Blob(['\ufeff'+html],{type:'application/vnd.ms-excel;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=discountReservationExportFileName('xls');
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function exportDiscountReservationsPDF(){
  const html=`<!doctype html><html><head><meta charset="utf-8"><title>Резервации с отстъпки</title>${discountReservationExportStyles()}</head><body><h1>Резервации с отстъпки</h1><div class="meta">Експорт: ${(new Date()).toLocaleString('bg-BG')}</div>${discountReservationTableHTML('Резервации с отстъпки')}<script>window.onload=function(){setTimeout(function(){window.print();},150)};<\/script></body></html>`;
  const win=window.open('','_blank');
  if(win){win.document.open();win.document.write(html);win.document.close();return;}
  const blob=new Blob([html],{type:'text/html;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=discountReservationExportFileName('html');
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function exportData(){syncVisibleEditorsBeforeGoogleSave();const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='hotel-discount-history-backup.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)}
function importData(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const imported=normalizeState(JSON.parse(reader.result));if(!imported.weeks||!Array.isArray(imported.weeks)){alert('Файлът не изглежда като валиден архив.');return}if(!confirm('Импортът ще замени текущата история в този браузър. Продължаваме ли?'))return;state=imported;activeWeekId=state.activeWeekId||(state.weeks[0]&&state.weeks[0].id)||null;cleanupOldHistoryKeys();saveState({skipWorkFormSync:true});captureAcceptedStateSnapshot({skipEditorSync:true});render()}catch(err){console.error(err);alert('Неуспешен импорт. Ако файлът е голям, причината често е запълнена памет от стари версии. Опитай пак с тази версия, която чисти старите ключове автоматично.')}};reader.readAsText(file);e.target.value=''}
function escapeHtml(value){return String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
function escapeAttr(value){return escapeHtml(value).replace(/`/g,'&#096;')}


(function setupMobileSidebarMenu(){
  function init(){
    const btn=document.getElementById('mobileMenuBtn');
    const backdrop=document.getElementById('mobileSidebarBackdrop');
    const sidebar=document.querySelector('.sidebar');
    if(!btn||!backdrop||!sidebar)return;
    function openMenu(){document.body.classList.add('mobile-sidebar-open');btn.setAttribute('aria-expanded','true')}
    function closeMenu(){document.body.classList.remove('mobile-sidebar-open');btn.setAttribute('aria-expanded','false')}
    btn.setAttribute('aria-expanded','false');
    btn.addEventListener('click',()=>document.body.classList.contains('mobile-sidebar-open')?closeMenu():openMenu());
    backdrop.addEventListener('click',closeMenu);
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
    sidebar.addEventListener('click',e=>{
      if(window.matchMedia('(max-width:950px)').matches && e.target.closest('.week-item'))closeMenu();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


(function setupMobileAppShellV160(){
  const sectionTargetIds={
    hotels:'hotelsSection',contracts:'contractsSection',tasks:'tasksSection',roomTypes:'roomTypesSection',prices:'pricesSection',ultra:'ultraSection',discounts:'discountsSection',discountReservations:'discountReservationsSection',form:'workFormSection',email:'emailTableSection',emailTxt:'emailTxtSection',checklist:'checklistSection',cancellations:'cancellationsSection'
  };
  function isMobile(){return window.matchMedia&&window.matchMedia('(max-width:950px)').matches}
  function closeMobileSheets(){document.body.classList.remove('mobile-sidebar-open','mobile-more-open')}
  function setActiveNav(target){
    document.querySelectorAll('#mobileBottomNav button').forEach(btn=>btn.classList.toggle('active',btn.dataset.mobileTarget===target));
  }
  function openSectionMobile(section){
    if(section==='nights'){
      closeMobileSheets();
      try{setSectionOpen('hotels',true);hotelNightsOpen=true;renderHotels();}catch(err){console.warn(err);}
      setActiveNav('nights');
      window.setTimeout(()=>{const el=document.getElementById('hotelNightsSection')||document.getElementById('hotelsSection');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},80);
      return;
    }
    closeMobileSheets();
    if(!section||!isMobile())return;
    if(typeof setSectionOpen==='function'&&typeof sectionOpen==='object'){
      Object.keys(sectionOpen).forEach(key=>setSectionOpen(key,false));
      if(section==='email'){
        setSectionOpen('discounts',true);
        setSectionOpen('email',true);
      }else{
        setSectionOpen(section,true);
      }
    }
    setActiveNav(section);
    window.setTimeout(()=>{
      const targetId=sectionTargetIds[section]||sectionTargetIds.discounts;
      const el=document.getElementById(targetId)||document.getElementById(section+'Section');
      if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
    },80);
  }
  function init(){
    const nav=document.getElementById('mobileBottomNav');
    const more=document.getElementById('mobileMoreSheet');
    const backdrop=document.getElementById('mobileSidebarBackdrop');
    if(!nav)return;
    nav.addEventListener('click',e=>{
      const btn=e.target.closest('button[data-mobile-target]');
      if(!btn)return;
      const target=btn.dataset.mobileTarget;
      if(target==='weeks'){
        document.body.classList.remove('mobile-more-open');
        document.body.classList.toggle('mobile-sidebar-open');
        setActiveNav('weeks');
        return;
      }
      if(target==='more'){
        document.body.classList.remove('mobile-sidebar-open');
        document.body.classList.toggle('mobile-more-open');
        setActiveNav('more');
        return;
      }
      openSectionMobile(target);
    });
    if(more)more.addEventListener('click',e=>{
      const btn=e.target.closest('button[data-mobile-more]');
      if(!btn)return;
      openSectionMobile(btn.dataset.mobileMore);
    });
    if(backdrop)backdrop.addEventListener('click',closeMobileSheets);
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMobileSheets()});
    document.addEventListener('click',e=>{
      if(!isMobile())return;
      if(e.target.closest('#mobileBottomNav')||e.target.closest('#mobileMoreSheet')||e.target.closest('.sidebar'))return;
      if(document.body.classList.contains('mobile-more-open'))document.body.classList.remove('mobile-more-open');
    });
    setActiveNav('discounts');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
