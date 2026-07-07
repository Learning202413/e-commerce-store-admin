import React, { useState, useEffect } from 'react';
import { catalogService } from '../services/api';
import { Package, Plus, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../estilos.css'; // Asegúrate de importar tus estilos globales

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create Product State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    description: ''
  });
  const [createSuccess, setCreateSuccess] = useState('');

  // Stock adjustments state mapping: productId -> quantity to adjust
  const [stockAdjustments, setStockAdjustments] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await catalogService.getAllProducts();
      setProducts(data || []);
    } catch (err) {
      setError('Error al cargar productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setError(null);
    setCreateSuccess('');

    try {
      const payload = {
        name: newProduct.name,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
        description: newProduct.description
      };

      await catalogService.addProduct(payload);
      setCreateSuccess(`Producto "${newProduct.name}" creado con éxito.`);
      setNewProduct({ name: '', price: '', quantity: '', description: '' });
      fetchProducts(); // Refresh the list
    } catch (err) {
      setError('Error al crear producto: ' + err.message);
    }
  };

  const handleStockChange = (productId, value) => {
    setStockAdjustments({
      ...stockAdjustments,
      [productId]: value
    });
  };

  const handleIncreaseStock = async (productId) => {
    const qty = Number(stockAdjustments[productId]);
    if (!qty || qty <= 0) return;

    try {
      await catalogService.increaseStock([{ productId, quantity: qty }]);
      setStockAdjustments({ ...stockAdjustments, [productId]: '' });
      fetchProducts();
    } catch (err) {
      setError('Error al aumentar stock: ' + err.message);
    }
  };

  const handleDecreaseStock = async (productId) => {
    const qty = Number(stockAdjustments[productId]);
    if (!qty || qty <= 0) return;

    try {
      await catalogService.decreaseStock([{ productId, quantity: qty }]);
      setStockAdjustments({ ...stockAdjustments, [productId]: '' });
      fetchProducts();
    } catch (err) {
      setError('Error al disminuir stock: ' + err.message);
    }
  };

  return (
      <div className="container" style={{ padding: '2rem 0' }}>

        {/* Encabezado del Dashboard */}
        <div className="dashboard-header flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <h1 className="flex items-center gap-2">
            <Package size={28} color="var(--text-primary)" />
            Catálogo e Inventario
          </h1>
        </div>

        {/* Alertas Globales */}
        {error && (
            <div className="alert-box alert-danger flex items-center gap-2">
              <AlertCircle size={20} /> {error}
            </div>
        )}

        {createSuccess && (
            <div className="alert-box alert-success flex items-center gap-2">
              <CheckCircle2 size={20} /> {createSuccess}
            </div>
        )}

        {/* SECCIÓN 1: CREAR PRODUCTO */}
        <section className="card" style={{ marginBottom: '3rem' }}>
          <h2 className="flex items-center gap-2" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Plus size={22} /> Añadir Nueva Prenda
          </h2>

          <form onSubmit={handleCreateProduct} className="grid grid-cols-2 gap-4">
            <div>
              <label>Nombre de la prenda</label>
              <input
                  type="text"
                  required
                  placeholder="Ej. Camiseta Básica Algodón"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div>
              <label>Precio de Venta ($)</label>
              <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Descripción detallada</label>
              <textarea
                  rows="3"
                  placeholder="Detalles sobre el material, corte y cuidados..."
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              />
            </div>
            <div>
              <label>Stock Inicial (Unidades)</label>
              <input
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  value={newProduct.quantity}
                  onChange={e => setNewProduct({...newProduct, quantity: e.target.value})}
              />
            </div>
            <div className="flex items-center" style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit">
                Crear Producto
              </button>
            </div>
          </form>
        </section>

        {/* SECCIÓN 2: GESTIÓN DE STOCK (TABLA) */}
        <section className="card">
          <h2 className="flex items-center gap-2" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Package size={22} /> Control de Inventario
          </h2>

          {loading ? (
              <div className="flex justify-center" style={{ padding: '3rem 0' }}>
                <div className="spinner"></div>
              </div>
          ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <Package size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                <p>No hay productos en el catálogo aún.</p>
              </div>
          ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                  <tr>
                    <th width="8%">SKU / ID</th>
                    <th width="35%">Prenda</th>
                    <th width="12%">Precio</th>
                    <th width="15%">Estado</th>
                    <th width="30%">Ajuste Rápido (Cant.)</th>
                  </tr>
                  </thead>
                  <tbody>
                  {products.map(p => (
                      <tr key={p.id}>
                        <td className="text-muted">#{p.id}</td>
                        <td style={{ fontWeight: '500' }}>{p.name}</td>
                        <td>${p.price?.toFixed(2)}</td>
                        <td>
                          {/* Lógica UX de E-commerce para inventario */}
                          {p.quantity === 0 ? (
                              <span className="badge danger">Agotado</span>
                          ) : p.quantity < 10 ? (
                              <span className="badge warning">Últimos {p.quantity}</span>
                          ) : (
                              <span className="badge success">En Stock ({p.quantity})</span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                min="1"
                                placeholder="0"
                                value={stockAdjustments[p.id] || ''}
                                onChange={(e) => handleStockChange(p.id, e.target.value)}
                                className="stock-input"
                            />
                            <button
                                type="button"
                                className="btn-icon add"
                                onClick={() => handleIncreaseStock(p.id)}
                                title="Ingresar mercancía"
                            >
                              <TrendingUp size={16} />
                            </button>
                            <button
                                type="button"
                                className="btn-icon remove"
                                onClick={() => handleDecreaseStock(p.id)}
                                title="Descontar mercancía / Merma"
                            >
                              <TrendingDown size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </section>
      </div>
  );
};

export default Admin;