import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/Ui/Button";
import Input from "../../Components/Ui/Input";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { validateLogin } from "../../utils/validators";

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateLogin({ email, password });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const loggedInUser = await login({ email, password });
      navigate(loggedInUser.role === ROLES.ADMIN ? "/admin" : "/");
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex max-w-sm flex-col gap-4"
    >
      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="you@gmail.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={errors.email}
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.password}
      />

      {submitError && <p className="text-sm text-danger">{submitError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

export default LoginForm;
