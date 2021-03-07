package com.fluig.kitintranet.parse.core.type;

public enum RMMethodType {
	ORGANIZATION_CHART("FopSubordinadosData"),
	BIRTHDAY("RhuPessoaData");
	
	private String type = null;
	RMMethodType(String chosenType){
		type = chosenType;
	}
	
	public String getType(){
		return this.type;
	}
}
