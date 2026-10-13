// Run setup() once, then deploy as a Web app: execute as yourself, access Anyone.
// Store CONTACT_SHARED_SECRET and SPREADSHEET_ID in Script Properties.
// The public endpoint accepts writes only with the server-side shared secret.
function setup() {
  var props=PropertiesService.getScriptProperties();
  var id=props.getProperty('SPREADSHEET_ID');
  var book=id?SpreadsheetApp.openById(id):SpreadsheetApp.create('CyberDefend — Website enquiries');
  props.setProperty('SPREADSHEET_ID',book.getId());
  var sheet=book.getSheetByName('Enquiries')||book.getSheets()[0];
  sheet.setName('Enquiries');
  if(sheet.getLastRow()===0){
    sheet.appendRow(['Received at','Request ID','Name','Email','Phone','Organisation / college','Interest','Message','Status']);
    sheet.getRange(1,1,1,9).setBackground('#122e3b').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1);sheet.setColumnWidths(1,9,180);sheet.setColumnWidth(8,420);
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  }
  return book.getUrl();
}
function doGet(){return output_({ok:false,message:'Submit enquiries through the CyberDefend website.'});}
function doPost(e){
  var lock=LockService.getScriptLock();
  try{
    var raw=e&&e.postData&&e.postData.contents;
    if(!raw||raw.length>14000)return output_({ok:false});
    var data=JSON.parse(raw),props=PropertiesService.getScriptProperties();
    var secret=props.getProperty('CONTACT_SHARED_SECRET');
    if(!secret||data.secret!==secret)return output_({ok:false});
    var limits={name:100,email:200,phone:30,organisation:150,topic:100,message:2500,requestId:80};
    for(var key in limits){if(typeof data[key]!=='string'||data[key].length>limits[key])return output_({ok:false});data[key]=data[key].trim();}
    if(data.website||!data.name||!data.topic||!data.message||!/^\S+@\S+\.\S+$/.test(data.email)||!/^[-\w]{16,80}$/.test(data.requestId))return output_({ok:false});
    lock.waitLock(10000);
    var sheet=SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID')).getSheetByName('Enquiries');
    // Stable request IDs make a retry after a timeout safe.
    var count=sheet.getLastRow();
    if(count>1&&sheet.getRange(2,2,count-1,1).createTextFinder(data.requestId).matchEntireCell(true).findNext())return output_({ok:true,requestId:data.requestId});
    sheet.appendRow([new Date(),data.requestId,safe_(data.name),safe_(data.email),safe_(data.phone),safe_(data.organisation),safe_(data.topic),safe_(data.message),'New']);
    SpreadsheetApp.flush();
    return output_({ok:true,requestId:data.requestId});
  }catch(error){return output_({ok:false});}
  finally{if(lock.hasLock())lock.releaseLock();}
}
// Prevent user-entered text from becoming spreadsheet formulas.
function safe_(value){return /^[\s]*[=+@-]/.test(value)?"'"+value:value;}
function output_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
