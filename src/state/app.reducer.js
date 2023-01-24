const initialState = {
  user: {
    email: '',
    name: '',
  },
  token: '',
  isAuth: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'defaultState':
      return action.state;
    case 'AUTH':
      return {
        ...state,
        isAuth: true,
        user: {email: action.email, name: action.name},
        token: action.token,
      };
    case 'AUTH_OUT':
      return {
        ...state,
        isAuth: false,
        user: {email: '', name: ''},
        token: '',
      };
    default:
      return state;
  }
};
