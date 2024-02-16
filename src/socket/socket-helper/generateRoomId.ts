const generateRoomIdentifier = (senderId: string, recipientId: string): string => {
    const sortedUserIds = [senderId, recipientId].sort();
    return `${sortedUserIds[0]}-${sortedUserIds[1]}`;
};

export default generateRoomIdentifier;
