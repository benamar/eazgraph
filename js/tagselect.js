/* Copyright (C) Lyn Connect, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by benamar BELARBI <benamarbelarbi@yahoo.fr>, October 2014
 */

(function($)
{
	var defauts_options=
	{
		"width": 400
	};  

	publicMethods = {
			
	}
	privateMethods = {
		init : function (user_options) {
		
			var options=$.extend(defauts_options, user_options);
			return this.each(function()
			{
						console.log('########################## CREATE TAGS ################################');
						var choiceValues = options.choices;
						var initValues = options.prefilled;
						filtermsg="Type here to filter";
						if (typeof(options.filtermsg)!='undefined' && options.filtermsg.length)
							filtermsg=options.filtermsg
						
						var $thisparent = $(this).parent();
						console.log('$parent',$thisparent,'length=',$thisparent.length);
						var idname=$(this).attr("id");
						
						if (typeof(options.name)!='undefined' && options.name.length)
							$(this).attr(options.name);
						console.log('choiceValues',choiceValues);
						var $contain1 = $('<div class="contain-tag" placeholder="ajouter un élement" ></div>');
						var $bubble = $('<div class="bubble" ></div>');
						var $bubbletitle = $('<span class="bubble-title" >Clicker sur un élément pour l\'ajouter </span>');
						var $contain2 = $('<div class="bubble-container"></div>');
						var $input2 = $('<input type="text" ignore id="'+idname+'-data-picker" placeholder="ajouter un élement" class="tm-input" style="display:none"/>');
						
						var $filterInput = $('<input type="text" ignore id="'+idname+'-data-search" placeholder="'+filtermsg+'" class="filterinput" style="  "/>');
						var $filtercontainer = $('<div class="filtercontainer">Filter : </div>');
						$filtercontainer.append($filterInput);
						$bubble.append($filtercontainer);
						$bubble.append($contain2);
						
						//$contain2.append($filterInput);
						$contain2.append($input2);
						//$parent.html("");
						console.log("tagname",$(this)[0].nodeName);
						$parent=$("<div class=main-contain-tag>");
						$thisparent.append($parent);
						var $input1=null;
						if($(this)[0].nodeName=="INPUT")
						{
							$input1=$(this);
							$input1.attr("original",true);
							$parent.insertAfter($input1);
							setTimeout(function(){
								
								//$input1.detach().appendTo($contain1);
								console.log($input1);
							},100);
						}else{
							$thisparent.append($parent);
							$input1 = $('<input type="text" placeholder="ajouter un élement" class="tm-input" />');
						}
						$input1.attr("maininput",true);
						$input1.attr('id',idname+"-labels");
						$input1.css("display","none");
						$input1.attr('class',"tm-input");
						
						$contain1.append($input1);
						$parent.append($contain1);
						$parent.append($bubble);
						
		
						var ready1=false;
						var ready2=false;
						setTimeout(function(){
							tagman1=$input1.tagsManager({
								tagClass:"tm-tag-success",
								externalTagId:true,
								prefilled: initValues
							});
							tagman1.attr('toto',"input1");
							$input2.tagsManager(
							{
								externalTagId:true,
								tagCloseIcon:"+",
								prefilled: choiceValues
										
							});
							$input2.attr('toto',"input2");
							$input2.on('tm:spliced', function(e, tag,tagId) {
								console.log("tm:spliced input2 "+tag,tagId, "trigger evt '"+idname+"_select'","for ",tagId);
								 $input1.tagsManager('pushTag',tag,true,tagId);
								 $( document ).trigger( idname+'_select',tagId);
							});
							
							$input1.on('tm:spliced', function(e, tag,tagId) {
								console.log("tm:popped",tag,true,tagId, "trigger evt '"+idname+"_unselect'","for ",tagId);
								 $input2.tagsManager('pushTag',tag,true,tagId);
								 $( document ).trigger( idname+'_unselect',tagId);
							});
							var wordsearch = function ()
							{
								search=$filterInput.val().toUpperCase();
								console.log($filterInput,"searching",search,"length=",$filterInput.length,$filterInput.val());
								$(".tm-tag",$contain2).each(function(i,el){
									$el = $(el);
									$t=$("span",$el);
									$el.css("display","block");
									if($t.length)
									{
										if ($t.html().toUpperCase().indexOf(search) == -1)
										{
											$el.css("display","none");
										}
									}
								});
							}
							$filterInput.keypress(function(e) { // text written
								wordsearch();
							});
							$filterInput.on('change', function(){
								wordsearch()
							});
							$filterInput.keyup(function(e) {
										wordsearch();
							   
								});
							
							
							setTimeout(function(){
							$('input',$contain1).each(function(i, el) {
								$el = $(el);
								if($el.length)
								{
									if($el.attr("id")==idname+'-labels')
									{
										$el.attr('ignore',true);
									}else{
											$el.attr("old_id",$el.attr('id'));
											$el.attr("id",idname);
									}
								}
							});
									
							$('input',$contain2).each(function(i, el) {
								$el = $(el);
								if($el.length)
								{
									$el.attr('ignore',true);
								}
							});
							
							},200);
						},200);
					
			});
		}
	}
	$.fn.tagSelect = function(method) {
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