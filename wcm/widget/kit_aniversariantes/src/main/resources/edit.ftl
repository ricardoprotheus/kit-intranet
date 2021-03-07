<#assign parameters = "{'widgetVersion': '${applicationVersion!}', 'sourceType': '${sourceType!'form'}', 'rmLink': '${rmLink!}', 'rmUser': '${rmUser!}', 'rmPass': '${rmPass!}'}"?html>

<div id="WdgtAniversarios_${instanceId}"
     class="super-widget wcm-widget-class fluig-style-guide"
     data-params="WdgtAniversarios.instance(${parameters})">

    <form role="form" class="fs-sm-space" id="editForm_${instanceId}" name="editForm_${instanceId}">
        <div class="dropdown">
            <h3>${i18n.getTranslation('kit_aniversariantes.edit.title')}</h3>
            <button class="btn btn-default dropdown-toggle" type="button" id="sourceTypeButton_${instanceId}" data-toggle="dropdown">
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                <li data-option-form role="presentation"><a role="menuitem" tabindex="-1" href="#">${i18n.getTranslation('kit_aniversariantes.opt.form')}</a></li>
                <li data-option-rm role="presentation"><a role="menuitem" tabindex="-1" href="#">${i18n.getTranslation('kit_aniversariantes.opt.rm')}</a></li>
            </ul>
            <input id="sourceType_${instanceId}" name="sourceType_${instanceId}" type="hidden" value="${sourceType!}"/>
        </div>

        <div id="formRM_${instanceId}">
            <div class="form-group" id="rmLinkDiv_${instanceId}">
                <label for="rmLink_${instanceId}">${i18n.getTranslation('kit_aniversariantes.edit.link')}</label>
                <i class="fluigicon fluigicon-question-sign" data-toggle="tooltip" title="${i18n.getTranslation('kit_aniversariantes.edit.link.tooltip')}"></i>
                <input type="text" class="form-control" id="rmLink_${instanceId}" name="rmLink_${instanceId}"
                       value="${rmLink!}"/>
            </div>
            <div class="form-group" id="rmUserDiv_${instanceId}">
                <label for="rmUser_${instanceId}">${i18n.getTranslation('kit_aniversariantes.edit.login')}</label>
                <i class="fluigicon fluigicon-question-sign" data-toggle="tooltip" title="${i18n.getTranslation('kit_aniversariantes.edit.login.tooltip')}"></i>
                <input type="text" class="form-control" id="rmUser_${instanceId}" name="rmUser_${instanceId}"
                       value="${rmUser!}"/>
            </div>
            <div class="form-group" id="rmPassDiv_${instanceId}">
                <label for="rmPass_${instanceId}">${i18n.getTranslation('kit_aniversariantes.edit.pass')}</label>
                <i class="fluigicon fluigicon-question-sign" data-toggle="tooltip" title="${i18n.getTranslation('kit_aniversariantes.edit.password.tooltip')}"></i>
                <input type="password" class="form-control" id="rmPass_${instanceId}" name="rmPass_${instanceId}"
                       value="${rmPass!}"/>
            </div>
        </div>

        <div id="formForm_${instanceId}">
            <div class="form-group">
                <label for="formLink_${instanceId}">${i18n.getTranslation('kit_aniversariantes.edit.formLink')}</label>
                <div>
                    <a id="formLink_${instanceId}" target="_blank" class="fs-word-break"></a>
                </div>
            </div>
        </div>

        <div class="text-right">
            <button type="button" class="btn btn-primary" data-save-preferences>
                ${i18n.getTranslation('kit_aniversariantes.save.preferences')}
            </button>
        </div>
    </form>
</div>
<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>
