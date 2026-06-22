(function(){
  'use strict';

  const STORAGE_KEY='algara_prices_preview_lite_v26_override';
  const BOOKING_MARKUP_KEY='algara_prices_preview_lite_v26_booking_markup_percent';
  const FORMULA_STORAGE_KEY='algara_prices_preview_lite_v26_formula_override';
  const STANDARD_ROOMS=['DBL','DBL Royal','DBL Side Sea','DBL Sea'];
  const MIN_2PLUS2_ROOMS=['AP Royal','AP Lux','Villa Royal','Beach House'];
  const SPECIAL_MULTIPLIERS={
    'Villa Royal':{'occ_3_0':2.8,'occ_4_0':3.6},
    'AP Lux':{'occ_3_0':2.8},
    'AP Royal':{'occ_2_3':2.75,'occ_3_0':2.8,'occ_3_1':3.05,'occ_3_2':3.3,'occ_4_0':3.6,'occ_4_1':3.85},
    'Beach House':{'occ_2_3':2.75,'occ_3_0':2.8,'occ_3_1':3.05,'occ_3_2':3.3,'occ_3_3':3.55,'occ_4_0':3.6,'occ_4_1':3.85,'occ_4_2':4.1,'occ_5_0':4.4,'occ_5_1':4.65,'occ_6_0':5.2}
  };
  const DEFAULT_FORMULA_RULES={
    standard:{extraAdultPercent:80,childPercent:25},
    specialBaseDivisor:2.5,
    specialMultipliers:SPECIAL_MULTIPLIERS
  };
  let settingsOpen=false;
  let settingsRoom='';

  function isAlgaraLiteDataset(data){
    return !!data&&data.app==='algara_prices_preview_lite';
  }
  function fallbackEscape(value){
    return String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
  function html(value){
    return typeof window.escapeHtml==='function'?window.escapeHtml(value):fallbackEscape(value);
  }
  function attr(value){
    return typeof window.escapeAttr==='function'?window.escapeAttr(value):fallbackEscape(value).replace(/`/g,'&#096;');
  }
  function clonePayload(payload){
    return payload?JSON.parse(JSON.stringify(payload)):null;
  }
  function mergeFormulaRules(input){
    const source=input&&typeof input==='object'?input:{};
    const merged=clonePayload(DEFAULT_FORMULA_RULES);
    merged.standard.extraAdultPercent=numberOrFallback(source.standard&&source.standard.extraAdultPercent,merged.standard.extraAdultPercent);
    merged.standard.childPercent=numberOrFallback(source.standard&&source.standard.childPercent,merged.standard.childPercent);
    merged.specialBaseDivisor=numberOrFallback(source.specialBaseDivisor,merged.specialBaseDivisor);
    Object.keys((source.specialMultipliers)||{}).forEach(room=>{
      if(!merged.specialMultipliers[room])merged.specialMultipliers[room]={};
      Object.keys(source.specialMultipliers[room]||{}).forEach(key=>{
        merged.specialMultipliers[room][key]=numberOrFallback(source.specialMultipliers[room][key],merged.specialMultipliers[room][key]||0);
      });
    });
    return merged;
  }
  function embeddedPayload(){
    return window.ALGARA_PRICES_PREVIEW_LITE_V26||null;
  }
  function readStoredPayload(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw)return null;
      const parsed=JSON.parse(raw);
      return isAlgaraLiteDataset(parsed)?parsed:null;
    }catch(err){
      return null;
    }
  }
  function getAlgaraLitePayload(){
    return readStoredPayload()||clonePayload(embeddedPayload())||{app:'algara_prices_preview_lite',rooms:[],prices:{}};
  }
  function getFormulaRules(){
    try{
      const raw=localStorage.getItem(FORMULA_STORAGE_KEY);
      return mergeFormulaRules(raw?JSON.parse(raw):null);
    }catch(err){
      return mergeFormulaRules(null);
    }
  }
  function saveFormulaRules(rules){
    try{localStorage.setItem(FORMULA_STORAGE_KEY,JSON.stringify(mergeFormulaRules(rules)));}catch(err){}
  }
  function resetFormulaRules(){
    try{localStorage.removeItem(FORMULA_STORAGE_KEY);}catch(err){}
    rerenderPrices();
  }
  function isBookingChannel(sub){
    const name=String((sub&&sub.name)||'').trim().toLowerCase();
    return name==='booking'||name==='booking.com'||name.includes('booking')||name.includes('букинг')||name.includes('expedia')||name.includes('експедия');
  }
  function readBookingMarkupPercent(){
    try{
      const raw=localStorage.getItem(BOOKING_MARKUP_KEY);
      const num=Number(String(raw||'').replace(',','.'));
      return Number.isFinite(num)?Math.max(0,num):0;
    }catch(err){
      return 0;
    }
  }
  function saveBookingMarkupPercent(value){
    const num=Number(String(value||'').replace(',','.'));
    const safe=Number.isFinite(num)?Math.max(0,num):0;
    try{localStorage.setItem(BOOKING_MARKUP_KEY,String(safe));}catch(err){}
  }
  function applyBookingMarkup(payload,percent){
    const copy=clonePayload(payload)||{app:'algara_prices_preview_lite',rooms:[],prices:{}};
    const factor=1+(Math.max(0,Number(percent)||0)/100);
    Object.keys(copy.prices||{}).forEach(room=>{
      Object.keys(copy.prices[room]||{}).forEach(row=>{
        Object.keys(copy.prices[room][row]||{}).forEach(date=>{
          const raw=copy.prices[room][row][date];
          if(String(raw||'').trim()==='')return;
          copy.prices[room][row][date]=inputPrice(roundMoney(numberFromPrice(raw)*factor));
        });
      });
    });
    copy.channelDerivedFrom='Direct';
    copy.bookingMarkupPercent=Number(percent)||0;
    return copy;
  }
  function getEffectivePayloadForChannel(payload,sub){
    return isBookingChannel(sub)?applyBookingMarkup(payload,readBookingMarkupPercent()):payload;
  }
  function saveAlgaraLitePayload(payload){
    if(!payload)return;
    try{
      payload.exportedAt=new Date().toISOString();
      localStorage.setItem(STORAGE_KEY,JSON.stringify(payload));
    }catch(err){
      console.warn('Algara LITE prices were not saved locally.',err);
    }
  }
  function resetAlgaraLitePayload(){
    try{localStorage.removeItem(STORAGE_KEY);}catch(err){}
    rerenderPrices();
  }
  function localParseISO(value){
    const parts=String(value||'').split('-').map(Number);
    return new Date(parts[0]||new Date().getFullYear(),(parts[1]||1)-1,parts[2]||1);
  }
  function localToISO(date){
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
  function localAddDays(date,days){
    const copy=new Date(date);
    copy.setDate(copy.getDate()+days);
    return copy;
  }
  function parseIso(value){
    return typeof window.parseISODate==='function'?window.parseISODate(value):localParseISO(value);
  }
  function toIso(date){
    return typeof window.toISODate==='function'?window.toISODate(date):localToISO(date);
  }
  function addDaysSafe(date,days){
    return typeof window.addDays==='function'?window.addDays(date,days):localAddDays(date,days);
  }
  function displayDate(iso){
    return typeof window.isoToDisplay==='function'?window.isoToDisplay(iso):String(iso||'');
  }
  function displayToIsoSafe(value){
    return typeof window.displayToISO==='function'?window.displayToISO(value):null;
  }
  function todayIso(){
    return toIso(new Date());
  }
  function dateList(start,end){
    if(typeof window.priceDateList==='function')return window.priceDateList(start,end);
    const dates=[];
    if(!start||!end||end<=start)return dates;
    let current=parseIso(start);
    const endDate=parseIso(end);
    while(current<endDate&&dates.length<90){
      dates.push(toIso(current));
      current=addDaysSafe(current,1);
    }
    return dates;
  }
  function allPayloadDates(payload){
    const start=payload&&payload.period&&payload.period.start;
    const end=payload&&payload.period&&payload.period.end;
    const dateSet=new Set();
    if(start&&end){
      let current=parseIso(start);
      const endDate=parseIso(end);
      while(current<=endDate&&dateSet.size<260){
        dateSet.add(toIso(current));
        current=addDaysSafe(current,1);
      }
    }
    Object.values((payload&&payload.prices)||{}).forEach(roomRows=>{
      Object.values(roomRows||{}).forEach(rowPrices=>{
        Object.keys(rowPrices||{}).forEach(date=>{
          if(/^\d{4}-\d{2}-\d{2}$/.test(date))dateSet.add(date);
        });
      });
    });
    if(!dateSet.size)return [];
    return Array.from(dateSet).sort();
  }
  function money(value){
    if(typeof window.formatPriceEuro==='function')return window.formatPriceEuro(value);
    return (Number(value)||0).toFixed(2).replace('.',',')+' €';
  }
  function discountText(value){
    if(typeof window.formatDiscountPercent==='function')return window.formatDiscountPercent(value);
    const rounded=Math.round((Number(value)||0)*100)/100;
    return `${String(rounded).replace('.',',')}%`;
  }
  function roundMoney(value){
    return Math.round((Number(value)||0)*100)/100;
  }
  function numberFromPrice(value){
    if(value===undefined||value===null)return 0;
    const normalized=String(value).replace(/\s/g,'').replace(',','.');
    const num=Number(normalized);
    return Number.isFinite(num)?num:0;
  }
  function numberOrFallback(value,fallback){
    const num=Number(String(value===undefined||value===null?'':value).replace(',','.'));
    return Number.isFinite(num)?num:fallback;
  }
  function inputPrice(value){
    const raw=String(value||'').trim().replace(/\s/g,'').replace(',','.');
    if(!raw)return '';
    const num=Number(raw);
    return Number.isFinite(num)?num.toFixed(2).replace('.',','):'';
  }
  function getRoomPrices(payload,room){
    if(!payload.prices)payload.prices={};
    if(!payload.prices[room])payload.prices[room]={};
    return payload.prices[room];
  }
  function getPriceValue(payload,room,row,date){
    return payload&&payload.prices&&payload.prices[room]&&payload.prices[room][row]
      ? payload.prices[room][row][date]
      : '';
  }
  function setPriceValue(room,row,date,value){
    const payload=getAlgaraLitePayload();
    const prices=getRoomPrices(payload,room);
    if(!prices[row])prices[row]={};
    prices[row][date]=inputPrice(value);
    saveAlgaraLitePayload(payload);
  }
  function roomRows(room){
    return STANDARD_ROOMS.includes(room)?['adult1','adult2']:['adult2'];
  }
  function rowLabel(room,row){
    if(row==='adult1')return '1 възрастен';
    return MIN_2PLUS2_ROOMS.includes(room)?'2+2 минимално заплащане':'2 възрастни';
  }
  function calcOccupancy(pc){
    if(typeof window.getPricePaidOccupancy==='function')return window.getPricePaidOccupancy(pc);
    const totalChildren=Math.max(0,Number(pc&&pc.children)||0);
    const ages=Array.isArray(pc&&pc.childAges)?pc.childAges.slice(0,totalChildren):[];
    let freeChildren=0,paidChildren=0,childrenAsAdults=0;
    for(let i=0;i<totalChildren;i++){
      const age=Number(ages[i]===undefined?2:ages[i]);
      if(age<=1)freeChildren++;
      else if(age<=11)paidChildren++;
      else childrenAsAdults++;
    }
    const baseAdults=Math.max(0,Number(pc&&pc.adults)||0);
    return {baseAdults,totalChildren,childAges:ages,freeChildren,paidChildren,childrenAsAdults,effectiveAdults:baseAdults+childrenAsAdults,effectiveChildren:paidChildren};
  }
  function occupancySummary(occupancy){
    if(typeof window.renderPriceOccupancySummaryText==='function')return window.renderPriceOccupancySummaryText(occupancy);
    const parts=[`Смята се като ${occupancy.effectiveAdults}+${occupancy.effectiveChildren}`];
    if(occupancy.freeChildren)parts.push(`${occupancy.freeChildren} дете/деца безплатно (0-1 г.)`);
    if(occupancy.childrenAsAdults)parts.push(`${occupancy.childrenAsAdults} дете/деца като възрастни (12+ г.)`);
    return parts.join(' · ');
  }
  function childAgeControls(pc){
    if(typeof window.renderPriceChildAgeControls==='function')return window.renderPriceChildAgeControls(pc);
    return '';
  }
  function discountSourceNotice(discountSource){
    if(typeof window.renderPriceDiscountSourceNotice==='function')return window.renderPriceDiscountSourceNotice(discountSource);
    if(!discountSource)return '';
    return `<div class="${discountSource.usedFallback?'price-warning':'price-discount-source'}">${html(discountSource.message||'')}</div>`;
  }
  function discountForDate(iso,sub){
    if(typeof window.findDiscountPercentForDate==='function')return window.findDiscountPercentForDate(iso,sub);
    const periods=(sub&&Array.isArray(sub.periods))?sub.periods:[];
    const match=periods.find(period=>iso>=period.fromDate&&iso<=period.toDate);
    const percent=match?Number(String(match.discount||'').replace(',','.')):0;
    return Number.isFinite(percent)?Math.max(0,percent):0;
  }
  function getDiscountSource(pc,week,hotel,sub,payload){
    if(typeof window.getPriceDiscountSource==='function')return window.getPriceDiscountSource(pc.reservationDate,week,hotel,sub,payload);
    return {reservationDate:pc.reservationDate,week,hotel,sub,found:false,usedFallback:false,message:''};
  }
  function updateCalculatorField(field,value){
    if(typeof window.updatePriceCalculatorField==='function')return window.updatePriceCalculatorField(field,value);
  }
  function updateChildAge(index,value){
    if(typeof window.updatePriceChildAge==='function')return window.updatePriceChildAge(index,value);
  }
  function rerenderPrices(){
    if(typeof window.renderPrices==='function')window.renderPrices();
  }
  function calculateAlgaraLiteDay(payload,room,adults,children,date){
    const formulas=getFormulaRules();
    const extraAdultRate=(numberOrFallback(formulas.standard&&formulas.standard.extraAdultPercent,80)||0)/100;
    const childRate=(numberOrFallback(formulas.standard&&formulas.standard.childPercent,25)||0)/100;
    const specialBaseDivisor=numberOrFallback(formulas.specialBaseDivisor,2.5)||2.5;
    const adult2=numberFromPrice(getPriceValue(payload,room,'adult2',date));
    const adult1=numberFromPrice(getPriceValue(payload,room,'adult1',date));
    if(STANDARD_ROOMS.includes(room)){
      if(adults<=1){
        if(!adult1)return {has:false,reason:`Няма цена за ${room}, 1 възрастен, ${displayDate(date)}.`};
        let total=adult1;
        if(children>0&&adult2)total+=children*(adult2/2)*childRate;
        return {has:true,base:roundMoney(total),label:`${adults}+${children}`};
      }
      if(!adult2)return {has:false,reason:`Няма цена за ${room}, 2 възрастни, ${displayDate(date)}.`};
      let total=adult2;
      const extraAdults=Math.min(Math.max(adults-2,0),2);
      if(extraAdults>0)total+=extraAdults*(adult2/2)*extraAdultRate;
      if(children>0)total+=children*(adult2/2)*childRate;
      return {has:true,base:roundMoney(total),label:`${adults}+${children}`};
    }
    if(!adult2)return {has:false,reason:`Няма базова цена за ${room}, ${displayDate(date)}.`};
    if(adults<=2&&children<=2){
      return {has:true,base:roundMoney(adult2),label:'2+2 минимално заплащане'};
    }
    const key=`occ_${adults}_${children}`;
    const multiplier=formulas.specialMultipliers&&formulas.specialMultipliers[room]&&formulas.specialMultipliers[room][key];
    if(!multiplier)return {has:false,reason:`Не е намерено правило за ${room} при ${adults}+${children}.`};
    return {has:true,base:roundMoney((adult2/specialBaseDivisor)*multiplier),label:`${adults}+${children} · коеф. ${String(multiplier).replace('.',',')}`};
  }
  function calculateAlgaraLiteStayPrice(pc,sub,payload){
    const rooms=(payload&&payload.rooms)||[];
    const selectedName=rooms.includes(pc.selectedRoom)?pc.selectedRoom:(rooms[0]||'');
    const nights=dateList(pc.checkIn,pc.checkOut);
    const occupancy=calcOccupancy(pc);
    const adults=Math.max(0,Number(occupancy.effectiveAdults)||0);
    const children=Math.max(0,Number(occupancy.effectiveChildren)||0);
    const nightRows=[];
    const missing=[];
    const warnings=[];
    let baseTotal=0;
    let discountTotal=0;

    if(!selectedName)return {error:'Няма избран тип стая.',room:{original:'',display:''},occupancy,nights:nights.length,missing,nightRows};
    if(!nights.length)return {error:'Избери валиден период на престой.',room:{original:selectedName,display:selectedName},occupancy,nights:0,missing,nightRows};

    nights.forEach(iso=>{
      const day=calculateAlgaraLiteDay(payload,selectedName,adults,children,iso);
      if(!day.has){
        missing.push(iso);
        if(day.reason&&!warnings.includes(day.reason))warnings.push(day.reason);
        return;
      }
      const discount=discountForDate(iso,sub);
      const discountAmount=roundMoney(day.base*discount/100);
      const final=roundMoney(day.base-discountAmount);
      baseTotal=roundMoney(baseTotal+day.base);
      discountTotal=roundMoney(discountTotal+discountAmount);
      nightRows.push({date:iso,period:day.label,base:day.base,discount,discountAmount,final,displayConfig:day.label});
    });

    if(!nightRows.length){
      return {error:warnings[0]||'Няма цена за избрания престой.',room:{original:selectedName,display:selectedName},occupancy,nights:nights.length,missing,warnings,nightRows};
    }

    return {
      room:{original:selectedName,display:selectedName},
      config:nightRows.length?'по нощувки':'',
      configLabels:Array.from(new Set(nightRows.map(row=>row.displayConfig).filter(Boolean))),
      formulaNotes:[],
      nights:nights.length,
      calculatedNights:nightRows.length,
      baseTotal,
      discountTotal,
      finalTotal:roundMoney(baseTotal-discountTotal),
      occupancy,
      missing,
      warnings,
      nightRows
    };
  }
  function averageDiscount(calculation){
    const base=Number(calculation&&calculation.baseTotal)||0;
    const discount=Number(calculation&&calculation.discountTotal)||0;
    return base>0?discount/base*100:0;
  }
  function buildAlgaraLiteDiscountSegments(nightRows){
    const rows=nightRows||[];
    const segments=[];
    rows.forEach(row=>{
      const percent=Number(row.discount)||0;
      const last=segments[segments.length-1];
      if(last&&Math.abs(last.discount-percent)<0.001){
        last.end=row.date;
        last.nights+=1;
        last.base=roundMoney(last.base+row.base);
        last.discountAmount=roundMoney(last.discountAmount+row.discountAmount);
        last.final=roundMoney(last.final+row.final);
      }else{
        segments.push({start:row.date,end:row.date,discount:percent,nights:1,base:row.base,discountAmount:row.discountAmount,final:row.final});
      }
    });
    return segments;
  }
  function renderAlgaraLiteDiscountDetails(calculation){
    const segments=buildAlgaraLiteDiscountSegments(calculation&&calculation.nightRows);
    if(!segments.length)return '';
    const rows=segments.map(segment=>{
      const range=segment.start===segment.end?displayDate(segment.start):`${displayDate(segment.start)} - ${displayDate(segment.end)}`;
      const discountLabel=segment.discount>0?discountText(segment.discount):'Без отстъпка';
      const amount=segment.discount>0?`-${money(segment.discountAmount)}`:money(segment.final);
      return `<div class="price-discount-detail-row">
        <div class="price-discount-date">
          <span class="price-discount-date-main">${html(range)}</span>
          <span class="price-discount-date-sub">${segment.nights} ${segment.nights===1?'нощувка':'нощувки'} · ${html(discountLabel)} · база ${html(money(segment.base))}</span>
        </div>
        <strong>${html(amount)}</strong>
      </div>`;
    }).join('');
    const average=calculation.discountTotal>0
      ? `<div class="price-discount-detail-average">Средна отстъпка: <strong>${html(discountText(averageDiscount(calculation)))}</strong></div>`
      : '';
    return `<div class="price-discount-detail"><div class="price-discount-detail-title">Разбивка по нощувки и отстъпки</div>${rows}${average}</div>`;
  }
  function occupancyKeyLabel(key){
    const parts=String(key||'').replace(/^occ_/,'').split('_');
    return `${parts[0]||0}+${parts[1]||0}`;
  }
  function renderFormulaSettingsPanel(){
    const formulas=getFormulaRules();
    const standardRows=[
      {label:'3-ти и 4-ти възрастен в DBL стаи',field:'standard.extraAdultPercent',value:formulas.standard.extraAdultPercent,suffix:'% от 1 легло'},
      {label:'Дете 2-11 г. в DBL стаи',field:'standard.childPercent',value:formulas.standard.childPercent,suffix:'% от 1 легло'},
      {label:'Делител за AP/Villa/Beach House',field:'specialBaseDivisor',value:formulas.specialBaseDivisor,suffix:'база = цена / делител'}
    ].map(row=>`<div class="algara-lite-formula-row">
        <span>${html(row.label)}</span>
        <input type="number" step="0.01" value="${attr(row.value)}" data-algara-lite-formula-field="${attr(row.field)}" />
        <small>${html(row.suffix)}</small>
      </div>`).join('');
    const specialRows=Object.keys(formulas.specialMultipliers||{}).map(room=>{
      const rows=Object.keys(formulas.specialMultipliers[room]||{}).sort().map(key=>`<div class="algara-lite-formula-row">
          <span>${html(room)} · ${html(occupancyKeyLabel(key))}</span>
          <input type="number" step="0.01" value="${attr(formulas.specialMultipliers[room][key])}" data-algara-lite-special-room="${attr(room)}" data-algara-lite-special-key="${attr(key)}" />
          <small>коефициент</small>
        </div>`).join('');
      return `<section class="algara-lite-formula-room"><div class="algara-lite-room-settings-title">${html(room)}</div>${rows}</section>`;
    }).join('');
    return `<div class="algara-lite-formula-settings">
      <div class="algara-lite-formula-header">
        <div>
          <strong>Формули за смятане</strong>
          <span>Тук са правилата за 3 възрастни, деца и големите стаи.</span>
        </div>
        <button id="resetAlgaraLiteFormulasBtn" class="small danger" type="button">Върни формулите</button>
      </div>
      <div class="algara-lite-formula-grid">${standardRows}</div>
      <div class="algara-lite-formula-special">${specialRows}</div>
    </div>`;
  }
  function renderSettingsPanel(payload,pc,sub){
    const rooms=(payload&&payload.rooms)||[];
    const bookingMode=isBookingChannel(sub);
    const bookingMarkup=readBookingMarkupPercent();
    if(!settingsOpen)return '';
    const dates=allPayloadDates(payload);
    const header=dates.map(date=>`<th>${html(displayDate(date))}</th>`).join('');
    const roomTables=rooms.map(room=>{
      const rows=roomRows(room).map(row=>{
        const cells=dates.map(date=>{
          const editAttrs=bookingMode
            ? 'disabled title="Booking цената се получава автоматично от Direct + процент."'
            : `data-algara-lite-price-room="${attr(room)}" data-algara-lite-price-row="${attr(row)}" data-algara-lite-price-date="${attr(date)}"`;
          return `<td><input class="algara-lite-price-input" type="text" inputmode="decimal" value="${attr(getPriceValue(payload,room,row,date))}" ${editAttrs} /></td>`;
        }).join('');
        return `<tr><th>${html(rowLabel(room,row))}</th>${cells}</tr>`;
      }).join('');
      return `<section class="algara-lite-room-settings-block">
        <div class="algara-lite-room-settings-title">${html(room)}</div>
        <div class="algara-lite-table-wrap">
          <table class="algara-lite-price-table"><thead><tr><th>Ред</th>${header}</tr></thead><tbody>${rows}</tbody></table>
        </div>
      </section>`;
    }).join('') || '<div class="price-warning">Няма въведени стаи в ценовия JSON.</div>';
    const bookingControl=bookingMode
      ? `<label>Booking увеличение %<input id="algaraLiteBookingMarkupPercent" type="number" min="0" step="0.01" value="${attr(bookingMarkup)}" /></label>`
      : '';
    const derivedNote=bookingMode
      ? `<div class="algara-lite-derived-note">Booking цените се попълват автоматично от Direct цените с увеличение ${html(discountText(bookingMarkup))}. Полетата в таблицата тук са само за преглед.</div>`
      : '';
    return `<div class="algara-lite-settings-panel no-print">
        <div class="algara-lite-settings-note">Ценовите таблици работят на заден план. Коригирай само ако има грешна цена.</div>
        <div class="algara-lite-settings-controls algara-lite-settings-controls-all">
          ${bookingControl}
          <button id="resetAlgaraLitePricesBtn" class="small danger" type="button">Върни вградените цени</button>
        </div>
        ${derivedNote}
        ${renderFormulaSettingsPanel()}
        <div class="algara-lite-all-room-tables">${roomTables}</div>
      </div>`;
  }
  function renderResult(calculation,discountSource,sourceWeek){
    if(calculation.error){
      const missing=calculation.missing&&calculation.missing.length
        ? `<div class="price-mini-muted">Липсващи дати: ${html(calculation.missing.map(displayDate).join(', '))}</div>`
        : '';
      return `<div class="price-warning">${html(calculation.error)}${missing}</div>`;
    }
    const hasDiscount=calculation.discountTotal>0;
    const missing=calculation.missing&&calculation.missing.length
      ? `<div class="price-warning">За следните дати няма намерена цена: ${html(calculation.missing.map(displayDate).join(', '))}</div>`
      : '';
    const warnings=calculation.warnings&&calculation.warnings.length
      ? `<div class="price-mini-muted">${calculation.warnings.map(note=>html(note)).join('<br>')}</div>`
      : '';
    const validUntil=sourceWeek&&sourceWeek.endDate?displayDate(sourceWeek.endDate):'';
    const validUntilHtml=validUntil?`<div class="price-valid-until">Отстъпките са според седмица до ${html(validUntil)}</div>`:'';
    const oldPrice=hasDiscount?`<div class="algara-lite-old-price"><span>Реална цена</span><del>${html(money(calculation.baseTotal))}</del></div>`:'';
    const average=hasDiscount?`<div class="algara-lite-average">Средна отстъпка: <strong>${html(discountText(averageDiscount(calculation)))}</strong></div>`:'';
    const discountLine=hasDiscount
      ? `<div class="price-breakdown-row"><span>Отстъпка от канала</span><strong>-${html(money(calculation.discountTotal))}</strong></div>`
      : `<div class="price-breakdown-row"><span>Отстъпка от канала</span><strong>няма приложена</strong></div>`;
    return `<div class="price-result-box algara-lite-result">
      <div class="muted">Тотал за ${calculation.nights} ${calculation.nights===1?'нощувка':'нощувки'} · ${html(calculation.room.display)} · ${html(calculation.configLabels.join(', ')||calculation.config)}</div>
      <div class="price-occupancy-summary">${html(occupancySummary(calculation.occupancy))}</div>
      ${warnings}
      <div class="algara-lite-price-pair">
        ${oldPrice}
        <div class="algara-lite-final-price"><span>${hasDiscount?'Нова цена':'Цена'}</span><strong>${html(money(calculation.finalTotal))}</strong></div>
        ${average}
      </div>
      ${validUntilHtml}
      <div class="price-breakdown">
        <div class="price-breakdown-row"><span>Базова цена</span><strong>${html(money(calculation.baseTotal))}</strong></div>
        ${discountLine}
        <div class="price-breakdown-row"><span>Крайна цена</span><strong>${html(money(calculation.finalTotal))}</strong></div>
      </div>
      <div class="price-applied-discounts">${hasDiscount?'Отстъпките се избират според датата на резервация и се прилагат по нощувки.':'За избрания престой няма съвпадение с периодите за отстъпка в седмицата на резервацията.'}</div>
      ${renderAlgaraLiteDiscountDetails(calculation)}
    </div>${missing}`;
  }
  function setFormulaField(field,value){
    const rules=getFormulaRules();
    const num=numberOrFallback(value,0);
    if(field==='standard.extraAdultPercent')rules.standard.extraAdultPercent=num;
    if(field==='standard.childPercent')rules.standard.childPercent=num;
    if(field==='specialBaseDivisor')rules.specialBaseDivisor=num>0?num:2.5;
    saveFormulaRules(rules);
  }
  function setSpecialMultiplier(room,key,value){
    const rules=getFormulaRules();
    if(!rules.specialMultipliers[room])rules.specialMultipliers[room]={};
    rules.specialMultipliers[room][key]=numberOrFallback(value,rules.specialMultipliers[room][key]||0);
    saveFormulaRules(rules);
  }
  function setupSettingsControls(container){
    const toggle=container.querySelector('#toggleAlgaraLiteSettingsBtn');
    const room=container.querySelector('#algaraLiteSettingsRoom');
    const reset=container.querySelector('#resetAlgaraLitePricesBtn');
    const resetFormulas=container.querySelector('#resetAlgaraLiteFormulasBtn');
    const bookingMarkup=container.querySelector('#algaraLiteBookingMarkupPercent');
    if(toggle)toggle.addEventListener('click',()=>{settingsOpen=!settingsOpen;rerenderPrices();});
    if(room)room.addEventListener('change',()=>{settingsRoom=room.value;rerenderPrices();});
    if(reset)reset.addEventListener('click',resetAlgaraLitePayload);
    if(resetFormulas)resetFormulas.addEventListener('click',resetFormulaRules);
    if(bookingMarkup)bookingMarkup.addEventListener('change',()=>{saveBookingMarkupPercent(bookingMarkup.value);rerenderPrices();});
    container.querySelectorAll('[data-algara-lite-formula-field]').forEach(input=>{
      input.addEventListener('change',()=>{
        setFormulaField(input.dataset.algaraLiteFormulaField,input.value);
        rerenderPrices();
      });
    });
    container.querySelectorAll('[data-algara-lite-special-room]').forEach(input=>{
      input.addEventListener('change',()=>{
        setSpecialMultiplier(input.dataset.algaraLiteSpecialRoom,input.dataset.algaraLiteSpecialKey,input.value);
        rerenderPrices();
      });
    });
    container.querySelectorAll('[data-algara-lite-price-date]').forEach(input=>{
      input.addEventListener('change',()=>{
        setPriceValue(input.dataset.algaraLitePriceRoom,input.dataset.algaraLitePriceRow,input.dataset.algaraLitePriceDate,input.value);
        rerenderPrices();
      });
    });
  }
  function setupCalculatorControls(container){
    const reservationDate=container.querySelector('#priceReservationDate');
    const stayRange=container.querySelector('#priceStayRange');
    const adults=container.querySelector('#priceAdults');
    const children=container.querySelector('#priceChildren');
    if(stayRange)stayRange.addEventListener('rangechange',event=>{
      const detail=event.detail||{};
      if(!detail.from||!detail.to)return;
      const weekNow=typeof window.getActiveWeek==='function'?window.getActiveWeek():null;
      if(!weekNow)return;
      const pcNow=typeof window.getPriceCalculatorState==='function'?window.getPriceCalculatorState(weekNow):weekNow.priceCalculator;
      pcNow.checkIn=detail.from;
      pcNow.checkOut=detail.to<=detail.from?toIso(addDaysSafe(parseIso(detail.from),1)):detail.to;
      if(typeof window.touchWeek==='function')window.touchWeek(weekNow);
      rerenderPrices();
    });
    if(reservationDate)reservationDate.addEventListener('change',()=>updateCalculatorField('reservationDate',reservationDate.dataset.dateIso||displayToIsoSafe(reservationDate.value)||todayIso()));
    if(adults)adults.addEventListener('change',()=>updateCalculatorField('adults',adults.value));
    if(children)children.addEventListener('change',()=>updateCalculatorField('children',children.value));
    container.querySelectorAll('[data-price-child-age]').forEach(select=>{
      select.addEventListener('change',()=>updateChildAge(Number(select.dataset.priceChildAge),select.value));
    });
    container.querySelectorAll('[data-price-room]').forEach(btn=>{
      btn.addEventListener('click',()=>updateCalculatorField('selectedRoom',btn.dataset.priceRoom));
    });
    setupSettingsControls(container);
  }
  function renderAlgaraLitePriceContent(week,hotel,sub,container,data){
    const directPayload=getAlgaraLitePayload();
    const bookingMode=isBookingChannel(sub);
    const payload=getEffectivePayloadForChannel(directPayload,sub);
    const pc=typeof window.getPriceCalculatorState==='function'?window.getPriceCalculatorState(week):(week&&week.priceCalculator);
    if(!pc||!container)return;
    const rooms=(payload&&payload.rooms)||[];
    if((!pc.selectedRoom||!rooms.includes(pc.selectedRoom))&&rooms[0])pc.selectedRoom=rooms[0];
    const selectedNights=dateList(pc.checkIn,pc.checkOut).length;
    const discountSource=getDiscountSource(pc,week,hotel,sub,payload||data);
    const calculation=calculateAlgaraLiteStayPrice(pc,(discountSource&&discountSource.sub)||sub||{},payload);
    calculation.discountSource=discountSource;
    const roomButtons=rooms.map(room=>`<button class="price-room-button ${room===pc.selectedRoom?'active':''}" type="button" data-price-room="${attr(room)}">${html(room)}</button>`).join('');
    const resultHtml=renderResult(calculation,discountSource,discountSource&&discountSource.week);
    const bookingMarkup=readBookingMarkupPercent();
    const sourceChip=bookingMode?`Booking +${discountText(bookingMarkup)}`:'Algara v26 LITE';
    const sourceNote=bookingMode
      ? `Booking цените се копират автоматично от Direct цените и се увеличават с ${discountText(bookingMarkup)}.`
      : 'Цените са от вградения Algara Beach v26 LITE JSON. Таблиците са скрити и се използват само за преизчисляване.';
    container.innerHTML=`
      <div class="prices-context">
        <span class="price-chip">Хотел: ${html((hotel&&hotel.name)||'Алгара Бийч')}</span>
        <span class="price-chip">Канал: ${html((sub&&sub.name)||'Direct')}</span>
        <span class="price-chip">${html(sourceChip)}</span>
      </div>
      <div class="prices-layout algara-lite-layout">
        <div class="price-card algara-lite-calculator-card">
          <div class="algara-lite-calculator-topbar">
            <h4>Калкулатор</h4>
            <button id="toggleAlgaraLiteSettingsBtn" class="small" type="button">${settingsOpen?'Скрий настройките':'Настройки'}</button>
          </div>
          <div class="price-controls-grid">
            <div class="full"><label for="priceReservationDate">Дата на резервация</label><input id="priceReservationDate" type="text" inputmode="numeric" data-calendar="true" readonly data-date-iso="${attr(pc.reservationDate)}" value="${attr(displayDate(pc.reservationDate))}" /></div>
            <div class="full price-stay-row"><div><label for="priceStayRange">Начало и край на престоя</label><input id="priceStayRange" class="price-stay-range-input" type="text" inputmode="numeric" data-date-range="true" readonly data-from="${attr(pc.checkIn)}" data-to="${attr(pc.checkOut)}" value="${attr(displayDate(pc.checkIn)+' - '+displayDate(pc.checkOut))}" /></div><div class="price-nights-pill"><span>Нощувки</span><strong>${selectedNights}</strong></div></div>
            <div class="price-occupancy-row">
              <div class="price-occupancy-field"><label for="priceAdults">Възрастни</label><select id="priceAdults">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${String(n)===String(pc.adults)?'selected':''}>${n}</option>`).join('')}</select></div>
              <div class="price-occupancy-field"><label for="priceChildren">Деца</label><select id="priceChildren">${[0,1,2,3,4,5,6].map(n=>`<option value="${n}" ${String(n)===String(pc.children)?'selected':''}>${n}</option>`).join('')}</select></div>
            </div>
            ${childAgeControls(pc)}
            <div class="full price-room-section"><label>Тип стая</label><div class="price-room-buttons">${roomButtons}</div></div>
          </div>
          <div class="price-mini-muted">${html(sourceNote)}</div>
          ${discountSourceNotice(discountSource)}
          <div class="price-discount-source">Отстъпките се взимат от раздел „Отстъпки по хотели“ според датата на резервация. Ако престоят минава през няколко периода, всяка нощувка се смята със своята отстъпка.</div>
          ${resultHtml}
          <div class="algara-lite-settings-host">${renderSettingsPanel(payload,pc,sub)}</div>
        </div>
      </div>`;
    setupCalculatorControls(container);
  }

  window.isAlgaraLiteDataset=isAlgaraLiteDataset;
  window.renderAlgaraLitePriceContent=renderAlgaraLitePriceContent;
  window.getAlgaraLitePayload=getAlgaraLitePayload;
})();
