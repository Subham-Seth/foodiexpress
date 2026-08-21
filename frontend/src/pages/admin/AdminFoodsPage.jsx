import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Flame,
  Clock,
  Sparkles,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { VegBadge } from '../../components/common/Badge';
import { PageLoader } from '../../components/common/Loader';
import { foodAPI, categoryAPI, uploadAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminFoodsPage = () => {
  const { showToast } = useToast();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    category: '',
    image: '',
    ingredients: '',
    prepTimeMinutes: 20,
    calories: 300,
    isVeg: true,
    isSpicy: false,
    isFeatured: false,
    isAvailable: true
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    try {
      const [foodsRes, catsRes] = await Promise.all([
        foodAPI.getAll({ limit: 100 }),
        categoryAPI.getAll()
      ]);
      if (foodsRes.data.success) setFoods(foodsRes.data.data);
      if (catsRes.data.success) setCategories(catsRes.data.data);
    } catch (err) {
      console.error('Failed to load food items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingFood(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || ''
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      discountedPrice: food.discountedPrice || '',
      category: food.category?._id || food.category,
      image: food.image,
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : '',
      prepTimeMinutes: food.prepTimeMinutes || 20,
      calories: food.calories || 300,
      isVeg: food.isVeg,
      isSpicy: food.isSpicy,
      isFeatured: food.isFeatured,
      isAvailable: food.isAvailable
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      showToast('Uploading food image...', 'info');
      const res = await uploadAPI.uploadImage(data);
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
        showToast('Image uploaded successfully', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      showToast('Please fill all mandatory fields (Name, Price, Category, Image)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : 0,
        prepTimeMinutes: Number(formData.prepTimeMinutes),
        calories: Number(formData.calories),
        ingredients: formData.ingredients ? formData.ingredients.split(',').map((s) => s.trim()) : []
      };

      if (editingFood) {
        await foodAPI.update(editingFood._id, payload);
        showToast('Dish updated successfully', 'success');
      } else {
        await foodAPI.create(payload);
        showToast('Dish added to catalog successfully', 'success');
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save food item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    try {
      await foodAPI.delete(id);
      showToast('Dish removed from catalog', 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to delete dish', 'error');
    }
  };

  const handleToggleAvailability = async (food) => {
    try {
      await foodAPI.update(food._id, { isAvailable: !food.isAvailable });
      showToast(`Availability updated for ${food.name}`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to toggle availability', 'error');
    }
  };

  // Filtered foods
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCat === 'all' ||
      food.category?._id === selectedCat ||
      food.category === selectedCat ||
      food.category?.slug === selectedCat;
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return <PageLoader message="Loading food catalog..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Menu Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Food Items Directory ({foods.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-purple-600/30 transition-transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category filter */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Foods Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Diet</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFoods.map((food) => (
                <tr key={food._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{food.name}</h4>
                        <p className="text-[10px] text-slate-400">
                          {food.prepTimeMinutes || 20} mins • {food.calories || 300} kcal
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {food.categoryName || food.category?.name || 'Delicacy'}
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">
                    ₹{food.discountedPrice > 0 ? food.discountedPrice : food.price}
                    {food.discountedPrice > 0 && (
                      <span className="text-[10px] text-slate-400 line-through ml-1.5 font-normal">
                        ₹{food.price}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <VegBadge isVeg={food.isVeg} />
                      {food.isSpicy && <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />}
                      {food.isFeatured && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleAvailability(food)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        food.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {food.isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEditModal(food)}
                        className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit dish"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingFood ? `Edit Dish: ${editingFood.name}` : 'Add New Delicious Dish'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Cheesy Truffle Burger"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="399"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Discounted Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleFormChange}
                    placeholder="349"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Prep Time (Minutes)
                  </label>
                  <input
                    type="number"
                    name="prepTimeMinutes"
                    value={formData.prepTimeMinutes}
                    onChange={handleFormChange}
                    placeholder="20"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Image URL or Local Upload *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    <label className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl cursor-pointer font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows="3"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Describe flavors, toppings, crust..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Key Ingredients (Comma-separated)
                  </label>
                  <input
                    type="text"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleFormChange}
                    placeholder="Mozzarella, Fresh Basil, Truffle Oil, Sourdough"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={formData.isVeg}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isSpicy"
                    checked={formData.isSpicy}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>Spicy</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Chef Special</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>In Stock</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  {submitting ? 'Saving...' : editingFood ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFoodsPage;
