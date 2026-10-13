const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);toggle.textContent=open?'Close':'Menu';});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){toggle.click();toggle.focus();}});nav.addEventListener('click',e=>{if(e.target.closest('a')&&toggle.getAttribute('aria-expanded')==='true')toggle.click();});}
const filters=document.querySelectorAll('[data-filter]');
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('[data-category]').forEach(card=>{const show=button.dataset.filter==='all'||card.dataset.category===button.dataset.filter;card.hidden=!show;if(show)count++;});document.querySelector('#filter-count').textContent=`${count} learning ${count===1?'area':'areas'}`;}));
const form=document.querySelector('#enquiry-form');
if(form){const wanted=new URLSearchParams(location.search).get('topic');const select=form.elements.topic;if(wanted&&[...select.options].some(o=>o.value===wanted))select.value=wanted;form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const subject='CyberDefend enquiry: '+data.get('topic');const body=`Hello CyberDefend,\n\nI am interested in ${data.get('topic')}.\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nOrganisation / college: ${data.get('organisation')||'Not specified'}\n\n${data.get('message')}\n\nThank you.`;const href=`mailto:support@cyberdefend.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;const fallback=document.querySelector('#email-fallback');fallback.href=href;fallback.hidden=false;document.querySelector('#form-status').textContent='Your email draft is ready. Review and send it in your email app. If nothing opens, use the link below or email support@cyberdefend.in directly. Your enquiry has not been sent by this website.';location.href=href;});}
// Preserve the intent of legacy certification/course enquiry links.
{
 const params=new URLSearchParams(location.search);
 const certification=params.get('certification');
 const programme=params.get('programme');
 const composer=document.querySelector('#enquiry-form');
 if(composer&&(certification||programme)){
  const value=(certification||programme).replace(/-/g,' ').slice(0,150);
  composer.elements.topic.value=certification?'Certification offer':'Professional training';
  if(!composer.elements.message.value)composer.elements.message.value=`I would like the current details for ${value}.`;
 }
 if(!composer&&certification){
  document.querySelectorAll('a[href*="topic=Certification"]').forEach(a=>{
   const u=new URL(a.getAttribute('href'),location.href);u.searchParams.set('certification',certification.slice(0,150));a.href=u.href;
  });
 }
}
