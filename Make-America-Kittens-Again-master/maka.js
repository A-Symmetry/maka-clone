// maka.js - part of make america kittens again
// v1.3.0
// by Tom Royal 
// tomroyal.com

var makaTesting = false; // for debugging only

if (makaTesting){
	console.log('maka initiated');
	var makaReplacements = 0;
}	

// init blacklist

var blacklist = [".jpeg", ".jpg", ".img", ".png", "img", "link", "url"]; // thanks to jSanchoDev and akiatoji for translations

// get additional settings from chrome storage

chrome.storage.local.get({
    blockPence: false,
    blockFarage: false,
    blockLePen: false,
    blockWilders: false,
    blockBannon: false,
    customBlock: false
  }, function(items) { 
	  if (items.blockPence){
		  blacklist.push("mike pence");
		  blacklist.push("ペンス");
	  };
	  if (items.blockFarage){
		  blacklist.push("farage");
	  };
	  if (items.blockLePen){
		  blacklist.push("le pen");
	  };
	  if (items.blockWilders){
		  blacklist.push("wilders");
	  };
	  if (items.blockBannon){
		  blacklist.push("bannon");
	  };
	  // process custom blocklist
	  
	  if(items.customBlock){
			var customBlockTargets = items.customBlock.split(',');
			  customBlockTargets.forEach(function(blockTarget) {
				    blacklist.push(blockTarget.trim().toLowerCase())
			  });  
	  };

	  document.addEventListener('DOMContentLoaded', makanow(theKittens), false);
	  
  });

// kitten data!
// Note - now moved from S3 to local storage

var theKittens = {"kitten": [
    {"file": "1.jpeg", "Credit" : "Archie", "URL": "https://archiereidart.files.wordpress.com/2018/08/power.jpg?w=1760", "type":"0"},
	{"file": "2.jpeg", "Credit" : "Archie R", "URL": "https://archiereidart.files.wordpress.com/2018/08/bath.jpg?w=1760", "type":"0"},
	{"file": "3.jpeg", "Credit" : "Archie RE", "URL": "https://archiereidart.files.wordpress.com/2018/08/montage-01.jpg?w=1760", "type":"0"},
	{"file": "4.jpeg", "Credit" : "Archie REI", "URL": "https://archiereidart.files.wordpress.com/2018/08/s_glitch-my-ass-02.jpg?w=1760", "type":"0"},
	{"file": "5.jpeg", "Credit" : "Archie REID", "URL": "https://archiereidart.files.wordpress.com/2018/08/s_mauve.jpg?w=1760", "type":"0"},
	{"file": "6.jpeg", "Credit" : "Archie S", "URL": "https://archiereidart.files.wordpress.com/2018/08/s_montage5.jpg?w=1760", "type":"0"},
	{"file": "7.jpeg", "Credit" : "Archie SE", "URL": "https://archiereidart.files.wordpress.com/2018/08/montage06-copy.jpg", "type":"0"},
	{"file": "8.jpeg", "Credit" : "Archie SETH", "URL": "https://archiereidart.files.wordpress.com/2018/08/img_9329.jpg?w=1760", "type":"0"},
	{"file": "9.jpeg", "Credit" : "Archie SET", "URL": "https://archiereidart.files.wordpress.com/2018/08/img_9192.jpg?w=1760", "type":"0"},
	{"file": "10.jpeg", "Credit" : "Archie Seth R", "URL": "https://archiereidart.files.wordpress.com/2018/08/10.jpg", "type":"0"},
	{"file": "11.jpeg", "Credit" : "Archie Seth Reid", "URL": "https://archiereidart.files.wordpress.com/2018/08/img_9476.jpg?w=1760", "type":"0"}
    ]
};

var element = document.getElementById('id');
element.style.opacity = "0.9";
element.style.filter = 'alpha(opacity=90)';

