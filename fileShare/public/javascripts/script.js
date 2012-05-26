//TODO:
//large files take a while to render preview, need to give user notification file has been dropped

// Random id generator
function rndId(length) {
  var iStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var n=0;
  var i=0;
  var s="";

  for (x=1;x<=length;x++) {
   n=Math.random()*62;
   i=Math.round(n);
   s+=iStr.charAt(i);
   }
  return s;
}


$(function(){
	
	var dropbox = $('#dropbox'),
	message = $('.message', dropbox);
	var id = rndId(10); //generate random ID of length 10

	var fileImage = "../images/fileImage.png";
	var videoImage = "../images/videoImage.png";
	var prog_Multiplier = 2.2; //width of image preview(in css) / 100 -> used for progress bar
	
	dropbox.filedrop({
		paramname:'file', //used to identify file (express ex. request.files.file)
		
		maxfiles: 5, //max num of files that can be dragged and dropped at one time
    	maxfilesize: 30,  //max file size in mb
    	
		url: '/fileUpload/' + id,
		
		uploadFinished:function(i,file,response){
			$.data(file).addClass('done');
			// response is the JSON object returned
		},
		
    	error: function(err, file) {
			switch(err) {
				case 'BrowserNotSupported':
					message.html('Your browser does not support HTML5 file uploads!');
					break;
				case 'TooManyFiles':
					alert('Too many files! Please select 5 at most!');
					break;
				case 'FileTooLarge':
					alert(file.name+' is too large! Please upload files up to 10mb.');
					break;
				default:
					break;
			}
		},
				
		dragOver: function() {
       		dropbox.css("background-color", "rgba(256, 256, 256,0.3)");
    	},
    	dragLeave: function() {
    		dropbox.css("background-color", "rgba(256, 256, 256,0.7)");
       	},
       	drop: function() {
       		dropbox.css("background-color", "rgba(256, 256, 256,0.7)");
       	},
		
		uploadStarted: function(i, file, len){
			createImage(file);
		},
		
		progressUpdated: function(i, file, progress) {
			$.data(file).find('.progress').width(progress * prog_Multiplier);
		}
    	 
	});
	
	
	var template = '<div class="preview">'+
						'<span class="imageHolder">'+
							'<img />'+
							'<span class="filenameHolder"></span>'+
							'<span class="uploaded"></span>'+
						'</span>'+
						'<div class="progressHolder">'+
							'<div class="progress"></div>'+
						'</div>'+
					'</div>'; 
											
	function createImage(file){	
		var preview = $(template), 
			image = $('img', preview);				
		
		// Determing file type
		if(file.type.match(/^image\//)){
			var reader = new FileReader();
		
			reader.onload = function(e){
			// e.target.result holds source of the image:
				image.attr('src',e.target.result);
			};
		
			// Reading file, will trigger onload function above when complete
			reader.readAsDataURL(file);
		}else if(file.type.match(/^video\//)){
			image.attr('src', videoImage);
			preview.find('.filenameHolder').html(file.name);
		}else{
			image.attr('src', fileImage);
			preview.find('.filenameHolder').html(file.name);
		}
		
		message.hide();
		preview.appendTo(dropbox);
		
		// Associating a preview container with the file
		$.data(file, preview);
	}
});