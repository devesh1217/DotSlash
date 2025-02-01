"use client"
import React, { useEffect, useState } from 'react';

function Services() {
  const [sections, setSections] = useState({
    central: {
      services: [],
      loading: false,
      error: null
    },
    state: {
      services: [],
      loading: false,
      selectedState: '',
      error: null
    },
    local: {
      services: [],
      loading: false,
      selectedState: '',
      selectedDistrict: '',
      error: null
    }
  });

  // Fetch services for each section
  const fetchServices = async (scope, params = {}) => {
    setSections(prev => ({
      ...prev,
      [scope]: { ...prev[scope], loading: true }
    }));

    const queryParams = new URLSearchParams(params).toString();
    try {
      const response = await fetch(`/api/services/get/${scope}${queryParams ? `?${queryParams}` : ''}`);
      const data = await response.json();
      
      console.log(`${scope} services response:`, data);

      if (data.error) {
        throw new Error(data.error);
      }
      
      setSections(prev => ({
        ...prev,
        [scope]: {
          ...prev[scope],
          services: data.services || [],
          loading: false,
          error: null
        }
      }));
    } catch (error) {
      console.error(`Error fetching ${scope} services:`, error);
      setSections(prev => ({
        ...prev,
        [scope]: { 
          ...prev[scope], 
          loading: false,
          error: error.message
        }
      }));
    }
  };

  useEffect(() => {
    fetchServices('central');
    fetchServices('state');
    fetchServices('local');
  }, []);

  // Handle state selection for state services
  const handleStateServiceStateChange = (state) => {
    setSections(prev => ({
      ...prev,
      state: { ...prev.state, selectedState: state }
    }));
    fetchServices('state', { state });
  };

  // Handle state and district selection for local services
  const handleLocalServiceLocationChange = (type, value) => {
    setSections(prev => ({
      ...prev,
      local: {
        ...prev.local,
        [type === 'state' ? 'selectedState' : 'selectedDistrict']: value,
        ...(type === 'state' ? { selectedDistrict: '' } : {})
      }
    }));

    const params = {
      ...(type === 'state' ? { state: value } : { 
        state: sections.local.selectedState,
        district: value 
      })
    };
    fetchServices('local', params);
  };

  const ServiceCard = ({ service }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gov-light hover:border-gov-accent">
      <h3 className="font-semibold text-xl text-gov-primary mb-2">{service.name}</h3>
      <p className="text-sm text-gov-dark mb-4">{service.description}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gov-secondary font-medium">{service.organization.name}</p>
        <button className="px-4 py-1 text-sm bg-gov-primary text-white rounded hover:bg-gov-dark transition-colors">
          Apply
        </button>
      </div>
    </div>
  );

  const SelectInput = ({ value, onChange, options, placeholder, disabled }) => (
    <select
      className="px-4 py-2 border border-gov-light rounded-md bg-white text-gov-dark 
                 hover:border-gov-accent focus:border-gov-primary focus:ring-1 focus:ring-gov-primary
                 disabled:bg-gray-50 disabled:text-gray-500"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );

  const SectionHeader = ({ title, children }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gov-light">
      <h2 className="text-2xl font-bold text-gov-primary">{title}</h2>
      {children}
    </div>
  );

  const SectionContent = ({ scope, services, loading, error }) => {
    if (loading) return (
      <div className="text-center py-8 text-gov-secondary">
        <p>Loading services...</p>
      </div>
    );
    
    if (error) return (
      <div className="text-center py-8 text-gov-error">
        <p>Error: {error}</p>
      </div>
    );
    
    if (!services?.length) return (
      <div className="text-center py-8 text-gov-secondary bg-gov-light/20 rounded-lg">
        <p>No services available for the selected criteria</p>
      </div>
    );
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      {/* Central Services Section */}
      <section>
        <SectionHeader title="Central Government Services" />
        <SectionContent 
          scope="central"
          services={sections.central.services}
          loading={sections.central.loading}
          error={sections.central.error}
        />
      </section>

      {/* State Services Section */}
      <section>
        <SectionHeader title="State Government Services">
          <SelectInput
            value={sections.state.selectedState}
            onChange={(e) => handleStateServiceStateChange(e.target.value)}
            options={[
              { value: "Gujarat", label: "Gujarat" },
              { value: "Maharashtra", label: "Maharashtra" }
            ]}
            placeholder="Select State"
          />
        </SectionHeader>
        <SectionContent 
          scope="state"
          services={sections.state.services}
          loading={sections.state.loading}
          error={sections.state.error}
        />
      </section>

      {/* Local Services Section */}
      <section>
        <SectionHeader title="Local Body Services">
          <div className="flex flex-col sm:flex-row gap-4">
            <SelectInput
              value={sections.local.selectedState}
              onChange={(e) => handleLocalServiceLocationChange('state', e.target.value)}
              options={[
                { value: "Gujarat", label: "Gujarat" },
                { value: "Maharashtra", label: "Maharashtra" }
              ]}
              placeholder="Select State"
            />
            <SelectInput
              value={sections.local.selectedDistrict}
              onChange={(e) => handleLocalServiceLocationChange('district', e.target.value)}
              options={
                sections.local.selectedState === 'Gujarat' 
                  ? [
                      { value: "Ahmedabad", label: "Ahmedabad" },
                      { value: "Surat", label: "Surat" },
                      { value: "Gandhinagar", label: "Gandhinagar" }
                    ]
                  : sections.local.selectedState === 'Maharashtra'
                  ? [
                      { value: "Mumbai", label: "Mumbai" },
                      { value: "Nashik", label: "Nashik" }
                    ]
                  : []
              }
              placeholder="Select District"
              disabled={!sections.local.selectedState}
            />
          </div>
        </SectionHeader>
        <SectionContent 
          scope="local"
          services={sections.local.services}
          loading={sections.local.loading}
          error={sections.local.error}
        />
      </section>
    </div>
  );
}

export default Services;