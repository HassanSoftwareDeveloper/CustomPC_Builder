import { Link, Navigate } from "react-router-dom";
import AuthLayout from "../Components/Layout/AuthLayout";
import LoginForm from "../Features/Auth/LoginForm";
import { ROLES } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === ROLES.ADMIN ? "/admin" : "/"} replace />;
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account."
      footer={
        <span>
          New here?{" "}
          <Link to="/signup" className="font-medium text-ink underline">
            Create an account
          </Link>
        </span>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
