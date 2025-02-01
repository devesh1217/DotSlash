'use client'
import { useState } from 'react';

const policyNames = ["Policy A", "Policy B", "Policy C", "Policy D", "Policy E"];
const sectors = ["Health", "Education", "Economy", "Environment", "Technology"];

export default function PolicyAnalysisForm() {
  const [formData, setFormData] = useState({
    policy_name: '',
    sector: '',
    population_affected: '',
    initial_sentiment: '',
    economic_impact: '',
    social_index_improvement: '',
    citizen_satisfaction: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission (API call)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('API Response:', result);  // Log the result to inspect the response

      if (response.ok) {
        setPrediction(result.predicted_satisfaction);  // Ensure predicted_satisfaction is returned by the backend
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Trigger handleSubmit on button click (API call)
  const handleButtonClick = (e) => {
    handleSubmit(e);  // Manually trigger the handleSubmit function
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 my-auto">
      <h3 className="text-lg font-semibold text-black mb-4">Policy Impact Analysis</h3>
      
      {/* Form */}
      <form>
        <div className="grid grid-cols-1 gap-6">
          {/* Policy Name */}
          <div>
            <label className="text-sm font-medium text-black">Policy Name</label>
            <select
              name="policy_name"
              value={formData.policy_name}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md"
              required
            >
              <option value="">Select Policy</option>
              {policyNames.map((policy) => (
                <option key={policy} value={policy}>
                  {policy}
                </option>
              ))}
            </select>
          </div>

          {/* Sector */}
          <div>
            <label className="text-sm font-medium text-black">Sector</label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md"
              required
            >
              <option value="">Select Sector</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Population Affected */}
          <div>
            <label className="text-sm font-medium text-black">Population Affected</label>
            <input
              type="number"
              name="population_affected"
              value={formData.population_affected}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md"
              placeholder="Enter the number of people affected"
              required
            />
          </div>

          {/* Initial Sentiment */}
          <div>
            <label className="text-sm font-medium text-black">Initial Sentiment (0 - 1)</label>
            <input
              type="number"
              name="initial_sentiment"
              value={formData.initial_sentiment}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md"
              min="0"
              max="1"
              step="0.01"
              placeholder="Enter Initial Sentiment"
              required
            />
          </div>

          {/* Economic Impact */}
          <div>
            <label className="text-sm font-medium text-black">Economic Impact (-5 to 10)</label>
            <input
              type="number"
              name="economic_impact"
              value={formData.economic_impact}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md"
              min="-5"
              max="10"
              step="0.1"
              placeholder="Enter Economic Impact"
              required
            />
          </div>

          {/* Social Index Improvement */}
          <div>
            <label className="text-sm font-medium text-black">Social Index Improvement (0 - 5)</label>
            <input
              type="number"
              name="social_index_improvement"
              value={formData.social_index_improvement}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md"
              min="0"
              max="5"
              step="0.1"
              placeholder="Enter Social Index Improvement"
              required
            />
          </div>

          {/* Citizen Satisfaction */}
          <div>
            <label className="text-sm font-medium text-black">Citizen Satisfaction (0 - 100)</label>
            <input
              type="number"
              name="citizen_satisfaction"
              value={formData.citizen_satisfaction}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md"
              min="0"
              max="100"
              step="1"
              placeholder="Enter Citizen Satisfaction"
              required
            />
          </div>

          <div className="mt-4">
            {/* Trigger handleSubmit on button click */}
            <button
              type="button"  // Change the button type to "button" so it doesn't submit the form automatically
              onClick={handleButtonClick}  // Manually trigger the API call
              className="bg-blue-500 text-white px-6 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Policy'}
            </button>
          </div>
        </div>
      </form>

      {/* Display Prediction */}
      {prediction && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-black">Predicted Impact:</h4>
          <p className="text-xl font-bold text-black">{prediction}</p>
        </div>
      )}

      {/* Display Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
