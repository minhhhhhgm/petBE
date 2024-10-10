const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const Post = require('../models/postModel');

const createPost = async (req, res) => {
    try {
        // Lấy thông tin người dùng và bài đăng
        const { content } = req.body;
        const userId = req.user._id;

        // Tạo bài đăng mới
        const post = new Post({
            author: userId,
            content
        });
        await post.save();

        // Tìm người theo dõi (followers) của người dùng hiện tại
        const user = await User.findById(userId).populate('followers');

        // Gửi thông báo tới từng người theo dõi
        const notifications = user.followers.map(follower => {
            return new Notification({
                recipient: follower._id,
                sender: userId,
                message: `${user.name} vừa đăng một bài viết mới`
            });
        });

        // Lưu tất cả các thông báo vào cơ sở dữ liệu
        await Notification.insertMany(notifications);

        res.status(201).json({ message: 'Bài viết đã được tạo và thông báo đã được gửi!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getPostsFromFollowing = async (req, res) => {
    try {
        // Lấy ID của người dùng hiện tại (người đang đăng nhập)
        const userId = req.user._id;

        // Tìm người dùng hiện tại để lấy danh sách "following"
        const user = await User.findById(userId).populate('following');

        // Lấy danh sách các bài viết từ những người mà người dùng đang theo dõi
        const posts = await Post.find({
            author: { $in: user.following.map(followedUser => followedUser._id) }
        }).populate('author', 'name'); // Để lấy thêm tên tác giả của bài viết

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createPost,
    getPostsFromFollowing
};
