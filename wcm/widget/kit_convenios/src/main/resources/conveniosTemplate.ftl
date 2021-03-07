<div class="${colClass!'col-xs-12'} fs-cursor-pointer" document-id="${documentId!}" data-open-partner>
    <div class="media">
	    <a class="pull-left" href="#">
	    	<img width="120" class="media-object img-responsive img-rounded" src="${imgURL}" alt="${title}">
	    </a>
	    <div class="media-body">
	        <h4 class="media-heading">${title}</h4>
	        <small>${content?replace("\\r\\n","<br/>")!}</small>
	    </div>
	</div>
	<br>
</div>
