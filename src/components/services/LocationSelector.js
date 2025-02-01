import React from 'react';

const STATES = ['Gujarat', 'Maharashtra', 'Karnataka']; // Add more states
const DISTRICTS = {
    'Gujarat': ['Surat', 'Ahmedabad', 'Vadodara'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nashik'],
    // Add more districts
};

function LocationSelector({ location, setLocation }) {
    const handleStateChange = (state) => {
        setLocation({
            state,
            district: '',
            city: '',
            isRural: false
        });
    };

    const handleDistrictChange = (district) => {
        setLocation(prev => ({
            ...prev,
            district,
            city: district, // Assuming city name same as district for now
            village: '',
            taluka: ''
        }));
    };

    const handleAreaTypeChange = (isRural) => {
        setLocation(prev => ({
            ...prev,
            isRural,
            city: isRural ? '' : prev.district,
            village: isRural ? '' : '',
            taluka: isRural ? '' : ''
        }));
    };

    return (
        <div className="bg-gov-light p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gov-dark">Select Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gov-text mb-2">
                        State
                    </label>
                    <select
                        className="w-full p-2 border rounded bg-white text-gov-text"
                        value={location.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                    >
                        <option value="">Select State</option>
                        {STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                {location.state && (
                    <div>
                        <label className="block text-sm font-medium text-gov-text mb-2">
                            District
                        </label>
                        <select
                            className="w-full p-2 border rounded bg-white text-gov-text"
                            value={location.district}
                            onChange={(e) => handleDistrictChange(e.target.value)}
                        >
                            <option value="">Select District</option>
                            {DISTRICTS[location.state]?.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>
                )}

                {location.district && (
                    <div>
                        <label className="block text-sm font-medium text-gov-text mb-2">
                            Area Type
                        </label>
                        <div className="space-x-4 text-gov-text">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    checked={!location.isRural}
                                    onChange={() => handleAreaTypeChange(false)}
                                    className="form-radio"
                                />
                                <span className="ml-2">Urban</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    checked={location.isRural}
                                    onChange={() => handleAreaTypeChange(true)}
                                    className="form-radio"
                                />
                                <span className="ml-2">Rural</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LocationSelector;
