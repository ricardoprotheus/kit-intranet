package com.fluig.kitintranet.parse.model;

import com.fluig.kitintranet.parse.core.annotation.WSBinderFieldSetter;
import com.fluig.kitintranet.parse.core.annotation.WSBinderObject;

@WSBinderObject(tag = "Equipe")
public class TeamVO {

	private String userCode;
	private String tag;
	private String name;

	@WSBinderFieldSetter(tag = "CHAPA")
	public void setTag(String tag) {
		this.tag = tag;
	}

	public String getTag() {
		return tag;
	}

	@WSBinderFieldSetter(tag = "NOME")
	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getUserCode() {
		return userCode;
	}

	@WSBinderFieldSetter(tag = "CODPESSOA")
	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}
}