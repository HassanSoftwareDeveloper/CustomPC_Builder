import { useState } from "react";
import Button from "../../Components/Ui/Button";
import Input from "../../Components/Ui/Input";
import { validateSignup } from "../../utils/validators";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const INITIAL_VALUES = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateSignup(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await signup(values);
      navigate("/");
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        id="name"
        name="name"
        label="Full name"
        placeholder="Your name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@gmail.com"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="At least 8 characters"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm password"
        placeholder="Type it again"
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      {submitError && <p className="text-sm text-danger">{submitError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}

export default SignupForm;
