<div class="row">
    <div class="media col-md-12">
        <div class="pull-left fs-no-padding-left col-md-5">
            <img class="media-object fs-no-padding-left fs-xs-space col-md-12" src="${imgURL!}"/>
        </div>

        <#if isToday>
            <span class="label label-info">
            ${i18n.getTranslation('kit_cardapio.today')}
            </span>
        </#if>
        <p>
			${day!}
        </p>

        <h2 >
            <b>${title!}</b>
        </h2>

	    <span class="media-body">
        ${content?replace("\\r\\n","<br/>")!}
        </span>
    </div>

</div>
