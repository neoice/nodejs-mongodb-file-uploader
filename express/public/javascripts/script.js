$(function(){
	
	var dropbox = $('#dropbox'),
	message = $('.message', dropbox);
	
	var file_image = "../images/fileImage.png";
	var prog_Multiplier = 2.2; //width of image preview(in css) / 100 -> used for progress bar
	
	dropbox.filedrop({
		paramname:'file', //used to identify file (express ex. request.files.file)
		
		maxfiles: 5, //max num of files that can be dragged and dropped at one time
    	maxfilesize: 10,  //max file size in mb
		url: '/fileUpload',
		
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
		
		// Called before each upload is started
		//beforeEach: function(file){
		//	if(!file.type.match(/^image\//)){
		//		alert('Only images are allowed!');
		//		
		//		// Returning false will cause the
		//		// file to be rejected
		//		return false;
		//	}
		//},
		
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
			
		// If file is an image
		if(file.type.match(/^image\//)){
			var reader = new FileReader();
		
			reader.onload = function(e){
			// e.target.result holds source of the image:
				image.attr('src',e.target.result);
			};
		
			// Reading file, will trigger onload function above when complete
			reader.readAsDataURL(file);
		}else{
			image.attr('src', file_image);
			preview.find('.filenameHolder').html(file.name);
		}
		
		message.hide();
		preview.appendTo(dropbox);
		
		// Associating a preview container with the file
		$.data(file, preview);
	}
});