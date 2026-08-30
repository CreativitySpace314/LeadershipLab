(()=>{
'use strict';
const scenarios={
 late:{title:"They're late.<br><em>AGAIN.</em>",name:'Taylor',setup:'Taylor is 25 minutes late to the team meeting again. You pull them aside.',bubble:"I know what you're thinking. Just hear me out, okay?",opening:"I know I'm late. I just... mornings have been rough lately.",coach:'Stay connected and address the issue.',known:'25 minutes late.',unknown:'Why.',caption:'There is tension, but not much information yet.',reply:{curious:"My mom has been having health problems. I've been helping her in the mornings and I didn't know how to bring it up.",balanced:"Yeah. I know it affects everyone. My mom's been sick and mornings have been hard. Can we figure something out?",clear:"I know. I'm not trying to make everyone pick up my slack.",defensive:"Okay. I said I know I'm late.",avoidant:"Thanks. I guess we can leave it there.",dismissive:"Wow. Okay. I guess there is not much point explaining then.",harsh:"Got it. I will be on time."}},
 feedback:{title:'They feel<br><em>UNHEARD.</em>',name:'Riley',setup:'Riley leaves a team meeting frustrated and comes straight to you.',bubble:'Why do I even speak up if everyone just moves on?',opening:'Honestly? Nobody listens to me around here.',coach:'Understand the experience before explaining the team.',known:'Riley is frustrated.',unknown:'What happened from their view.',caption:'The frustration is obvious. The full story is not.',reply:{curious:'Last week I raised the schedule issue twice, and both times everyone just moved on.',balanced:'Exactly. I want us to solve things, but I need to know my input actually lands somewhere.',clear:'I can give examples. I just do not want to have to prove I deserve to be heard.',defensive:'See? I say I do not feel heard and now I have to defend why.',avoidant:'Never mind. It is not worth it.',dismissive:'Okay. That kind of proves my point.',harsh:'Forget it. I will just keep it to myself next time.'}},
 mistake:{title:'You messed<br><em>THAT UP.</em>',name:'Sam',setup:'Yesterday you cut Sam off in front of the team. Today they are quiet and distant.',bubble:"It's fine. We can just move on.",opening:"It's fine. We can just move on.",coach:'Repair starts with ownership, not intent.',known:'You cut Sam off.',unknown:'What impact it had.',caption:'The quiet is giving you information, not the whole answer.',reply:{curious:'I was embarrassed. It felt like there was not room for me to disagree with you.',balanced:'I appreciate you saying that. I felt dismissed, and it really did bother me.',clear:'Okay. I needed you to know it did not feel respectful.',defensive:'I know you did not mean it that way. That does not change how it felt.',avoidant:'Sure. We can move on.',dismissive:'Right. So we are just going to pretend it was nothing.',harsh:'Okay. Message received.'}}
};
const rooms={armor:['🛡️ Armor Check','What do you reach for when leadership gets uncomfortable?','Certainty, fixing, control, humor, silence. Notice the move before you judge it.'],rumble:['🥊 The Rumble Room','Practice the conversation you keep rehearsing in your head.','Name what you observe, what matters, and what you are genuinely curious about.'],story:['🔎 The Story Check','Your brain makes meaning fast.','Separate what happened from the story you are telling yourself about it.'],values:['🧪 Values Lab','Pressure makes values visible.','Choose the behavior that lets people experience your value, not just hear the word.'],repair:['🧰 Repair Shop','You do not have to be perfect. You do have to come back.','Name it. Own the impact. Skip the defensive explanation. Ask what is needed now.']};
let current='late';
let scores={connection:72,clarity:65,courage:48};
let notebook=[];
try{const raw=localStorage.getItem('leadershipLabNotebookV3');notebook=raw?JSON.parse(raw):[]}catch(e){notebook=[]}
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const esc=v=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function clamp(n){return Math.max(5,Math.min(100,Math.round(n)))}
function setScores(){['connection','clarity','courage'].forEach(k=>{const n=clamp(scores[k]);$('#'+k+'Meter').style.width=n+'%';$('#'+k+'Score').textContent=n});updateMood()}
function updateMood(){const c=scores.connection;const stage=$('#sceneStage');if(c>=78){stage.dataset.mood='open';$('#bodyLanguageText').textContent='opening up';$('#sceneCaption').textContent='The room feels easier to stay in.'}else if(c<52){stage.dataset.mood='closed';$('#bodyLanguageText').textContent='closed off';$('#sceneCaption').textContent='The room just tightened.'}else{stage.dataset.mood='guarded';$('#bodyLanguageText').textContent='guarded'}}
function classify(text){
 const t=text.toLowerCase().trim();
 let type='neutral',d={connection:1,clarity:1,courage:1};
 const dismissive=/tough it out|suck it up|get over it|deal with it|everyone has problems|we all have problems|we all have a lot going on|that's life|thats life|not my problem|figure it out|stop making excuses|no excuses|just deal|quit complaining|move past it/.test(t);
 const harsh=/or else|final warning|write you up|disciplin|consequence|unacceptable|this better not|do better|just be on time|you need to fix this|i don't care|i dont care/.test(t);
 const blame=/you always|you never|why didn't you|why did you|your fault|but you/.test(t);
 const avoid=/don't worry|dont worry|no big deal|forget it|move on|it's fine|its fine|never mind/.test(t);
 const curious=/help me understand|tell me|what happened|what's going|what is going|walk me through|want to understand|what do you need|can i ask|what's behind|whats behind/.test(t)||(/\?$/.test(t)&&!/why didn't|why did you/.test(t));
 const connected=/sorry|i own|i realize|i hear you|that sounds|i appreciate|i can see|i want to understand|i should have/.test(t);
 const clear=/impact|need to|we need|expect|on time|responsib|important|agreement|going forward|next time|need you to/.test(t);
 if(dismissive){type='dismissive';d={connection:-20,clarity:2,courage:3};return{type,d}}
 if(harsh){type='harsh';d={connection:-16,clarity:10,courage:7};return{type,d}}
 if(blame){type='defensive';d={connection:-14,clarity:4,courage:1};return{type,d}}
 if(avoid){type='avoidant';d={connection:1,clarity:-10,courage:-9};return{type,d}}
 if(curious){type='curious';d={connection:11,clarity:4,courage:5}}
 if(connected){type=type==='curious'?'balanced':'connected';d.connection+=8;d.courage+=4}
 if(clear){type=(type==='curious'||type==='connected'||type==='balanced')?'balanced':'clear';d.clarity+=12;d.courage+=8}
 return{type,d}
}
function coachingFor(type,text){
 const t=text.trim();
 if(type==='dismissive')return `“${t.length>44?t.slice(0,41)+'…':t}” lands as dismissal. It asks the person to swallow the problem instead of giving you information about it. Try holding the expectation without shutting down the human.`;
 if(type==='harsh')return 'The expectation is clear, but the delivery leaves very little room for honesty. Accountability can be firm without making the conversation feel unsafe.';
 if(type==='defensive')return 'The response puts the focus back on what they did wrong. Notice whether you are gathering information or building a case.';
 if(type==='avoidant')return 'This lowers the discomfort quickly, but it also leaves the real issue untouched. Relief is not the same thing as repair.';
 if(type==='curious')return 'Curiosity opened the door. Stay with what you learn before jumping to the fix.';
 if(type==='connected')return 'You made room for the person. Now add enough clarity that the issue does not disappear.';
 if(type==='balanced')return 'You held two things at once: the person matters, and the impact still matters. That is the practice.';
 if(type==='clear')return 'You named the expectation. Now check whether your wording also leaves room for the other person to tell you something you do not know.';
 return 'This response does not strongly signal curiosity, accountability, or dismissal yet. What do you want the other person to feel safe enough to tell you next?';
}
function noticeFor(type){
 return {dismissive:'The message may be heard as: “your context does not matter.”',harsh:'Clarity went up, but connection took a hit.',defensive:'Certainty entered the room before curiosity did.',avoidant:'You reduced tension without resolving anything.',curious:'You created more room for information.',connected:'You signaled that the person matters.',balanced:'Connection and accountability stayed in the same conversation.',clear:'The expectation is visible. The relationship may need more room.',neutral:'Your words still shape what becomes easier or harder to say next.'}[type]||'Notice what changed in the room.';
}
function loadScenario(key){current=key;scores={connection:72,clarity:65,courage:48};const s=scenarios[key];$('#sceneTitle').innerHTML=s.title;$('#sceneSetup').textContent=s.setup;$('#characterBubble').textContent='“'+s.bubble+'”';$('#knownFact').textContent=s.known;$('#unknownFact').textContent=s.unknown;$('#replyInput').placeholder=`Type what you would actually say to ${s.name}...`;$('#coachText').textContent=s.coach;$('#chat').innerHTML=`<div class="chat-bubble them"><strong>${s.name}:</strong> ${esc(s.opening)}</div>`;$('#winText').textContent='You showed up. That is a rep.';$('#sceneCaption').textContent=s.caption;$('#bodyLanguageText').textContent='guarded';$('#sceneStage').dataset.mood='guarded';$$('.scenario-pill[data-scenario]').forEach(b=>b.classList.toggle('active',b.dataset.scenario===key));setScores()}
function respond(){const input=$('#replyInput');const text=input.value.trim();if(!text){input.focus();return}const {type,d}=classify(text);Object.keys(scores).forEach(k=>scores[k]+=d[k]);const s=scenarios[current];$('#chat').insertAdjacentHTML('beforeend',`<div class="chat-bubble you">${esc(text)}</div><div class="chat-bubble them typing-bubble" id="typingReply">${s.name} is responding…</div>`);input.value='';setScores();$('#characterBubble').textContent='“…”';$('#chat').scrollTop=$('#chat').scrollHeight;setTimeout(()=>{const reply=s.reply[type]||s.reply.curious;const typing=$('#typingReply');if(typing)typing.remove();$('#chat').insertAdjacentHTML('beforeend',`<div class="chat-bubble them"><strong>${s.name}:</strong> ${esc(reply)}</div>`);$('#characterBubble').textContent='“'+reply+'”';$('#chat').scrollTop=$('#chat').scrollHeight;$('#coachText').textContent=coachingFor(type,text);$('#winText').textContent=noticeFor(type)},550)}
function renderNotebook(){$('#notebookCount').textContent=notebook.length;$('#notebookEntries').innerHTML=notebook.length?notebook.map(n=>`<div class="notebook-entry"><strong>${esc(n.scenario)}</strong><p>${esc(n.note)}</p><small>${esc(n.date)}</small></div>`).join(''):'<p>No reps saved yet.</p>'}
function boot(){
 const say=$('#sayBtn');if(!say)return;
 say.addEventListener('click',respond);
 $('#replyInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();respond()}});
 $$('[data-fill]').forEach(b=>b.addEventListener('click',()=>{$('#replyInput').value=b.dataset.fill;$('#replyInput').focus()}));
 $$('.scenario-pill[data-scenario]').forEach(b=>b.addEventListener('click',()=>loadScenario(b.dataset.scenario)));
 $('#randomScenario').addEventListener('click',()=>{const keys=Object.keys(scenarios).filter(k=>k!==current);loadScenario(keys[Math.floor(Math.random()*keys.length)])});
 $$('[data-room]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.room==='arena'){window.scrollTo({top:0,behavior:'smooth'});return}const r=rooms[b.dataset.room];if(!r)return;$('#roomDialogContent').innerHTML=`<h2>${r[0]}</h2><p>${r[1]}</p><div class="coach-note"><p>${r[2]}</p></div>`;$('#roomDialog').showModal()}));
 $('#closeDialog').addEventListener('click',()=>$('#roomDialog').close());
 $('#saveInsight').addEventListener('click',()=>{notebook.unshift({scenario:scenarios[current].name+' scenario',note:$('#coachText').textContent,date:new Date().toLocaleDateString()});notebook=notebook.slice(0,20);try{localStorage.setItem('leadershipLabNotebookV3',JSON.stringify(notebook))}catch(e){}renderNotebook();$('#saveInsight').textContent='✓ SAVED';setTimeout(()=>$('#saveInsight').textContent='☆ SAVE THIS REP',1000)});
 $('#notebookBtn').addEventListener('click',()=>$('#notebookDialog').showModal());
 $('#closeNotebook').addEventListener('click',()=>$('#notebookDialog').close());
 renderNotebook();loadScenario('late');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();