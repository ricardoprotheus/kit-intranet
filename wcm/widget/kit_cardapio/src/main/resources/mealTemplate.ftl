<div class="${colClass!'col-xs-12'} fs-cursor-pointer" data-document-id="${documentId!}" data-open-description>
    <div class="media media-meal">
	    <a class="pull-left" href="#">
	    <img width="120" class="media-object img-responsive img-rounded" src="${imgURL!}" alt="${title!}">
	    </a>
	    <div class="media-body">
		    <#if isToday><span class="label label-info small">${i18n.getTranslation('kit_cardapio.today')}</span></#if>
	        <h4 class="media-heading"><small>${day!}</small><br>${title!}</h4>
	        <small>${content?replace("\\r\\n","<br/>")!}</small>
	    </div>
	</div>
	<br>
</div>
