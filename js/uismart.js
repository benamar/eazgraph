/* Copyright (C) Lyn Connect, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by benamar BELARBI <benamarbelarbi@yahoo.fr>, October 2014
 */

uismart = (function($)
{
		var openLinkDialog = function (atitle, link,callback) {
			linkDialogDiv = getSmartDialog();
			linkDialogDiv.show();
			console.log("load dialog !")
			loadSimpleHtmlform('linkDialogWrap_id', link,callback)
		},
		$this={},
		linkDialogDiv=null,
		privateMethods = {
				
		},
		publicMethods = {
			getSmartDialog : function () {
					if (linkDialogDiv==null){
						linkDialogDiv=$("<div id='linkDialog_id' class='smartDialog'></div>");
						linkDialogDiv.css({width:$(window).width()-70});
						linkDialogWrapper=$("<div id='linkDialogWrap_id' class='smartDialogWrapper'></div>");
						linkDialogDiv.append(linkDialogWrapper);
						linkDialogDiv.wrapper=linkDialogWrapper;
						toolBar=$("<div id='smartToolBar_id' class='smartToolBar'></div>");
						linkDialogDiv.append(toolBar);
						cancelBtn=$("<div id='cancelBtn_id' class='smartDialogCancel'>X</div>");
						toolBar.append(cancelBtn);
						$("body").append(linkDialogDiv);
						cancelBtn.click(function(){linkDialogDiv.hide()});
					}
					return linkDialogDiv;
				},
				crossDomainReq : function (url, method, data, callback, errback) {
					/**
					 * Make a X-Domain request to url and callback.
					 *
					 * @param url {String}
					 * @param method {String} HTTP verb ('GET', 'POST', 'DELETE', etc.)
					 * @param data {String} request body
					 * @param callback {Function} to callback on completion
					 * @param errback {Function} to callback on error
					 */

					var req;

					if (XMLHttpRequest) {
						req = new XMLHttpRequest();

						if ('withCredentials' in req) {
							req.open(method, url, true);
							req.onerror = errback;
							req.onreadystatechange = function() {
								if (req.readyState === 4) {
									if (req.status >= 200 && req.status < 400) {
										callback(req.responseText);
									} else {
										errback(new Error('Response returned with non-OK status'));
									}
								}
							};
							req.send(data);
						}
					} else if (XDomainRequest) {
						req = new XDomainRequest();
						req.open(method, url);
						req.onerror = errback;
						req.onload = function() {
							callback(req.responseText);
						};
						req.send(data);
					} else {
						errback(new Error('CORS not supported'));
					}
				},
			getJSON : function(ajsonUrl,dataType){
					var jsonUrl=ajsonUrl;
					var _json=null;
					try{
						processData = false;
						$(document).ajaxError(
							    function (event, jqXHR, ajaxSettings, thrownError) {
							        //console.log('[event:' , event , '], [jqXHR:' , jqXHR , '], [ajaxSettings:' , ajaxSettings , '], [thrownError:' , thrownError , '])');
							    });
						if(typeof(dataType)=="undefined")
							{
								dataType='json';
								processData = true;
							}
						if(0){
							$this.crossDomainReq(jsonUrl, 'GET', {}, function(responseText){
								_json = responseText;
							}, 
							function(error){
								console.log("jsonUrl=",jsonUrl,"error :", error);
							}) ;
						}else{
							$.ajaxSetup({ mimeType: "text/plain" });
							jQuery.ajax({
								url: jsonUrl,
								async: false,
								dataType: dataType,
								mimeType: "textPlain",
								processData: processData,
								crossDomain:true,
								success: function(scnjson) {
									console.log("jsonUrl=",scnjson,"success");
									_json = scnjson;
									//stopProgressBar('datatable', 10);
								},
									error : function(request, error) {
										//console.log("jsonUrl=",jsonUrl,"dataType=",dataType,"error :", error);
									}
								,
								complete: function(xhr, textStatus) {
									if(xhr.status==0)
										{
											//console.log("complete ",jsonUrl,"status",xhr);
											_json = xhr.responseText;
											if(dataType=="json")
												{
													try{
														eval("_json = "+xhr.responseText);
													}catch(e){
														console.log("\n##################\n url=",jsonUrl," json error :" ,e.stack);	
													}
													console.log("json=",_json);
												}
										}
								}
							
							});
						}
						
					}catch(e){
						console.log("\n##################\n exception error :" ,e.stack);	
					}
					return _json;
			},
			loadTemplate:function (tempName,callback)
			{
				var rep="jstemplates/";
				contents = $this.getJSON(rep+tempName+".templ.html"+ '?' + (new Date().getTime()),"text");
				if(contents!=null) 
				{
					try{
						opt={};
						//console.log("installing template "+tempName+"")
						opt[tempName]=contents;
						$.templates(opt);
						if (typeof(callback)=='function')
						{
							callback();
						}
					}catch(e){
						console.log("\n##################\n exception error :" ,e.stack);	
					}
				 }else{
					 console.log("template "+tempName+" failed!")
				 }
			},
			initRenderer : function(keywords)
			{
				$.views.tags({
					fields: function( object ) {
						var key,
							ret = "";
						for ( key in object ) {
							if ( object.hasOwnProperty( key )) {
								// For each property/field, render the content of the {{fields object}} tag, with "~key" as template parameter
								ret += this.tagCtx.render( object[ key ], { key: key });
							}
						}
						return ret;
					},
					debug: function(obj) {
				        var props = this.props;
				        // output a default message if the user didn't specify a message
				        var msg = props.message || 'Debug:';
				        console.log(msg, obj);
				    }
				});
	
	
	
				//Define a custom getFields helper function to iterate over fields and return
				$.views.helpers({
					getFields: function( object ) {
						var key, value,
							fieldsArray = [];
						for ( key in object ) {
							if ( object.hasOwnProperty( key )) {
								value = object[ key ];
								// For each property/field add an object to the array, with key and value
								fieldsArray.push({
									key: key,
									value: value
								});
							}
						}
						// Return the array, to be rendered using {{for ~fields(object)}}
						return fieldsArray;
					},
					getDebug: function( msg,obj ) {
						//console.log("display obj:",msg,obj);
						return obj;
					},
					wsGetFileIDF:function(obj){
						//console.log("display wsGetFileIDF obj:",obj);
						anUrl = "/wsGetFileIDF?idt="+obj.IDT+"&idf="+obj.IDF+"&host="+obj.HOST+"&filename="+obj.FILENAME+"&cmd="+obj.CMD;
						return {url:anUrl};
					},
					getFormattedFields: function( object ) {
						//console.log("formatted keys");
						var key, value,
							fieldsArray = [];
						for ( key in object ) {
							if ( object.hasOwnProperty( key )) {
								value = object[ key ];
								// For each property/field add an object to the array, with key and value
								if(typeof(keywords)!="undefined")
								for ( k in keywords ) {
									if(k==key)
									{
										key=keywords[k];
										break;
									}
								}
								if(key!="TITLE$")
								fieldsArray.push({
									key: key,
									value: value
								});
							}
						}
						// Return the array, to be rendered using {{for ~fields(object)}}
						return fieldsArray;
					}
				});
			}
		};		
		$.extend( $this, publicMethods );
		$.extend( $this, privateMethods );
		return publicMethods;
})(jQuery);