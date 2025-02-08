import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@/utils/message';
import { notification } from 'antd';

export const ShowSuccessMessage = (key: any) => {
  notification.success({
    message: 'Notification',
    description: SUCCESS_MESSAGE[key] || key,
    duration: 3,
    closeIcon: true,
    placement: 'top',
  });
};

export const ShowErrorMessage = (key: any) => {
  notification.error({
    message: 'Error',
    description: ERROR_MESSAGE[key] || key,
    duration: 3,
    closeIcon: true,
    placement: 'top',
  });
};
