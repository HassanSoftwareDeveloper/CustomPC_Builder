import { useState } from "react";
import Button from "../../Components/Ui/Button";
import Input from "../../Components/Ui/Input";
import { validateCheckout } from "../../utils/validators";

const CITIES = [
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Other",
];

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on delivery" },
  { value: "bank", label: "Bank transfer" },
];

const INITIAL_VALUES = {
  fullName: "",
  phone: "",
  city: "",
  address: "",
  paymentMethod: "cod",
};

function CheckoutForm({ onSubmit, initialName = "" }) {
  const [values, setValues] = useState(() => ({ ...INITIAL_VALUES, fullName: initialName }));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateCheckout(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        id="fullName"
        name="fullName"
        label="Full name"
        placeholder="Your name"
        value={values.fullName}
        onChange={handleChange}
        error={errors.fullName}
      />
      <Input
        id="phone"
        name="phone"
        type="tel"
        label="Mobile number"
        placeholder="0300 1234567"
        value={values.phone}
        onChange={handleChange}
        error={errors.phone}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="city" className="text-sm text-muted">
          City
        </label>
        <select
          id="city"
          name="city"
          value={values.city}
          onChange={handleChange}
          className="h-12 rounded-xl border border-border/80 bg-white/80 px-3 text-sm text-ink focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
        >
          <option value="">Choose your city</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && <p className="text-sm text-danger">{errors.city}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="text-sm text-muted">
          Delivery address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          placeholder="House, street, area"
          value={values.address}
          onChange={handleChange}
          className="rounded-xl border border-border/80 bg-white/80 px-3.5 py-3 text-sm text-ink focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
        {errors.address && (
          <p className="text-sm text-danger">{errors.address}</p>
        )}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm text-muted">Payment method</legend>
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.value}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/80 bg-white/70 p-3 text-sm font-medium text-ink transition hover:border-primary/25 hover:bg-primary/5"
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={values.paymentMethod === method.value}
              onChange={handleChange}
            />
            {method.label}
          </label>
        ))}
      </fieldset>

      <Button type="submit">Place order</Button>
    </form>
  );
}

export default CheckoutForm;
