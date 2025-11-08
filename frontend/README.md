# Axios interceptors

Axios interceptors can be used to intercept request. One common use case is to automatically renew access tokens, if they are expired

## Code in the frontend user store

```js
let refreshPromise = null;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // if a refresh is already in progrss, wait for it to complete
        if (!refreshPromise)
          refreshPromise = useUserStore.getState().refreshToken(); // if there is no "previous refreshPromise", call the refreshToken function to get new tokens
        await refreshPromise;
        refreshPromise = null;
        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
  }
);
```

In the refreshPromise we store the request to refresh the access token (so we can prevent to submit multiple requests for a new access token). To use an axios interceptor for an response we need to call the `axios.interceptors.response.use()` method. This has two parameters, one for the "normal" case, where no error occured and the second if an error occured. We need to change the behavior for the latter one.

The original request is stored in the error under the config attribute. It is common to add a \_retry property to the original request, so we can check if the "original" request comes from an interceptor (in that case it has the \_retry attribute - otherwise it doesn't) - this can be used to prevent us to intercept an interceptor response.

If the status code is 401 and it is no interceptor response, we add the \_retry attribute and try to refresh the access token. There is a function `refreshToken()` in the auth store, which calls the corresponding refreshToken endpoint of the API. After awaiting the refreshPromise (no matter if it was created in this interceptor or in a parallel one), we call the original request (but before that we null the refreshPromise, so that the interceptor will work the next time the access token expired).

And if we get some errors, we log out the current user.

### refreshToken function in the user store

```js
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;
    set({ checkingAuth: true });
    try {
      const response = await axios.post('/auth/refresh-token');
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
```
