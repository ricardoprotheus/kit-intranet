package com.fluig.kitintranet.parse.services;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.List;

import com.fluig.kitintranet.parse.core.SOAPWebService;
import com.fluig.kitintranet.parse.core.binder.AnnotationXMLBinder;
import com.fluig.kitintranet.parse.core.type.RMMethodType;
import com.fluig.kitintranet.parse.model.ParameterVO;
import com.fluig.kitintranet.parse.model.PersonVO;
import com.fluig.kitintranet.parse.model.TeamVO;
import com.fluig.util.Utils;

public class RMServices {
	private ParameterVO parameter = null;
	public RMServices(String serverURL, String user, String password){
		parameter = new ParameterVO();
		parameter.setUrl(serverURL);
		parameter.setUser(user);
		parameter.setPassword(password);
	}

	public List<TeamVO> getOrganizationChart(String userCode) throws Exception {
		this.loadOrganizationalChartParameters(userCode);
		InputStream is = SOAPWebService.call(this.parameter);
		String xml = Utils.bytesToString(is);
		AnnotationXMLBinder<TeamVO> binder = new AnnotationXMLBinder<TeamVO>(
				TeamVO.class);
		List<TeamVO> result = binder.bind(new ByteArrayInputStream(xml.getBytes()));
		return result;
	}
	
	public PersonVO getPerson(String userCode) throws Exception {
		this.loadBirthdayParameters(userCode);
		InputStream is = SOAPWebService.call(this.parameter);
		String xml = Utils.bytesToString(is);
		AnnotationXMLBinder<PersonVO> binder = new AnnotationXMLBinder<PersonVO>(
				PersonVO.class);
		List<PersonVO> result = binder.bind(new ByteArrayInputStream(xml.getBytes()));
		return result!=null&&!result.isEmpty()?result.get(0):null;
	}
	
	private void loadOrganizationalChartParameters(String userCode){
		this.parameter.setType(RMMethodType.ORGANIZATION_CHART.getType());
		this.parameter.setContext("CODCOLIGADA=1;CODSISTEMA=V;CODUSUARIO=" + 
				this.parameter.getUser() + 
				";CHAPAFUNCIONARIO=" + userCode + ";rhTipoUsr=01");
		this.parameter.setFilter("PFUNC.CHAPA is not null");
	}
	
	private void loadBirthdayParameters(String userCode){
		this.parameter.setType(RMMethodType.BIRTHDAY.getType());
		this.parameter.setContext("CODCOLIGADA=1;CODSISTEMA=V;CODUSUARIO=" + 
				this.parameter.getUser());
		this.parameter.setFilter("PPESSOA.CODIGO=" + userCode);
	}
}