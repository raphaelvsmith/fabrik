var FbVisTimeline=new Class({Implements:[Options],options:{dateFormat:"%c",orientation:"0"},initialize:function(json,options){this.json=eval(json);this.setOptions(options);this.resizeTimerID=null;this.tl=null;var dateFormat=this.options.dateFormat;Timeline.GregorianDateLabeller.prototype.labelPrecise=function(date){var newdate=new Date(date.getTime()+date.getTimezoneOffset()*60000);return newdate.format(dateFormat)};this.eventSource=new Timeline.DefaultEventSource();var theme=Timeline.ClassicTheme.create();theme.event.bubble.width=320;theme.event.bubble.height=520;theme.event.track.height=11.5;theme.event.track.gap=0.1;theme.ether.backgroundColors=["#000000","red"];theme.ether.highlightColor="red";Timeline.setDefaultTheme(theme);var bandBase={trackGap:0.2,width:"70%",intervalUnit:Timeline.DateTime.DAY,intervalPixels:50};var bandTracks=[];for(var b=0;b<json.bands.length;b++){var bandClone=Object.clone(bandBase);bandClone.width=json.bands[b].width;bandClone.intervalUnit=json.bands[b].intervalUnit;bandClone.overview=json.bands[b].overview;bandClone.eventSource=this.eventSource;bandClone.theme=theme;bandTracks.push(Timeline.createBandInfo(bandClone))}for(b=1;b<json.bands.length;b++){bandTracks[b].syncWith=0;bandTracks[b].highlight=true}SimileAjax.History.enabled=false;this.tl=Timeline.create(document.id("my-timeline"),bandTracks,this.options.orientation);this.start=0;var data={option:"com_fabrik",format:"raw",task:"ajax_getEvents",view:"visualization",visualizationid:this.options.id,currentList:this.options.currentList,setListRefFromRequest:1,listref:this.options.listRef};if(this.options.admin){data.task="visualization.ajax_getEvents"}else{data.controller="visualization.timeline"}this.start=0;this.counter=new Element("div.timelineTotals").inject(document.id("my-timeline"),"before");this.counter.set("text","loading");this.ajax=new Request.JSON({url:"index.php",data:data,onSuccess:function(json){this.start=this.start+this.options.step;if(this.start>=json.fabrik.total){this.counter.set("text","loaded "+json.fabrik.total)}else{this.counter.set("text","loading "+this.start+" / "+json.fabrik.total)}this.eventSource.loadJSON(json.timeline.events,"");if(json.fabrik.done.toInt()===0){this.ajax.options.data.start=json.fabrik.next;this.ajax.options.data.currentList=json.fabrik.currentList;this.ajax.send()}}.bind(this),onFailure:function(xhr){alert(xhr.status+": "+xhr.statusText)}});Fabrik.addEvent("fabrik.advancedSearch.submit",function(e){console.log("cancel ajax");this.ajax.cancel()}.bind(this));this.ajax.send();window.addEvent("resize",function(){if(this.resizeTimerID===null){this.resizeTimerID=window.setTimeout(function(){this.resizeTimerID=null;this.tl.layout()}.bind(this),500)}}.bind(this));this.watchDatePicker()},watchDatePicker:function(){var a=document.id("timelineDatePicker");if(typeOf(a)==="null"){return}var c={eventName:"click",ifFormat:this.options.dateFormat,daFormat:this.options.dateFormat,singleClick:true,align:"Br",range:[1900,2999],showsTime:false,timeFormat:"24",electric:true,step:2,cache:false,showOthers:false,advanced:false};var b=this.options.dateFormat;c.date=Date.parseDate(a.value||a.innerHTML,b);c.onClose=function(e){e.hide()};c.onSelect=function(){if(this.cal.dateClicked||this.cal.hiliteToday){this.cal.callCloseHandler();a.value=this.cal.date.format(b);this.tl.getBand(0).setCenterVisibleDate(this.cal.date)}}.bind(this);c.inputField=a;c.button=document.id("timelineDatePicker_cal_img");c.align="Tl";c.singleClick=true;this.cal=new Calendar(0,c.date,c.onSelect,c.onClose);this.cal.showsOtherMonths=c.showOthers;this.cal.yearStep=c.step;this.cal.setRange(c.range[0],c.range[1]);this.cal.params=c;this.cal.setDateFormat(b);this.cal.create();this.cal.refresh();this.cal.hide();if(typeOf(c.button)!=="null"){c.button.addEvent("click",function(f){this.cal.showAtElement(c.button);this.cal.show()}.bind(this))}a.addEvent("blur",function(f){this.updateFromField()}.bind(this));a.addEvent("keyup",function(f){if(f.key==="enter"){this.updateFromField()}}.bind(this))},updateFromField:function(){var a=document.id("timelineDatePicker").value;d=Date.parseDate(a,this.options.dateFormat);this.cal.date=d;var b=new Date(this.cal.date.getTime()-(this.cal.date.getTimezoneOffset()*60000));this.tl.getBand(0).scrollToCenter(b)},submit:function(){}});