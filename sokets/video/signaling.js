export default function registerSignaling(io, users, socket) {
    console.log(`${socket.id} connected`);
    socket.on('pre-offer', (data) => {
        const { calleePersonalCode } = data;
        const toSocketId = users.get(calleePersonalCode);

        if (toSocketId) {
            const data = {
                callerSocketId: socket.id
            };
            io.to(toSocketId).emit('pre-offer', data);
        } else {
            const data = {
                preOfferAnswer: 'CALLEE_NOT_FOUND'
            };
            io.to(socket.id).emit('pre-offer-answer', data);
        }
    });

    socket.on('pre-offer-answer', (data) => {
        io.to(data.callerSocketId).emit('pre-offer-answer', {
            ...data,
            calleeSocketId: socket.id,
        });
    });

    socket.on('webRTC-signaling', (data) => {
        const { connectedUserSocketId } = data;

        io.to(connectedUserSocketId).emit('webRTC-signaling', data);
    });

    socket.on('user-hanged-up', (data) => {
        const { connectedUserSocketId } = data;
        if (connectedUserSocketId) {
            io.to(connectedUserSocketId).emit('user-hanged-up');
        }
    });

    socket.on('cancel-call', (data) => {
        const { calleePersonalCode } = data;
        const toSocketId = users.get(calleePersonalCode);
        if (toSocketId) {
            io.to(toSocketId).emit('call-canceled');
        }
    });
}