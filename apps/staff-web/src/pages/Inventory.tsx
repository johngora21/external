import React, { useState } from 'react'
import { Search, Plus, Edit, Trash2, Package, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, X } from 'lucide-react'

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  lastRestocked: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
}

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: 'INV001',
    name: 'Multi-Vitamin Complex',
    category: 'Vitamins',
    currentStock: 150,
    minStock: 50,
    maxStock: 500,
    unitPrice: 29.99,
    lastRestocked: new Date('2023-12-01'),
    status: 'in-stock'
  },
  {
    id: 'INV002',
    name: 'Omega-3 Fish Oil',
    category: 'Omega-3',
    currentStock: 25,
    minStock: 30,
    maxStock: 200,
    unitPrice: 39.99,
    lastRestocked: new Date('2023-11-28'),
    status: 'low-stock'
  },
  {
    id: 'INV003',
    name: 'Protein Powder',
    category: 'Protein',
    currentStock: 0,
    minStock: 20,
    maxStock: 100,
    unitPrice: 49.99,
    lastRestocked: new Date('2023-11-15'),
    status: 'out-of-stock'
  },
  {
    id: 'INV004',
    name: 'Vitamin D3',
    category: 'Vitamins',
    currentStock: 75,
    minStock: 25,
    maxStock: 300,
    unitPrice: 19.99,
    lastRestocked: new Date('2023-12-05'),
    status: 'in-stock'
  },
  {
    id: 'INV005',
    name: 'Magnesium Complex',
    category: 'Minerals',
    currentStock: 200,
    minStock: 40,
    maxStock: 400,
    unitPrice: 24.99,
    lastRestocked: new Date('2023-12-03'),
    status: 'in-stock'
  }
]

