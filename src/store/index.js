import { createStore } from 'vuex';

import auth from './modules/auth';
import users from './modules/users';
import projects from './modules/projects';
import tasks from './modules/tasks';

const store = createStore({
  modules: {
    auth,
    users,
    projects,
    tasks,
  },
});

export default store;
