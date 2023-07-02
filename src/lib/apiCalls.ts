export const fetcher = async ({ url, method, body, json = true }) => {
  const res = await fetch(url, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    // handle your errors
    throw new Error('API error');
  }

  if (json) {
    const data = await res.json();
    // console.log(data.data);
    return data.data;
  }
};

export const register = (formData) => {
  const { email, password, confirmPassword } = formData;

  if (password !== confirmPassword) {
    console.log('Passwords do not match!');
    return null;
  } else {
    const newUser = { email, password };

    return fetcher({
      url: '/api/auth/register',
      method: 'post',
      body: newUser,
    });
  }
};

// sample fetch request for client components (use client)
// export const getUserGroups = (userId) => {
//   return fetcher({
//     url: `/api/users/${userId}/groups`,
//     method: 'get',
//     body: null,
//   });
// };
