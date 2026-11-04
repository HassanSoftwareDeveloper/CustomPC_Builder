import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
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
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const visibleProducts = products.filter((product) =>
    `${product.name} ${product.category} ${product.spec || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

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

  if (loading)
    return (
      <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-8">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-border" />
        <div className="mt-6 h-64 animate-pulse rounded-3xl bg-white" />
      </div>
    );

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-7 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.17em] text-primary">
            Inventory
          </p>
          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-muted">
            Manage the parts customers can browse and buy.
          </p>
        </div>
        <Button onClick={openAddForm}>+ Add product</Button>
      </div>

      {message && (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-danger/15 bg-danger/5 px-4 py-3 text-sm font-medium text-danger"
        >
          {message}
        </p>
      )}

      {showForm && (
        <div className="mt-6 max-w-2xl">
          <ProductForm
            key={editingProduct ? editingProduct.id : "new"}
            product={editingProduct}
            onSave={handleSave}
            onCancel={closeForm}
            saving={saving}
          />
        </div>
      )}

      {products.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-white p-10 text-center text-muted">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon name="cpu" />
          </span>
          <h2 className="mt-3 font-bold text-ink">
            Your catalog is ready for its first product
          </h2>
          <p className="mt-1 text-sm">
            Add a part to make it available in the customer store.
          </p>
          <button
            type="button"
            onClick={openAddForm}
            className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-strong"
          >
            Add your first product
          </button>
        </div>
      ) : (
        <section className="mt-7 overflow-hidden rounded-3xl border border-border bg-white shadow-sm shadow-ink/[0.02]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 sm:px-5">
            <div>
              <h2 className="font-black text-ink">Your inventory</h2>
              <p className="mt-0.5 text-xs text-muted">
                {visibleProducts.length} of {products.length} products
              </p>
            </div>
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Search products</span>
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or category"
                className="h-10 w-full rounded-full border border-border bg-bg/60 pl-9 pr-4 text-sm outline-none transition placeholder:text-muted/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </label>
          </div>
          {visibleProducts.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-bold text-ink">No matching products</p>
              <p className="mt-1 text-sm text-muted">
                Try another search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] text-left text-sm">
                <thead className="bg-bg/70 text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Product</th>
                    <th className="px-4 py-3.5 font-bold">Category</th>
                    <th className="px-4 py-3.5 text-right font-bold">Price</th>
                    <th className="px-4 py-3.5 text-right font-bold">Stock</th>
                    <th className="px-5 py-3.5 text-right font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-border transition hover:bg-bg/50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-ink">{product.name}</p>
                        {product.spec && (
                          <p className="mt-0.5 max-w-sm truncate text-xs text-muted">
                            {product.spec}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-primary/7 px-2.5 py-1 text-xs font-bold capitalize text-primary">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-ink">
                        Rs {Number(product.price).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {product.stock === 0 ? (
                          <span className="font-bold text-danger">
                            Out of stock
                          </span>
                        ) : (
                          <span
                            className={
                              product.stock <= 5
                                ? "font-bold text-amber-600"
                                : "font-semibold text-ink"
                            }
                          >
                            {product.stock}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => openEditForm(product)}
                            className="rounded-full"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleDelete(product)}
                            className="rounded-full text-danger hover:bg-danger/5"
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
        </section>
      )}
    </div>
  );
}

export default AdminProductsPage;
