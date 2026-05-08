import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Modal from '../components/UI/Modal';
import { fetchProducts, createProduct, deleteProduct } from '../api';
import './Products.css';

const STATUS_BADGE = { active:'badge-success', low_stock:'badge-warning', out_of_stock:'badge-danger' };
const STATUS_LABEL = { active:'Active', low_stock:'Low Stock', out_of_stock:'Out of Stock' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState('grid'); // 'grid' | 'table'
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState({ name:'', category:'Electronics', price:'', stock:'', sku:'', emoji:'📦' });

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await fetchProducts(); setProducts(d.products); }
    catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    try { await createProduct(form); toast.success('✅ Product added!'); setModal(false); load(); }
    catch (e) { toast.error(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); toast.success('Product deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Products</h2>
          <p className="page-subtitle">Manage your product catalog</p>
        </div>
        <div className="page-actions">
          <div className="filter-tabs">
            <button className={`filter-tab${view==='grid'?' active':''}`} onClick={() => setView('grid')}>⊞ Grid</button>
            <button className={`filter-tab${view==='table'?' active':''}`} onClick={() => setView('table')}>☰ Table</button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Add Product</button>
        </div>
      </div>

      {/* GRID VIEW */}
      {view === 'grid' && (
        <div className="products-grid">
          {loading
            ? Array.from({length:8}).map((_,i) => (
                <div key={i} className="card" style={{overflow:'hidden'}}>
                  <div className="skeleton" style={{height:140}} />
                  <div style={{padding:14}}><div className="skeleton" style={{height:14,marginBottom:8}} /><div className="skeleton" style={{height:12,width:'60%'}} /></div>
                </div>
              ))
            : products.map((p, i) => (
                <motion.div key={p.id} className="product-card card" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}} whileHover={{y:-4}}>
                  <div className="product-img">{p.emoji}
                    <span className="product-badge"><span className={`badge ${STATUS_BADGE[p.status]}`}>{STATUS_LABEL[p.status]}</span></span>
                  </div>
                  <div className="product-body">
                    <div className="product-name">{p.name}</div>
                    <div className="product-cat">{p.category}</div>
                    <div className="product-footer">
                      <span className="product-price">${p.price}</span>
                      <span className="product-stock">Stock: {p.stock}</span>
                    </div>
                    <button className="btn btn-danger btn-sm" style={{marginTop:10,width:'100%'}} onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </motion.div>
              ))
          }
        </div>
      )}

      {/* TABLE VIEW */}
      {view === 'table' && (
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>SKU</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{fontSize:24}}>{p.emoji}</span><strong>{p.name}</strong></div></td>
                    <td>{p.category}</td>
                    <td><strong>${p.price}</strong></td>
                    <td>{p.stock}</td>
                    <td style={{color:'var(--text-muted)',fontSize:12}}>{p.sku}</td>
                    <td><span className={`badge ${STATUS_BADGE[p.status]}`}>{STATUS_LABEL[p.status]}</span></td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      <Modal open={modal} onClose={() => setModal(false)} title="Add New Product"
        footer={<>
          <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd}>Add Product</button>
        </>}
      >
        <div className="form-group"><label className="form-label">Product Name</label>
          <input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Product name" />
        </div>
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              <option>Electronics</option><option>Fashion</option><option>Home</option><option>Accessories</option><option>Sports</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Emoji Icon</label>
            <input className="form-input" value={form.emoji} onChange={e=>setForm(f=>({...f,emoji:e.target.value}))} placeholder="📦" />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Price ($)</label>
            <input className="form-input" type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="0.00" />
          </div>
          <div className="form-group"><label className="form-label">Stock</label>
            <input className="form-input" type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} placeholder="0" />
          </div>
        </div>
        <div className="form-group"><label className="form-label">SKU</label>
          <input className="form-input" value={form.sku} onChange={e=>setForm(f=>({...f,sku:e.target.value}))} placeholder="e.g. ELEC-001" />
        </div>
      </Modal>
    </div>
  );
}
