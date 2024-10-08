module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Gửi message đến client khi kết nối
        socket.emit('message', 'Welcome to the WebSocket server!');

        // Nhận message từ client
        socket.on('client-message', (data) => {
            console.log('Message from client:', data);
            // Phát lại message cho tất cả các client
            io.emit('server-message', data);
        });

        // Xử lý khi client ngắt kết nối
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};