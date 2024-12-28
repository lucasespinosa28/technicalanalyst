import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FormData {
  pool_address: string;
  timeframe: string;
  aggregate: number;
  limit: number;
}


interface GeckoTerminalFormProps {
  id: string;
  poolAddresses: string;
  onSubmit: (formData: FormData) => void;
}

const GeckoTerminalForm: React.FC<GeckoTerminalFormProps> = ({id, poolAddresses, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    pool_address: poolAddresses,
    timeframe: 'day',
    aggregate: 1,
    limit: 24
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: name === 'aggregate' || name === 'limit' ? parseInt(value) : value
      };

      // Reset aggregate when timeframe changes
      if (name === 'timeframe') {
        switch (value) {
          case 'day':
            updatedData.aggregate = 1;
            break;
          case 'hour':
            updatedData.aggregate = 1;
            break;
          case 'minute':
            updatedData.aggregate = 1;
            break;
        }
      }

      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <div id={id} className="bg-white shadow-md rounded-lg p-6 mb-6">
         <h3 className="text-xl font-semibold mb-4">Get ohlcv data from pool</h3>
      <form className='m-2' onSubmit={handleSubmit}>
        <Input
          type="text"
          name="pool_address"
          value={formData.pool_address}
          onChange={handleInputChange}
          placeholder="Pool Address"
          required
        />
        <select
          name="timeframe"
          value={formData.timeframe}
          onChange={handleInputChange}
          required
          className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="day">Day</option>
          <option value="hour">Hour</option>
          <option value="minute">Minute</option>
        </select>
        <select
          name="aggregate"
          value={formData.aggregate}
          onChange={handleInputChange}
          required
          className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"

        >
          {formData.timeframe === 'day' && (
            <option value="1">1</option>
          )}
          {formData.timeframe === 'hour' && (
            <>
              <option value="1">1</option>
              <option value="4">4</option>
              <option value="12">12</option>
            </>
          )}
          {formData.timeframe === 'minute' && (
            <>
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="15">15</option>
            </>
          )}
        </select>
        <div className="mt-4">
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
            Limit: <span className="font-bold">{formData.limit}</span>
          </label>
          <Input
            type="range"
            id="limit"
            name="limit"
            min="1"
            max="100"
            value={formData.limit}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit">Fetch Data</Button>
      </form>
    </div>

  );
};

export default GeckoTerminalForm;
