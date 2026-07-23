import StakeholderType from "../models/stakeholderTypeModel.js";

// GET all
export const getAllStakeholderTypes = async (req, res) => {
    try {
        const types = await StakeholderType.find();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET by ID
export const getStakeholderTypeById = async (req, res) => {
    try {
        const type = await StakeholderType.findById(req.params.id);
        if (!type) return res.status(404).json({ message: "Not found" });
        res.status(200).json(type);
        console.log(type);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create
export const createStakeholderType = async (req, res) => {
    try {
        const type = new StakeholderType(req.body);
        const saved = await type.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update
export const updateStakeholderType = async (req, res) => {
    try {
        const updated = await StakeholderType.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE
export const deleteStakeholderType = async (req, res) => {
    try {
        const deleted = await StakeholderType.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
