import React, { useState, useEffect } from 'react';
import { catalogService } from '../services/api';
import { Plus, Minus, Package, AlertCircle, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Fundamental para cargar el sistema de diseño
import '../estilos.css';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stockUpdates, setStockUpdates] = useState({});
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await catalogService.getAllProducts();
      setProducts(data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockChange = (id, value) => {
    setStockUpdates({
      ...stockUpdates,
      [id]: parseInt(value, 10) || 0
    });
  };

  const updateStock = async (productId, isIncrease) => {
    const quantity = stockUpdates[productId];
    if (!quantity || quantity <= 0) return;

    try {
      const payload = [{ productId, quantity }];
      if (isIncrease) {
        await catalogService.increaseStock(payload);
      } else {
        await catalogService.decreaseStock(payload);
      }

      // Reset input and reload
      setStockUpdates({ ...stockUpdates, [productId]: '' });
      loadProducts();
    } catch (err) {
      setError('Error al actualizar stock: ' + err.message);
    }
  };

  return (
      <div className="container" style={{ padding: '2rem 0' }}>

        {/* Encabezado Principal */}
        <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
          <h1 className="flex items-center gap-2">
            <Package size={28} color="var(--primary-accent)" />
            Gestor de Inventario
          </h1>
          <button
              onClick={() => navigate('/products/new')}
              className="flex items-center gap-2"
          >
            <Plus size={18} /> Nuevo Producto
          </button>
        </div>

        {/* Alertas de Sistema */}
        {error && (
            <div className="alert-box alert-danger flex items-center gap-2">
              <AlertCircle size={20} /> {error}
            </div>
        )}

        {/* Tarjeta de Datos (Tabla) */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
              <tr>
                <th width="10%">ID</th>
                <th width="35%">Nombre del Producto</th>
                <th width="15%">Precio</th>
                <th width="15%">Stock Actual</th>
                <th width="25%">Ajuste Rápido</th>
              </tr>
              </thead>
              <tbody>
              {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem 0', textAlign: 'center' }}>
                      <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
              ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Box size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                      <p>No hay productos en el inventario.</p>
                    </td>
                  </tr>
              ) : (
                  products.map(product => (
                      <tr key={product.id}>
                        <td className="text-muted">#{product.id}</td>
                        <td style={{ fontWeight: '500' }}>{product.name}</td>
                        <td>${product.price?.toFixed(2)}</td>
                        <td>
                          {/* Lógica inteligente para etiquetas de stock */}
                          {product.quantity === 0 ? (
                              <span className="badge danger">Agotado</span>
                          ) : product.quantity < 10 ? (
                              <span className="badge warning">Últimos {product.quantity}</span>
                          ) : (
                              <span className="badge success">{product.quantity} uds</span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                placeholder="Cant."
                                className="stock-input"
                                value={stockUpdates[product.id] || ''}
                                onChange={(e) => handleStockChange(product.id, e.target.value)}
                            />
                            <button
                                className="btn-icon add"
                                onClick={() => updateStock(product.id, true)}
                                title="Ingresar mercancía (+)"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                                className="btn-icon remove"
                                onClick={() => updateStock(product.id, false)}
                                title="Descontar mercancía / Merma (-)"
                            >
                              <Minus size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default ProductsManager;