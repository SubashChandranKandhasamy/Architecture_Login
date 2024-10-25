// login.js

export const validateLogin = (emailOrPhone, password, role) => {
    // Define valid credentials
    const userCredentials = {
      email: "user@gmail.com",
      phone: "9047014252",
      password: "user123", // Example password for user
    };
  
    const architectCredentials = {
      email: "architect@gmail.com",
      phone: "7538841098",
      password: "arch123", // Example password for architect
    };
  
    // Validate User
    if (role === "user") {
      if (
        (emailOrPhone === userCredentials.email ||
          emailOrPhone === userCredentials.phone) &&
        password === userCredentials.password
      ) {
        return { success: true, message: "User login successful!" };
      } else {
        return { success: false, message: "Invalid User credentials!" };
      }
    }
  
    // Validate Architect
    else if (role === "architect") {
      if (
        (emailOrPhone === architectCredentials.email ||
          emailOrPhone === architectCredentials.phone) &&
        password === architectCredentials.password
      ) {
        return { success: true, message: "Architect login successful!" };
      } else {
        return { success: false, message: "Invalid Architect credentials!" };
      }
    }
  
    return { success: false, message: "Please select a valid role." };
  };
  