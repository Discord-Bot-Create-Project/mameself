module.exports = {
    name: 'skip',
    description: 'Skip command',
    execute: async (client, message, args) => {
        const queue = client.queue; // Assuming that 'queue' is a property of the client
        const serverQueue = queue.get('queue');

        if (!serverQueue || !serverQueue.songs) {
            return message.channel.send("There is nothing to skip.");
        }

        serverQueue.skipped = true;

        try {
            serverQueue.connection._state.subscription.player.stop();
            return message.channel.send("Successfully skipped the song.");
        } catch (error) {
            console.error(`Error skipping the song: ${error}`);
            return message.channel.send("An error occurred while trying to skip the song.");
        }
    }
};
