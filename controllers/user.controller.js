const registerUser = (req, res) => {
  const { username, password } = req.body;

  // Here you would typically hash the password and save the user to the database
  // For simplicity, we are just returning the user data without saving it
  res.status(201).json({
    message: "User registered successfully",
    user: {
      username,
      password, // In a real application, never return the password
    },  
    });
}