<#import "/wcm.ftl" as wcm/>

<!-- WCM Wrapper content -->
<div class="wcm-wrapper-content">
    <@wcm.header />

	<!-- Wrapper -->
	<div class="wcm-all-content" style='padding-left:0px !important'>
           <div id="wcm-content" class="clearfix wcm-background">
           		
           		<!-- Onde deverá estar a barra de formatação -->
	        	<#if pageRender.isEditMode()=true>
	            <div name="formatBar" id="formatBar"></div>
	            <!-- Div geral -->
	            <!-- Há CSS distinto para Edição/Visualização -->
	            <div id="edicaoPagina" class="clearfix">
	            <#else>
				<div id="visualizacaoPagina" class="clearfix">
	        	</#if>
           		
				<div id="all-slots-left" class="layout-2-3left clearfix">
					<div id="divSlot1" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotLeftA" editableSlot="true" decorator="false"/>
					</div>
					<div id="divSlot2" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotLeftB" editableSlot="true" decorator="false"/>
					</div>
					<div id="divSlot3" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotLeftC" editableSlot="true" decorator="false"/>
					</div>
					<div id="divSlot4" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotLeftD" editableSlot="true" decorator="false"/>
					</div>
					<div id="divSlot5" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotLeftE" editableSlot="true" decorator="false"/>
					</div>
				</div>																
								
				<div id="all-slots-right">
					<div id="divSlot6" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotRightA" editableSlot="true" decorator="false"/>
					</div>
					
					<div id="divSlot7" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotRightB" editableSlot="true" decorator="false"/>
					</div>
													
					<div id="divSlot8" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotRightC" editableSlot="true" decorator="false"/>
					</div>
					
					<div id="divSlot9" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotRightD" editableSlot="true" decorator="false"/>
					</div>
					
					<div id="divSlot10" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotRightE" editableSlot="true" decorator="false"/>
					</div>
					
					<div id="divSlot11" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotRightF" editableSlot="true" decorator="false"/>
					</div>
					
					<div id="divSlot12" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotRightG" editableSlot="true" decorator="false"/>
					</div>
					<div id="divSlot13" class="editable-slot slotfull layout-1-1">
                        <@wcm.renderSlot id="SlotRightH" editableSlot="true" decorator="false"/>
					</div>
					
                </div>
           <@wcm.footer layoutuserlabel="layout.default.user" />
		</div>
    </div>
</div>