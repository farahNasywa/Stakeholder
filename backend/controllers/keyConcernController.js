import KeyConcern from "../models/keyConcernModel.js"; // Adjust path as needed

// @desc    Get all key concerns
// @route   GET /api/keyconcerns
// @access  Public
const getAllKeyConcerns = async (req, res) => {
  try {
    const keyConcerns = await KeyConcern.find({});
    res.status(200).json(keyConcerns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single key concern by ID
// @route   GET /api/keyconcerns/:id
// @access  Public
const getKeyConcernById = async (req, res) => {
  try {
    const keyConcern = await KeyConcern.findById(req.params.id);
    if (keyConcern) {
      res.status(200).json(keyConcern);
    } else {
      res.status(404).json({ message: "Key Concern not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new key concern
// @route   POST /api/keyconcerns
// @access  Private (e.g., admin only)
const createKeyConcern = async (req, res) => {
  const { key_concern, mitigation_plan, objective } = req.body;

  if (!key_concern || !mitigation_plan || !objective) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const newKeyConcern = new KeyConcern({
      key_concern,
      mitigation_plan,
      objective,
    });

    const createdKeyConcern = await newKeyConcern.save();
    res.status(201).json(createdKeyConcern);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(409).json({ message: "Key Concern already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a key concern
// @route   PUT /api/keyconcerns/:id
// @access  Private (e.g., admin only)
const updateKeyConcern = async (req, res) => {
  const { key_concern, mitigation_plan, objective } = req.body;

  try {
    const keyConcern = await KeyConcern.findById(req.params.id);

    if (keyConcern) {
      keyConcern.key_concern = key_concern || keyConcern.key_concern;
      keyConcern.mitigation_plan = mitigation_plan || keyConcern.mitigation_plan;
      keyConcern.objective = objective || keyConcern.objective;

      const updatedKeyConcern = await keyConcern.save();
      res.status(200).json(updatedKeyConcern);
    } else {
      res.status(404).json({ message: "Key Concern not found" });
    }
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(409).json({ message: "Key Concern already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a key concern
// @route   DELETE /api/keyconcerns/:id
// @access  Private (e.g., admin only)
const deleteKeyConcern = async (req, res) => {
  try {
    const keyConcern = await KeyConcern.findById(req.params.id);

    if (keyConcern) {
      await keyConcern.deleteOne(); // Use deleteOne() for Mongoose 6+
      res.status(200).json({ message: "Key Concern removed" });
    } else {
      res.status(404).json({ message: "Key Concern not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllKeyConcerns,
  getKeyConcernById,
  createKeyConcern,
  updateKeyConcern,
  deleteKeyConcern,
};
