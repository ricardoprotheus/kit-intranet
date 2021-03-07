<#if !numberOfRecords??>
    <#assign numberOfRecords = 5>
</#if>

<div id="WidgetCardapio_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="WidgetCardapio.instance()">
	<div class="container-fluid">
		<div class="row">
			<div class="col-xs-12">
				<form role="form">
				    <div class="form-group">
				        <label for="formLink">${i18n.getTranslation('kit_cardapio.form.link')}</label><br>
				        <a data-form-link href="#" class="fs-word-break"></a>
				    </div>
				    <div class="form-group">
				        <label for="numberOfRecords">${i18n.getTranslation('kit_cardapio.register.limit')}</label>
				        <input type="number" class="form-control" id="numberOfRecords" placeholder="" value="${numberOfRecords}" data-number-of-records>
				        <p class="help-block"><small>${i18n.getTranslation('kit_cardapio.register.limit.helper')}</small></p>
				    </div>
				    <div class="text-right">
				   		<button type="button" class="btn btn-primary" data-save-settings>${i18n.getTranslation('kit_cardapio.save.settings')}</button>
				   		<br><br>
				   	</div>
				</form>
			</div>
		</div>
	</div>
</div>
<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>