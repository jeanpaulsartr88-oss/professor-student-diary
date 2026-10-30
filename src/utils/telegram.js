/**
 * Telegram WebApp SDK Integration Utility
 */

export const getTelegram = () => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const initTelegramApp = () => {
  const tg = getTelegram();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      
      // Lock scroll and customize header/background for Dark Academia look
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#16161a');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#16161a');
      }
      if (tg.enableClosingConfirmation) {
        tg.enableClosingConfirmation();
      }
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }
  }
};

export const triggerHaptic = (type = 'success', hapticEnabled = true) => {
  if (!hapticEnabled) return;

  const tg = getTelegram();
  if (tg && tg.HapticFeedback) {
    try {
      if (type === 'success' || type === 'warning' || type === 'error') {
        tg.HapticFeedback.notificationOccurred(type);
        return;
      }
      if (type === 'light' || type === 'medium' || type === 'heavy') {
        tg.HapticFeedback.impactOccurred(type);
        return;
      }
      if (type === 'selection') {
        tg.HapticFeedback.selectionChanged();
        return;
      }
    } catch (e) {
      console.warn('Haptic feedback error:', e);
    }
  }

  // Web Vibration API fallback for standard mobile browsers
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      if (type === 'success') navigator.vibrate([20, 40, 20]);
      else if (type === 'warning') navigator.vibrate([40, 30, 40]);
      else if (type === 'error') navigator.vibrate([60, 40, 60]);
      else if (type === 'heavy') navigator.vibrate(50);
      else navigator.vibrate(15);
    } catch (e) {
      // ignore
    }
  }
};

export const getTelegramUser = () => {
  const tg = getTelegram();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    return {
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      username: user.username || '',
      id: user.id || null,
      fullName: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Студентка',
    };
  }
  return {
    firstName: 'Студентка',
    lastName: '',
    username: '',
    id: null,
    fullName: 'Студентка',
  };
};

export const setupBackButton = (onClickHandler) => {
  const tg = getTelegram();
  if (tg && tg.BackButton) {
    try {
      tg.BackButton.show();
      tg.BackButton.onClick(onClickHandler);
    } catch (e) {
      console.warn('BackButton error:', e);
    }
  }
};

export const hideBackButton = () => {
  const tg = getTelegram();
  if (tg && tg.BackButton) {
    try {
      tg.BackButton.hide();
    } catch (e) {
      console.warn('BackButton hide error:', e);
    }
  }
};
