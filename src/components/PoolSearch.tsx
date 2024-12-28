import React, { useState, useMemo } from 'react';
import { pools } from '../pools';
import { Input } from './ui/input';
interface Pool {
  name: string;
  address: string;
}

interface PoolSearchProps {
  id: string;
  setSelectedPool: (pool: Pool | null) => void;
}

const PoolSearch: React.FC<PoolSearchProps> = ({ id, setSelectedPool }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPools = useMemo(() => {
    return pools.filter(pool =>
      pool.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelectedPool(null);
  };

  const handleSelectPool = (pool: Pool) => {
    setSelectedPool(pool);
    setSearchTerm('');
  };

  return (
    <div id={id} className="grid w-full max-w-sm items-center gap-1.5">
      <Input
        id="SearchPool"
        type="text"
        placeholder="Search for a pool..."
        value={searchTerm}
        onChange={handleSearch}
        className='ml-2 mt-2'
      />
      {searchTerm && (
        <ul className="ml-4 bg-white border border-gray-300 rounded-md shadow-sm">
          {filteredPools.map((pool, index) => (
            <li
              key={index}
              onClick={() => handleSelectPool(pool)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150 ease-in-out border-b border-gray-200 last:border-b-0"

            >
              {pool.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PoolSearch;