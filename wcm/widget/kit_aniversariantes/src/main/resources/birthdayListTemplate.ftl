<div class="media">
    <div class="pull-left">
    	<img class="media-object img-circle userImage" width="40" src="${imgURL!}" alt="${name!}"/>
    </div>
    <div class="media-body">
        <#if isToday>
	    	<span>${i18n.getTranslation("kit_aniversariantes.birthday.istoday")}</span>
		</#if>
        <strong>${name!}</strong>
        <p>
	        <#if !isToday>
		        ${birthday!}
		    <#else>
		    	&nbsp;
			</#if>
		</p>
        <#if !isLast>
			<hr class="fs-transparent-25 fs-no-margin-top fs-no-margin-bottom"/>
		</#if>
    </div>
</div>
