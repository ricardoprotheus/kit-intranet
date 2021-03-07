<div id="Organograma_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide container-fluid" data-params="Organograma.instance()">
    <form role="form" id="editForm_${instanceId}" name="editForm_${instanceId}" class="fs-sm-space">
        <div class="form-group">
            <label for="serviceLink_${instanceId}" class="control-label">${i18n.getTranslation('kit_organograma.edit.servicehost')}</label>
            <i class="fluigicon fluigicon-question-sign" data-toggle="tooltip" title="${i18n.getTranslation('kit_organograma.edit.link.tooltip')}"></i>
            <input type="text" class="form-control" id="serviceLink_${instanceId}" value="${serviceLink!}"
                   placeholder="${i18n.getTranslation('kit_organograma.edit.service.placeholder')}"/>
        </div>

        <div class="form-group">
            <label for="login_${instanceId}" class="control-label">${i18n.getTranslation('kit_organograma.edit.login')}</label>
            <i class="fluigicon fluigicon-question-sign" data-toggle="tooltip" title="${i18n.getTranslation('kit_organograma.edit.login.tooltip')}"></i>
            <input type="text" class="form-control" id="login_${instanceId}" value="${login!}" />
        </div>

        <div class="form-group">
            <label for="password_${instanceId}" class="control-label">${i18n.getTranslation('kit_organograma.edit.password')}</label>
            <i class="fluigicon fluigicon-question-sign" data-toggle="tooltip" title="${i18n.getTranslation('kit_organograma.edit.password.tooltip')}"></i>
            <input type="password" class="form-control" id="password_${instanceId}" value="${password!}" />
        </div>

        <div class="form-group">
            <label for="userHead_${instanceId}" class="control-label">${i18n.getTranslation('kit_organograma.edit.userhead')}</label>
            <i class="fluigicon fluigicon-question-sign" data-toggle="tooltip" title="${i18n.getTranslation('kit_organograma.edit.supervisor.tooltip')}"></i>
            <input type="text" class="form-control" id="userHead_${instanceId}" value="${userHead!}" />
        </div>

        <div class="form-group">
            <label for="userOrgId_${instanceId}" class="control-label">${i18n.getTranslation('kit_organograma.edit.userOrgId')}</label>
            <i class="fluigicon fluigicon-question-sign" data-toggle="tooltip" title="${i18n.getTranslation('kit_organograma.edit.id.tooltip')}"></i>
            <input type="text" class="form-control" id="userOrgId_${instanceId}" value="${userOrgId!}" />
        </div>

        <div class="text-right">
            <input type="button" class="btn btn-primary" value="${i18n.getTranslation('kit_organograma.edit.savepref')}" data-save-preferences/>
        </div>
    </form>
</div>
