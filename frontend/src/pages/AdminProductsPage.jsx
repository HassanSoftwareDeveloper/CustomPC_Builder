import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import ProductForm from "../features/admin/ProductForm";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = async () => {
    try {
      setProducts(await getProducts());
      setMessage("");
    } catch {
      setMessage("Could not load products. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getProducts()
      .then((list) => active && setProducts(list))
      .catch(
        () =>
          active &&
          setMessage("Could not load products. Is the backend running?"),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const openAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSave = async (values) => {
    try {
      if (editingProduct) {
        // keep the hidden compatibility details (specs) of the old product
        await updateProduct({
          ...editingProduct,
          ...values,
          id: editingProduct.id,
        });
      } else {
        await addProduct(values);
      }
      await loadProducts();
      closeForm();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete "${product.name}"?`);
    if (!confirmed) return;

    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p className="px-6 py-12">Loading products...</p>;

  return (
    <div className="px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-ink">Products</h1>
          <p className="mt-2 text-muted">
            {products.length} products in your store.
          </p>
        </div>
        <Button onClick={openAddForm}>Add product</Button>
      </div>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

      {showForm && (
        <div className="mt-6 max-w-xl">
          <ProductForm
            key={editingProduct ? editingProduct.id : "new"}
            product={editingProduct}
            onSave={handleSave}
            onCancel={closeForm}
          />
        </div>
      )}

      {products.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-10 text-center text-muted">
          No products yet.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-ink">{product.name}</td>
                  <td className="px-4 py-3 text-muted">{product.category}</td>
                  <td className="px-4 py-3 text-right text-ink">
                    Rs {product.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => openEditForm(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
