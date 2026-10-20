import { Link, Navigate } from "react-router-dom";
import AuthLayout from "../Components/Layout/AuthLayout";
import SignupForm from "../Features/Auth/SignupForm";
import { ROLES } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";

function SignupPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === ROLES.ADMIN ? "/admin" : "/"} replace />;
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Apna PC in a minute."
      footer={
        <span>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-ink underline">
            Sign in
          </Link>
        </span>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}

export default SignupPage;
