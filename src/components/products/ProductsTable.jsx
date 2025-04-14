import { motion } from "framer-motion";
import { Edit, Search, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const TrekkingPackagesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    daysRequired: "",
    rating: "",
    difficultyLevel: "",
    maxGroupSize: "",
    bestSeason: "",
    includedServices: "",
    excludedServices: "",
    location: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch data from API using Axios
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/api/package/trekking-packages");
        
        if (response.data.success && Array.isArray(response.data.packages)) {
          setPackages(response.data.packages);
          setFilteredPackages(response.data.packages);
        } else {
          throw new Error("Invalid data format received from API");
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching trekking packages:", error);
        setError("Failed to load trekking packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = packages.filter((pkg) =>
      pkg.title.toLowerCase().includes(term)
    );
    setFilteredPackages(filtered);
  };

  const handleAddOrUpdatePackage = async (e) => {
    e.preventDefault();
    
    const newPackage = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      daysRequired: parseInt(formData.daysRequired),
      rating: parseFloat(formData.rating),
      difficultyLevel: formData.difficultyLevel,
      maxGroupSize: parseInt(formData.maxGroupSize),
      bestSeason: formData.bestSeason,
      includedServices: formData.includedServices.split(",").map((item) => item.trim()),
      excludedServices: formData.excludedServices.split(",").map((item) => item.trim()),
      location: formData.location,
    };

    try {
      if (editId) {
        // Update existing package
        await axios.put(`http://localhost:4000/api/package/trekking-packages/${editId}`, newPackage);
      } else {
        // Add new package
        await axios.post('http://localhost:4000/api/package/add-trekking-packages', newPackage);
      }

      // Refresh the packages lis
      const response = await axios.get("http://localhost:4000/api/package/trekking-packages");
      
      if (response.data.success && Array.isArray(response.data.packages)) {
        setPackages(response.data.packages);
        setFilteredPackages(response.data.packages);
      } else {
        throw new Error("Invalid data format received from API");
      }
      
      // Reset form and show success
      setShowForm(false);
      setEditId(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        daysRequired: "",
        rating: "",
        difficultyLevel: "",
        maxGroupSize: "",
        bestSeason: "",
        includedServices: "",
        excludedServices: "",
        location: "",
      });
      
    } catch (error) {
      console.error("Error saving trekking package:", error);
      setError(error.response?.data?.message || "Failed to save trekking package. Please try again later.");
    }
  };

  const handleEdit = (pkg) => {
    setEditId(pkg._id);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price.toString(),
      daysRequired: pkg.daysRequired.toString(),
      rating: pkg.rating.toString(),
      difficultyLevel: pkg.difficultyLevel,
      maxGroupSize: pkg.maxGroupSize.toString(),
      bestSeason: pkg.bestSeason,
      includedServices: pkg.includedServices.join(", "),
      excludedServices: pkg.excludedServices.join(", "),
      location: pkg.location,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:4000/api/package/trekking-packages/${id}`);
      
      if (response.data.success) {
        // Optimistically update the UI without refetching
        setPackages(prev => prev.filter(pkg => pkg._id !== id));
        setFilteredPackages(prev => prev.filter(pkg => pkg._id !== id));
        setError(null);
      } else {
        throw new Error(response.data.message || "Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting trekking package:", error);
      setError(error.response?.data?.message || "Failed to delete trekking package. Please try again later.");
      
      // Re-fetch packages to ensure UI is in sync with server
      try {
        const refreshResponse = await axios.get("http://localhost:4000/api/package/trekking-packages");
        if (refreshResponse.data.success && Array.isArray(refreshResponse.data.packages)) {
          setPackages(refreshResponse.data.packages);
          setFilteredPackages(refreshResponse.data.packages);
        }
      } catch (refreshError) {
        console.error("Error refreshing packages:", refreshError);
      }
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Trekking Packages</h2>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search packages..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setFormData({
                title: "",
                description: "",
                price: "",
                daysRequired: "",
                rating: "",
                difficultyLevel: "",
                maxGroupSize: "",
                bestSeason: "",
                includedServices: "",
                excludedServices: "",
                location: "",
              });
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            Add Package
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-800 bg-opacity-50 text-white p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddOrUpdatePackage} className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Days Required</label>
              <input
                type="number"
                name="daysRequired"
                value={formData.daysRequired}
                onChange={(e) => setFormData({ ...formData, daysRequired: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                step="0.1"
                min="0"
                max="5"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Difficulty Level</label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                required
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Difficult">Difficult</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Max Group Size</label>
              <input
                type="number"
                name="maxGroupSize"
                value={formData.maxGroupSize}
                onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Best Season</label>
              <select
                name="bestSeason"
                value={formData.bestSeason}
                onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                required
              >
                <option value="">Select season</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
                <option value="All Year">All Year</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Included Services (comma separated)</label>
              <input
                type="text"
                name="includedServices"
                value={formData.includedServices}
                onChange={(e) => setFormData({ ...formData, includedServices: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                placeholder="e.g., Accommodation, Meals, Guide"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Excluded Services (comma separated)</label>
              <input
                type="text"
                name="excludedServices"
                value={formData.excludedServices}
                onChange={(e) => setFormData({ ...formData, excludedServices: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                placeholder="e.g., Flights, Insurance"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-gray-600 text-white p-2 rounded"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              {editId ? "Update Package" : "Add Package"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-300">Loading trekking packages...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                    {searchTerm ? "No packages match your search" : "No trekking packages available"}
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => (
                  <motion.tr
                    key={pkg._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{pkg.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${pkg.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pkg.daysRequired}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        pkg.rating >= 4 ? 'bg-green-900 text-green-200' :
                        pkg.rating >= 3 ? 'bg-blue-900 text-blue-200' :
                        pkg.rating >= 2 ? 'bg-yellow-900 text-yellow-200' :
                        'bg-red-900 text-red-200'
                      }`}>
                        {pkg.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pkg.difficultyLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pkg.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-600"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-600"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default TrekkingPackagesTable;