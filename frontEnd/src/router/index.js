import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    meta: {
			requireLoggedIn: false
		},
    component: () => import("../components/login"),
  },
  {
    path: "/login",
    meta: {
			requireLoggedIn: false
		},
    component: () => import("../components/login"),
  },
  //
  {
    path: "/ISP/home",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/ISP/home"),
  },
  {
    path: "/ISP/packages",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/ISP/packages"),
  },
  {
    path: "/ISP/payments",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/ISP/payments"),
  },
  {
    path: "/ISP/notifications",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/ISP/notifications"),
  },
  {
    path: "/ISP/offers",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/ISP/offers"),
  },
  {
    path: "/ISP/notify",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/ISP/notify"),
  },
  {
    path: "/ISP/tickets",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/ISP/tickets"),
  },
  {
    path: "/ISP/dashboard",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/ISP/dashboard"),
  },
  //
  {
    path: "/NTTN/home",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/NTTN/home"),
  },
  {
    path: "/NTTN/packages",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/NTTN/packages"),
  },
  {
    path: "/NTTN/payments",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/NTTN/payments"),
  },
  {
    path: "/NTTN/notifications",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/NTTN/notifications"),
  },
  {
    path: "/NTTN/offers",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/NTTN/offers"),
  },
  {
    path: "/NTTN/notify",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/NTTN/notify"),
  },
  {
    path: "/NTTN/tickets",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/NTTN/tickets"),
  },
  {
    path: "/NTTN/dashboard",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/NTTN/dashboard"),
  },
  //
  {
    path: "/USER/home",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/USER/home"),
  },
  {
    path: "/USER/notifications",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/USER/notifications"),
  },
  {
    path: "/USER/packages",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/USER/packages"),
  },
  {
    path: "/USER/payments",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/USER/payments"),
  },
  {
    path: "/USER/tickets",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/USER/tickets"),
  },
  {
    path: "/USER/dashboard",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/USER/dashboard"),
  },
  //
  {
    path: "/NTTN/*",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/NTTN/notFound"),
  },
  {
    path: "/ISP/*",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/ISP/notFound"),
  },
  {
    path: "/USER/*",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/USER/notFound"),
  },
  {
    path: "*",
    meta: {
			requireLoggedIn: true
		},
    component: () => import("../components/notFound"),
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history',
  history: 'enable',
  scrollBehavior() {
    return {x: 0, y: 0}
  }
});

router.beforeEach((to, from, next) => {
  // if (to.path === "/" && store.getters.getLoginState) {
  //   next({
  //     path: '/' + store.getters.getUserType + '/home',
  //   });
  // }
  if (to.meta.requireLoggedIn && !store.getters.getLoginState) {
    next({
      path: '/',
    });
  } else {
    next();
  }
})


export default router;