function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [updateData, setUpdateData] = useState({
    quantity: 0,
    action: 'restock' as 'restock' | 'dispense'
  })
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: ''
  })
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    status: 'in-stock' as const
  })

  const categories = ['all', 'Vitamins', 'Omega-3', 'Protein', 'Minerals']
  const statuses = ['all', 'in-stock', 'low-stock', 'out-of-stock', 'discontinued']
  const formCategories = ['Vitamins', 'Omega-3', 'Protein', 'Minerals']

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'text-green-600'
      case 'low-stock':
        return 'text-yellow-600'
      case 'out-of-stock':
        return 'text-red-600'
      case 'discontinued':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStockIcon = (item: InventoryItem) => {
    if (item.status === 'out-of-stock') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    } else if (item.status === 'low-stock') {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    } else {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getStockTrend = (item: InventoryItem) => {
    const stockPercentage = (item.currentStock / item.maxStock) * 100
    if (stockPercentage > 80) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (stockPercentage < 20) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    }
    return null
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: `INV${String(inventory.length + 1).padStart(3, '0')}`,
      name: formData.name,
      category: formData.category,
      currentStock: formData.currentStock,
      minStock: formData.minStock,
      maxStock: formData.maxStock,
      unitPrice: formData.unitPrice,
      lastRestocked: new Date(),
      status: formData.status
    }
    
    setInventory([...inventory, newItem])
    setShowAddModal(false)
    setFormData({
      name: '',
      category: '',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unitPrice: 0,
      status: 'in-stock'
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unitPrice: 0,
      status: 'in-stock'
    })
  }

  const handleUpdateClick = (item: InventoryItem) => {
    setSelectedItem(item)
    setUpdateData({ quantity: 0, action: 'restock' })
    setShowUpdateModal(true)
  }

  const handleDelete = (itemId: string) => {
    setInventory(inventory.filter(item => item.id !== itemId))
  }

  const handleUpdateStock = () => {
    if (!selectedItem) return

    const updatedInventory = inventory.map(item => {
      if (item.id === selectedItem.id) {
        let newStock = item.currentStock
        let newLastRestocked = item.lastRestocked

        if (updateData.action === 'restock') {
          newStock += updateData.quantity
          newLastRestocked = new Date()
        } else if (updateData.action === 'dispense') {
          newStock -= updateData.quantity
          if (newStock < 0) newStock = 0
        }

        // Update status based on new stock
        let newStatus = item.status
        if (newStock === 0) {
          newStatus = 'out-of-stock'
        } else if (newStock <= item.minStock) {
          newStatus = 'low-stock'
        } else {
          newStatus = 'in-stock'
        }

        return {
          ...item,
          currentStock: newStock,
          lastRestocked: newLastRestocked,
          status: newStatus
        }
      }
      return item
    })

    setInventory(updatedInventory)
    setShowUpdateModal(false)
    setSelectedItem(null)
    setUpdateData({ quantity: 0, action: 'restock' })
  }

  const handleAddCategory = () => {
    if (categoryData.name) {
      // Add category logic here
      setShowCategoryModal(false)
      setCategoryData({ name: '', description: '' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600 mt-1">Manage supplement inventory and stock levels</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="btn-primary flex items-center"
          >
            <Package className="h-5 w-5 mr-2" />
            Category
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-end space-x-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select-field w-32"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="select-field w-32"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Status' : status.replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Restocked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.currentStock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${item.unitPrice.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(item.lastRestocked)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                      {item.status.replace('-', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleUpdateClick(item)}
                        className="px-2 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-primary-dark"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Package className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' 
              ? 'Try adjusting your search criteria' 
              : 'Get started by adding your first inventory item'}
          </p>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Item</h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field w-full"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="select-field w-full"
                >
                  <option value="">Select category</option>
                  {formCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({...formData, unitPrice: parseFloat(e.target.value) || 0})}
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value) || 0})}
                    className="input-field w-full"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!formData.name || !formData.category}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {showUpdateModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Update Stock</h2>
              <button
                onClick={() => {
                  setShowUpdateModal(false)
                  setSelectedItem(null)
                  setUpdateData({ quantity: 0, action: 'restock' })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">{selectedItem.name}</h3>
              <p className="text-sm text-gray-600">Current Stock: {selectedItem.currentStock}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action *
                </label>
                <select
                  value={updateData.action}
                  onChange={(e) => setUpdateData({...updateData, action: e.target.value as 'restock' | 'dispense'})}
                  className="select-field w-full"
                >
                  <option value="restock">Restock</option>
                  <option value="dispense">Dispense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={updateData.quantity}
                  onChange={(e) => setUpdateData({...updateData, quantity: parseInt(e.target.value) || 0})}
                  className="input-field w-full"
                  placeholder="Enter quantity"
                />
              </div>

              {updateData.action === 'dispense' && updateData.quantity > selectedItem.currentStock && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    Warning: Dispensing {updateData.quantity} units will exceed current stock of {selectedItem.currentStock}
                  </p>
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Stock Level:</strong> {
                    updateData.action === 'restock' 
                      ? selectedItem.currentStock + updateData.quantity
                      : Math.max(0, selectedItem.currentStock - updateData.quantity)
                  }
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUpdateModal(false)
                  setSelectedItem(null)
                  setUpdateData({ quantity: 0, action: 'restock' })
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                disabled={updateData.quantity <= 0}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {updateData.action === 'restock' ? 'Restock' : 'Dispense'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Category</h2>
              <button
                onClick={() => {
                  setShowCategoryModal(false)
                  setCategoryData({ name: '', description: '' })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryData.name}
                  onChange={(e) => setCategoryData({...categoryData, name: e.target.value})}
                  className="input-field w-full"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={categoryData.description}
                  onChange={(e) => setCategoryData({...categoryData, description: e.target.value})}
                  className="input-field w-full h-20 resize-none"
                  placeholder="Enter category description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCategoryModal(false)
                  setCategoryData({ name: '', description: '' })
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!categoryData.name}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory
