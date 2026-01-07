export async function getMessagesAction(myId, friendId) {
  try {
    const chatHistory = await db.select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, myId), eq(messages.receiverId, friendId)),
          and(eq(messages.senderId, friendId), eq(messages.receiverId, myId))
        )
      )
      .orderBy(asc(messages.createdAt));

    return { success: true, messages: chatHistory };
  } catch (error) {
    return { success: false, messages: [] };
  }
}