function makanow(theKittens){
	if (makaTesting){
		console.log('maka processing blacklist is '+blacklist);
	}

	// called on page load. Searches all img alt text and srcs for the strings in blacklist, replaces with kittens
	var pagepics=document.getElementsByTagName("img"), i=0, img;	
	while (img = pagepics[i++])
	{	
		
		if (img.hasAttribute('makareplaced')){
			// already replaced	
		}
		else {
			// not yet replaced
			var alttext = String(img.alt).toLowerCase();
			var imgsrc = String(img.src).toLowerCase();
			
			if (img.parentElement.nodeName != 'BODY'){
				// check parent innerHTML for blackilist
				var parenttag = img.parentElement.innerHTML.toLowerCase();
			}
			else {
				// prevent parse of entire doc
				var parenttag = '';
			};
			
			var imgwidth = img.clientWidth;
			var imgheight = img.clientHeight;
	
			blacklist.forEach(function(blist) {	
				if ((alttext.indexOf(blist) != -1) || (imgsrc.indexOf(blist) != -1) || (parenttag.indexOf(blist) != -1)){
					
					// append old src
					img.setAttribute("makareplaced", img.src);
					
					// remove srcsets, forcing browser to the kitten - eg, BBC News
					if (img.hasAttribute('srcset')){
						img.removeAttribute('srcset');	
					};
					// remove source srcsets if children of same parent <picture> element - eg, the Guardian
					if (img.parentElement.nodeName == 'PICTURE'){
						var theparent = img.parentNode;
						for(var child=theparent.firstChild; child!==null; child=child.nextSibling) {
						    if (child.nodeName == "SOURCE"){
							    child.removeAttribute('src');
							    child.removeAttribute('srcset');
						    };
						};
						
					};
					// knock out lazyloader data URLs so it doesn't overwrite kittens
				//	if (img.hasAttribute('data-src')){
				//		img.removeAttribute('data-src');	
				//	};
				//	if (img.hasAttribute('data-hi-res-src')){
				//		img.removeAttribute('data-hi-res-src');	
				//	};
				//	if (img.hasAttribute('data-low-res-src')){
				//		img.removeAttribute('data-low-res-src');	
				//	};
					
					// fix for wapo lazyloading huge sidebar pix..
					//if (window.location.href.indexOf('washingtonpost.com') != -1){
					// console.log('wapo');	
					//	if (img.classList.contains('unprocessed')){
					//		// console.log('loreslazy');	
					//		img.classList.remove('unprocessed');
							
					//	};
					//};
					
					var randk = Math.floor(Math.random() * 10) + 1
					img.src = chrome.runtime.getURL('/kittens/'+theKittens.kitten[randk].file+'');
					img.width = imgwidth;
					img.height = imgheight;
					
					
					
					if (theKittens.kitten[randk].type == 0){
						img.alt = 'Photo by '+theKittens.kitten[randk].Credit+' source '+theKittens.kitten[randk].URL+'';
					}
					else {
						img.alt = 'Photo by '+theKittens.kitten[randk].Credit+'';
					};
					makaReplacements++;
				};
			});	
		};				
	}
	if (makaTesting){
		console.log('maka processing complete, replaced '+makaReplacements+' images');
	}
		    
};

// function to replace kittened-images with the original SRCs

function undomakanow(){
	if (makaTesting){
		console.log('undoing MAKA');
	}

	var pagepics=document.getElementsByTagName("img"), i=0, img;	
	while (img = pagepics[i++])
	{	
		if (img.hasAttribute('makareplaced')){
			if (makaTesting){
				console.log('replacing image');
			};
			img.src = img.getAttribute('makareplaced');
			img.removeAttribute('makareplaced');
		};	
	};
	
}

// listener for context menu click invoking the above

chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "undoMAKA") {
	    // undo function called
        undomakanow();
    };
    /*
    else if (message.functiontoInvoke == "redoMAKA") {
        makanow(theKittens);
    }
    */
});

// Twitter Dot Com
// Huge thanks to @aidobreen for the code to catch DOM modification on Twitter
// https://medium.com/@aidobreen/fixing-twitter-with-a-chrome-extension-1f53320f5a01
if (window.location.href.indexOf('twitter.com') != -1){
	function DOMModificationHandler(){		
		$(this).unbind('DOMSubtreeModified.event1');
		setTimeout(function(){
				makanow(theKittens);
				$('#timeline').bind('DOMSubtreeModified.event1',DOMModificationHandler);
		},10);
	}
	$('#timeline').bind('DOMSubtreeModified.event1', DOMModificationHandler);
};