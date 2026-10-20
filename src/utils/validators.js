const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export function validateLogin({ email, password }) {
  const errors = {};

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateSignup({ name, email, password, confirmPassword }) {
  const errors = {};

  if (name.trim().length < 2) {
    errors.name = "Enter your full name.";
  }
  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validateCheckout({ fullName, phone, city, address }) {
  const errors = {};

  if (fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }
  if (!/^03\d{9}$/.test(phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Enter a valid mobile number, for example 0300 1234567.";
  }
  if (!city) {
    errors.city = "Choose your city.";
  }
  if (address.trim().length < 10) {
    errors.address = "Enter your full delivery address.";
  }

  return errors;
}

export function validateProduct({ name, category, price }) {
  const errors = {};

  if (name.trim().length < 2) {
    errors.name = "Enter the product name.";
  }
  if (!category) {
    errors.category = "Choose a category.";
  }
  if (!(Number(price) > 0)) {
    errors.price = "Enter a price greater than 0.";
  }

  return errors;
}