<#if !sourceType??>
    <#assign sourceType = "dataset">
</#if>

<#if !numberOfRecords??>
    <#assign numberOfRecords = 5>
</#if>

<#if url??>
    <#assign parameters = '{"sourceType": "${sourceType}", "url": "${url?url}", "numberOfRecords": "${numberOfRecords!5}"}'?html>
<#else>
    <#assign parameters = '{"sourceType": "${sourceType}", "numberOfRecords": "${numberOfRecords!5}"}'?html>
</#if>

<div id="WidgetConvenios_${instanceId}"
     class="super-widget wcm-widget-class fluig-style-guide"
     data-params="WidgetConvenios.instance(${parameters})">

    <form role="form"  class="fs-sm-space">
        <div id="conveniosDataset_${instanceId}" class="form-group">
            <label for="conveniosDataSetLink_${instanceId}">${i18n.getTranslation('kit_convenios.data.datasetlink')}</label>
            <br>
            <a id="conveniosDataSetLink_${instanceId}" href="#" class="fs-word-break"></a>
        </div>

        <div id="articles_${instanceId}" class="form-group">
            <label for="conveniosNumberOfRecords_${instanceId}">${i18n.getTranslation('kit_convenios.label.numberOfRecords')}</label>
            <input class="form-control" id="conveniosNumberOfRecords_${instanceId}" value="${numberOfRecords!}" />
        </div>
		<div class="text-right">
			<button type="submit" class="btn btn-primary "
                data-save-preferences>${i18n.getTranslation('kit_convenios.label.save')}</button>
		</div>
    </form>

</div>
<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>