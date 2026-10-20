import { useState } from "react";
import Button from "../Components/Ui/Button";
import ProductForm from "../Features/Admin/ProductForm";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";

function AdminProductsPage() {
  const [products, setProducts] = useState(getProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleSave = (values) => {
    if (editingProduct) {
      updateProduct({ ...values, id: editingProduct.id });
    } else {
      addProduct(values);
    }
    setProducts(getProducts());
    closeForm();
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(`Delete "${product.name}"?`);
    if (!confirmed) return;

    deleteProduct(product.id);
    setProducts(getProducts());
  };

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
