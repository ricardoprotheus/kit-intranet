package com.fluig.kitintranet.rest.application;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import com.fluig.kitintranet.rest.BirthdayProxy;
import com.fluig.kitintranet.rest.OrganizationChartProxy;

public class ServiceApplication extends Application  {
	private Set<Object> singletons = new HashSet<Object>();

	public ServiceApplication() {
		singletons.add(new BirthdayProxy());
		singletons.add(new OrganizationChartProxy());
	}

	@Override
	public Set<Object> getSingletons() {
		return singletons;
	}
}