import React, { useState } from 'react';
import { catalogService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Tag, AlertCircle } from 'lucide-react';
import '../App.css';
import '../estilos.css';// Asegúrate de mantener la conexión con tus estilos

const ProductForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        description: formData.description
      };

      await catalogService.addProduct(payload);
      navigate('/products'); // Asumo que esta es la ruta de tu tabla de inventario
    } catch (err) {
      setError(err.message || 'Error al registrar la prenda en el catálogo.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>

        {/* Navegación Superior */}
        <div style={{ marginBottom: '2rem' }}>
          <button
              type="button"
              onClick={() => navigate('/products')}
              className="secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> Volver al catálogo
          </button>
        </div>

        <div className="card">
          {/* Encabezado del Formulario */}
          <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', paddingBottom: '1rem' }}>
            <h2 className="flex items-center gap-2">
              <Tag size={24} color="var(--primary-accent)" />
              Añadir Nueva Prenda
            </h2>
            <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              Complete los detalles para registrar un nuevo artículo en la tienda.
            </p>
          </div>

          {/* Alerta de Error */}
          {error && (
              <div className="alert-box alert-danger flex items-center gap-2">
                <AlertCircle size={20} /> {error}
              </div>
          )}

          {/* Formulario Estructurado */}
          <form onSubmit={handleSubmit} className="flex-col gap-6">

            <div>
              <label htmlFor="name">Nombre de la Prenda *</label>
              <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Camiseta Oversize de Algodón Orgánico"
                  autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price">Precio de Venta ($) *</label>
                <input
                    id="price"
                    type="number"
                    name="price"
                    min="0.01"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="quantity">Unidades Iniciales (Stock) *</label>
                <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    min="1"
                    step="1"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Ej: 50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description">Descripción Detallada</label>
              <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describa el corte, tipo de tela, instrucciones de lavado y detalles adicionales del producto..."
              ></textarea>
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '0.75rem 2.5rem' }}
              >
                {loading ? (
                    <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', margin: '0' }}></div>
                ) : (
                    <>
                      <Save size={18} /> Guardar Producto
                    </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
  );
};

export default ProductForm;