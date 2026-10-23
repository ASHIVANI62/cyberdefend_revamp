export function structuredData({key,page,defs,hosts,site}) {
 const [domain,route]=defs[key],url=hosts[domain]+'/'+route;
 const orgId=hosts.main+'/#organization';
 const webId=hosts[domain]+'/#website';
 const org={'@type':'Organization','@id':orgId,name:site.name,url:hosts.main+'/',email:site.email,logo:{'@type':'ImageObject',url:hosts.main+'/assets/cyberdefend-stacked-light.png'},sameAs:Object.values(site.socials).filter(u=>!u.includes('chat.whatsapp'))};
 const web={'@type':'WebSite','@id':webId,name:domain==='main'?'CyberDefend':`CyberDefend ${domain==='academy'?'Academy':'Services'}`,url:hosts[domain]+'/',publisher:{'@id':orgId},inLanguage:'en'};
 const crumbs=[{name:'CyberDefend',item:hosts.main+'/'}];
 if(domain!=='main')crumbs.push({name:domain==='academy'?'Academy':'Services',item:hosts[domain]+'/'});
 if(page.article)crumbs.push({name:'Insights',item:hosts.academy+'/blogs/'});
 if(route)crumbs.push({name:page.title,item:url});
 const breadcrumb={'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((x,i)=>({'@type':'ListItem',position:i+1,...x}))};
 const webpage={'@type':key==='contact'?'ContactPage':'WebPage','@id':url+'#webpage',url,name:page.title,description:page.description,isPartOf:{'@id':webId},about:{'@id':orgId},...(crumbs.length>1?{breadcrumb:{'@id':url+'#breadcrumb'}}:{}),inLanguage:'en'};
 const graph=[org,web,webpage,...(crumbs.length>1?[breadcrumb]:[])];
 if(['vapt','awareness','advisory'].includes(key))graph.push({'@type':'Service','@id':url+'#service',name:page.title,description:page.description,url,provider:{'@id':orgId},mainEntityOfPage:{'@id':url+'#webpage'}});
 if(key==='securityEngineering')graph.push({'@type':'Course','@id':url+'#course',name:'Advanced Security Engineering & AI Security',description:page.description,url,provider:{'@id':orgId},timeRequired:'PT40H',inLanguage:'en',educationalLevel:'Professional',coursePrerequisites:'Networking and operating-system fundamentals; cybersecurity awareness.'});
 if(page.article){
  webpage.mainEntity={'@id':url+'#article'};
  graph.push({'@type':'BlogPosting','@id':url+'#article',url,headline:page.title,description:page.description,datePublished:page.article.datePublished,dateModified:page.article.dateModified,author:{'@type':'Organization','@id':orgId,name:site.name,url:hosts.main+'/'},publisher:{'@id':orgId},mainEntityOfPage:{'@id':url+'#webpage'},articleSection:page.article.category,inLanguage:'en',citation:page.article.sources.map(source=>source.url)});
 }
 return {'@context':'https://schema.org','@graph':graph};
}
