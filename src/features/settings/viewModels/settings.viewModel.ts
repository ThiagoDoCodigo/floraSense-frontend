import { useState } from "react";
import type { AppSettings } from "../models/settings.model";

const APP_VERSION = "1.0.0";

export const useSettingsViewModel = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [urgentAlertsOnly, setUrgentAlertsOnly] = useState(false);

  const settings: AppSettings = {
    notificationsEnabled,
    urgentAlertsOnly,
    appVersion: APP_VERSION,
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const toggleUrgentAlertsOnly = () => {
    setUrgentAlertsOnly((prev) => !prev);
  };

  return {
    settings,
    toggleNotifications,
    toggleUrgentAlertsOnly,
  };
};
