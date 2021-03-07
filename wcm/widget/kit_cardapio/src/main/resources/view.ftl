<#assign parameters = '{"numberOfRecords": ${numberOfRecords!7}, "widgetVersion" : "${applicationVersion}"}'?html>
<div id="WidgetCardapio_${instanceId}"
     class="super-widget wcm-widget-class fluig-style-guide"
     data-params="WidgetCardapio.instance(${parameters})">

    <h2 class="page-header"> 
    	<span class="fluigicon fluigicon-food fluigicon-md"></span>
        ${i18n.getTranslation('application.title')}
    </h2>

    <div>
    	<div class="row">
    		<div class="col-xs-12">
    			<div class="alert alert-info" role="alert" data-has-not-today>${i18n.getTranslation('kit_cardapio.no.course.for.today')}</div>
	    		<ul class="list-group" data-list-courses></ul>
    		</div>
    	</div>
    	<div class="row" data-row-load-more>
    		<div class="col-xs-12 text-center">
    			<button type="button" class="btn btn-default btn-md btn-block" data-load-more>${i18n.getTranslation('kit_cardapio.load.more')}</button>
    		</div>
    	</div>
    </div>
    
    <script type="text/template" class="template-courses">
	    <li class="list-group-item fs-no-border-left fs-no-border-right fs-cursor-pointer fs-no-padding-left fs-no-padding-right" data-show-detail data-array-position="{{arrayPosition}}">
			<div class="media media-meal">
			    <a class="pull-left" href="#">
			    	<img width="120" class="media-object img-rounded" src="{{imgUrl}}" alt="{{mealTitle}}">
			    </a>
			    <div class="media-body">
			        <div class="media-heading">
						<small>
							{{dayOfTheWeek}}
							{{#isToday}}
							<span class="label label-info">
								${i18n.getTranslation('kit_cardapio.today')}
							</span>
							{{/isToday}}
						</small>
					</div>
					<h2>{{mealTitle}}</h2>
					<p>{{mealDescMin}}</p>
			    </div>
			</div>
		</li>
	</script>
	<script type="text/template" class="template-course-detail">
		<div class="media media-meal">
		    <a class="pull-left" href="#">
		    	<img width="120" class="media-object img-rounded" src="{{imgUrl}}" alt="{{mealTitle}}">
		    </a>
		    <div class="media-body">
		        <div class="media-heading">
					{{#isToday}}
					<small>
						<span class="label label-info">
							${i18n.getTranslation('kit_cardapio.today')}
						</span>
					</small>
					{{/isToday}}
				</div>
				<h2>{{mealTitle}}</h2>
				<p>{{mealDesc}}</p>
		    </div>
		</div>
	</script>
</div>

<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>