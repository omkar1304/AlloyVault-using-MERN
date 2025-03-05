const perms = [
  {
    name: "Settings",
    key: "settings",
    access: true,
    order: 1,
    children: [
      {
        name: "Settings 1",
        key: "settings1",
        access: true,
        order: 1,
      },
      {
        name: "Settings 2",
        key: "settings2",
        access: true,
        order: 2,
      },
    ],
  },
  {
    name: "Dashboards",
    key: "dashboards",
    access: true,
    order: 2,
    children: [
      {
        name: "Dashboards 1",
        key: "dashboards1",
        access: true,
        order: 1,
      },
      {
        name: "Dashboards 2",
        key: "dashboards2",
        access: true,
        order: 2,
      },
    ],
  },
  {
    name: "Calendar",
    key: "calendar",
    access: false,
    order: 3,
    children: [
      {
        name: "Calendar 1",
        key: "calendar1",
        access: false,
        order: 1,
      },
      {
        name: "Calendar 2",
        key: "calendar2",
        access: false,
        order: 2,
      },
    ],
  },
];

export default perms;
