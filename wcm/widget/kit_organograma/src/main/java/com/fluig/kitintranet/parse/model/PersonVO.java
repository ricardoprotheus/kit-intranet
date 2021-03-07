package com.fluig.kitintranet.parse.model;

import com.fluig.kitintranet.parse.core.annotation.WSBinderFieldSetter;
import com.fluig.kitintranet.parse.core.annotation.WSBinderObject;

@WSBinderObject(tag = "PPESSOA")
public class PersonVO {

	private String userCode;
	private String email;
	private String name;

	@WSBinderFieldSetter(tag = "EMAIL")
	public void setEmail(String email) {
		this.email = email;
	}

	public String getEmail() {
		return email;
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

	@WSBinderFieldSetter(tag = "CODIGO")
	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}
}