<#assign parameters = "{'widgetVersion': '${applicationVersion!}', 'sourceType': '${sourceType!'form'}'}"?html>
<div id="WdgtAniversarios_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="WdgtAniversarios.instance(${parameters})">
    <input type="hidden" id="sourceTypeView_${instanceId}" name="sourceTypeView_${instanceId}" value="${sourceType!}"/>
    <div class="page-header">
        <h2>
            <span class="fluigicon fluigicon-cake fluigicon-md"></span>
            <span id="birthdayMonth_${instanceId}">${i18n.getTranslation("kit_aniversariantes.birthdayMonth")}</span>
        </h2>
    </div>
    
    <div class="row" id="birthdays-wrapper_${instanceId}"></div><br>
    
    <div id="rowShowAll_${instanceId}" class="text-right">
    	<!-- Botão visível em telas grandes -->
        <button type="button" class="btn btn-default btn-block" data-more-birthdays>
            ${i18n.getTranslation('kit_aniversariantes.button.more')}
        </button>
    </div>
<script type="text/template" class="birthdays-template">
    {{#.}}
        {{>birthdays}}
    {{/.}}
</script>
<script type="text/template" class="birthday-template">
    <div class="col-xs-12 fs-cursor-pointer {{#isBirthdaysDetails}}fs-no-padding{{/isBirthdaysDetails}}" data-birthday-item data-open-birthday="{{documentId}}">
        <div class="media {{^isBirthdaysDetails}}fs-sm-space fs-no-padding-left fs-no-padding-right{{/isBirthdaysDetails}}">
            <ul class="list-group">
                <li class="fs-no-border list-group-item fs-no-padding-left fs-no-padding-right">
                    <div class="media">
                        <a class="pull-left fs-no-text-underline" href="#">
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    {{#isToday}}
                                        <span class="label label-info small">${i18n.getTranslation('kit_aniversariantes.today')}</span></br>
                                    {{/isToday}}
                                    <h3>
                                        {{#isBirthdaysDetails}}
                                            ...
                                        {{/isBirthdaysDetails}}
                                        {{^isBirthdaysDetails}}
                                            {{#isToday}}
                                                {{birthday}}
                                            {{/isToday}}
                                            {{^isToday}}
                                                {{birthday}}
                                            {{/isToday}}
                                        {{/isBirthdaysDetails}}
                                    </h3>
                                </div>
                            </div>
                        </a>
                        <div class="media-body">
                            <div class="media">
                                <a class="pull-left" href="#">
                                    <img class="fluig-style-guide thumb-profile thumb-profile-sm media-object img-circle userImage" width="40" src="{{imgURL}}" alt="{{name}}"/>
                                </a>
                                <div class="media-body">
                                    <h4 class="media-heading"><br>{{name}}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <hr class="fs-transparent-25 fs-no-margin-top fs-no-margin-bottom"/>
    </div>
</script>
</div>

<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>