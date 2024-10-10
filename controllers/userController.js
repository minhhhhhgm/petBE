const User = require('../models/userModel');
const {generateAccessToken, generateRefreshToken} = require('../service/jwtService')
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
    try {
        const isUserExits = await User.findOne({ email: req.body.email })
        if(isUserExits){
            return res.status(400).json({ message: 'Email already use' });
        }
        const passwordHash = bcrypt.hashSync(req.body.password, 10);
        const user = await User.create({
            ...req.body,
            password: passwordHash
        })
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const login = async (req, res) => {
    try {
        const isUserExits = await User.findOne({ email: req.body.email })
        if (isUserExits) {
            const isPasswordTrue = await bcrypt.compare(req.body.password, isUserExits.password);
            console.log(isPasswordTrue, req.body.password);
            if (isPasswordTrue) {
                const token = generateAccessToken(isUserExits)
                const refreshToken = generateRefreshToken(isUserExits);
                res.status(200).json({ 
                    status: true,
                    token,
                    refreshToken
                 })
            } else {
                res.status(400).json({ message: 'Login error wrong email or password' })
            }
        } else {
            res.status(400).json({ message: 'Login error wrong email or password' })

        }

    } catch (error) {
        res.status(400).json({ message: 'Login error wrong email or password' })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const followUser = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const userId = req.user._id;

        // Tìm người dùng muốn theo dõi
        const userToFollow = await User.findById(userIdToFollow);
        if (!userToFollow) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Thêm vào danh sách following của người dùng hiện tại và followers của người kia
        await User.findByIdAndUpdate(userId, { $addToSet: { following: userIdToFollow } });
        await User.findByIdAndUpdate(userIdToFollow, { $addToSet: { followers: userId } });

        res.status(200).json({ message: `Bạn đã theo dõi ${userToFollow.name}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    login,
    followUser
};
