<#assign parameters = "{widgetVersion : '${applicationVersion}', instanceId: '${instanceId}', serviceLink: '${serviceLink!}', login: '${login!}', password: '${password!}', userHead: '${userHead!}', userOrgId: '${userOrgId!}'}"?html>

<div id="Organograma_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="Organograma.instance(${parameters})" style="margin-top: 30px;">
    <script type="text/template" class="template_organization_chart">
        <h2>
            <span class="fluigicon fluigicon-organogram fluigicon-md"></span>
            ${i18n.getTranslation('kit_organograma.view.title')}

        </h2>
        <hr class="fs-transparent-25 fs-no-margin-bottom"/>
        <div id="organizationChartContainer_${instanceId}">
            <div id="organizationChart_${instanceId}"></div>
        </div>
    </script>
</div>
    
<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>