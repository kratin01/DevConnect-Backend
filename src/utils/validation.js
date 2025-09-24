import validator from "validator";

export const signupValidator = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required!");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

export const editProfileValidator = (updates) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "age",
    "about",
    "gender",
    "profileUrl",
  ];

  const isEditAllowed = Object.keys(updates).every((key) =>
    allowedUpdates.includes(key)
  );

  return isEditAllowed;
};
