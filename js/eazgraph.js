/* Copyright (C) Lyn Connect, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by benamar BELARBI <benamarbelarbi@yahoo.fr>, October 2014
 */
(function($)
{ 
	$this={}
	var options,defauts_options=
	{
		"width": 400
	},  
	publicMethods = {
		startGraphModal : function(jsonUrl)
		{
			console.log("startGraphModal");
			adialog = uismart.getSmartDialog();
			jsPlumb.reset();
			adialog.show();
			if(typeof(jsonUrl)!="undefined" && jsonUrl.length>0)
				{adialog.wrapper.html("loading please wait...");}
			else{
				adialog.wrapper.html("<b>error : json url is not defined</b>");
				return ;
			}
			setTimeout(function(){
				jsPlumb.Defaults.Container = adialog;
				jsPlumb.draggable($(".window"));
				var json=uismart.getJSON(jsonUrl)
				if(json)
					$this.drawGraph(json);
				else
					console.log("error loading graph json!");
			},150);
			
		},//end startModalGraphic
		
		drawGraph: function (scnjson){
			jsPlumb.reset();
			$("._jsPlumb_endpoint").remove();
			$("svg").remove();
			$(".graph").remove();
			adialog = uismart.getSmartDialog();
			adialog.show();
			adialog.wrapper.html("<h3>chargement, veuillez patienter svp ...</h3><br>");
			setTimeout(function(){
				var htmlresult = $.render.flowchart(scnjson);
				adialog.wrapper.html("<div>"+htmlresult+"</div>");
				$this.createGraphLinks(scnjson);
				jsPlumb.repaintEverything();
				$this.initGraphEvents();
			},100);
			/*setTimeout(function(){
				jsPlumb.repaintEverything();
				initGraphEvents();
				},100);*/

		},
	
	},
	privateMethods = {
		loadTemplates:function(){
			uismart.initRenderer();
			loadShape=$this.loadShape;
			//console.log("loading templates");
			uismart.loadTemplate("flowchart");
			uismart.loadTemplate("shape");
			uismart.loadTemplate("tooltip");
			uismart.loadTemplate("shapeOutside");

		},
		include : function(url, callback){
			 
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url + '?' + (new Date().getTime());
			if (callback) {
				script.onreadystatechange = callback;
				script.onload = script.onreadystatechange;
			}
			document.getElementsByTagName('head')[0].appendChild(script);
		},
		init : function (user_options,callbackfunc) 
		{
			options=$.extend(defauts_options, user_options); 
			return this.each(function()
			{
				config_require={
						'jsPlumb':{
//							'jquery':'js/jquery-1.11.1.min',
							'jquery-ui':'js/jquery-ui/jquery-ui-1.9.2.min',
							//'qtip':'js/jqplugins/jqpack/jquery.qtip.min',
							'jsrender':'js/jsrender.min',
							'uismart':'js/uismart',
							'jquery.ui.touch-punch':'js/jsPlumb-1.4.1/jquery.ui.touch-punch.min',
							'jsPlumb-util':'js/jsPlumb-1.4.1/jsPlumb-util',
							'jsPlumb-dom-adapter':'js/jsPlumb-1.4.1/jsPlumb-dom-adapter',
							'jsBezier':'js/jsPlumb-1.4.1/jsBezier-0.6',
							'jsPlumb':'js/jsPlumb-1.4.1/jsPlumb',
						},
						'jsPlumb-plugins':{
							'jsPlumb-connection':'js/jsPlumb-1.4.1/jsPlumb-connection',
							'jsPlumb-connectors-statemachine':'js/jsPlumb-1.4.1/jsPlumb-connectors-statemachine',
							'jsPlumb-connectors-flowchart':'js/jsPlumb-1.4.1/jsPlumb-connectors-flowchart',
							'jsPlumb-drag':'js/jsPlumb-1.4.1/jsPlumb-drag',
							'jsPlumb-endpoint':'js/jsPlumb-1.4.1/jsPlumb-endpoint',
							'jsPlumb-anchors':'js/jsPlumb-1.4.1/jsPlumb-anchors',
							'jsPlumb-defaults':'js/jsPlumb-1.4.1/jsPlumb-defaults',
							
						},
						'jsPlumb-plugins-final':{
							'jquery.jsPlumb':'js/jsPlumb-1.4.1/jquery.jsPlumb',
							'jsPlumb-renderers-svg':'js/jsPlumb-1.4.1/jsPlumb-renderers-svg',
							'jsPlumb-renderers-canvas':'js/jsPlumb-1.4.1/jsPlumb-renderers-canvas',
							'jsPlumb-renderers-vml':'js/jsPlumb-1.4.1/jsPlumb-renderers-vml',
//							'flowchart_const':'js/flowchart_const'
							
						}
							
					}
					mainConf={};
					confnames={};
					for (var cnf in config_require)
					{
						conf=config_require[cnf];
						confnames[cnf]=[];
						for (var jsname in conf)
						{
							jsfile=conf[jsname];
							confnames[cnf].push(jsname);
							mainConf[jsname]=jsfile;
						}
					}
				var nbreqtry=0;
				var MAX_TRY=3;
				var DELAY=30;
				RequireJS = function (deps, callback, errback, optional)
				{
					nbreqtry++;
					try{
						var acallback=callback;
						delay=DELAY
						setTimeout(function(){
							var mycallback = function(a){
								//console.log("require received ",deps);
								setTimeout(function(){
									if(typeof(acallback)=='function')
									{
										acallback(a);
										acallback=null;
										}
									else{console.log("undefined callback!");}
									},DELAY);
							}
							if(typeof(require)=="undefined")
							{
								setTimeout(function(){
									if((nbreqtry>0 && nbreqtry<MAX_TRY)||(nbreqtry>100 && nbreqtry<100+MAX_TRY))
									{
											RequireJS(deps, mycallback, errback, optional);
									}
									else
									{
										if (nbreqtry<100) nbreqtry=101;

										if(typeof(jQuery)!="undefined" && (nbreqtry>100 && nbreqtry<100+MAX_TRY)){
											console.log("require.js not found loading requirejs");
											privateMethods.include('http://requirejs.org/docs/release/2.1.15/minified/require.js', function() {
												RequireJS(deps, mycallback, errback, optional);
										})
										}else{
										console.log("require not found : make sure you have included require.js");
										}
									}
								},50);
							}else{
								//console.log("requiring ",deps);
								require.config({
									paths: mainConf,
								});
								require (deps, mycallback, errback, optional)
							}
						},delay);
					}catch(e){
						console.log("###############\n##################\n exception error :" ,e.stack);
						console.log("error in RequireJS:");
						console.log("###############\n##################\n");
					}
				}
	
				RequireJS(confnames['jsPlumb'], function(foo) {
					RequireJS(confnames['jsPlumb-plugins'], function(foo) {
						RequireJS(confnames['jsPlumb-plugins-final'], function(foo) {
							privateMethods.loadTemplates();
							if(typeof(callbackfunc)=='function')
								//console.log("callback call ");
								callbackfunc();
							});//require
					});
				});
			});
		},//init
		

		initGraphEvents : function (idivparent)
		{
			var divparent="";
			var inparent=false;
			if (typeof(idivparent)!="undefined")
				if (idivparent!=null)
					{
						divparent=idivparent+" ";
						inparent=true;
					}
			
			$(divparent+'.parentShape').mouseenter(function() {
				setTimeout(function(){jsPlumb.repaintEverything();},20);
				});
			
			$(divparent+'.parentShape').mouseleave(function() {
				setTimeout(function(){jsPlumb.repaintEverything();},20);
				});
			
			//if (inparent)
			$('body').click(function(e) {
				$('.parentShape').attr('class','parentShape');
				setTimeout(function(){jsPlumb.repaintEverything();},20);
			});	
			
			
			$(divparent+".tooltipPlace").click(function(){
				
				f = $(this).find(".tooltip");
				console.log("f=",f);
				if (f.length>0)
				if (f.css("display")!="block")
				{
					console.log(".tooltipPlace clicked found ",f.length,'display',f.css("display"));
					$(".tooltip").hide();
					f.show();
				}
			});
			
			$(divparent+".tooltipclose").click(function(){
				var f = $(this).parent();
				console.log(".tooltipPlace close clicked found ",f.length);
				if (f.length>0)
				setTimeout(function(){
					f.hide();
				},10);
			});

			
			//if (inparent)
			$(divparent+".parentShape").click(function(e){
				//css=$(this).css();
				console.log("parent shape click",this);
				$(divparent+'.parentShape.openedShape').attr('class','parentShape');
				$(this).attr('class','parentShape openedShape');
				e.stopPropagation();
				setTimeout(function(){jsPlumb.repaintEverything();},10);
			});

			$(divparent+".imgMaximize").click(function(){
				//css=$(this).css();
				parentShape=$(this).parents('.parentShape');
				$(divparent+'.parentShape.openedShape').attr('class','parentShape');
				
				parentShape.attr('class','parentShape openedShape');
				setTimeout(function(){jsPlumb.repaintEverything();},10);
				//addHistoryShapes('/portaildto/flowchart/histo/30/',parentShape.find('.shapes.history'))
				
			});
			
			
			
			$(divparent+".imgMinimize").click(function(e){
				console.log($(this).parent());
				$(this).parents(divparent+'.parentShape').attr('class','parentShape');
				setTimeout(function(){jsPlumb.repaintEverything();},10);
				e.stopPropagation();
			});
			
			function slideHistory(parentShape,incr)
			{
				console.log(parentShape);
				currentCount=parentShape.find(".currentCount");
				index=currentCount.html();
				index=parseInt(index, 10);
				index+=incr;
				if(index>=0)
				{
					dir="Left";
					if(incr<0)
						dir="Right";
					historyShape=parentShape.find(".shape:eq("+index+")")
					if(historyShape.length){
						currentCount.html(index);
						var oldShape = parentShape.find(".shape:visible");
						parentShape.css("overflow", "hidden");
						historyShape.parent().attr("class","newShape"+dir);
						oldShape.parent().attr("class","oldShape");
						setTimeout(function(){
							oldShape.animate({ left: -1*incr*100+"%"}, 600 ) ;
							historyShape.animate({ left: "0px"}, 600, function() {
								//oldShape.css("top", "10px");
								historyShape.css("left", "0px");
								oldShape.parent().attr("class","hiddenShape");
								parentShape.css("overflow", "visible");
							}) ;
						},20);
						
					}
				}
			}
				
			$(".arrowNext").click(function(e){
				parentShape=$(this).parents('.parentShape');
				slideHistory(parentShape,1);
				//setTimeout(function(){jsPlumb.repaintEverything();},10);
				e.stopPropagation();
			});
			$(".arrowPrev").click(function(e){
				parentShape=$(this).parents('.parentShape');		
				slideHistory(parentShape,-1);
				//setTimeout(function(){jsPlumb.repaintEverything();},10);
				e.stopPropagation();
			});


			$(function() {
				$( ".tooltiptabs" ).tabs();
			  });
		},//end of initGraphEvents
		
		createGraphLinks : function(ajson)
		{
			var groups = ajson.GROUPS;
			if(typeof($this.allnodes)=="undefined")
				$this.allnodes={};
			
			if(typeof(groups)=='undefined')
				console.log("##### ERROR : ajson.GROUPS is undefined ####")
			else
			for (var groupId=0; groupId<groups.length;groupId++)
			{
				var group=groups[groupId];
				var nodes = group.NODES;
				if(typeof(nodes)=='undefined')
					console.log("##### ERROR : group.NODES is undefined ####")
				else
				for (var nodeId=0; nodeId<nodes.length;nodeId++)
				{
					var inode=nodes[nodeId];
					node=$this.allnodes[inode.UID]={node:inode};
					//console.log("NODE : ",inode.UID);
					//- Top (also aliased as TopCenter) 
					//- TopRight - Right (also aliased as RightMiddle) 
					//- BottomRight - Bottom (also aliased as BottomCenter) 
					//- BottomLeft - Left (also aliased as LeftMiddle) - TopLeft
					node.outPoint = jsPlumb.addEndpoint(inode.UID+"_id",{ isSource:true,
						anchors:[["RightMiddle", "Continuous"],["BottomCenter", "Continuous"]]
						 ,paintStyle:{ fillStyle:"#7DBFE4", outlineColor:"#7DBFE4", outlineWidth:1 }
							//,connectorPaintStyle:{ strokeStyle:"red", lineWidth:3 }
							,endpoint : [ "Dot", {radius : 3} ]
							,connectorStyle : {
								lineWidth : 3,
								strokeStyle : '#7DBFE4'}
							//,connector : [ "Bezier", {curviness : 10}]
							,connector : [ "Flowchart", {stub : 5} ]
						});
					
					
					node.inPoint = jsPlumb.addEndpoint(inode.UID+"_id",{isTarget:true,
						anchor:["Continuous", { faces:["top", "left"] } ]
						,endpoint : [ "Dot", {radius : 3} ]
						});
				}//nodes
			}
			
			setTimeout(function()
			{
				//console.log("connecting links");
				for (var groupId=0; groupId<ajson.GROUPS.length;groupId++)
				{
					var group=ajson.GROUPS[groupId];
					var nodes = group.NODES;
					//console.log("groupId",groupId);
					if(typeof(nodes)=='undefined')
						console.log("##### ERROR : group.NODES is undefined ####")
					else
					for (var srcNodeId=0; srcNodeId<nodes.length;srcNodeId++)
					{
						var inode=nodes[srcNodeId];
						var srcnode=$this.allnodes[inode.UID];
						//console.log("srcNodeId",srcnode,"inode.UID",inode.UID);
						var nexts=inode.NEXTS;
						if(typeof(nexts)!='undefined' )
						{
							for (var nextId=0; nextId<nexts.length;nextId++)
							{
								var destnodeId=nexts[nextId];
								if(typeof($this.allnodes[destnodeId])!='undefined')
								{
										destnode=$this.allnodes[destnodeId];
										console.log(" -> connect ",inode.UID," to NEXT node : ",destnode.node.UID);
										//console.log(" => connect outPoint",srcnode.outPoint);
										//console.log(" =====> connect to toPoint : ",destnode.inPoint);
										jsPlumb.connect({ source:srcnode.outPoint, target:destnode.inPoint
											,paintStyle:{ strokeStyle:"#7DBF00", lineWidth:4 } //"#7DBFE4"
											,hoverPaintStyle : {
												strokeStyle : "green",
												lineWidth : 5
											}
											,overlays : [ [ "Arrow", {
												width : 10,
												length : 7,
												location : 0.7
											} ] ]
										});
									
								}
							}
							
						}//nexts
					}
				}
			},30);
			
		},//end createGraphLinks

		loadShape : function (uid,elem,inodetype)
		{
			var nodetype="idnode";
			if(typeof(inodetype)!='undefined')
				if(inodetype!="")
					nodetype=inodetype;
			urlnode='/portaildto/flowchart/'+nodetype+'/'+uid+'/';
			if (typeof(options.urlnode)=="function")
			{
				urlnode=options.urlnode(nodetype,uid);
			}else{
				console.log("undefined options.urlnode");
			}
			var scnjson = uismart.getJSON(urlnode);
			if (scnjson)
			{
				console.log(uid+"_id",$("#"+uid+"_id"));
				$("#"+uid+"_id").html($.render.shapeOutside(scnjson));
				setTimeout(function(){
					$this.initGraphEvents("#"+uid+"_id");
					img=$("#"+uid+"_id").find(".contentLoadImg");
					if (img.length)
							img.attr("src","images/refresh.png")
				},100);
			}else{
				console.log("######## ERROR including '"+urlnode);
				img=$("#"+uid+"_id").find(".contentLoadImg");
				if (img.length)
						img.attr("src","/media/images/bug1.jpg")
				//alert("template error : "+opt[name]);
				
			}
			
		},//end loadShape 


		addHistoryShapes : function (jsonUrl,div)
		{
			dd
			var templfile = 'jstemplates/shape.templ.html';
			console.log("loading shape history");
			console.log(div);
			startProgressBar('datatable', 10);
			jQuery.ajax({
				url: jsonUrl,
				async: false,
				dataType: 'json',
				mimeType: "textPlain",
				success: function(scnjson) {
					createJsonTemplate(div,templfile,scnjson,function(){
						aDiv.html("<div>"+$.render.my_template(scnjson)+"</div>");
						jsPlumb.repaintEverything();
						//initGraphEvents();
					});
				},
				error : function(request, error) {
					console.log("datatable error :" + error);
					alert("erreur serveur " + request.responseText);
				}

			});
			
		}, //end addHistoryShapes

		
	}
	$.extend( $this, publicMethods );
	$.extend( $this, privateMethods );
	$.fn.eazGraph = function(method) {
		var $self = $(this);

		if (!(0 in this)) { return this; }

		if ( publicMethods[method] ) {
			return publicMethods[method].apply( $self, Array.prototype.slice.call(arguments, 1) );
		} else if ( typeof method === 'object' || ! method ) {
			return privateMethods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist.' );
			return false;
		}
	};
	
})(jQuery);