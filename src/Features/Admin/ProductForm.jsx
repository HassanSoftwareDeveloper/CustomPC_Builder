import { useState } from "react";
import Button from "../../Components/Ui/Button";
import Input from "../../Components/Ui/Input";
import { BUILDER_SLOTS } from "../../data/builderSlots";
import { validateProduct } from "../../utils/validators";

const EMPTY_VALUES = {
  name: "",
  category: "",
  spec: "",
  price: "",
  socket: "",
  image: "",
};

function toFormValues(product) {
  if (!product) return EMPTY_VALUES;

  return {
    name: product.name,
    category: product.category,
    spec: product.spec || "",
    price: String(product.price),
    socket: product.socket || "",
    image: product.image || "",
  };
}

function ProductForm({ product, onSave, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(product));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateProduct(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const cleaned = {
      name: values.name.trim(),
      category: values.category,
      spec: values.spec.trim(),
      price: Number(values.price),
      image: values.image.trim(),
    };
    if (values.socket.trim()) {
      cleaned.socket = values.socket.trim().toUpperCase();
    }

    onSave(cleaned);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6"
    >
      <h2 className="text-xl font-bold text-ink">
        {product ? "Edit product" : "Add product"}
      </h2>

      <Input
        id="name"
        name="name"
        label="Product name"
        placeholder="For example Ryzen 5 5600"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-sm text-muted">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
          className="h-12 rounded-lg border border-border bg-surface px-3 text-ink focus:outline-2 focus:outline-primary"
        >
          <option value="">Choose a category</option>
          {BUILDER_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-danger">{errors.category}</p>
        )}
      </div>

      <Input
        id="spec"
        name="spec"
        label="Short details"
        placeholder="For example 6 cores, 12 threads"
        value={values.spec}
        onChange={handleChange}
      />
      <Input
        id="price"
        name="price"
        type="number"
        label="Price (Rs)"
        placeholder="25000"
        value={values.price}
        onChange={handleChange}
        error={errors.price}
      />
      <Input
        id="socket"
        name="socket"
        label="Socket (processors and motherboards only)"
        placeholder="For example AM4"
        value={values.socket}
        onChange={handleChange}
        error={errors.socket}
      />
      <Input
        id="image"
        name="image"
        label="Product image path (optional)"
        placeholder="/images/rtx-4060.jpg"
        value={values.image}
        onChange={handleChange}
      />

      <div className="flex gap-3">
        <Button type="submit">Save product</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
