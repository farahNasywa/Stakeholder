import Role from "../models/roleModel.js";

// Get all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new role
export const createRole = async (req, res) => {
  try {
    const newRole = new Role({ name: req.body.name });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
