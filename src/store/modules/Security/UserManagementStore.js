import api, { getResponseCount } from '@/store/api';

const getServerErrorMessages = function (error) {
  let errorData = error.response.data.error
    ? error.response.data.error
    : error.response.data;
  if (typeof errorData == 'string') {
    return [];
  }
  return Object.values(errorData)
    .reduce((a, b) => a.concat(b))
    .filter((info) => info.Message)
    .map((info) => info.Message);
};

const UserManagementStore = {
  namespaced: true,
  actions: {
    async updateUser(
      { dispatch },
      { originalUsername, username, password, privilege, status, locked },
    ) {
      const data = {};
      if (username) data.UserName = username;
      if (password) data.Password = password;
      if (privilege) data.RoleId = privilege;
      if (status !== undefined) data.Enabled = status;
      if (locked !== undefined) data.Locked = locked;
      return await api
        .patch(`/redfish/v1/AccountService/Accounts/${originalUsername}`, data)
        .then(() => dispatch('getUsers'))
        .then(() =>
          t('pageUserManagement.toast.successUpdateUser', {
            username: originalUsername,
          }),
        )
        .catch((error) => {
          console.log(error);
          const serverMessages = getServerErrorMessages(error);
          const message =
            serverMessages.length > 0
              ? serverMessages.join(' ')
              : t('pageUserManagement.toast.errorUpdateUser', {
                  username: originalUsername,
                });
          throw new Error(message);
        });
    },
  },
};

export default UserManagementStore;
