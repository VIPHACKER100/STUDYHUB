import cron from 'node-cron';
import Notification from '../models/Notification.js';
import emailService from './emailService.js';

class CronService {
    init() {
        console.log('⏰ Initializing Cron Jobs...');

        // Daily Digest at 8:00 AM
        cron.schedule('0 8 * * *', async () => {
            console.log('Running daily digest job...');
            try {
                const notifications = await Notification.getRecentUnread();

                // Group by user
                const userNotifications = {};
                notifications.forEach(n => {
                    if (!userNotifications[n.user_id]) {
                        userNotifications[n.user_id] = {
                            user: { email: n.email, username: n.username },
                            list: []
                        };
                    }
                    userNotifications[n.user_id].list.push(n);
                });

                // Send emails
                for (const userId in userNotifications) {
                    const { user, list } = userNotifications[userId];
                    if (list.length > 0) {
                        await emailService.sendDigest(user, list);
                    }
                }
                console.log(`✅ Daily digest sent to ${Object.keys(userNotifications).length} users.`);
            } catch (error) {
                console.error('❌ Daily digest job failed:', error);
            }
        });
    }
}

export default new CronService();
