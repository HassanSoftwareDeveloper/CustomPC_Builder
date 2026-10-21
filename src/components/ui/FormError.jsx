function FormError({ message }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-lg border border-danger px-4 py-3 text-sm text-danger"
    >
      {message}
    </p>
  );
}

export default FormError;
