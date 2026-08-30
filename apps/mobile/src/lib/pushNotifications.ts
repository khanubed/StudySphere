export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export const pushNotifications = {
  async registerForPushNotificationsAsync(): Promise<string | null> {
    // Mock expo push token registration for dev / preview
    const mockExpoToken = 'ExponentPushToken[mock_token_studysphere_scholar]';
    return mockExpoToken;
  },

  handleForegroundNotification(payload: PushNotificationPayload) {
    // In-app foreground toast or banner notification handler
    return payload;
  },
};

export default pushNotifications;
