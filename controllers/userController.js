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
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.size) || 5; 
        const skip = (page - 1) * limit;

        // ID của user hiện tại
        const currentUserId = req.user._id;

        // Lấy thông tin người dùng hiện tại để lấy danh sách following
        const currentUser = await User.findById(currentUserId).select('following');
        
        // Lấy tất cả người dùng, ngoại trừ người dùng hiện tại và những người đã theo dõi
        const users = await User.find({
            _id: { $ne: currentUserId } // Loại trừ user hiện tại và những người đã theo dõi
        })
        .skip(skip)
        .limit(limit);

        // Đếm tổng số người dùng, không bao gồm người dùng hiện tại và những người đã theo dõi
        const totalUsers = await User.countDocuments({
            _id: { $ne: currentUserId, $nin: currentUser.following } // Tính tổng số người dùng phù hợp
        });

        res.json({
            totalUsers,  
            totalPages: Math.ceil(totalUsers / limit),  
            currentPage: page,  
            users
        });
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

// const followUser = async (req, res) => {
//     try {
//         console.log("jjj");
//         const { userIdToFollow } = req.body;
//         const userId = req.user._id;

//         console.log('userId',userId);

//         // Tìm người dùng muốn theo dõi
//         const userToFollow = await User.findById(userIdToFollow);
//         if (!userToFollow) {
//             return res.status(404).json({ message: 'Người dùng không tồn tại' });
//         }
//         // const currentUser = await User.findById(userId);
//         // if (currentUser.following.includes(userIdToFollow)) {
//         //     return res.status(400).json({ message: 'Bạn đã theo dõi người dùng này.' });
//         // }

//         // Thêm vào danh sách following của người dùng hiện tại và followers của người kia
//         await User.findByIdAndUpdate(userId, { $addToSet: { following: userIdToFollow } });
//         await User.findByIdAndUpdate(userIdToFollow, { $addToSet: { followers: userId } });


//         const io = req.app.locals.io;
//         io.emit('new-follower', {
//             followerId: [...req.user._id],
//         });

//         res.status(200).json({ message: `Bạn đã theo dõi ${userToFollow.name}`, status: true });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


const followUser = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const userId = req.user._id;

        // Tìm người dùng muốn theo dõi
        const userToFollow = await User.findById(userIdToFollow);
        if (!userToFollow) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const currentUser = await User.findById(userId);
        if (currentUser.following.includes(userIdToFollow)) {
            return res.status(400).json({ message: 'Bạn đã theo dõi người dùng này.' });
        }
        // Thêm vào danh sách following của người dùng hiện tại và followers của người kia
        await User.findByIdAndUpdate(userId, { $addToSet: { following: userIdToFollow } });
        await User.findByIdAndUpdate(userIdToFollow, { $addToSet: { followers: userId } });


        const io = req.app.locals.io;
        io.emit('new-follower', {
            message: `${req.user.name} đã theo dõi bạn.`,
            followerId: req.user._id,
        });

        res.status(200).json({ message: `Bạn đã theo dõi ${userToFollow.name}`, status: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const deleteAllFollowRelations = async (req, res) => {
    try {
        // Xóa tất cả mối quan hệ theo dõi (following) của tất cả người dùng
        await User.updateMany({}, { $set: { following: [] } });

        // Xóa tất cả người theo dõi (followers) của tất cả người dùng
        await User.updateMany({}, { $set: { followers: [] } });

        // const io = req.app.locals.io;
        // io.emit('all-relations-deleted', {
        //     message: 'Đã xóa tất cả mối quan hệ theo dõi và người theo dõi của tất cả người dùng.',
        // });

        res.status(200).json({ message: 'Đã xóa tất cả mối quan hệ theo dõi và người theo dõi.', status: true });
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
    followUser,
    deleteAllFollowRelations
};
