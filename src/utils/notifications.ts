import { notifications } from "@mantine/notifications";

export const showErrorNotification = (message?: string) =>
  notifications.show({
    title: "Error",
    message: message ?? "An Error Has Occurred",
    color: "red",
    autoClose: 4000,
  });

export const showSuccessNotification = (message?: string) =>
  notifications.show({
    title: "Success",
    message: message ?? "Success",
    color: "green",
    autoClose: 4000,
  });

export const showWarningNotification = (message?: string) =>
  notifications.show({
    title: "Warning",
    message: message ?? "Warning",
    color: "yellow",
    autoClose: 4000,
  });
